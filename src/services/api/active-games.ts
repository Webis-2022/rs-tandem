import { supabase } from '../supabaseClient';
import type { AppState } from '../../types';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

// Получает активную незавершенную игру конкретного пользователя из Supabase.
// Если записи нет, возвращает null.
export async function getActiveGameByUser(
  userId: string
): Promise<AppState['game'] | null> {
  return withApiErrorHandling(async () => {
    const { data, error } = await supabase
      .from('active_games')
      .select('game_state')
      .eq('user_id', userId)
      .maybeSingle(); // ожидается не массив строк, а одна строка или null

    if (error) {
      throw error;
    }

    return (data?.game_state as AppState['game']) ?? null;
  }, 'Failed to load active game.');
}

// Создает или обновляет активную игру пользователя в Supabase.
// Используется для сохранения прогресса незавершенной игры между сессиями и устройствами.
export async function upsertActiveGame(
  userId: string,
  game: AppState['game']
): Promise<void> {
  return withApiErrorHandling(async () => {
    const payload = {
      user_id: userId,
      game_state: game,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('active_games')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      throw error;
    }
  }, 'Failed to save active game.');
}

// Удаляет активную игру пользователя из Supabase.
// Используется после завершения игры и сохранения результата.
export async function deleteActiveGame(userId: string): Promise<void> {
  return withApiErrorHandling(async () => {
    const { error } = await supabase
      .from('active_games')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }, 'Failed to delete active game.');
}
