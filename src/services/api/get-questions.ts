import { supabase } from '../supabaseClient';

export async function getQuestions() {
  const { data, error } = await supabase.functions.invoke('getQuestions', {
    body: { topicId: 10, difficulty: 'easy' },
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
