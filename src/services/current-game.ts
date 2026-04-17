import * as authService from './auth-service';
import { getLatestGameByUser } from './api/get-games';

type CurrentGameRecord = {
  id: number | null;
  achievement?: string | null;
};

export type ResolveCurrentGameResult =
  | { status: 'no-user' }
  | { status: 'no-game' }
  | { status: 'success'; gameId: number }
  | { status: 'error' };

function hasValidGameId(gameId: number | null | undefined): gameId is number {
  return typeof gameId === 'number' && gameId > 0;
}

function isFinishedGame(game: CurrentGameRecord): boolean {
  return (
    typeof game.achievement === 'string' && game.achievement.trim().length > 0
  );
}

export async function resolveCurrentGame(): Promise<ResolveCurrentGameResult> {
  const user = authService.getCurrentUser();

  if (!user) {
    return { status: 'no-user' };
  }

  try {
    const latestGame = await getLatestGameByUser(user.id);

    if (
      !latestGame ||
      !hasValidGameId(latestGame.id) ||
      isFinishedGame(latestGame)
    ) {
      return { status: 'no-game' };
    }

    return {
      status: 'success',
      gameId: latestGame.id,
    };
  } catch (error) {
    console.error('Failed to resolve current game:', error);
    return { status: 'error' };
  }
}
