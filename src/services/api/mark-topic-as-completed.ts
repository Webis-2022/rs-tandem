import { getState } from '../../app/state/store';
import { withApiErrorHandling } from '../../shared/helpers/request-error';
import { supabase } from '../supabase-client';

export function markTopicAsCompleted() {
  return withApiErrorHandling(async () => {
    const state = getState();
    const topicId = state.game.topicId;
    const userId = state.user?.id;
    const difficulty = state.game.difficulty;
    const { error } = await supabase.from('topic_status').upsert({
      user_id: userId,
      topic_id: topicId,
      difficulty: difficulty,
      is_completed: true,
    });

    if (error) {
      throw error;
    }
  }, 'Failed to update topic statement');
}
