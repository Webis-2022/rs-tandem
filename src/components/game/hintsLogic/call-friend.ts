import { getQuestionMeta } from '../../../utils/get-question-meta';

export function callFriend() {
  const { questions, questionNum } = getQuestionMeta('questions');
  const question = questions[questionNum];
  const probability = Number(Math.random().toFixed(2));
  let friendAnswer;
  const correctAnswer = question.answer;
  const wrongAnswers = question.options.filter(
    (option) => option !== correctAnswer
  );

  if (probability < 0.7) {
    friendAnswer = correctAnswer;
  } else {
    const index = Math.floor(Math.random() * 3);
    friendAnswer = wrongAnswers[index];
  }
  alert(
    `Your friend isn't sure, but he thinks the correct answer is ${friendAnswer}`
  );
}
