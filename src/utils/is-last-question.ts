import { getState } from '../app/state/store';

export function isLastQuestion(source: 'questions' | 'wrongAnswers') {
  const state = getState();
  const questions = state.game[source];
  const round = state.game.round;
  return questions.length <= round;
}
