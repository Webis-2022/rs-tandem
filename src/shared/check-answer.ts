import {
  calculateScore,
  increaseRound,
  saveWrongAnswers,
} from '../app/state/actions';
import { getState } from '../app/state/store';
import { toggleButtonsStatement } from '../components/game/toggle-buttons-statement';
import { rerenderGameCard } from '../components/game/rerender-game-card';
import { type Question } from '../types';
import { playSuperGame } from '../components/game/play-super-game';
import { showAnswerFeedback } from '../components/game/answer-feedback/show-answer-feedback';

export async function checkAnswer(
  answer: string | undefined,
  question: Question,
  section: HTMLElement | null
) {
  const correctAnswer = question.answer;
  const state = getState();
  let wrongAnswersLength;
  const text = `Would you like to play super game?
        Rules:
        You will be asked questions you haven't answered in this topic.
        If you answer all questions correctly, you will receive one point for each question.
        If you make even one mistake, an amount equal to the number of unanswered questions will be deducted from your score.`;
  const round = state.game.round;
  const isCorrect = answer?.toLowerCase() === correctAnswer?.toLowerCase();
  let roundScore: number = 0;
  if (isCorrect) {
    showAnswerFeedback(answer, '#57fa2e', './sound/correct.mp3');
    roundScore = 1;
    increaseRound();
    wrongAnswersLength = getState().game.wrongAnswers.length;
    if (round < 3) {
      setTimeout(() => {
        rerenderGameCard(section);
      }, 1000);
    } else if (round >= 3 && wrongAnswersLength > 0) {
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
  } else {
    showAnswerFeedback(answer, '#fa2525', './sound/incorrect.mp3');
    roundScore = -1;
    increaseRound();
    saveWrongAnswers(question);
    wrongAnswersLength = getState().game.wrongAnswers.length;
    if (round < 3) {
      setTimeout(() => {
        rerenderGameCard(section);
      }, 1000);
    } else if (round >= 3 && wrongAnswersLength > 0) {
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
  calculateScore(roundScore);
}
