import { highLightAnswer } from '../components/game/high-light-answer';
import { toggleButtonsStatement } from '../components/game/toggle-buttons-statement';
import { playSound } from '../components/game/play-sound';
import { increaseRound } from '../app/state/actions';
import { getState } from '../app/state/store';
// import { askQuestion } from '../components/game/ask-question';
import type { Question } from '../types';
import { playSuperGame } from '../components/game/play-super-game';
export function handleAnswerResult(
  question: Question,
  color: string,
  sound: string,
  round: number
) {
  const questionsPerRound = 3;
  const wrongAnswersLength = getState().game.wrongAnswers.length;
  const text = `Would you like to play super game?
        Rules:
        You will be asked questions you haven't answered in this topic.
        If you answer all questions correctly, you will receive one point for each question.
        If you make even one mistake, an amount equal to the number of unanswered questions will be deducted from your score.`;
  playSound(sound);
  highLightAnswer(question.answer, color);
  increaseRound();
  if (round < questionsPerRound) {
    setTimeout(async () => {
      playSuperGame('game');
      console.log('called100');
    }, 1000);
  } else if (round >= questionsPerRound && wrongAnswersLength > 0) {
    setTimeout(async () => {
      if (confirm(text)) {
        console.log('he');
      } else {
        toggleButtonsStatement();
      }
    }, 500);
  } else {
    toggleButtonsStatement();
  }
}
