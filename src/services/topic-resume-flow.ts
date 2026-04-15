import { restoreActiveSession, saveTopics } from '../app/state/actions';
import { getState } from '../app/state/store';
import { type PersistedActiveSession } from '../types';
import { getTopics } from './api/get-topics';
import { getTopicResumeCandidate } from './topic-resume-candidate';

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
 * Восстанавливает активный топик и при необходимости загружает topics.
 */
export async function restoreTopicSession(
  session: PersistedActiveSession
): Promise<void> {
  await ensureTopicsLoaded();
  restoreActiveSession(session);
}

/**
 * Silently restores an active topic without showing a modal.
 * Used on /practice page refresh: the user is already on the correct route,
 * so navigate() must not be called.
 * @returns true if a game was found and restored.
 */
export async function silentlyRestoreTopicSession(): Promise<boolean> {
  try {
    const activeSession = await getTopicResumeCandidate();

    if (!activeSession) {
      return false;
    }

    await restoreTopicSession(activeSession);
    return true;
  } catch (error) {
    console.error('Silent game restore failed:', error);
    return false;
  }
}
