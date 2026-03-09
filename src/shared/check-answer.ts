import { calculateScore } from '../app/state/actions';
import { getState } from '../app/state/store';
import { highLightAnswer } from '../components/game/high-light-answer';
import { makeButtonsAvailable } from '../components/game/make-buttons-available';
import { playSound } from '../components/game/play-sound';
import { rerenderGameCard } from '../components/game/rerender-game-card';

export function checkAnswer(
  answer: string | undefined,
  correctAnswer: string | undefined,
  section: HTMLElement | null
) {
  const state = getState();
  const round = state.game.round + 1;
  const isCorrect = answer?.toLowerCase() === correctAnswer?.toLowerCase();
  let roundScore: number = 0;
  if (isCorrect) {
    highLightAnswer(answer, '#57fa2e');
    playSound('./sound/correct.mp3');
    roundScore = 1;
    if (round < 3) {
      setTimeout(() => {
        rerenderGameCard(section);
      }, 1000);
    } else {
      makeButtonsAvailable();
    }
  } else {
    highLightAnswer(answer, '#fa2525');
    playSound('./sound/incorrect.mp3');
    roundScore = -1;
    if (round < 3) {
      setTimeout(() => {
        rerenderGameCard(section);
      }, 1000);
    } else {
      makeButtonsAvailable();
    }
  }
  calculateScore(roundScore);
}
