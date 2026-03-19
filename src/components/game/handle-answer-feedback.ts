import { increaseRound } from '../../app/state/actions';
import { delay } from '../../utils/delay';
import { highLightAnswer } from './high-light-answer';
import { playSound } from './play-sound';
import { showNextQuestion } from './show-next-question';

export async function handleAnswerFeedback(
  answer: string | undefined,
  sound: string,
  color: string
) {
  increaseRound();
  playSound(sound);
  highLightAnswer(answer, color);
  await delay(1000);
  showNextQuestion();
}
