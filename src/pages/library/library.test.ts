import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/dom';

// Создаем моки для каждой функции
// vi.fn() создает фейковую функцию
// vi.hoisted() подготавливает эти моки заранее, до обработки vi.mock(...)
const mocks = vi.hoisted(() => ({
  getTopics: vi.fn(),
  navigate: vi.fn(),
  startNewGame: vi.fn(),
  getState: vi.fn(),
}));

// Подменяем реальные модули тестовыми (vi.mock() — подменить модуль)
vi.mock('../../services/api/get-topics', () => ({
  getTopics: mocks.getTopics,
}));

vi.mock('../../app/navigation', () => ({
  navigate: mocks.navigate,
}));

vi.mock('../../app/state/store', () => ({
  getState: mocks.getState,
}));

vi.mock('../../app/state/actions', () => ({
  startNewGame: mocks.startNewGame,
}));

// к моменту импорта library.ts все зависимости были заменены на моки (чтобы не подтянулись настоящие getTopics, navigate и тд)
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
  });

  test('renders title and subtitle', () => {
    mocks.getTopics.mockReturnValue(new Promise(() => {}));

    const view = createLibraryView('easy');
    document.body.append(view);

    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Choose difficulty and select a topic to start practice.'
      )
    ).toBeInTheDocument();
  });

  test('shows loading state before topics are loaded', () => {
    mocks.getTopics.mockReturnValue(new Promise(() => {}));

    const view = createLibraryView('medium');
    document.body.append(view);

    expect(screen.getByText('Loading topics...')).toBeInTheDocument();
  });

  test('shows message when topics list is empty', async () => {
    mocks.getTopics.mockResolvedValue([]);

    const view = createLibraryView('hard');
    document.body.append(view);

    expect(await screen.findByText('No topics found.')).toBeInTheDocument();
  });

  test('changes active difficulty button on click', async () => {
    mocks.getTopics.mockResolvedValue([{ id: 1, name: 'HTML' }]);

    const view = createLibraryView('easy');
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

    const view = createLibraryView('easy');
    document.body.append(view);

    const startBtn = await screen.findByRole('button', { name: 'Start' });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(mocks.startNewGame).toHaveBeenCalledWith({
        topicId: 1,
        difficulty: 'easy',
      });
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice, true);
    });
  });
});
