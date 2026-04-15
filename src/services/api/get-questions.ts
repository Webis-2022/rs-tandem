import { supabase } from '../supabase-client.ts';
import { withApiErrorHandling } from '../../shared/helpers/request-error.ts';

export async function getQuestions(topicId: number, difficulty: string) {
  return withApiErrorHandling(async () => {
    const { data, error } = await supabase.functions.invoke('getQuestions', {
      body: { topicId, difficulty },
    });

    if (error) {
      throw error;
    }

    return data.questionsBatch;
  }, 'Failed to load questions.');
}
