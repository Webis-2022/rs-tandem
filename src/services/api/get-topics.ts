import { supabase } from '../supabaseClient';
export async function getTopics() {
  const { data, error } = await supabase.from('topics').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
