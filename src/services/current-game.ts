import type { PersistedActiveSession } from '../types';
import * as authService from './auth-service';
import { getActiveSessionByUser } from './api/active-games';
import { clearActiveSession, getActiveSession } from './storage-service';
import { removeActiveGameFromServer } from './sync-active-game';

export type CurrentGameSource = 'local' | 'server';
type GameId = NonNullable<PersistedActiveSession['gameId']>;

export type CurrentGame = {
  gameId: GameId;
  source: CurrentGameSource;
};

type CurrentGameLookupResult =
  | { status: 'missing' }
  | { status: 'invalid'; source: CurrentGameSource }
  | { status: 'ready'; currentGame: CurrentGame };

type CurrentGameResolution = {
  currentGame: CurrentGame | null;
  staleSources: CurrentGameSource[];
};

function hasValidGameId(
  gameId: PersistedActiveSession['gameId']
): gameId is GameId {
  return typeof gameId === 'number' && Number.isInteger(gameId) && gameId > 0;
}

async function checkLocalCurrentGame(): Promise<CurrentGameLookupResult> {
  const localSession = getActiveSession();

  if (!localSession) {
    return { status: 'missing' };
  }

  if (!hasValidGameId(localSession.gameId)) {
    return { status: 'invalid', source: 'local' };
  }

  return {
    status: 'ready',
    currentGame: {
      gameId: localSession.gameId,
      source: 'local',
    },
  };
}

async function checkServerCurrentGame(
  userId: string
): Promise<CurrentGameLookupResult> {
  try {
    const serverSession = await getActiveSessionByUser(userId);

    if (!serverSession) {
      return { status: 'missing' };
    }

    if (!hasValidGameId(serverSession.gameId)) {
      return { status: 'invalid', source: 'server' };
    }

    return {
      status: 'ready',
      currentGame: {
        gameId: serverSession.gameId,
        source: 'server',
      },
    };
  } catch (error) {
    console.error('Failed to load current game from server:', error);
    return { status: 'missing' };
  }
}

export async function resolveCurrentGame(): Promise<CurrentGameResolution> {
  const user = authService.getCurrentUser();

  if (!user) {
    return { currentGame: null, staleSources: [] };
  }

  const staleSources: CurrentGameSource[] = [];

  const localResult = await checkLocalCurrentGame();

  if (localResult.status === 'ready') {
    return {
      currentGame: localResult.currentGame,
      staleSources,
    };
  }

  if (localResult.status === 'invalid') {
    staleSources.push(localResult.source);
  }

  const serverResult = await checkServerCurrentGame(user.id);

  if (serverResult.status === 'ready') {
    return {
      currentGame: serverResult.currentGame,
      staleSources,
    };
  }

  if (serverResult.status === 'invalid') {
    staleSources.push(serverResult.source);
  }

  return {
    currentGame: null,
    staleSources,
  };
}

export async function getCurrentGame(): Promise<CurrentGame | null> {
  const { currentGame } = await resolveCurrentGame();
  return currentGame;
}

async function discardCurrentGame(source: CurrentGameSource): Promise<void> {
  if (source === 'local') {
    clearActiveSession();
    return;
  }

  try {
    await removeActiveGameFromServer();
  } catch (error) {
    console.error('Failed to remove current game from server:', error);
  }
}

export async function discardCurrentGames(
  sources: CurrentGameSource[]
): Promise<void> {
  const uniqueSources = [...new Set(sources)];

  for (const source of uniqueSources) {
    await discardCurrentGame(source);
  }
}

export async function discardAllCurrentGames(): Promise<void> {
  await discardCurrentGames(['local', 'server']);
}
