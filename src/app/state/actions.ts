import type { Question } from '../../types';
import { getState, setState } from './store';
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

export function changeGameMode(gameMode: string) {
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      gameMode,
    },
  });
}

export function saveTopicQuestions(questions: Question[]) {
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      questions: questions,
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
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      round: 1,
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
