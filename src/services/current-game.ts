import * as authService from './auth-service';
import { getLatestGameByUser } from './api/get-games';

type CurrentGame = {
  gameId: number;
};

type CurrentGameRecord = {
  id: number | null;
  achievement?: string | null;
};

function hasValidGameId(gameId: number | null | undefined): gameId is number {
  return typeof gameId === 'number' && gameId > 0;
}

function isFinishedGame(game: CurrentGameRecord): boolean {
  return (
    typeof game.achievement === 'string' && game.achievement.trim().length > 0
  );
}

export async function resolveCurrentGame(): Promise<CurrentGame | null> {
  const user = authService.getCurrentUser();

  if (!user) {
    return null;
  }

  try {
    const latestGame = await getLatestGameByUser(user.id);

    if (
      !latestGame ||
      !hasValidGameId(latestGame.id) ||
      isFinishedGame(latestGame)
    ) {
      return null;
    }

    return { gameId: latestGame.id };
  } catch (error) {
    console.error('Failed to resolve current game:', error);
    return null;
  }
}
