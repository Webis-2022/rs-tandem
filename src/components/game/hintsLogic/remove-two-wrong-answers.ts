import { type Question } from '../../../types';

export function removeTwoWrongAnswers(question: Question) {
  const options = question.options;
  const correctAnswer = question.answer;

  const wrongAnswers = options.filter((option) => option !== correctAnswer);
  const twoWrongAnswers = new Set();
  while (twoWrongAnswers.size < 2) {
    const index = Math.floor(Math.random() * 3);
    const wrongAnswer = wrongAnswers[index];
    twoWrongAnswers.add(wrongAnswer);
  }
  const answerButtons: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('.answer-button');
  answerButtons.forEach((btn) => {
    if (Array.from(twoWrongAnswers).includes(btn.value)) {
      const label = btn.closest('label');
      if (label) {
        label.style.textDecoration = 'line-through';
        label.style.color = '#fa2525';
        btn.disabled = true;
      }
    }
  });
}
