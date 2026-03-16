import { type AppState, type Difficulty, type Question } from '../../types';
import { saveActiveGame } from '../../services/storageService';
import { syncActiveGameToServer } from '../../services/syncActiveGame';

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
  round: 1,
  score: 0,
  usedHints: [],
  wrongAnswers: [],
  questions: [],
};

export async function startNewGame(params: {
  topicId: number;
  difficulty: Difficulty;
  questions: Question[];
}) {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...initialGameState,
      topicId: params.topicId,
      difficulty: params.difficulty,
      questions: params.questions,
    },
  });

  try {
    await syncActiveGameToServer();
  } catch (error) {
    console.error('Failed to save active game to Supabase:', error);
  }
}

export function restoreGameState(game: AppState['game']) {
  setState({
    ...state,
    game,
  });
}
