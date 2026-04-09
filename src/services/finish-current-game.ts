import { clearActiveGame } from './storage-service';
import { removeActiveGameFromServer } from './sync-active-game';

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
