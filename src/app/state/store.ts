import { type AppState, type Difficulty, type Question } from '../../types';
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
  saveActiveGame(state.game); // после каждого обновления state текущая игра синхронизируется с localStorage
  notify();
}

const initialGameState: AppState['game'] = {
  topicId: 0,
  difficulty: '',
  round: 0,
  score: 0,
  usedHints: [],
  wrongAnswers: [],
  questions: [],
};

export function startNewGame(params: {
  topicId: number;
  difficulty: Difficulty;
  questions: Question[];
}) {
  setState({
    ...state,
    game: {
      ...initialGameState,
      topicId: params.topicId,
      difficulty: params.difficulty,
      questions: params.questions,
    },
  });
}

export function restoreGameState(game: AppState['game']) {
  setState({
    ...state,
    game,
  });
}
