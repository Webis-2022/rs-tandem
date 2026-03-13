import type { Question } from '../../types';
import { getState, setState } from './store';

export function increaseRound() {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...prev.game,
      round: (prev.game.round ?? 0) + 1,
    },
  });
}
export function calculateScore(roundScore: number) {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...prev.game,
      score:
        prev.game.score + roundScore < 0 ? 0 : prev.game.score + roundScore,
    },
  });
}

export function saveWrongAnswers(question: Question) {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...prev.game,
      wrongAnswers: [...prev.game.wrongAnswers, question],
    },
  });
}
