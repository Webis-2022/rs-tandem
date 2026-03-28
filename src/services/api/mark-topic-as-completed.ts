import { getState } from '../../app/state/store';
import { withApiErrorHandling } from '../../shared/helpers/request-error';
import { supabase } from '../supabaseClient';

export function markTopicAsCompleted() {
  return withApiErrorHandling(async () => {
    const state = getState();
    const topicId = state.game.topicId;
    const { error } = await supabase
      .from('topics')
      .update({ is_completed: true })
      .eq('id', topicId)
      .select();

    if (error) {
      throw error;
    }
  }, 'Failed to update topic statement');
}
