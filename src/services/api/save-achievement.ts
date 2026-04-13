import { withApiErrorHandling } from '../../shared/helpers/request-error';
import { supabase } from '../supabase-client';
import { getState } from '../../app/state/store';

export function saveAchievement(achievement: string) {
  return withApiErrorHandling(async () => {
    const state = getState();
    const gameId = state.gameId;
    const { error } = await supabase
      .from('games')
      .update({ achievement: achievement })
      .eq('id', gameId);
    if (error) {
      throw error;
    }
  }, 'Failed to save achievement');
}
