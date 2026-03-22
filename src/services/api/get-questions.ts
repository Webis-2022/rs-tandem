import { supabase } from '../supabaseClient';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export async function getQuestions(topicId: number, difficulty: string) {
  return withApiErrorHandling(async () => {
    // throw new Error('test');
    const { data, error } = await supabase.functions.invoke('getQuestions', {
      body: { topicId, difficulty },
    });

    if (error) {
      throw error;
    }

    return data.questionsBatch;
  }, 'Failed to load questions.');
}
