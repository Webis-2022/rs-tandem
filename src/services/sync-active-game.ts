import * as authService from './auth-service';
import { getState } from '../app/state/store';
import { deleteActiveGame, upsertActiveSession } from './api/active-games';
import type { AppState, PersistedActiveSession } from '../types';

type GameState = AppState['game'];

/**
 * Сохраняет активную сессию в Supabase.
 * Если game передан явно, сохраняет его.
 * Иначе берет текущее состояние game из store.
 */
export async function syncActiveGameToServer(game?: GameState): Promise<void> {
  const user = authService.getCurrentUser();
  if (!user) return;

  const state = getState();

  const session: PersistedActiveSession = {
    gameId: state.gameId,
    game: game ?? state.game,
  };

  await upsertActiveSession(user.id, session);
}

/**
 * Удаляет активную сессию пользователя из Supabase.
 */
export async function removeActiveGameFromServer(): Promise<void> {
  const user = authService.getCurrentUser();
  if (!user) return;

  await deleteActiveGame(user.id);
}
