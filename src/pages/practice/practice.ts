import { getState } from '../../app/state/store';
import { createPracticeCard } from '../../components/ui/practice-card/practice-card';
import { getQuestions } from '../../services/api/get-questions';
import { createElement } from '../../shared/dom';

export function createPracticeView(): HTMLElement {
  const section = createElement('section', undefined, 'page');
  const state = getState();
  const questionNum = state.game.round;
  const topicId = state.game.topicId;
  const difficulty = state.game.difficulty;
  getQuestions(topicId, difficulty).then((questions) => {
    if (questionNum >= questions.length) return;

    const roundQuestion = questions[questionNum];
    const practiceCard = createPracticeCard(roundQuestion);
    section.append(practiceCard);
  });
  return section;
}
