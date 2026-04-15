import { showModal } from '../components/ui/modal/modal';
import {
  discardAllCurrentGames,
  discardCurrentGames,
  resolveCurrentGame,
} from './current-game';

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
    const { currentGame, staleSources } = await resolveCurrentGame();

    if (!currentGame) {
      await discardCurrentGames(staleSources);
      return 'no-game';
    }

    const shouldContinue = await promptLoginGameChoice();

    if (shouldContinue) {
      await discardCurrentGames(staleSources);
      return 'continued';
    }

    await discardAllCurrentGames();
    return 'start-new';
  } catch (error) {
    console.error('Login game choice flow failed:', error);
    return 'no-game';
  }
}
