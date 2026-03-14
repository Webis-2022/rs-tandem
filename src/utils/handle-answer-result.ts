import { highLightAnswer } from '../components/game/high-light-answer';
import { toggleButtonsStatement } from '../components/game/toggle-buttons-statement';
import { playSound } from '../components/game/play-sound';
import { rerenderGameCard } from '../components/game/rerender-game-card';
import { increaseRound } from '../app/state/actions';
export function handleAnswerResult(
  answer: string | undefined,
  color: string,
  sound: string,
  round: number,
  section: HTMLElement | null
) {
  const questionsPerRound = 3;
  highLightAnswer(answer, color);
  playSound(sound);
  increaseRound();
  if (round < questionsPerRound) {
    setTimeout(() => {
      rerenderGameCard(section);
    }, 1000);
  } else {
    toggleButtonsStatement();
  }
}
