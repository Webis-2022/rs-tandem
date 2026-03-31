import { getState } from '../../app/state/store';
import type { Topic } from '../../types';
import { supabase } from '../supabaseClient';
import { getTopics } from './get-topics';

export async function fetchCompletedTopics(
  difficulty = 'easy'
): Promise<Topic[]> {
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
  const topics = await getTopics();
  const completedTopics = topics.filter((topic) =>
    data.some((item) => item.topic_id === topic.id)
  );

  return completedTopics;
}
