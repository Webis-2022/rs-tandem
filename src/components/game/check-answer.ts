import {
  calculateScore,
  countWrongAnswers,
  markAsCorrected,
  saveWrongAnswers,
} from '../../app/state/actions';
import { highLightAnswer } from './high-light-answer';
import { playSound } from './play-sound';
import { updateScore } from './updateScore';
import { delay } from '../../utils/delay';
import { buildModalParagraphsHtml } from '../../shared/helpers';
import { showModal } from '../ui/modal/modal';
import { getQuestionMeta } from '../../utils/get-question-meta';
import { checkIfCorrect } from './check-if-correct';
import { isLastQuestion } from '../../utils/is-last-question';
import { handleAnswerFeedback } from './handle-answer-feedback';
import { handleRoundEnd } from './handle-round-end';
import { markTopicAsCompleted } from '../../services/api/mark-topic-as-completed';
import { saveGameResult } from '../../services/api/save-game-result';
import { getState } from '../../app/state/store';

export async function checkAnswer(gameMode: string) {
  let questionsLength;
  const state = getState();
  let isLast;
  if (gameMode === 'game') {
    const questionMeta = getQuestionMeta('questions');
    const currentQuestion = questionMeta.questions[questionMeta.questionNum];
    questionsLength = questionMeta.questions.length;
    const [correctAnswer, selectedValue, isCorrect] =
      checkIfCorrect(currentQuestion);
    const roundScore = isCorrect ? 1 : -1;
    isLast = isLastQuestion('questions');
    const wrongAnswersCounter = state.game.wrongAnswersCounter;

    if (isLast && isCorrect) {
      if (wrongAnswersCounter === 0) {
        await saveGameResult();
        await markTopicAsCompleted();
      }
    }

    if (isCorrect) {
      handleAnswerFeedback(correctAnswer, './sound/correct.mp3', '#57fa2e');
    } else {
      saveWrongAnswers(currentQuestion);
      handleAnswerFeedback(selectedValue, './sound/incorrect.mp3', '#fa2525');
    }
    countWrongAnswers();
    calculateScore(roundScore);
    updateScore();
  } else if (gameMode === 'super-game') {
    const questionMeta = getQuestionMeta('wrongAnswers');
    const currentQuestion = questionMeta.questions[questionMeta.questionNum];
    const [correctAnswer, selectedValue, isCorrect] =
      checkIfCorrect(currentQuestion);
    const winText =
      'Congratulation! You have answered all the questions of super game!';
    const lossText = 'This is not correct answer. You are lost super game';
    if (isCorrect) {
      isLast = isLastQuestion('wrongAnswers');
      questionsLength = questionMeta.questions.length;
      handleAnswerFeedback(correctAnswer, './sound/correct.mp3', '#57fa2e');
      markAsCorrected(currentQuestion);
      if (isLast) {
        showModal({
          title: undefined,
          messageHtml: buildModalParagraphsHtml([winText]),
          showConfirm: false,
          confirmText: 'Ok',
        });
        handleRoundEnd(questionsLength);
        await saveGameResult();
        await markTopicAsCompleted();
      }
    } else {
      playSound('./sound/incorrect.mp3');
      highLightAnswer(selectedValue, '#fa2525');
      await delay(1000);
      showModal({
        title: undefined,
        messageHtml: buildModalParagraphsHtml([lossText]),
        showConfirm: false,
        confirmText: 'Ok',
      });
      questionsLength = getQuestionMeta('wrongAnswers').questions.length;
      handleRoundEnd(-questionsLength);
      await saveGameResult();
      await markTopicAsCompleted();
      return;
    }
    countWrongAnswers();
  }
}
