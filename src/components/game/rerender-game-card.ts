import { createPracticeView } from '../../pages/practice/practice';

export async function rerenderGameCard(
  section: HTMLElement | null
): Promise<void> {
  section?.remove();
  const practiceView = createPracticeView();
  const mainSection = document.querySelector('.main');
  mainSection?.append(practiceView);
}
