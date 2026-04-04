import { getState } from '../../app/state/store';
import { supabase } from '../supabaseClient';

export async function fetchCompletedTopicIds(
  difficulty = 'easy'
): Promise<string[]> {
  const state = getState();
  const userId = state.user?.id;

  const { data, error } = await supabase
    .from('topic_status')
    .select('topic_id')
    .eq('user_id', userId)
    .eq('difficulty', difficulty);

  if (error) {
    throw error;
  }

  return data.map((item) => item.topic_id);
}
