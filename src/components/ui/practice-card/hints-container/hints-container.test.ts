import type { Difficulty } from '../../../../types';
import { createHintsContainer } from './hints-container';

describe('createHintsContainer', () => {
  let container: HTMLElement;
  let hintButtons: NodeListOf<HTMLButtonElement>;
  const question = {
    level: 'easy' as Difficulty,
    answer: 'HyperText Markup Language',
    options: [
      'HyperText Preprocessor',
      'HyperText Markup Language',
      'Home Tool Markup Language',
      'Hyperlinks and Text Markup Language',
    ],
    question: 'What does HTML stand for?',
    explanation:
      '<p><strong>HyperText Markup Language</strong> is the correct expansion of HTML.</p><p><code>HTML</code> is used to structure content on web pages with elements like <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code>.</p><ul><li>It defines headings, paragraphs, links, and more.</li></ul>',
  };
  beforeEach(() => {
    container = createHintsContainer(question);
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
