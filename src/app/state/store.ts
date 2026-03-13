import { type AppState } from '../../types';
import { saveActiveGame } from '../../services/storageService';

export let state: AppState = {
  user: null,
  game: {
    topicId: 0,
    difficulty: '',
    round: 1,
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
  saveActiveGame(state.game); // после любого изменения игры ее актуальная версия автоматически сохраняется в localStorage
  notify();
}

export function restoreGameState(game: AppState['game']) {
  state = {
    ...state, // берем текущий state и копируем из него все поля
    game, // но поле game заменяем на новое значение
  };
}
