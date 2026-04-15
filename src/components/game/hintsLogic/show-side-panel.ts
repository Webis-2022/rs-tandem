import { getQuestionMeta } from '../../../utils/get-question-meta';
import { countClicks } from './count-clicks';

export function showSidePanel(e: MouseEvent) {
  e.stopPropagation();
  const { questions, questionNum } = getQuestionMeta('questions');
  const question = questions[questionNum];
  const sidePanel: HTMLDivElement | null =
    document.querySelector('.side-panel');
  if (!sidePanel) return;

  const textContainer = sidePanel?.querySelector('.side-panel-text');
  if (!textContainer) return;

  const fallbackExplanation =
    'No explanation is available for this question yet. Try checking the related theory link for additional context.';
  textContainer.innerHTML = question.explanation || fallbackExplanation;

  sidePanel.classList.remove('closed');
  sidePanel.classList.add('opened');
  sidePanel.setAttribute('aria-hidden', 'false');
  countClicks('oneButton', '.i-dont-know', true, "i don't know");
}
