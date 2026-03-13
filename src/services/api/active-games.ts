import { supabase } from '../supabaseClient';
import type { AppState } from '../../types';

// Получает активную незавершённую игру конкретного пользователя из Supabase.
// Если записи нет, возвращает null.
export async function getActiveGameByUser(
  userId: string
): Promise<AppState['game'] | null> {
  const { data, error } = await supabase
    .from('active_games')
    .select('game_state')
    .eq('user_id', userId)
    .maybeSingle(); // ожидается не массив строк, а одна строка или null

  if (error) {
    throw new Error(error.message);
  }

  return (data?.game_state as AppState['game']) ?? null;
}

// Создает или обновляет активную игру пользователя в Supabase.
// Используется для сохранения прогресса незавершённой игры между сессиями и устройствами.
export async function upsertActiveGame(
  userId: string,
  game: AppState['game']
): Promise<void> {
  const payload = {
    user_id: userId,
    game_state: game,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('active_games')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    throw new Error(error.message);
  }
}

// Удаляет активную игру пользователя из Supabase.
// Используется после завершения игры и сохранения результата.
export async function deleteActiveGame(userId: string): Promise<void> {
  const { error } = await supabase
    .from('active_games')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
