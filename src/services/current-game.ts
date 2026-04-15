import * as authService from './auth-service';
import { getLatestGameByUser } from './api/get-games';

type CurrentGame = {
  gameId: number;
};

function hasValidGameId(gameId: number | null | undefined): gameId is number {
  return typeof gameId === 'number' && Number.isInteger(gameId) && gameId > 0;
}

export async function resolveCurrentGame(): Promise<CurrentGame | null> {
  const user = authService.getCurrentUser();

  if (!user) {
    return null;
  }

  try {
    const latestGame = await getLatestGameByUser(user.id);

    if (!latestGame || !hasValidGameId(latestGame.id)) {
      return null;
    }

    return { gameId: latestGame.id };
  } catch (error) {
    console.error('Failed to resolve current game:', error);
    return null;
  }
}
