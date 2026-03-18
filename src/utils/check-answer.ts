import { calculateScore, saveWrongAnswers } from '../app/state/actions';
import { getState } from '../app/state/store';
import type { Question } from '../types';
import { handleAnswerResult } from '../utils/handle-answer-result';

export async function checkAnswer(
  answer: string | undefined,
  question: Question,
  section: HTMLElement | null
) {
  const correctAnswer = question.answer;
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
    saveWrongAnswers(question);
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
