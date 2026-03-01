import { supabase } from '../supabaseClient';

export async function getQuestions(topicId: number, difficulty: string) {
  const { data, error } = await supabase.functions.invoke('getQuestions', {
    body: { topicId, difficulty },
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
