import { supabase } from '../supabaseClient';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

type SaveProgressParams = {
  userId: string;
  topic: string;
  time: number;
  score: number;
};

export async function saveProgress(params: SaveProgressParams) {
  return withApiErrorHandling(async () => {
    const { error } = await supabase.from('game_results').insert({
      user_id: params.userId,
      topic: params.topic,
      time: params.time,
      score: params.score,
    });

    if (error) {
      throw error;
    }
  }, 'Failed to save progress.');
}
