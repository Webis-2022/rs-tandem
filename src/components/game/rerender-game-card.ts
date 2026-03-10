import { increaseRound } from '../../app/state/actions';
import { createPracticeView } from '../../pages/practice/practice';

export function rerenderGameCard(section: HTMLElement | null) {
  increaseRound();
  section?.remove();
  const practiceView = createPracticeView();
  const mainSection = document.querySelector('.main');
  mainSection?.append(practiceView);
}
