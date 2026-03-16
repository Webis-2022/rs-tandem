import { calculateScore, saveWrongAnswers } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { handleAnswerResult } from '../../utils/handle-answer-result';
// import { checkAnswer } from '../../utils/check-answer';
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
    console.log(questions);
    for (let i = 0; i < questions.length; i += 1) {
      console.log(i);
      const state = getState();
      const round = state.game.round;
      let roundScore: number = 0;
      const question = questions[i];
      console.log('q', question);
      const isCorrect = await askQuestion(question, gameMode);
      if (isCorrect) {
        roundScore = 1;
        handleAnswerResult(question, '#57fa2e', '../sound/correct.mp3', round);
      } else {
        roundScore = -1;
        saveWrongAnswers(question);
        handleAnswerResult(
          question,
          '#fa2525',
          '../sound/incorrect.mp3',
          round
        );
      }
      calculateScore(roundScore);
    }
  }
}
