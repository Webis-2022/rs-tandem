import { setState, getState } from '../../app/state/store';
import { rerenderGameCard } from './rerender-game-card';

export function goToNextTopic() {
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      topicId: (prev.game.topicId ?? 0) + 1,
      round: 1,
    },
  });
  const pageSection: HTMLElement | null = document.querySelector('.page');
  rerenderGameCard(pageSection);
}
