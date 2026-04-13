import { supabase } from '../supabase-client.ts';
import type { AppState, PersistedActiveSession } from '../../types';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

/**
 * Получает активную сессию пользователя из Supabase.
 * Сессия включает текущий gameId и состояние незавершенного топика.
 */
export async function getActiveSessionByUser(
  userId: string
): Promise<PersistedActiveSession | null> {
  return withApiErrorHandling(async () => {
    const { data, error } = await supabase
      .from('active_games')
      .select('game_id, game_state')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data?.game_state) {
      return null;
    }

    return {
      gameId: data.game_id ?? null,
      game: data.game_state as AppState['game'],
    };
  }, 'Failed to load active session.');
}

/**
 * Совместимая обертка для существующих вызовов,
 * которым пока нужен только active game state.
 */
export async function getActiveGameByUser(
  userId: string
): Promise<AppState['game'] | null> {
  const session = await getActiveSessionByUser(userId);
  return session?.game ?? null;
}

/**
 * Создает или обновляет активную сессию пользователя в Supabase.
 */
export async function upsertActiveSession(
  userId: string,
  session: PersistedActiveSession
): Promise<void> {
  return withApiErrorHandling(async () => {
    const payload = {
      user_id: userId,
      game_id: session.gameId,
      game_state: session.game,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('active_games')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      throw error;
    }
  }, 'Failed to save active session.');
}

/**
 * Совместимая обертка для существующих вызовов,
 * которые пока сохраняют только состояние активного топика.
 */
export async function upsertActiveGame(
  userId: string,
  game: AppState['game']
): Promise<void> {
  return upsertActiveSession(userId, {
    gameId: null,
    game,
  });
}

/**
 * Удаляет активную сессию пользователя из Supabase.
 */
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
