import { supabase } from '../supabaseClient.ts';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';
import { getState } from '../../app/state/store.ts';

export async function getGameResult(gameId?: number) {
  return withApiErrorHandling(async () => {
    let id;
    if (gameId) {
      id = gameId;
    } else {
      const state = getState();
      id = state.gameId;
    }

    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .eq('game_id', id);

    if (error) {
      throw error;
    }
    console.log(data);
    return data;
  }, 'Failed to load stats.');
}
