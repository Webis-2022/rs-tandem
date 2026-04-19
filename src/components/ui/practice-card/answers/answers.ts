import { createEl } from '../../../../shared/dom';
import type { Question } from '../../../../types';

export function createAnswers(question: Question) {
  const answers = document.querySelector('.answers') as HTMLDivElement;
  const answerContainer = document.querySelector('.answer-container');
  const groupId = Date.now();
  answers?.replaceChildren();
  question.options.forEach((option) => {
    const label = createEl('label', { className: 'label' });
    const radioInput = createEl('input', { className: 'answer-button' });
    if (radioInput instanceof HTMLInputElement) {
      radioInput.type = 'radio';
      radioInput.name = String(groupId);
      radioInput.value = option;
      radioInput.addEventListener('change', () => {
        const checkButton: HTMLButtonElement | null =
          document.querySelector('.check-button');
        if (!checkButton) return;
        checkButton.disabled = false;
      });
    }

    const span = createEl('span');

    if (span) {
      span.textContent = option;
    }

    label.append(radioInput, span);
    answers?.append(label);
    answerContainer?.prepend(answers);
  });
}
