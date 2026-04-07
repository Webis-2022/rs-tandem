import { supabase } from '../supabaseClient';

type Params = {
  difficulty?: string;
  gameId?: number;
};

export async function getGames(params: Params) {
  let query = supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: true });

  if (params.difficulty) {
    query = query.eq('difficulty', params.difficulty);
  }

  if (params.gameId) {
    query = query.eq('id', params.gameId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
