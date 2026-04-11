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

type ResumeCandidateSource = 'local' | 'server';

type ResumeCandidate = {
  game: GameState;
  source: ResumeCandidateSource;
};

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
    hasValidDifficulty(game.difficulty) &&
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
 * Ищет сохраненную игру для продолжения в localStorage.
 */
async function getLocalResumeCandidate(): Promise<ResumeCandidate | null> {
  const localGame = getActiveGame();

  if (!localGame) {
    return null;
  }

  if (!hasRequiredResumeData(localGame)) {
    discardLocalResumeCandidate();
    return null;
  }

  const isCompleted = await isCompletedResumeCandidate(localGame);

  if (isCompleted) {
    discardLocalResumeCandidate();
    return null;
  }

  return {
    game: localGame,
    source: 'local',
  };
}

/**
 * Ищет сохраненную игру для продолжения на сервере.
 */
async function getServerResumeCandidate(
  userId: string
): Promise<ResumeCandidate | null> {
  try {
    const serverGame = await getActiveGameByUser(userId);

    if (!hasRequiredResumeData(serverGame)) {
      return null;
    }

    const isCompleted = await isCompletedResumeCandidate(serverGame);

    if (isCompleted) {
      await discardServerResumeCandidate();
      return null;
    }

    return {
      game: serverGame,
      source: 'server',
    };
  } catch (error) {
    console.error('Failed to load resume candidate from server:', error);
    return null;
  }
}

/**
 * Ищет resume candidate для продолжения игры.
 * Сначала проверяет localStorage, затем сервер
 * и возвращает игру вместе с источником.
 */
export async function getResumeCandidate(): Promise<ResumeCandidate | null> {
  const user = authService.getCurrentUser();

  if (!user) {
    return null;
  }

  const localCandidate = await getLocalResumeCandidate();

  if (localCandidate) {
    return localCandidate;
  }

  return getServerResumeCandidate(user.id);
}

/**
 * Удаляет сохраненную игру локально.
 */
function discardLocalResumeCandidate(): void {
  clearActiveGame();
}

/**
 * Удаляет сохраненную игру на сервере.
 */
async function discardServerResumeCandidate(): Promise<void> {
  try {
    await removeActiveGameFromServer();
  } catch (error) {
    console.error('Failed to remove active game from server:', error);
  }
}

/**
 * Удаляет resume candidate из указанного источника:
 * localStorage или сервера.
 */
async function discardResumeCandidate(
  source: ResumeCandidateSource
): Promise<void> {
  if (source === 'local') {
    discardLocalResumeCandidate();
    return;
  }

  await discardServerResumeCandidate();
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
let topicsLoadingPromise: Promise<void> | null = null;

/**
 * Загружает topics, если их еще нет в store.
 * Параллельные вызовы переиспользуют один и тот же запрос.
 */
async function ensureTopicsLoaded(): Promise<void> {
  if (getState().topics.length > 0) {
    return;
  }

  if (topicsLoadingPromise) {
    return topicsLoadingPromise;
  }

  topicsLoadingPromise = (async () => {
    try {
      const topics = await getTopics();
      saveTopics(topics);
    } catch (error) {
      console.error('Failed to load topics while resuming game:', error);
    } finally {
      topicsLoadingPromise = null;
    }
  })();

  return topicsLoadingPromise;
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
    const candidate = await getResumeCandidate();

    if (!candidate) {
      return 'no-game';
    }

    const shouldResume = await promptResumeGame(candidate.game);

    if (shouldResume) {
      await restoreResumedGame(candidate.game);
      navigate(ROUTES.Practice, true);
      return 'resumed';
    }

    await discardResumeCandidate(candidate.source);
    return 'discarded';
  } catch (error) {
    console.error('Resume game flow failed:', error);
    return 'no-game';
  }
}
