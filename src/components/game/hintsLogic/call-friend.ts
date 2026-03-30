import { getQuestionMeta } from '../../../utils/get-question-meta';
import { showModal } from '../../ui/modal/modal';
import { countClicks } from './count-clicks';

export function callFriend() {
  const { questions, questionNum } = getQuestionMeta('questions');
  const question = questions[questionNum];
  const probability = Number(Math.random().toFixed(2));
  const probabilityThreshold = 0.7;
  const wrongAnswersCount = 3;
  let friendAnswer;
  const correctAnswer = question.answer;
  const wrongAnswers = question.options.filter(
    (option) => option !== correctAnswer
  );

  if (probability < probabilityThreshold) {
    friendAnswer = correctAnswer;
  } else {
    const index = Math.floor(Math.random() * wrongAnswersCount);
    friendAnswer = wrongAnswers[index];
  }
  showModal({
    messageHtml: `Your friend isn't sure, but he thinks the correct answer is <b>${friendAnswer}</b>`,
  });
  countClicks('oneButton', '.friend', true, 'call a friend');
}
