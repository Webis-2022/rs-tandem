import * as authService from './authService';
import { getState } from '../app/state/store';
import { upsertActiveGame, deleteActiveGame } from './api/active-games';

// Сохраняет текущую активную игру пользователя в Supabase.
// Если пользователь не авторизован, просто ничего не делает.
export async function syncActiveGameToServer(): Promise<void> {
  const user = authService.getCurrentUser();

  if (!user) return;

  const { game } = getState();

  await upsertActiveGame(user.id, game);
}

// Удаляет активную игру пользователя из Supabase.
// Используется после завершения игры.
export async function removeActiveGameFromServer(): Promise<void> {
  const user = authService.getCurrentUser();

  if (!user) return;

  await deleteActiveGame(user.id);
}
