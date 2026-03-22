import { type AppState } from '../../types';
import { saveActiveGame } from '../../services/storageService';

export let state: AppState = {
  user: null,
  game: {
    topicId: 1,
    difficulty: '',
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
  saveActiveGame(state.game); // после каждого обновления state текущая игра синхронизируется с localStorage
  notify();
}

export const initialGameState: AppState['game'] = {
  topicId: 1,
  difficulty: '',
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
};
