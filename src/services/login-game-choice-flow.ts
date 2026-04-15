import { showModal } from '../components/ui/modal/modal';
import { resolveCurrentGame } from './current-game';

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

export async function runLoginGameChoiceFlow(): Promise<LoginGameChoiceFlowResult> {
  try {
    const currentGame = await resolveCurrentGame();

    if (!currentGame) {
      return 'no-game';
    }

    const shouldContinue = await promptLoginGameChoice();

    return shouldContinue ? 'continued' : 'start-new';
  } catch (error) {
    console.error('Login game choice flow failed:', error);
    return 'no-game';
  }
}
