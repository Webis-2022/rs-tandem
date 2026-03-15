import { createPracticeView } from '../../pages/practice/practice';

export function rerenderGameCard(section: HTMLElement | null) {
  if (!section) return;
  section?.remove();
  const practiceView = createPracticeView();
  const mainSection = document.querySelector('.main');
  mainSection?.append(practiceView);
}
