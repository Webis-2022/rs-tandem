import { supabase } from '../supabaseClient';

export async function getGames(difficulty: string) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('difficulty', difficulty)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }
  return data;
}
