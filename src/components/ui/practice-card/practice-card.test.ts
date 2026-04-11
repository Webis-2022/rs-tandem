import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPracticeCard } from './practice-card';
import { getState, subscribe } from '../../../app/state/store';
import type { AppState } from '../../../types';
import * as navigation from '../../../app/navigation';
import * as gameModule from '../../game/go-to-next-topic';
import * as checkAnswerModule from '../../game/check-answer';
import * as actions from '../../../app/state/actions';
import * as domModule from '../../../shared/dom';
import * as hintsModule from './hints-container/hints-container';
import * as dividerModule from './divider/divider';

vi.mock('../../../app/state/store', () => ({
  getState: vi.fn(),
  subscribe: vi.fn(),
}));

vi.mock('../../../app/navigation', () => ({
  navigate: vi.fn(),
}));

vi.mock('../../game/go-to-next-topic', () => ({
  goToNextTopic: vi.fn(),
}));

vi.mock('../../game/check-answer', () => ({
  checkAnswer: vi.fn(),
}));

vi.mock('../../../app/state/actions', () => ({
  resetWrongAnswersCounter: vi.fn(),
}));

vi.mock('./theory-btn-popover/theory-btn-popover', () => ({}));

vi.mock('../../../shared/dom', () => ({
  createEl: vi.fn(),
  createButton: vi.fn(),
}));

vi.mock('./hints-container/hints-container', () => ({
  createHintsContainer: vi.fn(),
}));

vi.mock('./divider/divider', () => ({
  createDivider: vi.fn(),
}));

const createMockState = (
  overrides: Partial<AppState['game']> = {}
): AppState => ({
  gameId: 1,
  user: null,
  game: {
    topicId: 1,
    difficulty: 'easy' as const,
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
    theme: 'light' as const,
    activeRoute: '/' as const,
    isNavOpen: false,
    onboardingSeen: true,
  },
});

describe('createPracticeCard', () => {
  let card: ReturnType<typeof createPracticeCard>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getState).mockReturnValue(createMockState());
    vi.mocked(subscribe).mockReturnValue(() => {});

    vi.mocked(domModule.createEl).mockImplementation(
      (tag: string, attrs?: Record<string, unknown>) => {
        const el = document.createElement(tag);
        if (attrs) {
          Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className' && typeof value === 'string') {
              el.className = value;
            } else if (key === 'textContent' && typeof value === 'string') {
              el.textContent = value;
            } else if (key === 'id' && typeof value === 'string') {
              el.id = value;
            } else if (key === 'type' && typeof value === 'string') {
              (el as HTMLInputElement).type = value;
            }
          });
        }
        return el;
      }
    );

    vi.mocked(domModule.createButton).mockImplementation(
      (
        text: string,
        onClick?: (event: MouseEvent) => void,
        className?: string,
        disabled = false
      ) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        if (className) btn.className = className;
        btn.disabled = disabled;
        if (onClick) {
          btn.addEventListener('click', onClick);
        }
        return btn;
      }
    );

    vi.mocked(hintsModule.createHintsContainer).mockReturnValue(
      document.createElement('div')
    );
    vi.mocked(dividerModule.createDivider).mockReturnValue(
      document.createElement('hr')
    );

    vi.mocked(gameModule.goToNextTopic).mockReturnValue(undefined);
    vi.mocked(actions.resetWrongAnswersCounter).mockReturnValue(undefined);
    vi.mocked(navigation.navigate).mockReturnValue(undefined);
    vi.mocked(checkAnswerModule.checkAnswer).mockResolvedValue(undefined);

    card = createPracticeCard();
  });

  it('creates card with correct structure and classes', () => {
    expect(card).toBeInstanceOf(HTMLDivElement);
    expect(card.classList.contains('card')).toBe(true);

    expect(card.querySelector('.card-header')).not.toBeNull();
    expect(card.querySelector('.card-body')).not.toBeNull();
    expect(card.querySelector('.card-footer')).not.toBeNull();
    expect(card.querySelector('.score')).not.toBeNull();
    expect(card.querySelector('.topic')).not.toBeNull();
    expect(card.querySelector('.difficulty')).not.toBeNull();
    expect(card.querySelector('.question-container')).not.toBeNull();
    expect(card.querySelector('.check-button')).not.toBeNull();
    expect(card.querySelector('.next-topic-btn')).not.toBeNull();
    expect(card.querySelector('.library-btn')).not.toBeNull();
  });

  it('renders topic name and difficulty from state', () => {
    const topicEl = card.querySelector('.topic');
    const difficultyEl = card.querySelector('.difficulty');

    expect(topicEl).not.toBeNull();
    expect(difficultyEl).not.toBeNull();

    expect((topicEl as HTMLElement).textContent).toBe('Test Topic');
    expect((difficultyEl as HTMLElement).textContent).toBe('Difficulty: easy');
  });

  it('subscribes to state changes twice', () => {
    expect(subscribe).toHaveBeenCalledTimes(2);
  });

  it('sets up Next Topic button handlers', () => {
    const nextBtn = card.querySelector('.next-topic-btn');
    expect(nextBtn).not.toBeNull();
    expect(nextBtn instanceof HTMLButtonElement).toBe(true);

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    (nextBtn as HTMLButtonElement).dispatchEvent(clickEvent);

    expect(gameModule.goToNextTopic).toHaveBeenCalledTimes(1);
    expect(actions.resetWrongAnswersCounter).toHaveBeenCalledTimes(1);
  });

  it('sets up Library button navigation', () => {
    const libraryBtn = card.querySelector('.library-btn');
    expect(libraryBtn).not.toBeNull();
    expect(libraryBtn instanceof HTMLButtonElement).toBe(true);

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    (libraryBtn as HTMLButtonElement).dispatchEvent(clickEvent);

    expect(navigation.navigate).toHaveBeenCalledWith(expect.any(String), true);
  });

  it('sets up Check button with gameMode', () => {
    const checkBtn = card.querySelector('.check-button');
    expect(checkBtn).not.toBeNull();
    expect(checkBtn instanceof HTMLButtonElement).toBe(true);
    expect((checkBtn as HTMLButtonElement).disabled).toBe(true);

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    (checkBtn as HTMLButtonElement).dispatchEvent(clickEvent);

    expect(checkAnswerModule.checkAnswer).toHaveBeenCalledWith('practice');
  });

  it('sets up theory button with correct src and class', () => {
    const theoryBtn = card.querySelector('.theory-btn');
    expect(theoryBtn).not.toBeNull();
    expect(theoryBtn instanceof HTMLImageElement).toBe(true);
    expect((theoryBtn as HTMLImageElement).src).toContain('question.png');
    expect(theoryBtn?.classList.contains('theory-btn')).toBe(true);
  });

  it('score element starts with 0', () => {
    const scoreEl = card.querySelector('.score');
    expect(scoreEl).not.toBeNull();
    expect((scoreEl as HTMLElement).textContent).toBe('0');
  });
});
