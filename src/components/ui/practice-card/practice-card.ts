import { createButton, createEl, createElement } from '../../../shared/dom';
import { createHintsContainer } from './hints-container/hints-container';
import { createDivider } from './divider/divider';
import './practice-card.scss';

type Question = {
  level: string;
  answer: string;
  options: string[];
  question: string;
};

export function createPracticeCard(question: Question) {
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
  const topDivider = createDivider();
  const bottomDivider = createDivider();
  const questionContainer = createElement(
    'div',
    undefined,
    'question-container'
  );
  const questionIcon = createEl('img', {
    text: '',
    className: 'question-icon',
  }) as HTMLImageElement;
  questionIcon.src = './img/question.png';
  questionContainer.textContent = question.question;
  const answerContainer = createElement('div', undefined, 'answer-container');
  question.options.forEach((option) => {
    const label = createElement('label', undefined, 'label');
    const radioInput = createElement('input', undefined, 'answer-button');
    const groupId = Date.now();
    if (radioInput instanceof HTMLInputElement) {
      radioInput.type = 'radio';
      radioInput.name = String(groupId);
      radioInput.value = option;
    }
    label.append(radioInput, option);
    answerContainer.append(label);
  });

  const checkButtonContainer = createElement(
    'div',
    undefined,
    'check-button-container'
  );
  const checkButton = createButton('Check', undefined, 'check-button');

  buttonContainer.append(nextTopicButton, libraryButton);
  cardHeader.append(questionIcon, score, buttonContainer);
  checkButtonContainer.append(checkButton);
  answerContainer.append(checkButtonContainer);
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
