import { getTopics } from '../services/api/get-topics';

export async function isAllTopicsCompleted(): Promise<boolean> {
  const topics = await getTopics();
  return topics.every((topic) => topic.is_completed === true);
}
