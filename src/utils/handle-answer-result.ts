import { highLightAnswer } from '../components/game/high-light-answer';
import { toggleButtonsStatement } from '../components/game/toggle-buttons-statement';
import { playSound } from '../components/game/play-sound';
import { increaseRound } from '../app/state/actions';
import { createPracticeCard } from '../components/ui/practice-card/practice-card';
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
      section?.remove();
      createPracticeCard(section);
    }, 1000);
  } else {
    toggleButtonsStatement();
  }
}
