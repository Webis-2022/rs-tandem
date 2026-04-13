import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createPracticeView } from './practice';
import { getState } from '../../app/state/store';
import type { AppState } from '../../types';
import * as api from '../../services/api/get-questions';
import * as actions from '../../app/state/actions';
import * as syncModule from '../../services/sync-active-game';
import * as showNextModule from '../../components/game/show-next-question';
import * as updateScoreModule from '../../components/game/updateScore';
import * as practiceCardModule from '../../components/ui/practice-card/practice-card';
import * as sidePanelModule from '../../components/ui/practice-card/side-panel/side-panel';

vi.mock('../../app/state/store');
vi.mock('../../services/api/get-questions');
vi.mock('../../app/state/actions');
vi.mock('../../services/sync-active-game');
vi.mock('../../components/game/show-next-question');
vi.mock('../../components/game/updateScore');
vi.mock('../../components/ui/practice-card/practice-card');
vi.mock('../../components/ui/practice-card/side-panel/side-panel');

const mockQuestions = [{ id: 1, question: 'Test?', answers: ['a'] }];

const createMockState = (
  overrides: Partial<AppState['game']> = {}
): AppState => ({
  gameId: 1,
  user: null,
  game: {
    topicId: 1,
    difficulty: 'easy',
    round: 0,
    score: 0,
    usedHints: undefined,
    wrongAnswers: [],
    wrongAnswersCounter: 0,
    questions: [],
    gameMode: 'practice',
    ...overrides,
  },
  isLoading: false,
  topics: [{ id: 1, name: 'Test Topic' }],
  ui: {
    theme: 'light',
    activeRoute: '/',
    isNavOpen: false,
    onboardingSeen: true,
    selectedLibraryDifficulty: 'easy',
  },
});

describe('createPracticeView', () => {
  const getQuestionsMock = vi.mocked(api.getQuestions);
  const saveTopicQuestionsMock = vi.mocked(actions.saveTopicQuestions);
  const syncActiveGameMock = vi.mocked(syncModule.syncActiveGameToServer);
  const showNextQuestionMock = vi.mocked(showNextModule.showNextQuestion);
  const createPracticeCardMock = vi.mocked(
    practiceCardModule.createPracticeCard
  );
  const createSidePanelMock = vi.mocked(sidePanelModule.createSidePanel);
  const updateScoreMock = vi.mocked(updateScoreModule.updateScore);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getState).mockReturnValue(createMockState());
  });

  test('shows error message without difficulty', () => {
    vi.mocked(getState).mockReturnValue(createMockState({ difficulty: null }));

    const section = createPracticeView();
    const errorEl = section.querySelector('.error-message');

    expect(errorEl).toBeTruthy();
    expect(errorEl?.textContent).toContain('No active game found');
  });

  test('successfully loads questions and replaces loading', async () => {
    getQuestionsMock.mockResolvedValue(mockQuestions);
    syncActiveGameMock.mockResolvedValue(undefined);

    const mockCard = document.createElement('div');
    createPracticeCardMock.mockReturnValue(mockCard);

    const container = document.createElement('div');
    document.body.appendChild(container);

    const section = createPracticeView();
    container.appendChild(section);

    await vi.waitFor(() => {
      expect(getQuestionsMock).toHaveBeenCalledWith(1, 'easy');
      expect(saveTopicQuestionsMock).toHaveBeenCalledWith(mockQuestions);
      expect(section.querySelector('.loading')).toBeNull();
      expect(createPracticeCardMock).toHaveBeenCalledOnce();
      expect(createSidePanelMock).toHaveBeenCalledWith(section, mockCard);
      expect(updateScoreMock).toHaveBeenCalledOnce();
    });
  });

  test('handles API error and shows error message', async () => {
    getQuestionsMock.mockRejectedValue(new Error('API fail'));

    const section = createPracticeView();

    await vi.waitFor(() => {
      const errorEl = section.querySelector('.error-message');
      expect(errorEl).toBeTruthy();
      expect(errorEl?.textContent).toContain('API fail');
    });

    expect(showNextQuestionMock).toHaveBeenCalled();
  });
});
