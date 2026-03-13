import { type Question } from '../types';

export function showSidePanel(question: Question, e: MouseEvent) {
  e.stopPropagation();
  const sidePanel: HTMLDivElement | null =
    document.querySelector('.side-panel');
  const textContainer = sidePanel?.querySelector('.text-container');
  if (!textContainer) return;
  textContainer.innerHTML = question.explanation;
  if (!sidePanel) return;
  sidePanel.classList.remove('closed');
  sidePanel.classList.add('opened');
}
