import {
  HINT_KEYS,
  ROUTES,
  type AppState,
  type Difficulty,
  type HintCounter,
} from '../types';
import { navigate } from '../app/navigation';
import { restoreGameState, saveTopics } from '../app/state/actions';
import { getState } from '../app/state/store';
import * as authService from './auth-service';
import { getActiveGame, clearActiveGame } from './storage-service';
import { getActiveGameByUser } from './api/active-games';
import { getTopics } from './api/get-topics';
import { removeActiveGameFromServer } from './sync-active-game';
import { showModal } from '../components/ui/modal/modal';
import { fetchCompletedTopicIds } from './api/fetch-completed-topic-ids';

type GameState = AppState['game'];

export type ResumeFlowResult = 'no-game' | 'resumed' | 'discarded';

const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
type ValidDifficulty = (typeof validDifficulties)[number];

/**
 * Проверяет, что в сохраненной игре указана
 * корректная сложность для resume flow.
 */
function hasValidDifficulty(
  difficulty: GameState['difficulty']
): difficulty is ValidDifficulty {
  return (
    difficulty !== null &&
    validDifficulties.includes(difficulty as ValidDifficulty)
  );
}

/**
 * Проверяет, что usedHints существует
 * и содержит счетчики для всех доступных подсказок.
 */
function hasValidUsedHints(
  usedHints: HintCounter | undefined
): usedHints is HintCounter {
  if (!usedHints) {
    return false;
  }

  return HINT_KEYS.every((key) => typeof usedHints[key] === 'number');
}

/**
 * Проверяет, что в сохраненной игре есть
 * все обязательные данные для корректного resume.
 */
export function hasRequiredResumeData(
  game: GameState | null | undefined
): game is GameState {
  if (!game) {
    return false;
  }

  return Boolean(
    game.topicId > 0 &&
    validDifficulties.includes(
      game.difficulty as (typeof validDifficulties)[number]
    ) &&
    game.round > 0 &&
    Array.isArray(game.questions) &&
    game.questions.length > 0 &&
    hasValidUsedHints(game.usedHints)
  );
}

/**
 * Проверяет, не относится ли сохраненная игра
 * к уже завершенной теме на текущей сложности.
 */
async function isCompletedResumeCandidate(game: GameState): Promise<boolean> {
  if (!hasValidDifficulty(game.difficulty)) {
    return false;
  }

  try {
    const completedTopicIds = await fetchCompletedTopicIds(game.difficulty);
    return completedTopicIds.includes(game.topicId);
  } catch (error) {
    console.error(
      'Failed to validate resume candidate against completed topics:',
      error
    );
    return false;
  }
}

/**
 * Ищет сохраненную игру для продолжения.
 * Сначала проверяет localStorage, потом сервер.
 */
export async function getResumeCandidate(): Promise<GameState | null> {
  const localGame = getActiveGame();

  if (hasRequiredResumeData(localGame)) {
    const isCompleted = await isCompletedResumeCandidate(localGame);

    if (!isCompleted) {
      return localGame;
    }

    await discardResumeCandidate();
  } else {
    clearActiveGame();
  }
  const user = authService.getCurrentUser();

  if (!user) {
    return null;
  }

  try {
    const serverGame = await getActiveGameByUser(user.id);

    if (!hasRequiredResumeData(serverGame)) {
      return null;
    }

    const isCompleted = await isCompletedResumeCandidate(serverGame);

    if (isCompleted) {
      await discardResumeCandidate();
      return null;
    }

    return serverGame;
  } catch (error) {
    console.error('Failed to load resume candidate from server:', error);
    return null;
  }
}

/**
 * Удаляет сохраненную игру локально и на сервере.
 */
export async function discardResumeCandidate(): Promise<void> {
  clearActiveGame();

  try {
    await removeActiveGameFromServer();
  } catch (error) {
    console.error('Failed to remove active game from server:', error);
  }
}

/**
 * Спрашивает пользователя, хочет ли он продолжить игру.
 */
export async function promptResumeGame(game: GameState): Promise<boolean> {
  if (!hasRequiredResumeData(game)) {
    return false;
  }

  const result = await showModal({
    title: 'Continue unfinished game?',
    messageHtml:
      '<p>You have an unfinished game. Do you want to continue it?</p>',
    showConfirm: true,
    confirmText: 'Yes',
    cancelText: 'No',
  });

  return result.confirmed;
}

/**
 * Загружает topics, если их еще нет в store.
 */
async function ensureTopicsLoaded(): Promise<void> {
  if (getState().topics.length > 0) {
    return;
  }

  try {
    const topics = await getTopics();
    saveTopics(topics);
  } catch (error) {
    console.error('Failed to load topics while resuming game:', error);
  }
}

/**
 * Восстанавливает игру и при необходимости загружает topics.
 */
async function restoreResumedGame(game: GameState): Promise<void> {
  await ensureTopicsLoaded();
  restoreGameState(game);
}

/**
 * Запускает весь сценарий продолжения игры.
 */
export async function runResumeGameFlow(): Promise<ResumeFlowResult> {
  try {
    const game = await getResumeCandidate();

    if (!game) {
      return 'no-game';
    }

    const shouldResume = await promptResumeGame(game);

    if (shouldResume) {
      await restoreResumedGame(game);
      navigate(ROUTES.Practice, true);
      return 'resumed';
    }

    await discardResumeCandidate();
    return 'discarded';
  } catch (error) {
    console.error('Resume game flow failed:', error);
    return 'no-game';
  }
}
