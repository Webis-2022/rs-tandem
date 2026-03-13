import './library.scss';
import { ROUTES, type Difficulty } from '../../types';
import { navigate } from '../../app/navigation';
import { getState, startNewGame } from '../../app/state/store';
import { getTopics } from '../../services/api/get-topics';
import { createEl, createButton } from '../../shared/dom';
import { getQuestions } from '../../services/api/get-questions';

type Topic = {
  id: number;
  name: string;
};

export const createLibraryView = (): HTMLElement => {
  const section = createEl('section', { className: 'page' });

  const title = createEl('h1', {
    text: 'Library',
    className: 'library-title',
  });

  const subtitle = createEl('p', {
    text: 'Choose difficulty and select a topic to start practice.',
    className: 'library-subtitle',
  });

  let difficulty: Difficulty = getState().game.difficulty || 'easy';

  const difficultyRow = createEl('div', { className: 'library-difficulty' });

  const difficultyLabel = createEl('span', {
    text: 'Difficulty:',
    className: 'library-difficulty-label',
  });

  const diffBtns: Record<Difficulty, HTMLButtonElement> = {
    easy: createButton('Easy', undefined, 'btn library-diff-btn'),
    medium: createButton('Medium', undefined, 'btn library-diff-btn'),
    hard: createButton('Hard', undefined, 'btn library-diff-btn'),
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

  const loading = createEl('div', {
    text: 'Loading topics...',
    className: 'library-list-status',
  });

  list.append(loading);

  const renderTopicCard = (topic: Topic): HTMLElement => {
    const card = createEl('div', { className: 'library-card' });

    const name = createEl('div', {
      text: topic.name ?? `Topic #${topic.id}`,
      className: 'library-card-title',
    });

    const actions = createEl('div', { className: 'library-card-actions' });

    const startBtn = createButton(
      'Start',
      async () => {
        status.textContent = 'Loading questions...';
        status.classList.remove('is-error');
        startBtn.disabled = true;

        try {
          const questions = await getQuestions(topic.id, difficulty);

          if (!questions || questions.length === 0) {
            status.textContent = 'No questions found for this topic.';
            status.classList.add('is-error');
            return;
          }

          status.textContent = '';
          status.classList.remove('is-error');

          startNewGame({
            topicId: topic.id,
            difficulty,
            questions,
          });

          navigate(ROUTES.Practice, true);
        } catch (err: unknown) {
          status.textContent =
            err instanceof Error ? err.message : 'Failed to load questions.';
          status.classList.add('is-error');
        } finally {
          startBtn.disabled = false;
        }
      },
      'btn'
    );

    actions.append(startBtn);
    card.append(name, actions);

    return card;
  };

  getTopics()
    .then((topics) => {
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

      (topics as Topic[]).forEach((topic) => {
        list.append(renderTopicCard(topic));
      });
    })
    .catch((err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Failed to load topics.';

      list.replaceChildren(
        createEl('div', {
          text: message,
          className: 'library-list-status is-error',
        })
      );
    });

  section.append(title, subtitle, difficultyRow, status, list);
  return section;
};
