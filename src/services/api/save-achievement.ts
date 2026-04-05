import { withApiErrorHandling } from '../../shared/helpers/request-error';
import { supabase } from '../supabaseClient';
import { getState } from '../../app/state/store';

export function saveAchievement(achievement: string) {
  return withApiErrorHandling(async () => {
    const state = getState();
    const gameId = state.gameId;
    const { error } = await supabase
      .from('game_results')
      .update({ achievement: achievement })
      .eq('game_id', gameId);
    if (error) {
      throw error;
    }
  }, 'Failed to save achievement');
}
