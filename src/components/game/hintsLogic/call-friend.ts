import type { Question } from '../../../types';

export function callFriend(question: Question) {
  const probability = Number(Math.random().toFixed(2));
  console.log(probability);
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
