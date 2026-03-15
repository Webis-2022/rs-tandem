import { supabase } from './supabaseClient';
import type {
  User,
  AuthSession,
  AuthError,
  AuthChangeCallback,
} from '../types';
import { state, notify } from '../app/state/store';

// Storage keys for localStorage persistence
const STORAGE_KEYS = {
  SESSION: 'tandem:session',
  USER: 'tandem:user',
} as const;

// Timer for automatic token refresh
let refreshTimer: number | null = null;

/**
 * Convert Supabase auth error to our AuthError type
 */
function toAuthError(error: unknown): AuthError {
  if (error && typeof error === 'object' && 'code' in error) {
    return {
      code: (error as { code: string }).code,
      message: (error as { message?: string }).message || 'Unknown error',
      status: (error as { status?: number }).status,
    };
  }
  return {
    code: 'unknown_error',
    message: error instanceof Error ? error.message : 'Unknown error',
  };
}

/**
 * Convert Supabase User to our User type
 */
function toUser(supabaseUser: {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: Record<string, unknown>;
}): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    created_at: supabaseUser.created_at,
    name: supabaseUser.user_metadata?.name as string | undefined,
    avatar_url: supabaseUser.user_metadata?.avatar_url as string | undefined,
  };
}

/**
 * Save session to localStorage
 */
function saveSession(session: AuthSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session.user));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

/**
 * Load session from localStorage
 */
function loadSession(): AuthSession | null {
  try {
    const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionData) return null;
    return JSON.parse(sessionData) as AuthSession;
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
    return null;
  }
}

/**
 * Clear session from localStorage
 */
function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
  }
}

/**
 * Schedule automatic token refresh before expiration
 */
function scheduleTokenRefresh(expiresAt: number): void {
  // Clear existing timer
  if (refreshTimer !== null) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const now = Math.floor(Date.now() / 1000);
  const timeUntilRefresh = (expiresAt - now - 5 * 60) * 1000; // 5 min before expiry

  if (timeUntilRefresh > 0) {
    refreshTimer = window.setTimeout(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Auto refresh failed:', error);
        await logout();
      }
    }, timeUntilRefresh);
  }
}

/**
 * Create AuthSession from Supabase session data
 * Throws if session or user data is invalid
 */
function createSessionFromSupabase(supabaseSession: {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
    created_at: string;
    user_metadata?: Record<string, unknown>;
  };
}): AuthSession {
  const user = toUser(supabaseSession.user);
  return {
    access_token: supabaseSession.access_token,
    refresh_token: supabaseSession.refresh_token,
    expires_at: supabaseSession.expires_at || 0,
    user,
  };
}

/**
 * Persist session to localStorage and state, schedule auto-refresh
 */
function persistSession(session: AuthSession): void {
  saveSession(session);
  state.user = session.user;
  notify();
  scheduleTokenRefresh(session.expires_at);
}

/**
 * Register a new user with email and password
 */
export async function register(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw toAuthError(error);
    if (!data.user || !data.session) {
      throw toAuthError({
        code: 'registration_failed',
        message: 'Registration failed. Please try again.',
      });
    }

    const session = createSessionFromSupabase(data.session);
    persistSession(session);

    return session.user;
  } catch (error) {
    throw toAuthError(error);
  }
}

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw toAuthError(error);
    if (!data.user || !data.session) {
      throw toAuthError({
        code: 'login_failed',
        message: 'Login failed. Please try again.',
      });
    }

    const session = createSessionFromSupabase(data.session);
    persistSession(session);

    return session.user;
  } catch (error) {
    throw toAuthError(error);
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  try {
    // Clear refresh timer
    if (refreshTimer !== null) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signOut error:', error);
    }
  } finally {
    // Always clear local state, even if Supabase call fails
    clearSession();
    state.user = null;
    notify();
  }
}

/**
 * Refresh the current session token
 */
export async function refreshToken(): Promise<AuthSession | null> {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw toAuthError(error);
    if (!data.session) return null;

    const session = createSessionFromSupabase(data.session);
    persistSession(session);

    return session;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await logout();
    return null;
  }
}

/**
 * Validate if current token is valid
 * Returns true if valid, false otherwise
 */
export async function validateToken(): Promise<boolean> {
  try {
    const session = loadSession();
    if (!session) return false;

    const now = Math.floor(Date.now() / 1000);

    // Check if token is expired
    if (session.expires_at && session.expires_at < now) {
      // Try to refresh
      const newSession = await refreshToken();
      return newSession !== null;
    }

    // Token is still valid
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

/**
 * Get current user from state or localStorage
 */
export function getCurrentUser(): User | null {
  // First check global state
  if (state.user) return state.user;

  // Try to restore from localStorage
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;

    const user = JSON.parse(userData) as User;
    state.user = user;
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function
 */
export function onAuthChange(callback: AuthChangeCallback): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      const authSession = createSessionFromSupabase(session);
      persistSession(authSession);
      callback(authSession);
    } else {
      clearSession();
      state.user = null;
      notify();
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}

// Export as default object for convenience
export const authService = {
  register,
  login,
  logout,
  refreshToken,
  validateToken,
  getCurrentUser,
  onAuthChange,
};
