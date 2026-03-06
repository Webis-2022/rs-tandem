import { closeSidePanel } from '../../../../shared/close-side-panel';
import { createEl } from '../../../../shared/dom';
import { createDivider } from '../divider/divider';
import './side-panel.scss';

export function createSidePanel() {
  const sidePanel = createEl('div', {
    text: '',
    className: 'side-panel',
  });
  const closeButton = createEl('button', {
    text: 'X',
    className: 'close-btn',
  });
  closeButton.addEventListener('click', closeSidePanel);
  const title = createEl('h1', { className: 'side-panel-title' });
  title.textContent = 'Explanation';
  const divider = createDivider();
  sidePanel.append(closeButton, title, divider);
  sidePanel.classList.add('side-panel');
  const sectionPage = document.querySelector('.page');
  const card: HTMLDivElement | null = document.querySelector('.card');
  const cardHeight = card?.style.height;
  sidePanel.style.height = cardHeight as string;
  sectionPage?.append(sidePanel);
}
