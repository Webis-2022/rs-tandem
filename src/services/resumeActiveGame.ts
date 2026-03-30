import type { AppState } from '../types';
import * as authService from './authService';
import { getActiveGame, clearActiveGame } from './storageService';
import { getActiveGameByUser } from './api/active-games';
import { removeActiveGameFromServer } from './syncActiveGame';
import { showModal } from '../components/ui/modal/modal';

type GameState = AppState['game'];

export async function getResumeCandidate(): Promise<GameState | null> {
  const localGame = getActiveGame();

  if (isResumeCandidate(localGame)) {
    return localGame;
  }

  const user = authService.getCurrentUser();

  if (!user) {
    return null;
  }

  try {
    const serverGame = await getActiveGameByUser(user.id);

    return isResumeCandidate(serverGame) ? serverGame : null;
  } catch (error) {
    console.error('Failed to load resume candidate from server:', error);
    return null;
  }
}

export function isResumeCandidate(
  game: GameState | null | undefined
): game is GameState {
  if (!game) {
    return false;
  }

  return Boolean(game.topicId >= 1 && game.difficulty && game.round >= 1);
}

export async function promptResumeGame(game: GameState): Promise<boolean> {
  if (!isResumeCandidate(game)) {
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

export async function discardResumeCandidate(): Promise<void> {
  clearActiveGame();

  try {
    await removeActiveGameFromServer();
  } catch (error) {
    console.error('Failed to remove active game from server:', error);
  }
}
