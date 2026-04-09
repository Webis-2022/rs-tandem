import { supabase } from '../supabase-client.ts';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';
import { getState } from '../../app/state/store.ts';

type Params = {
  gameId?: number;
  difficulty?: string;
};

export async function getGameResult(params: Params) {
  return withApiErrorHandling(async () => {
    let id;
    if (params.gameId) {
      id = params.gameId;
    } else {
      const state = getState();
      id = state.gameId;
    }

    let query = supabase.from('game_results').select('*');

    if (params.gameId) {
      query = query.eq('game_id', id);
    }

    if (params.difficulty) {
      query = query.eq('difficulty', params.difficulty);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }
    return data;
  }, 'Failed to load stats.');
}
