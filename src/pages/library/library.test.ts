import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/dom';

const mocks = vi.hoisted(() => ({
  getTopics: vi.fn(),
  navigate: vi.fn(),
  startNewGame: vi.fn(),
  saveTopics: vi.fn(),
  restoreGameState: vi.fn(),
  getState: vi.fn(),
  fetchCompletedTopicIds: vi.fn(),
  showModal: vi.fn(),
  getResumeCandidate: vi.fn(),
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
  restoreGameState: mocks.restoreGameState,
}));

vi.mock('../../components/ui/modal/modal', () => ({
  showModal: mocks.showModal,
}));

vi.mock('../../services/resume-active-game', () => ({
  getResumeCandidate: mocks.getResumeCandidate,
}));

import { createLibraryView } from './library';
import { ROUTES } from '../../types';

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

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();

    mocks.getState.mockReturnValue({
      user: null,
      game: {
        topicId: 0,
        difficulty: '',
        round: 0,
        score: 0,
        usedHints: [],
        wrongAnswers: [],
        questions: [],
      },
      topics: [],
      isLoading: false,
    });

    mocks.fetchCompletedTopicIds.mockResolvedValue([]);
    mocks.getResumeCandidate.mockResolvedValue(null);
    mocks.showModal.mockResolvedValue({ confirmed: true });
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

    const startBtn = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startBtn);

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

    const mediumBtn = within(view).getByRole('button', { name: 'Medium' });
    fireEvent.click(mediumBtn);

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
      expect(mocks.showModal).not.toHaveBeenCalled();
      expect(mocks.startNewGame).toHaveBeenCalledWith({
        topicId: 1,
        difficulty: 'easy',
      });
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });

  test('shows confirmation modal and restores same active game after confirmation', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);

    mocks.getState.mockReturnValue({
      user: null,
      game: {
        topicId: 0,
        difficulty: '',
        round: 0,
        score: 0,
        usedHints: [],
        wrongAnswers: [],
        questions: [],
      },
      topics: [{ id: 1, name: 'HTML' }],
      isLoading: false,
    });

    mocks.getResumeCandidate.mockResolvedValue({
      game: resumeGameMock,
      source: 'local',
    });

    mocks.showModal.mockResolvedValue({ confirmed: true });

    const view = createLibraryView();
    document.body.append(view);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(mocks.showModal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Continue previous game?',
          messageHtml: expect.stringContaining('HTML'),
        })
      );

      expect(mocks.restoreGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          topicId: 1,
          difficulty: 'easy',
        })
      );
      expect(mocks.startNewGame).not.toHaveBeenCalled();
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });

  test('shows modal and starts a new game after confirmation when another active game exists', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);
    mocks.startNewGame.mockResolvedValue(undefined);

    mocks.getState.mockReturnValue({
      user: null,
      game: {
        topicId: 0,
        difficulty: '',
        round: 0,
        score: 0,
        usedHints: [],
        wrongAnswers: [],
        questions: [],
      },
      topics: [{ id: 1, name: 'HTML' }],
      isLoading: false,
    });

    mocks.getResumeCandidate.mockResolvedValue({
      game: resumeGameMock,
      source: 'local',
    });

    mocks.showModal.mockResolvedValue({ confirmed: true });

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

    const startBtn = await screen.findByRole('button', { name: 'Start' });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(mocks.showModal).toHaveBeenCalled();
      expect(mocks.startNewGame).toHaveBeenCalledWith({
        topicId: 1,
        difficulty: 'medium',
      });
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });

    expect(mocks.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Start new game?',
        messageHtml: expect.stringContaining('HTML'),
      })
    );
  });

  test('does not start a new game when modal is cancelled', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);

    mocks.getState.mockReturnValue({
      user: null,
      game: {
        topicId: 0,
        difficulty: '',
        round: 0,
        score: 0,
        usedHints: [],
        wrongAnswers: [],
        questions: [],
      },
      topics: [{ id: 1, name: 'HTML' }],
      isLoading: false,
    });

    mocks.getResumeCandidate.mockResolvedValue({
      game: resumeGameMock,
      source: 'local',
    });

    mocks.showModal.mockResolvedValue({ confirmed: false });

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

    const startBtn = await screen.findByRole('button', { name: 'Start' });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(mocks.showModal).toHaveBeenCalled();
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
});
