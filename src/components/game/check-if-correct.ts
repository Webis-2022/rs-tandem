import type { Question } from '../../types';

export function checkIfCorrect(
  currentQuestion: Question
): [string, string | undefined, boolean] {
  const selected: HTMLInputElement | null = document.querySelector(
    `.answer-button:checked`
  );
  const selectedValue = selected?.value;
  const correctAnswer = currentQuestion.answer;
  const isCorrect = selectedValue === correctAnswer;
  return [correctAnswer, selectedValue, isCorrect];
}
