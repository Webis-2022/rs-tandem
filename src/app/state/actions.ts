import type { AppState, Difficulty, Question, Topic } from '../../types';
import { getState, initialGameState, setState, state } from './store';
import { syncActiveGameToServer } from '../../services/syncActiveGame';

export async function increaseRound() {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...prev.game,
      round: (prev.game.round ?? 0) + 1,
    },
  });

  try {
    await syncActiveGameToServer();
  } catch (error) {
    console.error('Failed to sync active game:', error);
  }
}

export function changeGameMode(gameMode: 'game' | 'super-game') {
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      gameMode,
    },
  });
}

export function saveTopics(topics: Topic[]) {
  const prev = getState();
  setState({
    ...prev,
    topics,
  });
}

export function saveTopicQuestions(questions: Question[]) {
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      questions,
    },
  });
}
export function calculateScore(roundScore: number) {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...prev.game,
      score:
        prev.game.score + roundScore < 0 ? 0 : prev.game.score + roundScore,
    },
  });
}

export function resetRound() {
  const initialRound = 1;
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      round: initialRound,
    },
  });
}

export function increaseTopicId() {
  const prev = getState();
  const nextId = (prev.game.topicId ?? 0) + 1;

  setState({
    ...prev,
    game: {
      ...prev.game,
      topicId: nextId,
    },
  });
}

export function saveWrongAnswers(question: Question) {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...prev.game,
      wrongAnswers: [...prev.game.wrongAnswers, question],
    },
  });
}

export async function startNewGame(params: {
  topicId: number;
  difficulty: Difficulty;
}) {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...initialGameState,
      topicId: params.topicId,
      difficulty: params.difficulty,
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

export function resetGameState() {
  const prev = getState();

  setState(
    {
      ...prev,
      game: { ...initialGameState },
    },
    { saveGameToStorage: false }
  );
}
