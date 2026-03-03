import { getState } from '../../app/state/store';
import { createPracticeCard } from '../../components/ui/practice-card/practice-card';
import { getQuestions } from '../../services/api/get-questions';
import { createElement } from '../../shared/dom';

export function createPracticeView(): HTMLElement {
  const section = createElement('section', undefined, 'page');
  const state = getState();
  const questionNum = state.game.round;
  //remove hardcode
  getQuestions(7, 'easy').then((questions) => {
    const roundQuestion = questions[questionNum];
    const practiceCard = createPracticeCard(roundQuestion);
    console.log(practiceCard);
    section.append(practiceCard);
  });
  return section;
}
