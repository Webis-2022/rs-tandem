import './library.scss';
import { ROUTES, type Difficulty } from '../../types';
import { navigate } from '../../app/navigation';
import { getState, setState } from '../../app/state/store';
import { getTopics } from '../../services/api/get-topics';
import { createEl, createButton } from '../../shared/dom';

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

  const loading = createEl('div', {
    text: 'Loading topics...',
    className: 'library-status',
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
      () => {
        const state = getState();

        setState({
          ...state,
          game: {
            ...state.game,
            topicId: topic.id,
            difficulty,
            round: 0,
            score: 0,
            usedHints: [],
            wrongAnswers: [],
          },
        });

        navigate(ROUTES.Practice, true);
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
            className: 'library-status',
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
          className: 'library-status is-error',
        })
      );
    });

  section.append(title, subtitle, difficultyRow, list);
  return section;
};
