import {
  HINT_KEYS,
  type AppState,
  type Difficulty,
  type HintCounter,
  type PersistedActiveSession,
} from '../types';
import { getActiveSessionByUser } from './api/active-games';
import { fetchCompletedTopicIds } from './api/fetch-completed-topic-ids';
import { getActiveSession } from './storage-service';

type GameState = AppState['game'];
const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
type ValidDifficulty = (typeof validDifficulties)[number];

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

async function validateTopicResumeSession(
  session: PersistedActiveSession | null
): Promise<PersistedActiveSession | null> {
  if (!session) {
    return null;
  }

  if (!hasRequiredResumeData(session.game)) {
    return null;
  }

  const isCompleted = await isCompletedResumeCandidate(session.game);
  if (isCompleted) {
    return null;
  }

  return session;
}

async function checkLocalTopicResumeCandidate(): Promise<PersistedActiveSession | null> {
  return validateTopicResumeSession(getActiveSession());
}

async function checkServerTopicResumeCandidate(
  userId: string
): Promise<PersistedActiveSession | null> {
  try {
    const serverSession = await getActiveSessionByUser(userId);
    return validateTopicResumeSession(serverSession);
  } catch (error) {
    console.error('Failed to load resume candidate from server:', error);
    return null;
  }
}

export async function getTopicResumeCandidate(
  userId: string
): Promise<PersistedActiveSession | null> {
  const localCandidate = await checkLocalTopicResumeCandidate();
  if (localCandidate) {
    return localCandidate;
  }

  const serverCandidate = await checkServerTopicResumeCandidate(userId);
  if (serverCandidate) {
    return serverCandidate;
  }

  return null;
}
