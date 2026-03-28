import { getQuestionMeta } from '../../../utils/get-question-meta';
import { toggleButtonsStatement } from '../toggle-buttons-statement';
import { saveUsedHint } from '../../../app/state/actions';

export function removeTwoWrongAnswers() {
  const { questions, questionNum } = getQuestionMeta('questions');
  const question = questions[questionNum];
  const options = question.options;
  const correctAnswer = question.answer;
  const wrongAnswersCount = 3;
  const wrongAnswersPair = 2;

  const wrongAnswers = options.filter((option) => option !== correctAnswer);
  const twoWrongAnswers = new Set();
  while (twoWrongAnswers.size < wrongAnswersPair) {
    const index = Math.floor(Math.random() * wrongAnswersCount);
    const wrongAnswer = wrongAnswers[index];
    twoWrongAnswers.add(wrongAnswer);
  }
  const answerButtons: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('.answer-button');
  answerButtons.forEach((btn) => {
    if (Array.from(twoWrongAnswers).includes(btn.value)) {
      const label = btn.closest('label');
      if (label) {
        label.style.textDecoration = 'line-through';
        label.style.color = '#fa2525';
        btn.disabled = true;
      }
    }
  });
  toggleButtonsStatement('oneButton', '.fifty-fifty', true);
  const countClicks = () => {
    saveUsedHint('50/50');
  };
  countClicks();
}
