import { createElement } from '../../../shared/dom';
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
    id: question.level,
  };
  console.log('eQ', editedQuestion);
  const card = createElement('div', undefined, 'card');
  const cardHeader = createElement('div', undefined, 'card-header');
  const cardBody = createElement('div', undefined, 'card-body');
  const cardFooter = createElement('div', undefined, 'card-footer');
  const score = createElement('span', undefined, 'score');
  const divider = createElement('div', undefined, 'divider');
  const questionContainer = createElement(
    'span',
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

  cardHeader.append(score);
  cardBody.append(divider, questionContainer, divider, answerContainer);

  card.append(cardHeader, cardBody, cardFooter);
  return card;
}
