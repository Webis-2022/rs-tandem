import { beforeEach, describe, expect, it } from 'vitest';
import type { PersistedActiveSession } from '../types';
import {
  clearActiveGame,
  clearActiveSession,
  getActiveSession,
  saveActiveSession,
} from './storage-service';

describe('storage-service', () => {
  const session = {
    gameId: 1,
    game: {
      topicId: 1,
      difficulty: 'easy',
      round: 1,
    },
  } as PersistedActiveSession;

  beforeEach(() => {
    localStorage.clear();
  });

  it('saves active session', () => {
    saveActiveSession(session);

    expect(localStorage.getItem('activeGame')).toBe(JSON.stringify(session));
  });

  it('gets active session', () => {
    localStorage.setItem('activeGame', JSON.stringify(session));

    expect(getActiveSession()).toEqual(session);
  });

  it('returns null when there is no active session', () => {
    expect(getActiveSession()).toBeNull();
  });

  it('returns legacy game as session with null gameId', () => {
    const legacyGame = {
      topicId: 2,
      difficulty: 'medium',
      round: 3,
    };

    localStorage.setItem('activeGame', JSON.stringify(legacyGame));

    expect(getActiveSession()).toEqual({
      gameId: null,
      game: legacyGame,
    });
  });

  it('clears active session', () => {
    localStorage.setItem('activeGame', JSON.stringify(session));

    clearActiveSession();

    expect(localStorage.getItem('activeGame')).toBeNull();
  });

  it('clearActiveGame also clears storage', () => {
    localStorage.setItem('activeGame', JSON.stringify(session));

    clearActiveGame();

    expect(localStorage.getItem('activeGame')).toBeNull();
  });
});
