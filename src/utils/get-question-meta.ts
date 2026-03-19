import { getState } from '../app/state/store';

export function getQuestionMeta(source: 'questions' | 'wrongAnswers') {
  const roundIndexOffset = 1;
  const state = getState();
  const questions = state.game[source];
  const round = state.game.round;
  const questionNum = round - roundIndexOffset;
  return { questions, questionNum, round };
}
