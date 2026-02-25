import { type AppState } from '../../types';

export const state: AppState = {
  user: null,
  game: {
    currentQuestionIndex: 0,
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
