import { saveGameId } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';
import { type GameData } from '../../types';

export async function createNewGame(userId: string) {
  if (!userId) throw new Error('userId missing');
  const state = getState();
  const difficulty = state.game.difficulty;

  const {
    data: newGame,
    error,
  }: { data: GameData | null; error: PostgrestError | null } = await supabase
    .from('games')
    .insert({
      user_id: userId,
      difficulty,
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
