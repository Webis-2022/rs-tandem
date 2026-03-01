import { createElement } from '../../../shared/dom';
export function createPracticeCard() {
  const cardHeader = createElement('div', undefined, 'card-header');
  const cardBody = createElement('div', undefined, 'card-body');
  const cardFooter = createElement('div', undefined, 'card-footer');
  const card = createElement('div', undefined, 'card');
  const score = createElement('span', undefined, 'score');
  const divider = createElement('div', undefined, 'divider');
  const question = createElement('span', undefined, 'question');
  const answer = createElement('span', undefined, 'answer');
  cardHeader.append(score);
  cardBody.append(divider, question, divider, answer);

  card.append(cardHeader, cardBody, cardFooter);
  return card;
}
