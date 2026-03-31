import {
  closeSidePanel,
  initSidePanelClose,
} from '../../../game/hintsLogic/close-side-panel';
import { createEl } from '../../../../shared/dom';
import { createDivider } from '../divider/divider';
import './side-panel.scss';

export function createSidePanel(container: HTMLElement, card: HTMLElement) {
  const existingSidePanel = document.querySelector('.side-panel');
  if (existingSidePanel) {
    existingSidePanel.remove();
  }

  const sidePanel = createEl('div', {
    text: '',
    className: 'side-panel',
  });
  const closeButton = createEl('button', {
    text: 'X',
    className: 'close-btn',
  });
  closeButton.setAttribute('aria-label', 'Close explanation panel');
  closeButton.addEventListener('click', closeSidePanel);
  const title = createEl('h2', { className: 'side-panel-title' });
  title.textContent = 'Explanation';
  const divider = createDivider();
  const textContainer = createEl('div', { className: 'text-container' });
  sidePanel.append(closeButton, title, divider, textContainer);
  sidePanel.classList.add('closed');
  sidePanel.setAttribute('aria-hidden', 'true');

  const cardHeight = card.style.height;
  if (cardHeight) {
    sidePanel.style.height = cardHeight;
  }

  container.append(sidePanel);
  initSidePanelClose();
}
