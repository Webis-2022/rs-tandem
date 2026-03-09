import { type AppState } from '../../types';

export let state: AppState = {
  user: null,
  game: {
    topicId: 7,
    difficulty: '',
    round: 0,
    score: 0,
    usedHints: [],
    wrongAnswers: [],
    questions: [],
  },
  isLoading: false,
};

const listeners: ((state: AppState) => void)[] = [];

export function subscribe(listener: (state: AppState) => void) {
  listeners.push(listener);
}

export function notify() {
  listeners.forEach((fn) => fn(state));
}

export function getState() {
  return state;
}
export function setState(newState: AppState) {
  state = newState;
  notify();
}
