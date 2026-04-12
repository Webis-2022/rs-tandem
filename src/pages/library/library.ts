import './library.scss';
import {
  ROUTES,
  type AppState,
  type Difficulty,
  type Topic,
} from '../../types';
import { navigate } from '../../app/navigation';
import { getTopics } from '../../services/api/get-topics';
import { createEl, createButton } from '../../shared/dom';
import {
  restoreGameState,
  saveTopics,
  startNewGame,
} from '../../app/state/actions';
import { createLoadingView } from '../../components/ui/loading/loading';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { fetchCompletedTopicIds } from '../../services/api/fetch-completed-topic-ids';
import { getState } from '../../app/state/store';
import { getResumeCandidate } from '../../services/resume-active-game';
import {
  confirmContinueSameTopic,
  confirmReplaceActiveTopic,
} from './library-resume-modals.ts';

type GameState = AppState['game'];

function isSameActiveGame(
  activeGame: GameState,
  topicId: number,
  difficulty: Difficulty
): boolean {
  return activeGame.topicId === topicId && activeGame.difficulty === difficulty;
}

function getTopicTitleById(topicId: number): string {
  const topics = getState().topics;

  return (
    topics.find((topic) => topic.id === topicId)?.name ?? `Topic #${topicId}`
  );
}

function createTopicCard(
  topic: Topic,
  isCompleted: boolean,
  onStart: (startBtn: HTMLButtonElement) => void
): HTMLElement {
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
    () => onStart(startBtn as HTMLButtonElement),
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
}

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

  const setActiveDifficultyUI = () => {
    (Object.keys(diffBtns) as Difficulty[]).forEach((key) => {
      diffBtns[key].classList.toggle('is-active', key === difficulty);
    });
  };

  const handleStartClick = async (
    topicId: number,
    startBtn: HTMLButtonElement
  ): Promise<void> => {
    status.textContent = '';
    status.classList.remove('is-error');
    startBtn.disabled = true;

    let shouldEnableButton = true;

    try {
      const activeCandidate = await getResumeCandidate();
      const activeGame = activeCandidate?.game;

      if (activeGame && isSameActiveGame(activeGame, topicId, difficulty)) {
        const activeTopicTitle = getTopicTitleById(activeGame.topicId);
        const shouldContinue = await confirmContinueSameTopic(
          activeGame.difficulty,
          activeTopicTitle
        );

        if (!shouldContinue) {
          return;
        }

        restoreGameState(activeGame);
        shouldEnableButton = false;
        navigate(ROUTES.Practice, true);
        return;
      }

      if (activeGame) {
        const activeTopicTitle = getTopicTitleById(activeGame.topicId);
        const shouldReplace = await confirmReplaceActiveTopic(
          activeGame.difficulty,
          activeTopicTitle
        );

        if (!shouldReplace) {
          return;
        }
      }

      status.textContent = 'Starting practice...';

      await startNewGame({
        topicId,
        difficulty,
      });

      status.textContent = '';
      shouldEnableButton = false;
      navigate(ROUTES.Practice, true);
    } catch (err: unknown) {
      status.textContent =
        err instanceof Error ? err.message : 'Failed to start game.';
      status.classList.add('is-error');
    } finally {
      if (shouldEnableButton) {
        startBtn.disabled = false;
      }
    }
  };

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
        list.append(
          createTopicCard(
            topic,
            completedIds.has(topic.id),
            (startBtn) => void handleStartClick(topic.id, startBtn)
          )
        );
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
