import { supabase } from '../supabaseClient';

export async function getGames(params: { gameIds: number[] }) {
  let query = supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: true });

  if (params.gameIds && params.gameIds.length > 0) {
    query = query.in('id', params.gameIds);
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }
  return;
}
