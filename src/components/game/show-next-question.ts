import { changeGameMode, resetRound } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { createAnswers } from '../ui/practice-card/answers/answers';
// import { playSuperGame } from './play-super-game';
import { toggleButtonsStatement } from './toggle-buttons-statement';
// import { toggleButtonsStatement } from './toggle-buttons-statement';

export function showNextQuestion() {
  const text = `Would you like to play super game?
        Rules:
        You will be asked questions you haven't answered in this topic.
        If you answer all questions correctly, you will receive one point for each question.
        If you make even one mistake, an amount equal to the number of unanswered questions will be deducted from your score.`;
  const state = getState();
  const questions = state.game.questions;
  const wrongAnswers = state.game.wrongAnswers;
  const questionNum = state.game.round - 1;
  let question = questions[questionNum];
  if (questionNum + 1 > questions.length && wrongAnswers.length > 0) {
    if (confirm(text)) {
      changeGameMode('super-game');
      resetRound();
      showNextQuestion();
    } else {
      toggleButtonsStatement();
    }
  }
  const questionContainer = document.querySelector('.question-container');
  if (!questionContainer) return;
  const gameMode = getState().game.gameMode;
  if (gameMode === 'game') {
    // Проверяем, не вышли ли мы за пределы массива questions
    if (questionNum < questions.length) {
      questionContainer.textContent = questions[questionNum].question;
      createAnswers(question);
    }
  } else {
    // Для super-game используем wrongAnswers
    if (questionNum < wrongAnswers.length) {
      question = wrongAnswers[questionNum];
      questionContainer.textContent = question.question;
      createAnswers(question);
    }
  }
}
