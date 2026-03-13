import { highLightAnswer } from './high-light-answer';
import { playSound } from './play-sound';

export function showAnswerFeedback(
  answer: string | undefined,
  color: string,
  sound: string
) {
  highLightAnswer(answer, color);
  playSound(sound);
}
