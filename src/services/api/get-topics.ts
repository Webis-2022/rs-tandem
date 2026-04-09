import { supabase } from '../supabase-client.ts';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export async function getTopics() {
  return withApiErrorHandling(async () => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  }, 'Failed to load topics.');
}
