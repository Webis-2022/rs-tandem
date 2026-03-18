import { saveTopicQuestions } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { showNextQuestion } from '../../components/game/show-next-question';
import { updateScore } from '../../components/game/updateScore';
import { createPracticeCard } from '../../components/ui/practice-card/practice-card';
import { createSidePanel } from '../../components/ui/practice-card/side-panel/side-panel';
import { getQuestions } from '../../services/api/get-questions';
import { createEl } from '../../shared/dom';

export function createPracticeView(): HTMLElement {
  const section = createEl('section', { className: 'page' });
  if (window.location.pathname === '/practice') {
    section.style.flexDirection = 'row';
  }
  const state = getState();
  const topicId = state.game.topicId;
  const difficulty = state.game.difficulty;
  getQuestions(topicId, difficulty)
    .then((questions) => {
      saveTopicQuestions(questions);
      const practiceCard = createPracticeCard();
      section.append(practiceCard);

      createSidePanel();
      updateScore();
    })
    .catch((error: Error) => {
      throw new Error(error.message);
    })
    .finally(() => {
      showNextQuestion();
    });
  return section;
}
