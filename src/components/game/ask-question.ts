import type { Question } from '../../types';
// import { checkAnswer } from '../../utils/check-answer';
import { checkAnswerSuperGame } from '../../utils/check-answer-super-game';
import { createAnswers } from '../ui/practice-card/answers/answers';

export function askQuestion(question: Question, gameMode: string) {
  return new Promise((resolve) => {
    const groupId = Date.now();
    const checkButton = document.querySelector('.check-button');
    if (gameMode === 'super-game') {
      checkButton?.addEventListener('click', () => {
        const selected: HTMLInputElement | null = document.querySelector(
          `input[name="${groupId}"]:checked`
        );
        const selectedValue = selected?.value;
        const correctAnswer = question.answer;
        const isCorrect: boolean = selectedValue === correctAnswer;
        checkAnswerSuperGame(correctAnswer, isCorrect, question, groupId);

        setTimeout(() => {
          resolve(isCorrect);
        }, 700);
      });
    } else {
      checkButton?.addEventListener('click', () => {
        const selected: HTMLInputElement | null = document.querySelector(
          `input[name="${groupId}"]:checked`
        );
        const selectedValue = selected?.value;
        const correctAnswer = question.answer;
        const isCorrect: boolean = selectedValue === correctAnswer;
        checkAnswerSuperGame(correctAnswer, isCorrect, question, groupId);
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
  const questionContainer = document.querySelector('.question-container');
  const answers = document.querySelector('.answers');
  answers?.replaceChildren();
  if (!questionContainer) return;
  questionContainer.innerHTML = question.question;
  createAnswers(question, groupId, answers as HTMLDivElement);
}
