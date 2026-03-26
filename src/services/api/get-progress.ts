import { supabase } from '../supabaseClient.ts';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';
import { getState } from '../../app/state/store.ts';

export async function getProgress() {
  return withApiErrorHandling(async () => {
    const state = getState();
    const gameId = state.game.gameId;
    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .eq('game_id', gameId);

    if (error) {
      throw error;
    }
    return data;
  }, 'Failed to load stats.');
}
