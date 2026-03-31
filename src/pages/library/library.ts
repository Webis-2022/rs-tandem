import './library.scss';
import { ROUTES, type Difficulty, type Topic } from '../../types';
import { navigate } from '../../app/navigation';
import { getTopics } from '../../services/api/get-topics';
import { createEl, createButton } from '../../shared/dom';
import { saveTopics, startNewGame } from '../../app/state/actions';
import { createLoadingView } from '../../components/ui/loading/loading';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { fetchCompletedTopics } from '../../services/api/fetch-completed-topics';

export const createLibraryView = (
  difficultyLevel: 'easy' | 'medium' | 'hard'
): HTMLElement => {
  const section = createEl('section', { className: 'page' });

  const completedTopics = fetchCompletedTopics(difficultyLevel);

  const title = createEl('h1', {
    text: 'Library',
    className: 'library-title',
  });

  const subtitle = createEl('p', {
    text: 'Choose difficulty and select a topic to start practice.',
    className: 'library-subtitle',
  });

  let difficulty: Difficulty = difficultyLevel;

  const difficultyRow = createEl('div', { className: 'library-difficulty' });

  const difficultyLabel = createEl('span', {
    text: 'Difficulty:',
    className: 'library-difficulty-label',
  });

  const diffBtns: Record<Difficulty, HTMLButtonElement> = {
    easy: createButton(
      'Easy',
      () => {
        const main = document.querySelector('main.main');
        if (main) {
          main.replaceChildren();
          main.append(createLibraryView('easy'));
        }
      },
      'btn library-diff-btn'
    ),
    medium: createButton(
      'Medium',
      () => {
        const main = document.querySelector('main.main');
        if (main) {
          main.replaceChildren();
          main.append(createLibraryView('medium'));
        }
      },
      'btn library-diff-btn'
    ),
    hard: createButton(
      'Hard',
      () => {
        const main = document.querySelector('main.main');
        if (main) {
          main.replaceChildren();
          main.append(createLibraryView('hard'));
        }
      },
      'btn library-diff-btn'
    ),
  };

  const setActiveDifficultyUI = () => {
    (Object.keys(diffBtns) as Difficulty[]).forEach((key) => {
      diffBtns[key].classList.toggle('is-active', key === difficulty);
    });
  };

  (Object.keys(diffBtns) as Difficulty[]).forEach((key) => {
    diffBtns[key].addEventListener('click', () => {
      difficulty = key;
      setActiveDifficultyUI();
    });
  });

  setActiveDifficultyUI();

  difficultyRow.append(
    difficultyLabel,
    diffBtns.easy,
    diffBtns.medium,
    diffBtns.hard
  );

  const list = createEl('div', { className: 'library-list' });
  const status = createEl('div', { className: 'library-status' });

  list.append(createLoadingView('Loading topics...'));

  const renderTopicCard = (
    topic: Topic,
    completedTopic: Topic
  ): HTMLElement => {
    const card = createEl('div', { className: 'library-card' });
    const topicIcon = createEl('img', {
      className: 'topic-icon',
    });

    card.style.backgroundColor = '#fff';
    card.style.opacity = '1';
    card.style.pointerEvents = 'auto';

    if (
      completedTopic &&
      Object.keys(completedTopic).length > 0 &&
      topic.name === completedTopic.name
    ) {
      card.style.backgroundColor = '#ccc';
      card.style.opacity = '0.6';
      card.style.pointerEvents = 'none';
      (topicIcon as HTMLImageElement).src = './img/tick-mark.png';
    }

    const name = createEl('div', {
      text: topic.name ?? `Topic #${topic.id}`,
      className: 'library-card-title',
    });

    const actions = createEl('div', { className: 'library-card-actions' });

    const startBtn = createButton(
      'Start',
      async () => {
        status.textContent = 'Starting practice...';
        status.classList.remove('is-error');
        startBtn.disabled = true;

        try {
          await startNewGame({
            topicId: topic.id,
            difficulty,
          });

          status.textContent = '';
          navigate(ROUTES.Practice, true);
        } catch (err: unknown) {
          status.textContent =
            err instanceof Error ? err.message : 'Failed to start game.';
          status.classList.add('is-error');
        } finally {
          startBtn.disabled = false;
        }
      },
      'btn'
    );

    actions.append(topicIcon, startBtn);
    card.append(name, actions);

    return card;
  };

  Promise.all([getTopics(), completedTopics])
    .then(([topics, completedTopicsArray]) => {
      list.replaceChildren();

      if (!topics || topics.length === 0) {
        list.append(
          createEl('div', {
            text: 'No topics found.',
            className: 'library-list-status',
          })
        );
        return;
      }

      (topics as Topic[]).forEach((topic, index) => {
        const completedTopic = completedTopicsArray[index];
        list.append(renderTopicCard(topic, completedTopic));
      });

      saveTopics(topics);
    })
    .catch((err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Failed to load topics.';
      list.replaceChildren(createErrorMessage(message));
    });

  section.append(title, subtitle, difficultyRow, status, list);

  return section;
};
