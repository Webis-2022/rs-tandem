import {
  HINT_KEYS,
  ROUTES,
  type AppState,
  type Difficulty,
  type HintCounter,
  type PersistedActiveSession,
} from '../types';
import { navigate } from '../app/navigation';
import { getState } from '../app/state/store';
import * as authService from './auth-service';
import { getTopics } from './api/get-topics';
import { removeActiveGameFromServer } from './sync-active-game';
import { showModal } from '../components/ui/modal/modal';
import { fetchCompletedTopicIds } from './api/fetch-completed-topic-ids';
import { clearActiveSession, getActiveSession } from './storage-service';
import { getActiveSessionByUser } from './api/active-games';
import { restoreActiveSession, saveTopics } from '../app/state/actions';

type GameState = AppState['game'];

export type ResumeFlowResult = 'no-game' | 'resumed' | 'discarded';

type ResumeCandidateSource = 'local' | 'server';

type ResumeCandidate = {
  session: PersistedActiveSession;
  source: ResumeCandidateSource;
};

type ResumeLookupResult =
  | { status: 'missing' }
  | { status: 'invalid'; source: ResumeCandidateSource }
  | { status: 'completed'; source: ResumeCandidateSource }
  | { status: 'ready'; candidate: ResumeCandidate };

type ResumeCandidateResolution = {
  candidate: ResumeCandidate | null;
  staleSources: ResumeCandidateSource[];
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
 * Проверяет сохраненную игру в localStorage
 * и возвращает результат в виде статуса resume candidate.
 */
async function checkLocalResumeCandidate(): Promise<ResumeLookupResult> {
  const localSession = getActiveSession();
  if (!localSession) {
    return { status: 'missing' };
  }

  if (!hasRequiredResumeData(localSession.game)) {
    return { status: 'invalid', source: 'local' };
  }

  const isCompleted = await isCompletedResumeCandidate(localSession.game);
  if (isCompleted) {
    return { status: 'completed', source: 'local' };
  }

  return {
    status: 'ready',
    candidate: {
      session: localSession,
      source: 'local',
    },
  };
}

/**
 * Проверяет сохраненную игру на сервере
 * и возвращает результат в виде статуса resume candidate.
 */
async function checkServerResumeCandidate(
  userId: string
): Promise<ResumeLookupResult> {
  try {
    const serverSession = await getActiveSessionByUser(userId);
    if (!serverSession) {
      return { status: 'missing' };
    }

    if (!hasRequiredResumeData(serverSession.game)) {
      return { status: 'invalid', source: 'server' };
    }

    const isCompleted = await isCompletedResumeCandidate(serverSession.game);
    if (isCompleted) {
      return { status: 'completed', source: 'server' };
    }

    return {
      status: 'ready',
      candidate: {
        session: serverSession,
        source: 'server',
      },
    };
  } catch (error) {
    console.error('Failed to load resume candidate from server:', error);
    return { status: 'missing' };
  }
}

/**
 * Проверяет, есть ли игра для продолжения.
 * Возвращает найденную игру и источники,
 * которые нужно очистить отдельно.
 */
async function resolveResumeCandidate(): Promise<ResumeCandidateResolution> {
  const user = authService.getCurrentUser();

  if (!user) {
    return { candidate: null, staleSources: [] };
  }

  const staleSources: ResumeCandidateSource[] = [];

  const localResult = await checkLocalResumeCandidate();

  if (localResult.status === 'ready') {
    return {
      candidate: localResult.candidate,
      staleSources,
    };
  }

  if (localResult.status === 'invalid' || localResult.status === 'completed') {
    staleSources.push(localResult.source);
  }

  const serverResult = await checkServerResumeCandidate(user.id);

  if (serverResult.status === 'ready') {
    return {
      candidate: serverResult.candidate,
      staleSources,
    };
  }

  if (
    serverResult.status === 'invalid' ||
    serverResult.status === 'completed'
  ) {
    staleSources.push(serverResult.source);
  }

  return {
    candidate: null,
    staleSources,
  };
}

/**
 * Возвращает resume candidate для продолжения игры
 * без очистки невалидных или устаревших данных.
 */
export async function getResumeCandidate(): Promise<ResumeCandidate | null> {
  const { candidate } = await resolveResumeCandidate();
  return candidate;
}

/**
 * Удаляет сохраненную активную сессию локально.
 */
function discardLocalResumeCandidate(): void {
  clearActiveSession();
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
 * Удаляет resume candidate из нескольких источников.
 * Повторяющиеся источники очищаются только один раз.
 */
async function discardResumeCandidates(
  sources: ResumeCandidateSource[]
): Promise<void> {
  const uniqueSources = [...new Set(sources)];

  for (const source of uniqueSources) {
    await discardResumeCandidate(source);
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
 * Восстанавливает активную сессию и при необходимости загружает topics.
 */
async function restoreResumedGame(
  session: PersistedActiveSession
): Promise<void> {
  await ensureTopicsLoaded();
  restoreActiveSession(session);
}

/**
 * Запускает весь сценарий продолжения игры.
 */
export async function runResumeGameFlow(): Promise<ResumeFlowResult> {
  try {
    const { candidate, staleSources } = await resolveResumeCandidate();

    if (!candidate) {
      await discardResumeCandidates(staleSources);
      return 'no-game';
    }

    const shouldResume = await promptResumeGame(candidate.session.game);

    if (shouldResume) {
      await discardResumeCandidates(staleSources);
      await restoreResumedGame(candidate.session);
      navigate(ROUTES.Practice, true);
      return 'resumed';
    }

    await discardResumeCandidates([...staleSources, candidate.source]);
    return 'discarded';
  } catch (error) {
    console.error('Resume game flow failed:', error);
    return 'no-game';
  }
}
