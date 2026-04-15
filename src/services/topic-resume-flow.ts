// Shared restore helpers
import { navigate } from '../app/navigation';
import { restoreActiveSession, saveTopics } from '../app/state/actions';
import { getState } from '../app/state/store';
import { showModal } from '../components/ui/modal/modal';
import { ROUTES, type AppState, type PersistedActiveSession } from '../types';
import { getTopics } from './api/get-topics';
import {
  discardTopicResumeCandidates,
  getTopicResumeCandidate,
  hasRequiredResumeData,
  resolveTopicResumeCandidate,
} from './topic-resume-candidate';

type GameState = AppState['game'];
type TopicResumeFlowResult = 'no-game' | 'resumed' | 'discarded';

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

// Topic-level UI and public flow
/**
 * Спрашивает пользователя, хочет ли он продолжить топик.
 */
export async function promptResumeTopic(game: GameState): Promise<boolean> {
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
 * Silently restores an active topic without showing a modal.
 * Used on /practice page refresh: the user is already on the correct route,
 * so navigate() must not be called.
 * @returns true if a game was found and restored.
 */
export async function silentlyRestoreTopicSession(): Promise<boolean> {
  try {
    const candidate = await getTopicResumeCandidate();

    if (!candidate) {
      return false;
    }

    await restoreTopicSession(candidate.session);
    return true;
  } catch (error) {
    console.error('Silent game restore failed:', error);
    return false;
  }
}

/**
 * Запускает весь сценарий продолжения топика.
 */
export async function runTopicResumeFlow(): Promise<TopicResumeFlowResult> {
  try {
    const { candidate, staleSources } = await resolveTopicResumeCandidate();

    if (!candidate) {
      await discardTopicResumeCandidates(staleSources);
      return 'no-game';
    }

    const shouldResume = await promptResumeTopic(candidate.session.game);

    if (shouldResume) {
      await discardTopicResumeCandidates(staleSources);
      await restoreTopicSession(candidate.session);
      navigate(ROUTES.Practice, true);
      return 'resumed';
    }

    await discardTopicResumeCandidates([...staleSources, candidate.source]);
    return 'discarded';
  } catch (error) {
    console.error('Resume game flow failed:', error);
    return 'no-game';
  }
}
