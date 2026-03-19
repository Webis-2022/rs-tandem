import { getState } from '../../app/state/store';
import { updateScore } from '../../components/game/updateScore';
import { createLoadingView } from '../../components/ui/loading/loading';
import { createPracticeCard } from '../../components/ui/practice-card/practice-card';
import { createSidePanel } from '../../components/ui/practice-card/side-panel/side-panel';
import { getQuestions } from '../../services/api/get-questions';
import { createEl } from '../../shared/dom';

export function createPracticeView(): HTMLElement {
  const section = createEl('section', { className: 'page' });
  if (window.location.pathname === '/practice') {
    section.style.flexDirection = 'row';
  }
  section.append(createLoadingView('Loading questions...'));
  const state = getState();
  const questionNum = state.game.round - 1;
  const topicId = state.game.topicId;
  const difficulty = state.game.difficulty;
  getQuestions(topicId, difficulty)
    .then((questions) => {
      if (questionNum >= questions.length) return;
      const roundQuestion = questions[questionNum];
      const practiceCard = createPracticeCard(roundQuestion, section);
      section.append(practiceCard);

      section.replaceChildren(practiceCard);
      createSidePanel();
      updateScore();
    })
    .catch((error: Error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to load questions.';

      section.replaceChildren(
        createEl('div', {
          text: message,
          className: 'library-status is-error',
        })
      );
    });
  return section;
}
