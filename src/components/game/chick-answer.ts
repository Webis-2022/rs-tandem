import {
  calculateScore,
  increaseRound,
  resetRound,
  saveWrongAnswers,
} from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { showNextQuestion } from './show-next-question';
import { highLightAnswer } from './high-light-answer';
import { playSound } from './play-sound';
import { updateScore } from './updateScore';
import { delay } from '../../utils/delay';
import { toggleButtonsStatement } from './toggle-buttons-statement';

export async function chickAnswer(gameMode: string) {
  const state = getState();
  let questions;
  let currentQuestion;
  console.log(gameMode);
  if (gameMode === 'game') {
    questions = state.game.questions;
    const questionNum = state.game.round - 1;
    currentQuestion = questions[questionNum];
    const selected: HTMLInputElement | null = document.querySelector(
      `.answer-button:checked`
    );
    const selectedValue = selected?.value;
    const correctAnswer = currentQuestion.answer;
    const isCorrect = selectedValue === correctAnswer;
    const roundScore = isCorrect ? 1 : -1;

    if (isCorrect) {
      increaseRound();
      playSound('./sound/correct.mp3');
      highLightAnswer(correctAnswer, '#57fa2e');
      await delay(1000);
      showNextQuestion();
    } else {
      increaseRound();
      saveWrongAnswers(currentQuestion);
      playSound('./sound/incorrect.mp3');
      highLightAnswer(selectedValue, '#fa2525');
      await delay(1000);
      showNextQuestion();
    }

    calculateScore(roundScore);
    updateScore();
  } else if (gameMode === 'super-game') {
    questions = state.game.wrongAnswers;
    const questionNum = state.game.round - 1;
    currentQuestion = questions[questionNum];
    const selected: HTMLInputElement | null = document.querySelector(
      `.answer-button:checked`
    );
    const selectedValue = selected?.value;
    const correctAnswer = currentQuestion.answer;
    const isCorrect = selectedValue === correctAnswer;
    console.log('gL', questions.length);
    console.log('qN', questionNum + 1);
    if (isCorrect) {
      increaseRound();
      playSound('./sound/correct.mp3');
      highLightAnswer(correctAnswer, '#57fa2e');
      await delay(1000);
      showNextQuestion();
      if (questions.length <= questionNum + 1) {
        alert(
          'Congratulation! You have answered all the questions of super game!'
        );
        calculateScore(questions.length);
        updateScore();
        toggleButtonsStatement();
      }
    } else {
      resetRound();
      playSound('./sound/incorrect.mp3');
      highLightAnswer(selectedValue, '#fa2525');
      await delay(1000);
      alert('This is not correct answer. You are lost super game');
      calculateScore(-questions.length);
      updateScore();
      toggleButtonsStatement();
      return;
    }
  }
}
