import { getState } from '../../app/state/store';
import { updateScore } from '../../components/game/updateScore';
import { createPracticeCard } from '../../components/ui/practice-card/practice-card';
import { createSidePanel } from '../../components/ui/practice-card/side-panel/side-panel';
import { getQuestions } from '../../services/api/get-questions';
import { createElement } from '../../shared/dom';

export function createPracticeView(): HTMLElement {
  const section = createElement('section', undefined, 'page');
  if (window.location.pathname === '/practice') {
    section.style.flexDirection = 'row';
  }
  const state = getState();
  const questionNum = state.game.round;
  const topicId = state.game.topicId;
  const difficulty = state.game.difficulty;
  getQuestions(topicId, difficulty)
    .then((questions) => {
      if (questionNum >= questions.length) return;
      const roundQuestion = questions[questionNum];
      const practiceCard = createPracticeCard(roundQuestion, section);
      section.append(practiceCard);
    })
    .then(() => {
      createSidePanel();
      updateScore();
    });
  return section;
}
