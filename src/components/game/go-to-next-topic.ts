import {
  changeGameMode,
  increaseTopicId,
  resetRound,
} from '../../app/state/actions';
import { rerenderGameCard } from './rerender-game-card';

export function goToNextTopic() {
  resetRound();
  increaseTopicId();
  changeGameMode('game');
  const pageSection: HTMLElement | null = document.querySelector('.page');
  rerenderGameCard(pageSection);
}
