import { saveTopicQuestions } from '../../app/state/actions';
import { getState } from '../../app/state/store';
import { showNextQuestion } from '../../components/game/show-next-question';
import { updateScore } from '../../components/game/update-score';
import { createLoadingView } from '../../components/ui/loading/loading';
import { createPracticeCard } from '../../components/ui/practice-card/practice-card';
import { createSidePanel } from '../../components/ui/practice-card/side-panel/side-panel';
import { getQuestions } from '../../services/api/get-questions';
import { createEl } from '../../shared/dom';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { syncActiveGameToServer } from '../../services/sync-active-game';

export function createPracticeView(): HTMLElement {
  const section = createEl('section', { className: 'page practice-page' });
  section.append(createLoadingView('Loading questions...'));

  const state = getState();
  const topicId = state.game.topicId;
  const difficulty = state.game.difficulty;

  if (!difficulty) {
    section.replaceChildren(
      createErrorMessage(
        'No active game found. Please start a new game from the library.'
      )
    );
    return section;
  }

  getQuestions(topicId, difficulty)
    .then(async (questions) => {
      if (!section.isConnected) return;

      saveTopicQuestions(questions);
      await syncActiveGameToServer();
      if (!section.isConnected) return;

      const practiceCard = createPracticeCard();

      section.replaceChildren(practiceCard);
      createSidePanel(section, practiceCard);
      updateScore();
    })
    .catch((err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Failed to load questions.';

      section.replaceChildren(createErrorMessage(message));
    })
    .finally(() => {
      showNextQuestion();
    });
  return section;
}
