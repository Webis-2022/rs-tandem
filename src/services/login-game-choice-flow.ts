import { ROUTES } from '../types';
import { navigate } from '../app/navigation';
import { showModal } from '../components/ui/modal/modal';
import {
  discardAllActiveSessions,
  discardTopicResumeCandidates,
  resolveTopicResumeCandidate,
} from './topic-resume-candidate';
import { restoreTopicSession } from './topic-resume-flow';

// Login/game-choice UI and public flow
/**
 * Спрашивает пользователя при логине,
 * хочет ли он продолжить текущую игру или начать новую.
 */
export async function promptLoginGameChoice(): Promise<boolean> {
  const result = await showModal({
    title: 'Continue current game?',
    messageHtml:
      '<p>You already have a saved game. Do you want to continue it or start a new one?</p>',
    showConfirm: true,
    confirmText: 'Continue',
    cancelText: 'Start new',
  });

  return result.confirmed;
}

export type LoginGameChoiceFlowResult = 'no-game' | 'continued' | 'start-new';

/**
 * Запускает сценарий выбора при логине:
 * продолжить текущую игру или начать новую.
 */
export async function runLoginGameChoiceFlow(): Promise<LoginGameChoiceFlowResult> {
  try {
    const { candidate, staleSources } = await resolveTopicResumeCandidate();

    if (!candidate) {
      await discardTopicResumeCandidates(staleSources);
      return 'no-game';
    }

    const shouldContinue = await promptLoginGameChoice();

    if (shouldContinue) {
      await discardTopicResumeCandidates(staleSources);
      await restoreTopicSession(candidate.session);
      navigate(ROUTES.Practice, true);
      return 'continued';
    }

    await discardAllActiveSessions();
    return 'start-new';
  } catch (error) {
    console.error('Login game choice flow failed:', error);
    return 'no-game';
  }
}
