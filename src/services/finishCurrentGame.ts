import { clearActiveGame } from './storageService';
import { removeActiveGameFromServer } from './syncActiveGame';

export async function finishCurrentGame(): Promise<boolean> {
  clearActiveGame();

  try {
    await removeActiveGameFromServer();
    return true;
  } catch (error) {
    console.error('Failed to remove active game from server:', error);
    return false;
  }
}
