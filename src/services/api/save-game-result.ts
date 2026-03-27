import { getState } from '../../app/state/store.ts';
import { supabase } from '../supabaseClient.ts';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export function saveGameResult() {
  return withApiErrorHandling(async () => {
    const state = getState();
    console.log('gI', state.gameId);
    if (!state.user) return;
    const { error } = await supabase.from('game_results').insert({
      game_id: state.gameId,
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
