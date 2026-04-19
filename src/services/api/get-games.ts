import { supabase } from '../supabase-client';

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

export async function getLatestGameByUser(userId: string) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
