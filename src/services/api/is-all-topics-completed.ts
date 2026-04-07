import { getState } from '../../app/state/store';
import { supabase } from '../supabaseClient';

type TopicStatus = {
  user_id: number;
  topic_id: number;
  difficulty: string;
  is_completed: boolean;
};

export async function isAllTopicsCompleted(): Promise<boolean> {
  const topicsCount = 1;
  const state = getState();
  const userId = state.user?.id;
  const difficulty = state.game.difficulty;
  const { data, error } = await supabase
    .from('topic_status')
    .select('*')
    .eq('user_id', userId)
    .eq('difficulty', difficulty);
  const topics: TopicStatus[] | null = data;
  if (error) {
    throw error;
  }
  if (!topics) {
    return false;
  } else {
    return (
      topics.length === topicsCount &&
      topics?.every((topic) => topic.is_completed === true)
    );
  }
}
