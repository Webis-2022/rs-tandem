import { getState } from '../../app/state/store';

export function updateScore() {
  const score = document.querySelector('.score');
  const state = getState();
  const newScore = state.game.score;
  if (!score) return;
  score.textContent = String(newScore);
}
