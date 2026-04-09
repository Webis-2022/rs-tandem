import { changeGameMode, resetRound } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { getQuestionMeta } from '../../utils/get-question-meta';
import { buildModalParagraphsHtml } from '../../shared/helpers';
import { showModal } from '../ui/modal/modal';
import { createAnswers } from '../ui/practice-card/answers/answers';
import { toggleButtonsStatement } from './toggle-buttons-statement';
import { finishCurrentGame } from '../../services/finish-current-game';
import { handleGameCompletion } from './handle-game-completion';

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

  if (round > questions.length && wrongAnswers.length === 0) {
    await handleGameCompletion();
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
      await showNextQuestion();
      return;
    } else {
      await handleGameCompletion();
      toggleButtonsStatement('allButtons');
      await finishCurrentGame();
      return;
    }
  }

  const currentMeta =
    getState().game.gameMode === 'game'
      ? getQuestionMeta('questions')
      : getQuestionMeta('wrongAnswers');
  const currentQuestions = currentMeta.questions;
  const currentQuestionNum = currentMeta.questionNum;

  if (currentQuestionNum < 0 || currentQuestionNum >= currentQuestions.length) {
    return;
  }

  const question = currentQuestions[currentQuestionNum];
  const questionContainer = document.querySelector('.question-container');
  if (!questionContainer) return;

  const gameMode = getState().game.gameMode;
  if (gameMode === 'game') {
    questionContainer.textContent = question.question;
    createAnswers(question);
  } else {
    questionContainer.textContent = question.question;
    createAnswers(question);
  }
}
