import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/dom';

const mocks = vi.hoisted(() => ({
  getTopics: vi.fn(),
  navigate: vi.fn(),
  startNewGame: vi.fn(),
  saveTopics: vi.fn(),
  restoreActiveSession: vi.fn(),
  setLibraryDifficulty: vi.fn(),
  getState: vi.fn(),
  fetchCompletedTopicIds: vi.fn(),
  getResumeCandidate: vi.fn(),
  confirmReplaceActiveTopic: vi.fn(),
  confirmRestartActiveTopic: vi.fn(),
  createNewGame: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('../../services/api/get-topics', () => ({
  getTopics: mocks.getTopics,
}));

vi.mock('../../services/api/fetch-completed-topic-ids', () => ({
  fetchCompletedTopicIds: mocks.fetchCompletedTopicIds,
}));

vi.mock('../../app/navigation', () => ({
  navigate: mocks.navigate,
}));

vi.mock('../../app/state/store', () => ({
  getState: mocks.getState,
}));

vi.mock('../../app/state/actions', () => ({
  startNewGame: mocks.startNewGame,
  saveTopics: mocks.saveTopics,
  restoreActiveSession: mocks.restoreActiveSession,
  setLibraryDifficulty: mocks.setLibraryDifficulty,
}));

vi.mock('../../services/resume-active-game', () => ({
  getResumeCandidate: mocks.getResumeCandidate,
}));

vi.mock('./library-resume-modals.ts', () => ({
  confirmReplaceActiveTopic: mocks.confirmReplaceActiveTopic,
  confirmRestartActiveTopic: mocks.confirmRestartActiveTopic,
}));

vi.mock('../../services/api/create-new-game.ts', () => ({
  createNewGame: mocks.createNewGame,
}));

vi.mock('../../services/auth-service.ts', () => ({
  authService: {
    getCurrentUser: mocks.getCurrentUser,
  },
}));

import { createLibraryView } from './library';
import { ROUTES } from '../../types';

const buildState = (overrides: Record<string, unknown> = {}) => {
  const { ui, game, ...rest } = overrides;

  return {
    user: null,
    gameId: 101,
    game: {
      topicId: 0,
      difficulty: '',
      round: 0,
      score: 0,
      usedHints: [],
      wrongAnswers: [],
      questions: [],
      ...(game as object),
    },
    topics: [],
    isLoading: false,
    ui: {
      theme: 'light',
      activeRoute: ROUTES.Library,
      isNavOpen: false,
      onboardingSeen: false,
      selectedLibraryDifficulty: 'easy',
      ...(ui as object),
    },
    ...rest,
  };
};

describe('createLibraryView', () => {
  const resumeGameMock = {
    topicId: 1,
    difficulty: 'easy' as const,
    round: 2,
    score: 0,
    usedHints: [],
    wrongAnswers: [],
    questions: [{ id: 1 }],
  };

  const activeSessionMock = {
    gameId: 101,
    game: resumeGameMock,
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();

    mocks.getState.mockReturnValue(buildState());
    mocks.fetchCompletedTopicIds.mockResolvedValue([]);
    mocks.getResumeCandidate.mockResolvedValue(null);
    mocks.confirmReplaceActiveTopic.mockResolvedValue(true);
    mocks.confirmRestartActiveTopic.mockResolvedValue(true);
    mocks.createNewGame.mockResolvedValue(undefined);
    mocks.getCurrentUser.mockReturnValue({ id: 'user-1' });
  });

  test('renders title and subtitle', () => {
    mocks.getTopics.mockImplementation(() => new Promise(() => {}));

    const view = createLibraryView();
    document.body.append(view);

    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Choose difficulty and select a topic to start practice.'
      )
    ).toBeInTheDocument();
  });

  test('shows loading state before topics are loaded', () => {
    mocks.getTopics.mockImplementation(() => new Promise(() => {}));

    const view = createLibraryView();
    document.body.append(view);

    expect(screen.getByText('Loading topics...')).toBeInTheDocument();
  });

  test('shows message when topics list is empty', async () => {
    mocks.getTopics.mockResolvedValue([]);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByText('No topics found.')).toBeInTheDocument();
    });
  });

  test('changes active difficulty button on click', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);

    const view = createLibraryView();
    document.body.append(view);

    const easyBtn = screen.getByRole('button', { name: 'Easy' });
    const mediumBtn = screen.getByRole('button', { name: 'Medium' });

    expect(easyBtn).toHaveClass('is-active');
    expect(mediumBtn).not.toHaveClass('is-active');

    fireEvent.click(mediumBtn);

    expect(mediumBtn).toHaveClass('is-active');
    expect(easyBtn).not.toHaveClass('is-active');
  });

  test('starts new game and navigates to practice after clicking Start', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.startNewGame.mockResolvedValue(undefined);
    mocks.getResumeCandidate.mockResolvedValue(null);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(mocks.startNewGame).toHaveBeenCalledWith({
        topicId: 1,
        difficulty: 'easy',
      });
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });

  test('marks completed topic and disables Start button', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.fetchCompletedTopicIds.mockResolvedValue([1]);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      const card = within(view).getByText('HTML').closest('.library-card');
      expect(card).toHaveClass('is-completed');

      const startBtn = within(card as HTMLElement).getByRole('button', {
        name: /start/i,
      });
      expect(startBtn).toBeDisabled();
    });

    expect(view.querySelector('.topic-icon')).not.toBeNull();
  });

  test('loads completed topics for selected difficulty', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.fetchCompletedTopicIds.mockResolvedValue([]);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(mocks.fetchCompletedTopicIds).toHaveBeenCalledWith('easy');
    });

    mocks.fetchCompletedTopicIds.mockClear();

    fireEvent.click(within(view).getByRole('button', { name: 'Medium' }));

    await waitFor(() => {
      expect(mocks.fetchCompletedTopicIds).toHaveBeenCalledWith('medium');
    });
  });

  test('shows error message when topics loading fails', async () => {
    mocks.getTopics.mockRejectedValue(new Error('Failed to load topics.'));

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByText('Failed to load topics.')).toBeInTheDocument();
    });
  });

  test('starts new game without modal when there is no active game', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.startNewGame.mockResolvedValue(undefined);
    mocks.getResumeCandidate.mockResolvedValue(null);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(mocks.confirmRestartActiveTopic).not.toHaveBeenCalled();
      expect(mocks.confirmReplaceActiveTopic).not.toHaveBeenCalled();
      expect(mocks.startNewGame).toHaveBeenCalledWith({
        topicId: 1,
        difficulty: 'easy',
      });
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });

  test('shows continue button and restores same active topic without confirmation', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.getState.mockReturnValue(
      buildState({
        topics: [{ id: 1, name: 'HTML' }],
      })
    );

    mocks.getResumeCandidate.mockResolvedValue({
      session: activeSessionMock,
      source: 'local',
    });

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Continue?' })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue?' }));

    await waitFor(() => {
      expect(mocks.restoreActiveSession).toHaveBeenCalledWith(
        activeSessionMock
      );
      expect(mocks.confirmRestartActiveTopic).not.toHaveBeenCalled();
      expect(mocks.confirmReplaceActiveTopic).not.toHaveBeenCalled();
      expect(mocks.startNewGame).not.toHaveBeenCalled();
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });

  test('shows restart confirmation when starting same unfinished topic', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.getState.mockReturnValue(
      buildState({
        topics: [{ id: 1, name: 'HTML' }],
      })
    );

    mocks.getResumeCandidate.mockResolvedValue({
      session: activeSessionMock,
      source: 'local',
    });

    mocks.confirmRestartActiveTopic.mockResolvedValue(true);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(mocks.confirmRestartActiveTopic).toHaveBeenCalledWith(
        'easy',
        'HTML'
      );
      expect(mocks.startNewGame).toHaveBeenCalledWith({
        topicId: 1,
        difficulty: 'easy',
      });
      expect(mocks.restoreActiveSession).not.toHaveBeenCalled();
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });

  test('shows modal and starts a new game after confirmation when another active game exists', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.startNewGame.mockResolvedValue(undefined);
    mocks.getState.mockReturnValue(
      buildState({
        topics: [{ id: 1, name: 'HTML' }],
      })
    );

    mocks.getResumeCandidate.mockResolvedValue({
      session: activeSessionMock,
      source: 'local',
    });

    mocks.confirmReplaceActiveTopic.mockResolvedValue(true);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Medium' })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Medium' }));

    await waitFor(() => {
      expect(mocks.fetchCompletedTopicIds).toHaveBeenCalledWith('medium');
    });

    fireEvent.click(await screen.findByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(mocks.confirmReplaceActiveTopic).toHaveBeenCalledWith(
        'easy',
        'HTML'
      );
      expect(mocks.startNewGame).toHaveBeenCalledWith({
        topicId: 1,
        difficulty: 'medium',
      });
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });

  test('does not start a new game when modal is cancelled', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.getState.mockReturnValue(
      buildState({
        topics: [{ id: 1, name: 'HTML' }],
      })
    );

    mocks.getResumeCandidate.mockResolvedValue({
      session: activeSessionMock,
      source: 'local',
    });

    mocks.confirmReplaceActiveTopic.mockResolvedValue(false);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Medium' })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Medium' }));

    await waitFor(() => {
      expect(mocks.fetchCompletedTopicIds).toHaveBeenCalledWith('medium');
    });

    fireEvent.click(await screen.findByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(mocks.confirmReplaceActiveTopic).toHaveBeenCalled();
      expect(mocks.startNewGame).not.toHaveBeenCalled();
      expect(mocks.navigate).not.toHaveBeenCalled();
    });
  });

  test('shows error message and re-enables button when startNewGame fails', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.startNewGame.mockRejectedValue(new Error('Start failed'));
    mocks.getResumeCandidate.mockResolvedValue(null);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    });

    const startBtn = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByText('Start failed')).toBeInTheDocument();
      expect(startBtn).not.toBeDisabled();
    });
  });

  test('restores selected library difficulty after refresh', async () => {
    mocks.getState.mockReturnValue(
      buildState({
        game: {
          difficulty: null,
        },
        ui: {
          selectedLibraryDifficulty: 'medium',
        },
      })
    );

    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Medium' })).toHaveClass(
        'is-active'
      );
      expect(mocks.fetchCompletedTopicIds).toHaveBeenCalledWith('medium');
    });
  });
});
