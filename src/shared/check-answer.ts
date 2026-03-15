import { calculateScore } from '../app/state/actions';
import { getState } from '../app/state/store';
import { handleAnswerResult } from '../utils/handle-answer-result';

export async function checkAnswer(
  answer: string | undefined,
  question: Question,
  section: HTMLElement | null
) {
  const correctAnswer = question.answer;
  const state = getState();
  let wrongAnswersLength;
  const text = `Would you like to play super game?
        Rules:
        You will be asked questions you haven't answered in this topic.
        If you answer all questions correctly, you will receive one point for each question.
        If you make even one mistake, an amount equal to the number of unanswered questions will be deducted from your score.`;
  const round = state.game.round;
  const isCorrect = answer?.toLowerCase() === correctAnswer?.toLowerCase();
  let roundScore: number = 0;
  if (isCorrect) {
    roundScore = 1;
    handleAnswerResult(
      answer,
      '#57fa2e',
      '../sound/correct.mp3',
      round,
      section
    );
  } else {
    roundScore = -1;
    handleAnswerResult(
      answer,
      '#fa2525',
      '../sound/incorrect.mp3',
      round,
      section
    );
  }
  calculateScore(roundScore);
}
