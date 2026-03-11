import { calculateScore, increaseRound } from '../app/state/actions';
import { getState } from '../app/state/store';
import { highLightAnswer } from '../components/game/high-light-answer';
import { toggleButtonsStatement } from '../components/game/toggle-buttons-statement';
import { playSound } from '../components/game/play-sound';
import { rerenderGameCard } from '../components/game/rerender-game-card';

export function checkAnswer(
  answer: string | undefined,
  correctAnswer: string | undefined,
  section: HTMLElement | null
) {
  const state = getState();
  const round = state.game.round;
  const isCorrect = answer?.toLowerCase() === correctAnswer?.toLowerCase();
  let roundScore: number = 0;
  if (isCorrect) {
    highLightAnswer(answer, '#57fa2e');
    playSound('./sound/correct.mp3');
    roundScore = 1;
    increaseRound();
    if (round < 3) {
      setTimeout(() => {
        rerenderGameCard(section);
      }, 1000);
    } else {
      toggleButtonsStatement();
    }
  } else {
    highLightAnswer(answer, '#fa2525');
    playSound('./sound/incorrect.mp3');
    roundScore = -1;
    increaseRound();
    if (round < 3) {
      setTimeout(() => {
        rerenderGameCard(section);
      }, 1000);
    } else {
      toggleButtonsStatement();
    }
  }
  calculateScore(roundScore);
}
