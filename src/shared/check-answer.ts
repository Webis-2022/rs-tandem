import { calculateScore } from '../app/state/actions';
import { getState } from '../app/state/store';
import { handleAnswerResult } from '../utils/handle-answer-result';

export function checkAnswer(
  answer: string | undefined,
  correctAnswer: string | undefined,
  section: HTMLElement | null
) {
  const state = getState();
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
