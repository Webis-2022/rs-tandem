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

export type LoginGameChoiceFlowResult =
  | { status: 'no-game' }
  | { status: 'continued'; gameId: number }
  | { status: 'start-new' };

export async function runLoginGameChoiceFlow(): Promise<LoginGameChoiceFlowResult> {
  try {
    const currentGame = await resolveCurrentGame();

    if (!currentGame) {
      return { status: 'no-game' };
    }

    const shouldContinue = await promptLoginGameChoice();

    if (shouldContinue) {
      return {
        status: 'continued',
        gameId: currentGame.gameId,
      };
    }

    return { status: 'start-new' };
  } catch (error) {
    console.error('Login game choice flow failed:', error);
    return { status: 'no-game' };
  }
}
