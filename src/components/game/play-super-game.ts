import { calculateScore } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import type { Question } from '../../types';
import { askQuestion } from './ask-question';
import { toggleButtonsStatement } from './toggle-buttons-statement';
import { updateScore } from './updateScore';

export async function playSuperGame() {
  const state = getState();
  const wrongAnswers = state.game.wrongAnswers;

  for (let i = 0; i < wrongAnswers.length; i += 1) {
    const question = wrongAnswers[i] as unknown as Question;
    const isCorrect = await askQuestion(question);

    if (!isCorrect) {
      alert('This is not correct answer. You are lost super game');
      calculateScore(-wrongAnswers.length);
      updateScore();
      toggleButtonsStatement();
      return;
    }
  }
  alert('Congratulation! You have answered all the questions of super game!');
  calculateScore(wrongAnswers.length);
  updateScore();
  toggleButtonsStatement();
}
