import { playSound } from '../components/game/play-sound';
import { highLightAnswer } from '../components/game/high-light-answer';

export function checkAnswerSuperGame(
  selectedValue: string | undefined,
  correctAnswer: string | undefined
) {
  const isCorrect = selectedValue === correctAnswer;
  if (isCorrect) {
    playSound('./sound/correct.mp3');
    highLightAnswer(correctAnswer, '#57fa2e');
  } else {
    playSound('./sound/incorrect.mp3');
    highLightAnswer(correctAnswer, '#fa2525');
  }

  return isCorrect;
}
