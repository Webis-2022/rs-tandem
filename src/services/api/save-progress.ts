import { supabase } from '../supabaseClient';

type SaveProgressParams = {
  userId: string;
  topic: string;
  time: string;
  score: number;
};

export async function saveProgress(params: SaveProgressParams) {
  const { error } = await supabase.from('game_results').insert({
    user_id: params.userId,
    topic: params.topic,
    time: params.time,
    score: params.score,
  });

  if (error) {
    throw new Error(error.message);
  }
}
