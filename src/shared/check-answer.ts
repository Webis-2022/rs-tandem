import { calculateScore } from '../app/state/actions';
import { highLightAnswer } from '../components/game/high-light-answer';
import { playSound } from '../components/game/play-sound';
import { rerenderGameCard } from '../components/game/rerender-game-card';

export function checkAnswer(
  answer: string | undefined,
  correctAnswer: string | undefined,
  section: HTMLElement
) {
  const isCorrect = answer?.toLowerCase() === correctAnswer?.toLowerCase();
  let roundScore: number = 0;
  if (isCorrect) {
    highLightAnswer(answer, '#57fa2e');
    playSound('./sound/correct.mp3');
    setTimeout(() => {
      rerenderGameCard(section);
    }, 1000);
    roundScore = 1;
  } else {
    highLightAnswer(answer, '#fa2525');
    playSound('./sound/incorrect.mp3');
    setTimeout(() => {
      rerenderGameCard(section);
    }, 1000);
    roundScore = -1;
  }
  calculateScore(roundScore);
}
