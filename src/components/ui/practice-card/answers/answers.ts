import { createEl } from '../../../../shared/dom';
import type { Question } from '../../../../types';

export function createAnswers(
  question: Question,
  groupId: number,
  answerContainer: HTMLDivElement | null
) {
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
    label.append(radioInput, option);
    answerContainer?.append(label);
  });
}
