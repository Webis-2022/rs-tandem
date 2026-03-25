import { type AppState } from '../../types';
import { saveActiveGame } from '../../services/storageService';

export let state: AppState = {
  user: null,
  game: {
    topicId: 1,
    difficulty: '',
    round: 1,
    score: 0,
    usedHints: [],
    wrongAnswers: [],
    questions: [],
    gameMode: 'game',
  },
  isLoading: false,
  topics: [],
};

const listeners: ((state: AppState) => void)[] = [];

export function subscribe(listener: (state: AppState) => void) {
  listeners.push(listener);

  return () => listeners.filter((l) => l !== listener);
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

  notify();
}

export const initialGameState: AppState['game'] = {
  topicId: 1,
  difficulty: '',
  round: 1,
  score: 0,
  usedHints: [],
  wrongAnswers: [],
  questions: [],
  gameMode: 'game',
};
