import { getQuestionMeta } from '../../../utils/get-question-meta';
import { toggleButtonsStatement } from '../toggle-buttons-statement';

export function showSidePanel(e: MouseEvent) {
  e.stopPropagation();
  const { questions, questionNum } = getQuestionMeta('questions');
  const question = questions[questionNum];
  const sidePanel: HTMLDivElement | null =
    document.querySelector('.side-panel');
  const textContainer = sidePanel?.querySelector('.text-container');
  if (!textContainer) return;
  textContainer.innerHTML = question.explanation;
  if (!sidePanel) return;
  sidePanel.classList.remove('closed');
  sidePanel.classList.add('opened');
  toggleButtonsStatement('oneButton', '.i-dont-know', true);
}
