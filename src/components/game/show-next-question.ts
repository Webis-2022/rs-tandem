import { changeGameMode, resetRound } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { getQuestionMeta } from '../../utils/get-question-meta';
import { showModal } from '../ui/modal/modal';
import { createAnswers } from '../ui/practice-card/answers/answers';
import { toggleButtonsStatement } from './toggle-buttons-statement';

export function showNextQuestion() {
  const title = 'Would you like to play super game?';
  const text = `You will be asked questions you haven't answered in this topic.
                If you answer all questions correctly, you will receive one point for each question.
                If you make even one mistake, an amount equal to the number of unanswered questions will be deducted from your score.`;
  const questionMeta = getQuestionMeta('questions');
  const wrongAnswerMeta = getQuestionMeta('wrongAnswers');
  const questions = questionMeta.questions;
  const wrongAnswers = wrongAnswerMeta.questions;
  const round = questionMeta.round;
  const questionNum = questionMeta.questionNum;
  let question = questions[questionMeta.questionNum];
  if (round > questions.length && wrongAnswers.length > 0) {
    showModal({
      title,
      message: text,
      showConfirm: true,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
    });
    const confirmButton = document.querySelector('.modal-btn-confirm');
    const cancelButton = document.querySelector('.modal-btn-cancel');

    confirmButton?.addEventListener('click', () => {
      changeGameMode('super-game');
      resetRound();
      showNextQuestion();
    });

    cancelButton?.addEventListener('click', () => {
      toggleButtonsStatement();
    });
  }
  const questionContainer = document.querySelector('.question-container');
  if (!questionContainer) return;
  const gameMode = getState().game.gameMode;
  if (gameMode === 'game') {
    if (questionNum < questions.length) {
      questionContainer.textContent = questions[questionNum].question;
      createAnswers(question);
    }
  } else {
    if (questionNum < wrongAnswers.length) {
      question = wrongAnswers[questionNum];
      questionContainer.textContent = question.question;
      createAnswers(question);
    }
  }
}
