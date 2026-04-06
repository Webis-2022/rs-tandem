import './library.scss';
import { ROUTES, type Difficulty, type Topic } from '../../types';
import { navigate } from '../../app/navigation';
import { getTopics } from '../../services/api/get-topics';
import { createEl, createButton } from '../../shared/dom';
import { saveTopics, startNewGame } from '../../app/state/actions';
import { createLoadingView } from '../../components/ui/loading/loading';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { fetchCompletedTopicIds } from '../../services/api/fetch-completed-topic-ids';
import { getState } from '../../app/state/store';

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

  // Меняет сложность и обновляет список тем.
  const handleDifficultyChange = (key: Difficulty) => {
    if (difficulty === key) return;
    difficulty = key;
    void updateTopicsList();
  };

  const diffBtns: Record<Difficulty, HTMLButtonElement> = {
    easy: createButton(
      'Easy',
      () => handleDifficultyChange('easy'),
      'btn library-diff-btn'
    ),
    medium: createButton(
      'Medium',
      () => handleDifficultyChange('medium'),
      'btn library-diff-btn'
    ),
    hard: createButton(
      'Hard',
      () => handleDifficultyChange('hard'),
      'btn library-diff-btn'
    ),
  };

  const status = createEl('div', { className: 'library-status' });
  const list = createEl('div', { className: 'library-list' });

  // Подсвечивает активную кнопку сложности.
  const setActiveDifficultyUI = () => {
    (Object.keys(diffBtns) as Difficulty[]).forEach((key) => {
      diffBtns[key].classList.toggle('is-active', key === difficulty);
    });
  };

  // Создает карточку темы.
  const renderTopicCard = (topic: Topic, isCompleted: boolean): HTMLElement => {
    const card = createEl('div', {
      className: `library-card${isCompleted ? ' is-completed' : ''}`,
    });

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
          startBtn.disabled = false;
        }
      },
      'btn',
      isCompleted
    );

    if (isCompleted) {
      const topicIcon = createEl('img', {
        className: 'topic-icon',
      }) as HTMLImageElement;

      topicIcon.src = '/img/tick-mark.png';
      topicIcon.alt = '';
      topicIcon.setAttribute('aria-hidden', 'true');

      actions.append(topicIcon);
    }

    actions.append(startBtn);
    card.append(name, actions);

    return card;
  };

  // Загружает и обновляет список тем.
  const updateTopicsList = async (): Promise<void> => {
    setActiveDifficultyUI();
    list.replaceChildren(createLoadingView('Loading topics...'));

    try {
      const [topics, completedTopicIds] = await Promise.all([
        getTopics(),
        fetchCompletedTopicIds(difficulty),
      ]);

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

      const completedIds = new Set(completedTopicIds);

      topics.forEach((topic) => {
        list.append(renderTopicCard(topic, completedIds.has(topic.id)));
      });

      saveTopics(topics);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load topics.';
      list.replaceChildren(createErrorMessage(message));
    }
  };

  difficultyRow.append(
    difficultyLabel,
    diffBtns.easy,
    diffBtns.medium,
    diffBtns.hard
  );

  section.append(title, subtitle, difficultyRow, status, list);
  void updateTopicsList();
  return section;
};
