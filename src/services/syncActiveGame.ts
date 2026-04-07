import * as authService from './authService';
import { getState } from '../app/state/store';
import { upsertActiveGame, deleteActiveGame } from './api/active-games';
import type { AppState } from '../types';

type GameState = AppState['game'];

// Сохраняет активную игру пользователя в Supabase.
// Если game передан явно, синхронизирует именно его.
// Иначе берет текущее состояние из store.
export async function syncActiveGameToServer(game?: GameState): Promise<void> {
  const user = authService.getCurrentUser();

  if (!user) return;

  const currentGame = game ?? getState().game;

  await upsertActiveGame(user.id, currentGame);
}

// Удаляет активную игру пользователя из Supabase.
// Используется после завершения игры.
export async function removeActiveGameFromServer(): Promise<void> {
  const user = authService.getCurrentUser();

  if (!user) return;

  await deleteActiveGame(user.id);
}
