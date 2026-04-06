import { createPracticeView } from '../../pages/practice/practice';

export function rerenderGameCard(section: HTMLElement | null) {
  if (!section) return;
  section?.remove();
  const practiceView = createPracticeView();
  const layoutMain = document.querySelector('.layout-main');
  layoutMain?.append(practiceView);
}
