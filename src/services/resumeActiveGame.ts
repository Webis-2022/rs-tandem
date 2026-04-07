import { ROUTES, type AppState } from '../types';
import { navigate } from '../app/navigation';
import { restoreGameState, saveTopics } from '../app/state/actions';
import { getState } from '../app/state/store';
import * as authService from './authService';
import { getActiveGame, clearActiveGame } from './storageService';
import { getActiveGameByUser } from './api/active-games';
import { getTopics } from './api/get-topics';
import { removeActiveGameFromServer } from './syncActiveGame';
import { showModal } from '../components/ui/modal/modal';

type GameState = AppState['game'];

export type ResumeFlowResult = 'no-game' | 'resumed' | 'discarded';

/**
 * Ищет сохраненную игру для продолжения.
 * Сначала проверяет localStorage, потом сервер.
 */
export async function getResumeCandidate(): Promise<GameState | null> {
  const localGame = getActiveGame();

  if (hasRequiredResumeData(localGame)) {
    return localGame;
  }

  clearActiveGame();

  const user = authService.getCurrentUser();

  if (!user) {
    return null;
  }

  try {
    const serverGame = await getActiveGameByUser(user.id);

    return hasRequiredResumeData(serverGame) ? serverGame : null;
  } catch (error) {
    console.error('Failed to load resume candidate from server:', error);
    return null;
  }
}

const validDifficulties = ['easy', 'medium', 'hard'] as const;

/**
 * Проверяет, хватает ли данных в сохраненной игре
 * для сценария продолжения.
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
    game.questions.length > 0
  );
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
