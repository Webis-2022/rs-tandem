import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '../types';

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  refreshSession: vi.fn(),
  onAuthStateChange: vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  }),
  getState: vi.fn(),
  setState: vi.fn(),
}));

vi.mock('./supabase-client', () => ({
  supabase: {
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      signOut: mocks.signOut,
      refreshSession: mocks.refreshSession,
      onAuthStateChange: mocks.onAuthStateChange,
    },
  },
}));

vi.mock('../app/state/store', () => ({
  getState: mocks.getState,
  setState: mocks.setState,
}));

import { getCurrentUser, login, logout, register } from './auth-service';

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  created_at: '2026-01-01T00:00:00Z',
};

const makeState = (user: User | null = null) => ({
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
    activeRoute: '/',
    isNavOpen: false,
    onboardingSeen: false,
    selectedLibraryDifficulty: 'easy',
  },
});

const makeSupabaseSession = (user: User) => ({
  access_token: 'token-abc',
  refresh_token: 'refresh-abc',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    user_metadata: {},
  },
});

describe('auth-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getState.mockReturnValue(makeState(null));
    mocks.setState.mockImplementation(() => {});
  });

  describe('getCurrentUser', () => {
    it('returns user from store state when present', () => {
      mocks.getState.mockReturnValue(makeState(mockUser));
      const result = getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('returns null when store user is null and localStorage has no user', () => {
      mocks.getState.mockReturnValue(makeState(null));
      const result = getCurrentUser();
      expect(result).toBeNull();
    });

    it('does not call setState when user is found in store', () => {
      mocks.getState.mockReturnValue(makeState(mockUser));
      getCurrentUser();
      expect(mocks.setState).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('calls signInWithPassword with correct credentials', async () => {
      const session = makeSupabaseSession(mockUser);
      mocks.signInWithPassword.mockResolvedValue({
        data: { user: session.user, session },
        error: null,
      });
      mocks.getState.mockReturnValue(makeState(null));

      await login('test@example.com', 'password123');

      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('returns user on successful login', async () => {
      const session = makeSupabaseSession(mockUser);
      mocks.signInWithPassword.mockResolvedValue({
        data: { user: session.user, session },
        error: null,
      });
      mocks.getState.mockReturnValue(makeState(null));

      const result = await login('test@example.com', 'password123');

      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
    });

    it('updates store state with user on successful login', async () => {
      const session = makeSupabaseSession(mockUser);
      mocks.signInWithPassword.mockResolvedValue({
        data: { user: session.user, session },
        error: null,
      });
      mocks.getState.mockReturnValue(makeState(null));

      await login('test@example.com', 'password123');

      expect(mocks.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({ id: mockUser.id }),
        })
      );
    });

    it('throws AuthError when supabase returns an error', async () => {
      mocks.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { code: 'invalid_credentials', message: 'Invalid credentials' },
      });

      await expect(login('wrong@example.com', 'wrong')).rejects.toMatchObject({
        code: 'invalid_credentials',
      });
    });

    it('throws AuthError when supabase returns no session', async () => {
      mocks.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      await expect(login('test@example.com', 'pass')).rejects.toMatchObject({
        code: 'login_failed',
      });
    });
  });

  describe('register', () => {
    it('calls signUp with correct credentials', async () => {
      const session = makeSupabaseSession(mockUser);
      mocks.signUp.mockResolvedValue({
        data: { user: session.user, session },
        error: null,
      });
      mocks.getState.mockReturnValue(makeState(null));

      await register('test@example.com', 'password123');

      expect(mocks.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('returns user on successful registration', async () => {
      const session = makeSupabaseSession(mockUser);
      mocks.signUp.mockResolvedValue({
        data: { user: session.user, session },
        error: null,
      });
      mocks.getState.mockReturnValue(makeState(null));

      const result = await register('test@example.com', 'password123');

      expect(result.email).toBe(mockUser.email);
    });

    it('throws AuthError on registration failure', async () => {
      mocks.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { code: 'email_taken', message: 'Email already in use' },
      });

      await expect(register('taken@example.com', 'pass')).rejects.toMatchObject(
        {
          code: 'email_taken',
        }
      );
    });
  });

  describe('logout', () => {
    it('calls supabase signOut', async () => {
      mocks.signOut.mockResolvedValue({ error: null });
      mocks.getState.mockReturnValue(makeState(mockUser));

      await logout();

      expect(mocks.signOut).toHaveBeenCalledOnce();
    });

    it('clears user from store state', async () => {
      mocks.signOut.mockResolvedValue({ error: null });
      mocks.getState.mockReturnValue(makeState(mockUser));

      await logout();

      expect(mocks.setState).toHaveBeenCalledWith(
        expect.objectContaining({ user: null })
      );
    });

    it('clears state even when signOut fails', async () => {
      mocks.signOut.mockResolvedValue({
        error: { code: 'network_error', message: 'No connection' },
      });
      mocks.getState.mockReturnValue(makeState(mockUser));

      await logout();

      expect(mocks.setState).toHaveBeenCalledWith(
        expect.objectContaining({ user: null })
      );
    });
  });
});
