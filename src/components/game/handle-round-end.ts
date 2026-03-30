import { calculateScore } from '../../app/state/actions';
import { toggleButtonsStatement } from './toggle-buttons-statement';
import { updateScore } from './updateScore';

export function handleRoundEnd(points: number) {
  calculateScore(points);
  updateScore();
  toggleButtonsStatement('allButtons');
}
