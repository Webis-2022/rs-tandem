import { createEl, createButton } from '../../../../shared/dom';
import { showSidePanel } from '../../../game/hintsLogic/show-side-panel';
import { removeTwoWrongAnswers } from '../../../game/hintsLogic/remove-two-wrong-answers';
import './hints-container.scss';
import { callFriend } from '../../../game/hintsLogic/call-friend';
import { getState } from '../../../../app/state/store';

export function createHintsContainer() {
  const state = getState();
  const questions = state.game.questions;
  const questionNum = state.game.round - 1;
  const currentQuestion = questions[questionNum];
  const hintButtons = {
    '50/50': () => removeTwoWrongAnswers(currentQuestion),
    'Call a friend': () => callFriend(currentQuestion),
    "I don't know": (e: MouseEvent) => showSidePanel(currentQuestion, e),
  };
  const container = createEl('div', { className: 'hints-container' });
  Object.entries(hintButtons).forEach(([buttonKey, buttonHandler]) => {
    const hintButton = createButton(buttonKey, buttonHandler, 'hint-btn');
    container.append(hintButton);
  });
  return container;
}
