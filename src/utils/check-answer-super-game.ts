import { showAnswerFeedback } from '../components/game/answer-feedback/show-answer-feedback';

export function checkAnswerSuperGame(
  selectedValue: string | undefined,
  correctAnswer: string | undefined
) {
  const isCorrect = selectedValue === correctAnswer;
  if (isCorrect) {
    showAnswerFeedback(correctAnswer, '#57fa2e', './sound/correct.mp3');
  } else {
    showAnswerFeedback(correctAnswer, '#fa2525', './sound/incorrect.mp3');
  }

  return isCorrect;
}
