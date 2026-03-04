import { createElement, createButton } from '../../../../shared/dom';
import './hints-container.scss';

export function createHintsContainer() {
  const hintButtons = {
    '50/50': console.log('50/50'),
    'Call a friend': console.log('Call a friend'),
    "I don't know": console.log("I don't know"),
  };
  const container = createElement('div', undefined, 'hints-container');
  Object.entries(hintButtons).forEach((button) => {
    const hintButton = createButton(button[0], () => button[1], 'hint-btn');
    container.append(hintButton);
  });
  return container;
}
