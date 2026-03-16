import { highLightAnswer } from '../components/game/high-light-answer';
import { toggleButtonsStatement } from '../components/game/toggle-buttons-statement';
import { playSound } from '../components/game/play-sound';
import { increaseRound } from '../app/state/actions';
import { getState } from '../app/state/store';
import { playSuperGame } from '../components/game/play-super-game';
import { createPracticeCard } from '../components/ui/practice-card/practice-card';
export function handleAnswerResult(
  answer: string | undefined,
  color: string,
  sound: string,
  round: number,
  section: HTMLElement | null
) {
  const questionsPerRound = 3;
  const wrongAnswersLength = getState().game.wrongAnswers.length;
  const text = `Would you like to play super game?
        Rules:
        You will be asked questions you haven't answered in this topic.
        If you answer all questions correctly, you will receive one point for each question.
        If you make even one mistake, an amount equal to the number of unanswered questions will be deducted from your score.`;
  playSound(sound);
  highLightAnswer(answer, color);
  increaseRound();
  if (round < questionsPerRound) {
    setTimeout(() => {
      section?.remove();
      createPracticeCard(section);
    }, 1000);
  } else if (round >= questionsPerRound && wrongAnswersLength > 0) {
    setTimeout(() => {
      if (confirm(text)) {
        playSuperGame();
      } else {
        toggleButtonsStatement();
      }
    }, 500);
  } else {
    toggleButtonsStatement();
  }
}
