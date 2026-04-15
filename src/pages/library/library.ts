import './library.scss';
import {
  ROUTES,
  type AppState,
  type Difficulty,
  type PersistedActiveSession,
  type Topic,
} from '../../types';
import { navigate } from '../../app/navigation';
import { getTopics } from '../../services/api/get-topics';
import { createEl, createButton } from '../../shared/dom';
import {
  saveTopics,
  startNewGame,
  setLibraryDifficulty,
  restoreActiveSession,
} from '../../app/state/actions';
import { createLoadingView } from '../../components/ui/loading/loading';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { fetchCompletedTopicIds } from '../../services/api/fetch-completed-topic-ids';
import { getState } from '../../app/state/store';
import { getTopicResumeCandidate } from '../../services/topic-resume-candidate.ts';
import {
  confirmReplaceActiveTopic,
  confirmRestartActiveTopic,
} from './library-resume-modals.ts';
import { createNewGame } from '../../services/api/create-new-game.ts';
import { authService } from '../../services/auth-service.ts';

type GameState = AppState['game'];

type CreateTopicCardParams = {
  topic: Topic;
  isCompleted: boolean;
  isActiveTopic: boolean;
  onStart: (startBtn: HTMLButtonElement) => void;
  onContinue: () => void;
};

function isSameActiveTopic(
  activeTopic: GameState,
  topicId: number,
  difficulty: Difficulty
): boolean {
  return (
    activeTopic.topicId === topicId && activeTopic.difficulty === difficulty
  );
}

function getTopicTitleById(topicId: number): string {
  const topics = getState().topics;

  return (
    topics.find((topic) => topic.id === topicId)?.name ?? `Topic #${topicId}`
  );
}

function createTopicCard({
  topic,
  isCompleted,
  isActiveTopic,
  onStart,
  onContinue,
}: CreateTopicCardParams): HTMLElement {
  const card = createEl('div', {
    className: `library-card${isCompleted ? ' is-completed' : ''}`,
  });

  const header = createEl('div', {
    className: 'library-card-header',
  });

  const name = createEl('div', {
    text: topic.name ?? `Topic #${topic.id}`,
    className: 'library-card-title',
  });
  header.append(name);

  if (isActiveTopic) {
    const activeBadge = createEl('span', {
      text: 'Unfinished',
      className: 'library-topic-badge',
    });

    header.append(activeBadge);
  }

  const actions = createEl('div', { className: 'library-card-actions' });
  const actionsRight = createEl('div', {
    className: 'library-card-actions-right',
  });

  if (isCompleted) {
    const topicIcon = createEl('img', {
      className: 'topic-icon',
    }) as HTMLImageElement;

    topicIcon.src = '/img/tick-mark.png';
    topicIcon.alt = '';
    topicIcon.setAttribute('aria-hidden', 'true');
    actions.append(topicIcon);
  }

  if (isActiveTopic) {
    const continueBtn = createButton(
      'Continue?',
      onContinue,
      'btn btn-secondary'
    );
    actionsRight.append(continueBtn);
  }

  const startBtn = createButton(
    'Start',
    () => onStart(startBtn as HTMLButtonElement),
    'btn',
    isCompleted
  );
  actionsRight.append(startBtn);

  actions.append(actionsRight);
  card.append(header, actions);

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

  let difficulty: Difficulty = getState().ui.selectedLibraryDifficulty;

  const difficultyRow = createEl('div', { className: 'library-difficulty' });

  const difficultyLabel = createEl('span', {
    text: 'Difficulty:',
    className: 'library-difficulty-label',
  });

  const handleDifficultyChange = (key: Difficulty) => {
    if (difficulty === key) return;

    difficulty = key;
    setLibraryDifficulty(key);
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

  const handleContinueClick = (
    activeSession: PersistedActiveSession | null
  ): void => {
    if (!activeSession) return;

    status.textContent = '';
    status.classList.remove('is-error');

    restoreActiveSession(activeSession);
    navigate(ROUTES.Practice, true);
  };

  const handleStartClick = async (
    topicId: number,
    startBtn: HTMLButtonElement,
    activeTopic: GameState | null
  ): Promise<void> => {
    status.textContent = '';
    status.classList.remove('is-error');
    startBtn.disabled = true;

    let shouldEnableButton = true;

    try {
      if (activeTopic && isSameActiveTopic(activeTopic, topicId, difficulty)) {
        const activeTopicTitle = getTopicTitleById(activeTopic.topicId);
        const shouldRestart = await confirmRestartActiveTopic(
          activeTopic.difficulty,
          activeTopicTitle
        );

        if (!shouldRestart) {
          return;
        }
      } else if (activeTopic) {
        const activeTopicTitle = getTopicTitleById(activeTopic.topicId);
        const shouldReplace = await confirmReplaceActiveTopic(
          activeTopic.difficulty,
          activeTopicTitle
        );

        if (!shouldReplace) {
          return;
        }
      }

      status.textContent = 'Starting practice...';

      if (!getState().gameId) {
        const user = authService.getCurrentUser();

        if (!user) {
          throw new Error('User not found.');
        }

        await createNewGame(user.id);
      }

      await startNewGame({
        topicId,
        difficulty,
      });

      status.textContent = '';
      shouldEnableButton = false;
      navigate(ROUTES.Practice, true);
    } catch (err: unknown) {
      status.textContent =
        err instanceof Error ? err.message : 'Failed to start topic.';
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
      const [topics, completedTopicIds, activeSession] = await Promise.all([
        getTopics(),
        fetchCompletedTopicIds(difficulty),
        getTopicResumeCandidate(),
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
      const activeTopic = activeSession?.game ?? null;

      topics.forEach((topic) => {
        const isCompleted = completedIds.has(topic.id);
        const isActiveTopic =
          Boolean(activeTopic) &&
          activeTopic?.difficulty === difficulty &&
          activeTopic.topicId === topic.id &&
          !isCompleted;

        list.append(
          createTopicCard({
            topic,
            isCompleted,
            isActiveTopic,
            onContinue: () => void handleContinueClick(activeSession),
            onStart: (startBtn) =>
              void handleStartClick(topic.id, startBtn, activeTopic),
          })
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
