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
import { finishCurrentGame } from '../../services/finishCurrentGame';
import { toggleButtonsStatement } from './toggle-buttons-statement';
import { isAllTopicsCompleted } from '../../utils/is-all-topics-completed';
import { markTopicAsCompleted } from '../../services/api/mark-topic-as-completed';
import { getProgress } from '../../services/api/get-progress';
import { saveProgress } from '../../services/api/save-progress';

export async function checkAnswer(gameMode: string) {
  let questionsLength;
  let isLast;
  if (gameMode === 'game') {
    const questionMeta = getQuestionMeta('questions');
    const currentQuestion = questionMeta.questions[questionMeta.questionNum];
    questionsLength = questionMeta.questions.length;
    const [correctAnswer, selectedValue, isCorrect] =
      checkIfCorrect(currentQuestion);
    const roundScore = isCorrect ? 1 : -1;
    isLast = isLastQuestion('questions');

    if (isCorrect && isLast) {
      await saveProgress();
      await markTopicAsCompleted();
      const isAllCompleted = await isAllTopicsCompleted();
      if (isAllCompleted) {
        getProgress();
      }
      toggleButtonsStatement();
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
      questionsLength = getQuestionMeta('wrongAnswers').questions.length;
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
        await finishCurrentGame();
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
      await finishCurrentGame();
      return;
    }
    countWrongAnswers();
  }
}
