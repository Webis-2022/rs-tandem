import { saveGameId } from '../../app/state/actions';
import { supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';
import { type GameData } from '../../types';

export async function createNewGame(userId: string) {
  if (!userId) throw new Error('userId missing');
  const {
    data: newGame,
    error,
  }: { data: GameData | null; error: PostgrestError | null } = await supabase
    .from('games')
    .insert({
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  if (!newGame) return;
  const gameId = newGame.id;
  saveGameId(gameId);
}
