import { calculateScore } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { checkAnswerSuperGame } from '../../utils/check-answer-super-game';
import { askQuestion } from './ask-question';
import { toggleButtonsStatement } from './toggle-buttons-statement';
import { updateScore } from './updateScore';

export async function playSuperGame(gameMode: string) {
  const state = getState();
  let questions;

  if (gameMode === 'super-game') {
    questions = state.game.wrongAnswers;

    for (let i = 0; i < questions.length; i += 1) {
      const question = questions[i];
      const isCorrect = await askQuestion(question, gameMode);

      if (!isCorrect) {
        alert('This is not correct answer. You are lost super game');
        calculateScore(-questions.length);
        updateScore();
        toggleButtonsStatement();
        return;
      }
    }
    alert('Congratulation! You have answered all the questions of super game!');
    calculateScore(questions.length);
    updateScore();
    toggleButtonsStatement();
  } else if (gameMode === 'game') {
    questions = getState().game.questions;
    for (let i = 0; i < questions.length; i += 1) {
      console.log(i);
      let roundScore: number = 0;
      const question = questions[i];
      console.log('q', question);
      const isCorrect = await askQuestion(question, gameMode);
      console.log(isCorrect);
      const groupId = Date.now();
      if (isCorrect) {
        console.log('called150');
        roundScore = 1;
        checkAnswerSuperGame(question.answer, isCorrect, question, groupId);
      } else {
        roundScore = -1;
        checkAnswerSuperGame(question.answer, isCorrect, question, groupId);
      }
      calculateScore(roundScore);
    }
  }
}
