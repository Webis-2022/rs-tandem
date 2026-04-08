import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { within } from '@testing-library/dom';

const mocks = vi.hoisted(() => ({
  getTopics: vi.fn(),
  navigate: vi.fn(),
  startNewGame: vi.fn(),
  saveTopics: vi.fn(),
  getState: vi.fn(),
  fetchCompletedTopicIds: vi.fn(),
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
}));

import { createLibraryView } from './library';
import { ROUTES } from '../../types';

describe('createLibraryView', () => {
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
      isLoading: false,
    });

    mocks.fetchCompletedTopicIds.mockResolvedValue([]);
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
        round: 0,
      });
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
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
