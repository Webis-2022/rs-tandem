import { createEl, createButton } from '../../../../shared/dom';
import { showSidePanel } from '../../../game/hintsLogic/show-side-panel';
import { removeTwoWrongAnswers } from '../../../game/hintsLogic/remove-two-wrong-answers';
import './hints-container.scss';
import { type Question } from '../../../../types';
import { callFriend } from '../../../game/hintsLogic/call-friend';

export function createHintsContainer(question: Question) {
  const hintButtons = {
    '50/50': () => removeTwoWrongAnswers(question),
    'Call a friend': () => callFriend(question),
    "I don't know": (e: MouseEvent) => showSidePanel(question, e),
  };
  const container = createEl('div', { className: 'hints-container' });
  Object.entries(hintButtons).forEach(([buttonKey, buttonHandler]) => {
    const hintButton = createButton(buttonKey, buttonHandler, 'hint-btn');
    container.append(hintButton);
  });
  return container;
}
