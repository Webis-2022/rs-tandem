import { createButton, createEl } from '../../shared/dom';
import type { Question } from '../../types';
import { checkAnswerSuperGame } from '../../utils/check-answer-super-game';
import { createAnswers } from '../ui/practice-card/answers/answers';

export function askQuestion(question: Question) {
  return new Promise((resolve) => {
    const groupId = Date.now();
    const questionContainer = document.querySelector('.question-container');
    const answerContainer = document.querySelector('.answer-container');
    answerContainer?.replaceChildren();
    if (!questionContainer) return;
    questionContainer.innerHTML = question.question;
    createAnswers(question, groupId, answerContainer as HTMLDivElement);
    const checkButtonContainer = createEl('div', {
      className: 'check-button-container',
    });
    const checkButton = createButton('Check', undefined, 'check-button');
    checkButtonContainer.append(checkButton);
    answerContainer?.append(checkButtonContainer);
    checkButton?.addEventListener('click', () => {
      const selected: HTMLInputElement | null = document.querySelector(
        `input[name="${groupId}"]:checked`
      );
      const selectedValue = selected?.value;
      const correctAnswer = question.answer;
      const isCorrect = checkAnswerSuperGame(selectedValue, correctAnswer);
      resolve(isCorrect);
    });
  });
}
