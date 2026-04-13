import { getState } from '../../app/state/store';
import type { Difficulty, Topic } from '../../types';
import { supabase } from '../supabase-client';

export async function fetchCompletedTopicIds(
  difficulty: Difficulty
): Promise<Topic['id'][]> {
  const state = getState();
  const userId = state.user?.id;

  const { data, error } = await supabase
    .from('topic_status')
    .select('topic_id')
    .eq('user_id', userId)
    .eq('difficulty', difficulty)
    .eq('is_completed', true);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => item.topic_id);
}
