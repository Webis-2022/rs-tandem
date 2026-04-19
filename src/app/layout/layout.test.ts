import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTES } from '../../types';
import type { AppState } from '../../types';

const mocks = vi.hoisted(() => ({
  getState: vi.fn(),
  subscribe: vi.fn().mockReturnValue(() => {}),
  toggleTheme: vi.fn(),
  toggleNav: vi.fn(),
  closeNav: vi.fn(),
}));

vi.mock('../state/store', () => ({
  getState: mocks.getState,
  subscribe: mocks.subscribe,
}));

vi.mock('../state/actions', () => ({
  toggleTheme: mocks.toggleTheme,
  toggleNav: mocks.toggleNav,
  closeNav: mocks.closeNav,
}));

import { createLayout } from './layout';

const buildState = (
  uiOverrides: Partial<AppState['ui']> = {},
  user: AppState['user'] = null
): AppState => ({
  user,
  gameId: null,
  game: {
    topicId: 1,
    difficulty: null,
    round: 1,
    score: 0,
    usedHints: { '50/50': 0, 'call a friend': 0, "i don't know": 0 },
    wrongAnswers: [],
    wrongAnswersCounter: 0,
    questions: [],
    gameMode: 'game',
  },
  isLoading: false,
  topics: [],
  ui: {
    theme: 'light',
    activeRoute: ROUTES.Landing,
    isNavOpen: false,
    onboardingSeen: false,
    selectedLibraryDifficulty: 'easy',
    ...uiOverrides,
  },
});

describe('createLayout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    mocks.subscribe.mockReturnValue(() => {});
    mocks.getState.mockReturnValue(buildState());
  });

  describe('return value', () => {
    it('returns root HTMLElement', () => {
      const { root } = createLayout();
      expect(root).toBeInstanceOf(HTMLElement);
    });

    it('returns outlet HTMLElement', () => {
      const { outlet } = createLayout();
      expect(outlet).toBeInstanceOf(HTMLElement);
    });

    it('outlet has id "main-content"', () => {
      const { outlet } = createLayout();
      expect(outlet.id).toBe('main-content');
    });
  });

  describe('structural elements', () => {
    it('renders skip link pointing to #main-content', () => {
      const { root } = createLayout();
      document.body.append(root);
      const skipLink = root.querySelector('.layout-skip-link');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink?.getAttribute('href')).toBe('#main-content');
    });

    it('renders brand link with text "DOMinator"', () => {
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('.layout-brand')?.textContent).toBe(
        'DOMinator'
      );
    });

    it('renders nav with aria-label "Primary navigation"', () => {
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('nav')?.getAttribute('aria-label')).toBe(
        'Primary navigation'
      );
    });

    it('renders footer with RS School link', () => {
      const { root } = createLayout();
      document.body.append(root);
      expect(
        root.querySelector('.layout-footer-school-link')?.getAttribute('href')
      ).toBe('https://rs.school/');
    });

    it('renders 3 author links in footer', () => {
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelectorAll('.layout-footer-author-link')).toHaveLength(
        3
      );
    });
  });

  describe('nav items by auth state', () => {
    it('shows Login and hides authed-only links for guest', () => {
      mocks.getState.mockReturnValue(buildState({}, null));
      const { root } = createLayout();
      document.body.append(root);
      const texts = Array.from(root.querySelectorAll('.layout-nav-link')).map(
        (l) => l.textContent
      );
      expect(texts).toContain('Login');
      expect(texts).not.toContain('Start Practice');
      expect(texts).not.toContain('Results');
      expect(texts).not.toContain('Logout');
    });

    it('shows authed links and hides Login for logged in user', () => {
      const user = { id: '1', email: 'user@test.com', created_at: '' };
      mocks.getState.mockReturnValue(buildState({}, user));
      const { root } = createLayout();
      document.body.append(root);
      const texts = Array.from(root.querySelectorAll('.layout-nav-link')).map(
        (l) => l.textContent
      );
      expect(texts).toContain('Start Practice');
      expect(texts).toContain('Results');
      expect(texts).toContain('Logout');
      expect(texts).not.toContain('Login');
    });
  });

  describe('active route highlighting', () => {
    it('active Dashboard link has is-active class', () => {
      const user = { id: '1', email: 'u@t.com', created_at: '' };
      mocks.getState.mockReturnValue(
        buildState({ activeRoute: ROUTES.Dashboard }, user)
      );
      const { root } = createLayout();
      document.body.append(root);
      const activeLink = root.querySelector('.layout-nav-link.is-active');
      expect(activeLink?.textContent).toBe('Results');
    });

    it('active link has aria-current="page"', () => {
      const user = { id: '1', email: 'u@t.com', created_at: '' };
      mocks.getState.mockReturnValue(
        buildState({ activeRoute: ROUTES.Library }, user)
      );
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('[aria-current="page"]')?.textContent).toBe(
        'Start Practice'
      );
    });

    it('no link has is-active when no route matches nav items', () => {
      mocks.getState.mockReturnValue(
        buildState({ activeRoute: ROUTES.Landing })
      );
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('.layout-nav-link.is-active')).toBeNull();
    });
  });

  describe('theme button', () => {
    it('shows "Theme: Light" for light theme', () => {
      mocks.getState.mockReturnValue(buildState({ theme: 'light' }));
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('.layout-theme-switcher')?.textContent).toBe(
        'Theme: Light'
      );
    });

    it('shows "Theme: Dark" for dark theme', () => {
      mocks.getState.mockReturnValue(buildState({ theme: 'dark' }));
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('.layout-theme-switcher')?.textContent).toBe(
        'Theme: Dark'
      );
    });

    it('has aria-pressed="true" for dark theme', () => {
      mocks.getState.mockReturnValue(buildState({ theme: 'dark' }));
      const { root } = createLayout();
      document.body.append(root);
      expect(
        root
          .querySelector('.layout-theme-switcher')
          ?.getAttribute('aria-pressed')
      ).toBe('true');
    });

    it('has aria-pressed="false" for light theme', () => {
      mocks.getState.mockReturnValue(buildState({ theme: 'light' }));
      const { root } = createLayout();
      document.body.append(root);
      expect(
        root
          .querySelector('.layout-theme-switcher')
          ?.getAttribute('aria-pressed')
      ).toBe('false');
    });

    it('calls toggleTheme when clicked', () => {
      const { root } = createLayout();
      document.body.append(root);
      (
        root.querySelector('.layout-theme-switcher') as HTMLButtonElement
      ).click();
      expect(mocks.toggleTheme).toHaveBeenCalledOnce();
    });
  });

  describe('nav open state', () => {
    it('nav does not have is-open class when isNavOpen is false', () => {
      mocks.getState.mockReturnValue(buildState({ isNavOpen: false }));
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('#primary-navigation')).not.toHaveClass(
        'is-open'
      );
    });

    it('nav has is-open class when isNavOpen is true', () => {
      mocks.getState.mockReturnValue(buildState({ isNavOpen: true }));
      const { root } = createLayout();
      document.body.append(root);
      expect(root.querySelector('#primary-navigation')).toHaveClass('is-open');
    });

    it('aria-expanded is "true" when nav is open', () => {
      mocks.getState.mockReturnValue(buildState({ isNavOpen: true }));
      const { root } = createLayout();
      document.body.append(root);
      expect(
        root.querySelector('.layout-nav-toggle')?.getAttribute('aria-expanded')
      ).toBe('true');
    });

    it('aria-expanded is "false" when nav is closed', () => {
      mocks.getState.mockReturnValue(buildState({ isNavOpen: false }));
      const { root } = createLayout();
      document.body.append(root);
      expect(
        root.querySelector('.layout-nav-toggle')?.getAttribute('aria-expanded')
      ).toBe('false');
    });

    it('menu toggle button calls toggleNav on click', () => {
      const { root } = createLayout();
      document.body.append(root);
      (root.querySelector('.layout-nav-toggle') as HTMLButtonElement).click();
      expect(mocks.toggleNav).toHaveBeenCalledOnce();
    });
  });
});
