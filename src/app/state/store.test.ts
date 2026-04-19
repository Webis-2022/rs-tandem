import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTES } from '../../types';
import type { AppState } from '../../types';

vi.mock('../../services/storage-service', () => ({
  saveActiveSession: vi.fn(),
  clearActiveSession: vi.fn(),
}));

import { saveActiveSession } from '../../services/storage-service';
import { getState, setState, subscribe, initialGameState } from './store';

const makeState = (): AppState => ({
  user: null,
  gameId: null,
  game: { ...initialGameState, topicId: 1, round: 1 },
  isLoading: false,
  topics: [],
  ui: {
    theme: 'light',
    activeRoute: ROUTES.Landing,
    isNavOpen: false,
    onboardingSeen: false,
    selectedLibraryDifficulty: 'easy',
  },
});

describe('store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setState(makeState(), { saveGameToStorage: false });
  });

  describe('getState', () => {
    it('returns current state', () => {
      expect(getState().user).toBeNull();
      expect(getState().ui.theme).toBe('light');
    });

    it('reflects updated state after setState', () => {
      setState(
        { ...makeState(), isLoading: true },
        { saveGameToStorage: false }
      );
      expect(getState().isLoading).toBe(true);
    });
  });

  describe('setState', () => {
    it('updates the state object', () => {
      setState({ ...makeState(), gameId: 99 }, { saveGameToStorage: false });
      expect(getState().gameId).toBe(99);
    });

    it('calls saveActiveSession when saveGameToStorage is not false', () => {
      setState(makeState());
      expect(saveActiveSession).toHaveBeenCalledOnce();
    });

    it('does not call saveActiveSession when saveGameToStorage is false', () => {
      setState(makeState(), { saveGameToStorage: false });
      expect(saveActiveSession).not.toHaveBeenCalled();
    });

    it('updates nested ui state correctly', () => {
      setState(
        { ...makeState(), ui: { ...makeState().ui, theme: 'dark' } },
        { saveGameToStorage: false }
      );
      expect(getState().ui.theme).toBe('dark');
    });

    it('updates user field', () => {
      const user = { id: '1', email: 'a@b.com', created_at: '' };
      setState({ ...makeState(), user }, { saveGameToStorage: false });
      expect(getState().user).toEqual(user);
    });
  });

  describe('subscribe / unsubscribe', () => {
    it('returns an unsubscribe function', () => {
      const unsub = subscribe(vi.fn());
      expect(typeof unsub).toBe('function');
      unsub();
    });

    it('listener is called on state update', () => {
      const listener = vi.fn();
      const unsub = subscribe(listener);
      setState(makeState(), { saveGameToStorage: false });
      unsub();
      expect(listener).toHaveBeenCalledOnce();
    });

    it('listener receives the updated state', () => {
      const listener = vi.fn();
      const unsub = subscribe(listener);
      setState(
        { ...makeState(), isLoading: true },
        { saveGameToStorage: false }
      );
      unsub();
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ isLoading: true })
      );
    });

    it('unsubscribe stops listener from receiving updates', () => {
      const listener = vi.fn();
      const unsub = subscribe(listener);
      unsub();
      setState(makeState(), { saveGameToStorage: false });
      expect(listener).not.toHaveBeenCalled();
    });

    it('multiple listeners all receive updates', () => {
      const a = vi.fn();
      const b = vi.fn();
      const unsubA = subscribe(a);
      const unsubB = subscribe(b);
      setState(makeState(), { saveGameToStorage: false });
      unsubA();
      unsubB();
      expect(a).toHaveBeenCalledOnce();
      expect(b).toHaveBeenCalledOnce();
    });

    it('unsubscribing one listener does not affect others', () => {
      const a = vi.fn();
      const b = vi.fn();
      const unsubA = subscribe(a);
      const unsubB = subscribe(b);
      unsubA();
      setState(makeState(), { saveGameToStorage: false });
      unsubB();
      expect(a).not.toHaveBeenCalled();
      expect(b).toHaveBeenCalledOnce();
    });
  });
});
