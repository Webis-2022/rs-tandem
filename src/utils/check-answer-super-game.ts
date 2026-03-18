import { playSound } from '../components/game/play-sound';
import { highLightAnswer } from '../components/game/high-light-answer';
import { showNextQuestion } from '../components/game/show-next-question';
// import { getState } from '../app/state/store';

export function checkAnswerSuperGame(
  correctAnswer: string,
  isCorrect: boolean
) {
  // const round = getState().game.round;
  if (isCorrect) {
    playSound('./sound/correct.mp3');
    highLightAnswer(correctAnswer, '#57fa2e');
    showNextQuestion();
  } else {
    playSound('./sound/incorrect.mp3');
    highLightAnswer(correctAnswer, '#fa2525');
    showNextQuestion();
  }

  return isCorrect;
}
