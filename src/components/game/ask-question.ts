import type { Question } from '../../types';
import { createAnswers } from '../ui/practice-card/answers/answers';

export function askQuestion(
  question: Question,
  gameMode: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const groupId = Date.now();
    const checkButton = document.querySelector('.check-button');
    if (gameMode === 'super-game') {
      console.log('!!!!!');
      checkButton?.addEventListener('click', () => {
        const selected: HTMLInputElement | null = document.querySelector(
          `input[name="${groupId}"]:checked`
        );
        const selectedValue = selected?.value;
        const correctAnswer = question.answer;
        const isCorrect: boolean = selectedValue === correctAnswer;

        setTimeout(() => {
          resolve(isCorrect);
        }, 700);
      });
    } else if (gameMode === 'game') {
      checkButton?.addEventListener('click', () => {
        const selected: HTMLInputElement | null = document.querySelector(
          `input[name="${groupId}"]:checked`
        );
        console.log('>>>>>');
        const selectedValue = selected?.value;
        const correctAnswer = question.answer;
        const isCorrect: boolean = selectedValue === correctAnswer;
        console.log('called88');

        setTimeout(() => {
          resolve(isCorrect);
        }, 700);
      });
    }
  });
}

export function showNextQuestion(question: Question, groupId: number) {
  console.log('called10');
  console.log(question);
  const questionContainer = document.querySelector('.question-container');
  const answers = document.querySelector('.answers');
  answers?.replaceChildren();
  if (!questionContainer) return;
  questionContainer.innerHTML = question.question;
  createAnswers(question, groupId, answers as HTMLDivElement);
}
