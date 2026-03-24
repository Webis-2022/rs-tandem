import { getState } from '../../app/state/store';
import { supabase } from '../supabaseClient';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export async function saveProgress() {
  return withApiErrorHandling(async () => {
    const state = getState();
    console.log(state.topics[state.game.topicId - 1]?.name);
    const { error } = await supabase.from('game_results').insert({
      user_id: state.user?.id,
      topic: state.topics[state.game.topicId - 1]?.name ?? '',
      difficulty: state.game.difficulty,
      topic_id: state.game.topicId,
      used_hints: JSON.stringify(state.game.usedHints),
      wrong_answers_count: state.game.wrongAnswersCounter,
    });

    if (error) {
      throw error;
    }
  }, 'Failed to save progress.');
}
