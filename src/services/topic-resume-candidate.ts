import {
  HINT_KEYS,
  type AppState,
  type Difficulty,
  type HintCounter,
  type PersistedActiveSession,
} from '../types';
import { getActiveSessionByUser } from './api/active-games';
import { fetchCompletedTopicIds } from './api/fetch-completed-topic-ids';
import * as authService from './auth-service';
import { clearActiveSession, getActiveSession } from './storage-service';
import { removeActiveGameFromServer } from './sync-active-game';

type GameState = AppState['game'];
const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
type ValidDifficulty = (typeof validDifficulties)[number];

// Validation helpers
function hasValidDifficulty(
  difficulty: GameState['difficulty']
): difficulty is ValidDifficulty {
  return (
    difficulty !== null &&
    validDifficulties.includes(difficulty as ValidDifficulty)
  );
}

function hasValidUsedHints(
  usedHints: HintCounter | undefined
): usedHints is HintCounter {
  if (!usedHints) {
    return false;
  }

  return HINT_KEYS.every((key) => typeof usedHints[key] === 'number');
}

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
 * Проверяет, не относится ли сохраненный топик
 * к уже завершенной теме на текущей сложности.
 */
export async function isCompletedResumeCandidate(
  game: GameState
): Promise<boolean> {
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

// Topic resume lookup helpers
type TopicResumeCandidateSource = 'local' | 'server';

type TopicResumeCandidate = {
  session: PersistedActiveSession;
  source: TopicResumeCandidateSource;
};

type TopicResumeLookupResult =
  | { status: 'missing' }
  | { status: 'invalid'; source: TopicResumeCandidateSource }
  | { status: 'completed'; source: TopicResumeCandidateSource }
  | { status: 'ready'; candidate: TopicResumeCandidate };

type TopicResumeCandidateResolution = {
  candidate: TopicResumeCandidate | null;
  staleSources: TopicResumeCandidateSource[];
};

/**
 * Проверяет сохраненный топик в localStorage
 * и возвращает результат в виде статуса resume candidate.
 */
async function checkLocalTopicResumeCandidate(): Promise<TopicResumeLookupResult> {
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
 * Проверяет сохраненный топик на сервере
 * и возвращает результат в виде статуса resume candidate.
 */
async function checkServerTopicResumeCandidate(
  userId: string
): Promise<TopicResumeLookupResult> {
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
 * Проверяет, есть ли топик для продолжения.
 * Возвращает найденный топик и источники,
 * которые нужно очистить отдельно.
 */
export async function resolveTopicResumeCandidate(): Promise<TopicResumeCandidateResolution> {
  const user = authService.getCurrentUser();

  if (!user) {
    return { candidate: null, staleSources: [] };
  }

  const staleSources: TopicResumeCandidateSource[] = [];

  const localResult = await checkLocalTopicResumeCandidate();

  if (localResult.status === 'ready') {
    return {
      candidate: localResult.candidate,
      staleSources,
    };
  }

  if (localResult.status === 'invalid' || localResult.status === 'completed') {
    staleSources.push(localResult.source);
  }

  const serverResult = await checkServerTopicResumeCandidate(user.id);

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
 * Возвращает resume candidate для продолжения топика
 * без очистки невалидных или устаревших данных.
 */
export async function getTopicResumeCandidate(): Promise<TopicResumeCandidate | null> {
  const { candidate } = await resolveTopicResumeCandidate();
  return candidate;
}

// Topic resume discard helpers
function discardLocalTopicResumeCandidate(): void {
  clearActiveSession();
}

async function discardServerTopicResumeCandidate(): Promise<void> {
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
async function discardTopicResumeCandidate(
  source: TopicResumeCandidateSource
): Promise<void> {
  if (source === 'local') {
    discardLocalTopicResumeCandidate();
    return;
  }

  await discardServerTopicResumeCandidate();
}

/**
 * Удаляет resume candidate из нескольких источников.
 * Повторяющиеся источники очищаются только один раз.
 */
export async function discardTopicResumeCandidates(
  sources: TopicResumeCandidateSource[]
): Promise<void> {
  const uniqueSources = [...new Set(sources)];

  for (const source of uniqueSources) {
    await discardTopicResumeCandidate(source);
  }
}

/**
 * Очищает сохраненный топик во всех источниках:
 * и локально, и на сервере.
 */
export async function discardAllActiveSessions(): Promise<void> {
  await discardTopicResumeCandidates(['local', 'server']);
}
