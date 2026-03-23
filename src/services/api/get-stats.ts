import { supabase } from '../supabaseClient';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export async function getStats(userId: string) {
  return withApiErrorHandling(async () => {
    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data;
  }, 'Failed to load stats.');
}
