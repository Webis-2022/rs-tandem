import { createPracticeView } from '../../pages/practice/practice';

export function rerenderGameCard(section: HTMLElement | null) {
  section?.remove();
  const practiceView = createPracticeView();
  const mainSection = document.querySelector('.main');
  mainSection?.append(practiceView);
}
