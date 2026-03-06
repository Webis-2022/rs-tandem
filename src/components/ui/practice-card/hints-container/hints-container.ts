import { createElement, createButton } from '../../../../shared/dom';
import { showSidePanel } from '../../../../shared/show-side-panel';
import './hints-container.scss';

export function createHintsContainer() {
  const hintButtons = {
    '50/50': () => console.log('50/50'),
    'Call a friend': () => console.log('Call a friend'),
    "I don't know": showSidePanel,
  };
  const container = createElement('div', undefined, 'hints-container');
  Object.entries(hintButtons).forEach(([buttonKey, buttonHandler]) => {
    const hintButton = createButton(buttonKey, buttonHandler, 'hint-btn');
    container.append(hintButton);
  });
  return container;
}
