import { getState } from '../../app/state/store';
import { withApiErrorHandling } from '../../shared/helpers/request-error';
import type { Difficulty } from '../../types';
import { supabase } from '../supabaseClient';

export function deleteCompletedTopics(difficulty: Difficulty) {
  return withApiErrorHandling(async () => {
    const state = getState();
    const userId = state.user?.id;

    const { error } = await supabase
      .from('topic_status')
      .delete()
      .eq('user_id', userId)
      .eq('difficulty', difficulty);

    if (error) {
      throw error;
    }
  }, 'Failed to delete complete topics');
}
