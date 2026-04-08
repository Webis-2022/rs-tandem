import {
  changeGameMode,
  increaseTopicId,
  resetRound,
  resetUsedHints,
} from '../../app/state/actions';
import { rerenderGameCard } from './rerender-game-card';

export function goToNextTopic() {
  resetRound();
  resetUsedHints();
  increaseTopicId();
  changeGameMode('game');
  const pageSection: HTMLElement | null = document.querySelector('.page');
  rerenderGameCard(pageSection);
}
