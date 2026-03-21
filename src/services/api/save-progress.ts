import { getState } from '../../app/state/store';
import { supabase } from '../supabaseClient';

// type SaveProgressParams = {
//   userId: string;
//   topic: string;
//   time: number;
//   score: number;
// };

export async function saveProgress() {
  const state = getState();
  const { error } = await supabase.from('game_results').insert({
    user_id: state.user?.id,
    topic_id: state.game.topicId,
    used_hints: JSON.stringify(state.game.usedHints),
    wrong_answers_count: state.game.wrongAnswersCounter,
  });

  if (error) {
    throw new Error(error.message);
  }
}
