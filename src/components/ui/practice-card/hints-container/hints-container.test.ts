import type { Question } from '../../../../types';
import { createHintsContainer } from './hints-container';

describe('createHintsContainer', () => {
  let container: HTMLElement;
  let hintButtons: NodeListOf<HTMLButtonElement>;

  const mockQuestion: Question = {
    level: 'easy',
    answer: 'HyperText Markup Language',
    options: ['HTML', 'CSS', 'JS', 'TS'],
    question: 'What does HTML stand for?',
    explanation: 'HTML stands for HyperText Markup Language.',
  };

  beforeEach(() => {
    container = createHintsContainer(mockQuestion);
    hintButtons = container.querySelectorAll('.hint-btn');
  });

  test('create 3 hint buttons', () => {
    expect(hintButtons.length).toEqual(3);
  });
  test('buttons have correct text', () => {
    const text = Array.from(hintButtons).map((btn) => btn.textContent);
    expect(text).toEqual(['50/50', 'Call a friend', "I don't know"]);
  });
  test('buttons have correct class', () => {
    hintButtons.forEach((btn) => {
      expect(btn).toHaveClass('hint-btn');
    });
  });
});
