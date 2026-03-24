import { getState } from '../../app/state/store';
import { supabase } from '../supabaseClient';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export async function saveProgress() {
  return withApiErrorHandling(async () => {
    const state = getState();
    const { error } = await supabase.from('game_results').insert({
      user_id: state.user?.id,
      topic_id: state.game.topicId,
      used_hints: JSON.stringify(state.game.usedHints),
      wrong_answers_count: state.game.wrongAnswersCounter,
    });

    if (error) {
      throw error;
    }
  }, 'Failed to save progress.');
}
