import { createEl, createButton } from '../../../../shared/dom';
import { showSidePanel } from '../../../game/hintsLogic/show-side-panel';
import { removeTwoWrongAnswers } from '../../../game/hintsLogic/remove-two-wrong-answers';
import './hints-container.scss';
import { callFriend } from '../../../game/hintsLogic/call-friend';
import { getState } from '../../../../app/state/store';
import type { HintCounter } from '../../../../types';

type HintConfig = {
  [key: string]: [(e: MouseEvent) => void, string, keyof HintCounter];
};

export function createHintsContainer() {
  const usedHints = getState().game.usedHints;

  const hintButtons: HintConfig = {
    '50/50': [removeTwoWrongAnswers, 'fifty-fifty', '50/50'],
    'Call a friend': [callFriend, 'friend', 'call a friend'],
    "I don't know": [
      (e: MouseEvent) => showSidePanel(e),
      'i-dont-know',
      "i don't know",
    ],
  };

  const container = createEl('div', { className: 'hints-container' });

  Object.entries(hintButtons).forEach(
    ([buttonKey, [handler, className, hintKey]]) => {
      const hintButton = createButton(buttonKey, handler, className);
      hintButton.classList.add('hint-btn');

      if ((usedHints?.[hintKey] ?? 0) > 0) {
        hintButton.disabled = true;
      }

      container.append(hintButton);
    }
  );

  return container;
}
