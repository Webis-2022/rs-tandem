import { supabase } from '../supabaseClient';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export async function getTopics() {
  return withApiErrorHandling(async () => {
    // throw new Error('test');

    const { data, error } = await supabase.from('topics').select('*');

    if (error) {
      throw error;
    }

    return data;
  }, 'Failed to load topics.');
}
