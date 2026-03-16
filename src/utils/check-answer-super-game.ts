import { playSound } from '../components/game/play-sound';
import { highLightAnswer } from '../components/game/high-light-answer';
import type { Question } from '../types';
import { showNextQuestion } from '../components/game/ask-question';

export function checkAnswerSuperGame(
  correctAnswer: string,
  isCorrect: boolean,
  question: Question,
  groupId: number
) {
  console.log('called15');
  if (isCorrect) {
    playSound('./sound/correct.mp3');
    highLightAnswer(correctAnswer, '#57fa2e');
    showNextQuestion(question, groupId);
  } else {
    playSound('./sound/incorrect.mp3');
    highLightAnswer(correctAnswer, '#fa2525');
    showNextQuestion(question, groupId);
  }

  return isCorrect;
}
