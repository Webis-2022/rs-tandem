import type { HintCounter, Question, User } from '../../types';
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
      wrongAnswers: [
        ...prev.game.wrongAnswers,
        { ...question, isCorrected: false },
      ],
    },
  });
}

export function markAsCorrected(question: Question) {
  const prev = getState();

  setState({
    ...prev,
    game: {
      ...prev.game,
      wrongAnswers: prev.game.wrongAnswers.map((q) =>
        q.question === question.question ? { ...q, isCorrected: true } : q
      ),
    },
  });
}

export function countWrongAnswers() {
  const prev = getState();
  setState({
    ...prev,
    game: {
      ...prev.game,
      wrongAnswersCounter: prev.game.wrongAnswers.filter(
        (q) => q.isCorrected !== true
      ).length,
    },
  });
}

export function saveUsedHint(hintName: keyof HintCounter) {
  const prev = getState();
  if (!prev.game.usedHints) return;

  setState({
    ...prev,
    game: {
      ...prev.game,
      usedHints: {
        ...prev.game.usedHints,
        [hintName]: prev.game.usedHints[hintName] + 1,
      },
    },
  });
}

export function saveUserData(user: User) {
  const prev = getState();

  setState({
    ...prev,
    user,
  });
}

export function removeUserData() {
  const prev = getState();

  setState({
    ...prev,
    user: null,
  });
}
