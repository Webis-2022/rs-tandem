import { isAllTopicsCompleted } from '../../services/api/is-all-topics-completed';
import { markTopicAsCompleted } from '../../services/api/mark-topic-as-completed';
import { saveGameResult } from '../../services/api/save-game-result';
import { createFinalScreen } from '../ui/final-screen/final-screen';

export async function handleGameCompletion() {
  await saveGameResult();
  await markTopicAsCompleted();
  const isGameOver = await isAllTopicsCompleted();
  if (isGameOver) createFinalScreen();
}
