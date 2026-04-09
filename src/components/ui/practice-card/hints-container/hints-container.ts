import { createEl, createButton } from '../../../../shared/dom';
import { showSidePanel } from '../../../game/hintsLogic/show-side-panel';
import { removeTwoWrongAnswers } from '../../../game/hintsLogic/remove-two-wrong-answers';
import './hints-container.scss';
import { callFriend } from '../../../game/hintsLogic/call-friend';

type HintConfig = {
  [key: string]: [(e: MouseEvent) => void, string];
};

export function createHintsContainer() {
  const hintButtons: HintConfig = {
    '50/50': [removeTwoWrongAnswers, 'fifty-fifty'],
    'Call a friend': [callFriend, 'friend'],
    "I don't know": [(e: MouseEvent) => showSidePanel(e), 'i-dont-know'],
  };
  const container = createEl('div', { className: 'hints-container' });
  Object.entries(hintButtons).forEach(([buttonKey, [handler, className]]) => {
    const hintButton = createButton(buttonKey, handler, className);
    hintButton.classList.add('hint-btn');
    container.append(hintButton);
  });
  return container;
}
