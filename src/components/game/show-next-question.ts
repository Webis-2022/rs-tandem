import { changeGameMode, resetRound } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { getQuestionMeta } from '../../utils/get-question-meta';
import { buildModalParagraphsHtml } from '../../shared/helpers';
import { showModal } from '../ui/modal/modal';
import { createAnswers } from '../ui/practice-card/answers/answers';
import { toggleButtonsStatement } from './toggle-buttons-statement';
import { finishCurrentGame } from '../../services/finishCurrentGame';

export async function showNextQuestion() {
  const title = 'Would you like to play super game?';
  const text = buildModalParagraphsHtml([
    "You will be asked questions you haven't answered in this topic.",
    'If you answer all questions correctly, you will receive one point for each question.',
    'If you make even one mistake, an amount equal to the number of unanswered questions will be deducted from your score.',
  ]);
  const questionMeta = getQuestionMeta('questions');
  const wrongAnswerMeta = getQuestionMeta('wrongAnswers');
  const questions = questionMeta.questions;
  const wrongAnswers = wrongAnswerMeta.questions;
  const round = questionMeta.round;
  const questionNum = questionMeta.questionNum;
  let question = questions[questionMeta.questionNum];

  if (round > questions.length && wrongAnswers.length === 0) {
    await finishCurrentGame();
    toggleButtonsStatement('allButtons');
    return;
  }

  if (round > questions.length && wrongAnswers.length > 0) {
    const result = await showModal({
      title,
      messageHtml: text,
      showConfirm: true,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
    });

    if (result.confirmed) {
      changeGameMode('super-game');
      resetRound();
      showNextQuestion();
    } else {
      toggleButtonsStatement('allButtons');
      await finishCurrentGame();
      return;
    }
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
