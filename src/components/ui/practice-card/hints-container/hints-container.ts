import { createEl, createButton } from '../../../../shared/dom';
import { showSidePanel } from '../../../game/hintsLogic/show-side-panel';
import { removeTwoWrongAnswers } from '../../../game/hintsLogic/remove-two-wrong-answers';
import './hints-container.scss';
import { callFriend } from '../../../game/hintsLogic/call-friend';
import { getState } from '../../../../app/state/store';
import type { HintKey } from '../../../../types';

type HintConfig = {
  [key: string]: [(e: MouseEvent) => void, string, HintKey];
};

function isHintDisabled(hintKey: HintKey): boolean {
  const usedHints = getState().game.usedHints;
  return (usedHints?.[hintKey] ?? 0) > 0;
}

export function createHintsContainer() {
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
      const hintButton = createButton(
        buttonKey,
        (event: MouseEvent) => {
          handler(event);
          hintButton.disabled = isHintDisabled(hintKey);
        },
        className
      );

      hintButton.classList.add('hint-btn');
      hintButton.disabled = isHintDisabled(hintKey);

      container.append(hintButton);
    }
  );

  return container;
}
