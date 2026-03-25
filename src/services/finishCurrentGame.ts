import { clearActiveGame } from './storageService';
import { removeActiveGameFromServer } from './syncActiveGame';

export async function finishCurrentGame() {
  await removeActiveGameFromServer();
  clearActiveGame();
}
