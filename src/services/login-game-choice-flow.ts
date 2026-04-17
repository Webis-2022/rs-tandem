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
  | { status: 'no-user' }
  | { status: 'no-game' }
  | { status: 'continued'; gameId: number }
  | { status: 'start-new' }
  | { status: 'error' };

export async function runLoginGameChoiceFlow(
  userId: string
): Promise<LoginGameChoiceFlowResult> {
  try {
    const currentGameResult = await resolveCurrentGame(userId);

    if (currentGameResult.status === 'no-user') {
      return { status: 'no-user' };
    }

    if (currentGameResult.status === 'no-game') {
      return { status: 'no-game' };
    }

    if (currentGameResult.status === 'error') {
      return { status: 'error' };
    }

    const shouldContinue = await promptLoginGameChoice();

    return shouldContinue
      ? { status: 'continued', gameId: currentGameResult.gameId }
      : { status: 'start-new' };
  } catch (error) {
    console.error('Login game choice flow failed:', error);
    return { status: 'error' };
  }
}
