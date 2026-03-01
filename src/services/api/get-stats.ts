import { supabase } from '../supabaseClient';
export async function getStats(userId: string) {
  const { data, error } = await supabase
    .from('game_results')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
