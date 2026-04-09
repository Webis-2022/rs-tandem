import { ROUTES, type AppState, type UIState } from '../../types';
import { saveActiveGame } from '../../services/storage-service';

const UI_STORAGE_KEY = 'tandem:ui';

const initialUIState: UIState = {
  theme: 'light',
  activeRoute: ROUTES.Landing,
  isNavOpen: false,
  onboardingSeen: false,
};

function loadUIState(): Pick<UIState, 'theme' | 'onboardingSeen'> {
  try {
    const persisted = localStorage.getItem(UI_STORAGE_KEY);

    if (!persisted) {
      return {
        theme: initialUIState.theme,
        onboardingSeen: initialUIState.onboardingSeen,
      };
    }

    const parsed = JSON.parse(persisted) as Partial<UIState>;

    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      onboardingSeen: Boolean(parsed.onboardingSeen),
    };
  } catch (error) {
    console.error('Failed to load UI state from localStorage:', error);
    return {
      theme: initialUIState.theme,
      onboardingSeen: initialUIState.onboardingSeen,
    };
  }
}

function saveUIState(ui: UIState): void {
  try {
    localStorage.setItem(
      UI_STORAGE_KEY,
      JSON.stringify({
        theme: ui.theme,
        onboardingSeen: ui.onboardingSeen,
      })
    );
  } catch (error) {
    console.error('Failed to save UI state to localStorage:', error);
  }
}

const persistedUI = loadUIState();

export let state: AppState = {
  user: null,
  gameId: null,
  game: {
    topicId: 1,
    difficulty: null,
    round: 1,
    score: 0,
    usedHints: {
      '50/50': 0,
      'call a friend': 0,
      "i don't know": 0,
    },
    wrongAnswers: [],
    wrongAnswersCounter: 0,
    questions: [],
    gameMode: 'game',
  },
  isLoading: false,
  topics: [],
  ui: {
    ...initialUIState,
    ...persistedUI,
  },
};

const listeners: ((state: AppState) => void)[] = [];

export function subscribe(listener: (state: AppState) => void) {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}

export function notify() {
  listeners.forEach((fn) => fn(state));
}

export function getState() {
  return state;
}

export function setState(
  newState: AppState,
  options?: { saveGameToStorage?: boolean }
) {
  state = newState;

  if (options?.saveGameToStorage !== false) {
    saveActiveGame(state.game);
  }

  saveUIState(state.ui);
  notify();
}

export const initialGameState: AppState['game'] = {
  topicId: 0,
  difficulty: null,
  round: 0,
  score: 0,
  usedHints: {
    '50/50': 0,
    'call a friend': 0,
    "i don't know": 0,
  },
  wrongAnswers: [],
  wrongAnswersCounter: 0,
  questions: [],
  gameMode: 'game',
};
