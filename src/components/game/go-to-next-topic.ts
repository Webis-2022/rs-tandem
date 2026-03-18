import { resetRound, resetTopicId } from '../../app/state/actions';
import { rerenderGameCard } from './rerender-game-card';

export function goToNextTopic() {
  resetRound();
  resetTopicId();
  const pageSection: HTMLElement | null = document.querySelector('.page');
  rerenderGameCard(pageSection);
}
