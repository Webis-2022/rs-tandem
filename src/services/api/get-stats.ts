import { supabase } from '../supabaseClient';
export async function getStats() {
  const { data, error } = await supabase
    .from('game_results')
    .select('*')
    // ADD user.id
    .eq('user_id', '550e8400-e29b-41d4-a716-446655440088');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
