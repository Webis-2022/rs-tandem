import { createButton, createElement } from '../../../shared/dom';
import { createHintsContainer } from './hints-container/hints-container';
import './practice-card.scss';

type Question = {
  level: string;
  answer: string;
  options: string[];
  question: string;
};

export function createPracticeCard(question: Question) {
  console.log(question);
  const editedQuestion = {
    ...question,
    id: Date.now(),
  };

  const card = createElement('div', undefined, 'card');
  const cardHeader = createElement('div', undefined, 'card-header');
  const score = createElement('span', undefined, 'score');
  score.textContent = '0';
  const buttonContainer = createElement('div', undefined, 'button-container');
  const nextTopicButton = createButton(
    'Next topic',
    undefined,
    'next-topic-btn',
    true
  );
  const libraryButton = createButton('Library', undefined, 'library-btn', true);
  const cardBody = createElement('div', undefined, 'card-body');
  const cardFooter = createElement('div', undefined, 'card-footer');
  const hintsContainer = createHintsContainer();
  const topDivider = createElement('div', undefined, 'divider');
  const bottomDivider = createElement('div', undefined, 'divider');
  const questionContainer = createElement(
    'div',
    undefined,
    'question-container'
  );
  const answerContainer = createElement('div', undefined, 'answer-container');
  editedQuestion.options.forEach((option) => {
    const label = createElement('label', undefined, 'label');
    const radioInput = createElement('input', undefined, 'answer-button');
    if (radioInput instanceof HTMLInputElement) {
      radioInput.type = 'radio';
      radioInput.name = String(editedQuestion.id);
      radioInput.value = option;
    }
    questionContainer.textContent = editedQuestion.question;
    label.append(radioInput, option);
    answerContainer.append(label);
  });

  buttonContainer.append(nextTopicButton, libraryButton);
  cardHeader.append(score, buttonContainer);
  cardBody.append(
    topDivider,
    questionContainer,
    bottomDivider,
    answerContainer
  );
  cardFooter.append(hintsContainer);

  card.append(cardHeader, cardBody, cardFooter);
  return card;
}
