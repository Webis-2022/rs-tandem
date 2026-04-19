import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTES } from '../../types';
import type { AppState } from '../../types';

vi.mock('../../services/sync-active-game', () => ({
  syncActiveGameToServer: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../services/storage-service', () => ({
  saveActiveSession: vi.fn(),
  clearActiveSession: vi.fn(),
}));

import { getState, setState, initialGameState } from './store';
import {
  applyTheme,
  setTheme,
  toggleTheme,
  setActiveRoute,
  setNavOpen,
  toggleNav,
  closeNav,
  markOnboardingSeen,
} from './actions';

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

describe('UI Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setState(makeState(), { saveGameToStorage: false });
    delete document.documentElement.dataset.theme;
  });

  describe('applyTheme', () => {
    it('sets data-theme="dark" on documentElement', () => {
      applyTheme('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('sets data-theme="light" on documentElement', () => {
      applyTheme('light');
      expect(document.documentElement.dataset.theme).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('updates state.ui.theme to dark', () => {
      setTheme('dark');
      expect(getState().ui.theme).toBe('dark');
    });

    it('applies the theme to the DOM', () => {
      setTheme('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('switches back from dark to light', () => {
      setTheme('dark');
      setTheme('light');
      expect(getState().ui.theme).toBe('light');
      expect(document.documentElement.dataset.theme).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      toggleTheme();
      expect(getState().ui.theme).toBe('dark');
    });

    it('toggles from dark to light', () => {
      setState(
        { ...makeState(), ui: { ...makeState().ui, theme: 'dark' } },
        { saveGameToStorage: false }
      );
      toggleTheme();
      expect(getState().ui.theme).toBe('light');
    });

    it('applies toggled theme to DOM', () => {
      toggleTheme();
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });

  describe('setActiveRoute', () => {
    it('updates activeRoute in state', () => {
      setActiveRoute(ROUTES.Dashboard);
      expect(getState().ui.activeRoute).toBe(ROUTES.Dashboard);
    });

    it('closes nav when route changes', () => {
      setState(
        { ...makeState(), ui: { ...makeState().ui, isNavOpen: true } },
        { saveGameToStorage: false }
      );
      setActiveRoute(ROUTES.Library);
      expect(getState().ui.isNavOpen).toBe(false);
    });

    it('works for all route values', () => {
      setActiveRoute(ROUTES.Practice);
      expect(getState().ui.activeRoute).toBe(ROUTES.Practice);
    });
  });

  describe('setNavOpen', () => {
    it('sets isNavOpen to true', () => {
      setNavOpen(true);
      expect(getState().ui.isNavOpen).toBe(true);
    });

    it('sets isNavOpen to false', () => {
      setNavOpen(true);
      setNavOpen(false);
      expect(getState().ui.isNavOpen).toBe(false);
    });
  });

  describe('toggleNav', () => {
    it('opens a closed nav', () => {
      toggleNav();
      expect(getState().ui.isNavOpen).toBe(true);
    });

    it('closes an open nav', () => {
      setState(
        { ...makeState(), ui: { ...makeState().ui, isNavOpen: true } },
        { saveGameToStorage: false }
      );
      toggleNav();
      expect(getState().ui.isNavOpen).toBe(false);
    });
  });

  describe('closeNav', () => {
    it('sets isNavOpen to false when open', () => {
      setState(
        { ...makeState(), ui: { ...makeState().ui, isNavOpen: true } },
        { saveGameToStorage: false }
      );
      closeNav();
      expect(getState().ui.isNavOpen).toBe(false);
    });

    it('is a no-op when nav is already closed', () => {
      closeNav();
      expect(getState().ui.isNavOpen).toBe(false);
    });
  });

  describe('markOnboardingSeen', () => {
    it('sets onboardingSeen to true in state', () => {
      expect(getState().ui.onboardingSeen).toBe(false);
      markOnboardingSeen();
      expect(getState().ui.onboardingSeen).toBe(true);
    });

    it('does not change other ui fields', () => {
      markOnboardingSeen();
      expect(getState().ui.theme).toBe('light');
      expect(getState().ui.activeRoute).toBe(ROUTES.Landing);
      expect(getState().ui.isNavOpen).toBe(false);
    });
  });
});
