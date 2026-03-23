export const ROUTES = {
  Landing: '/',
  Login: '/login',
  Dashboard: '/dashboard',
  Library: '/library',
  Practice: '/practice',
  Logout: '/logout',
  NotFound: '/404',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export type AuthState = {
  isAuthenticated: boolean;
  login?: string;
};

// User types for Supabase Auth
export type User = {
  id: string;
  email: string;
  created_at: string;
  // optional profile data
  name?: string;
  avatar_url?: string;
};

// Session types for JWT token management
export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // timestamp in seconds
  user: User;
};

// Error types for auth operations
export type AuthError = {
  code: string;
  message: string;
  status?: number;
};

// Auth callback types for state change listeners
export type AuthChangeCallback = (session: AuthSession | null) => void;

export type Difficulty = 'easy' | 'medium' | 'hard';

type GameState = {
  topicId: number;
  difficulty: Difficulty | '';
  round: number;
  score: number;
  usedHints: string[];
  wrongAnswers: Question[];
  questions: Question[];
  gameMode: string;
};

export type AppState = {
  user: User | null;
  game: GameState;
  isLoading: boolean;
};

export type Question = {
  level: Difficulty;
  answer: string;
  options: string[];
  question: string;
  explanation: string;
};

// Modal types
/**
 * Options for rendering a modal dialog.
 */
export type ModalOptions = {
  /** Optional title rendered in modal header. */
  title?: string;
  /**
   * Trusted HTML content for modal body.
   * Use buildModalParagraphsHtml([...]) for paragraph-based text.
   */
  messageHtml: string;
  /** If true, render Cancel + Confirm buttons; otherwise render single OK button. */
  showConfirm?: boolean;
  /** Confirm button label in confirm mode. */
  confirmText?: string;
  /** Cancel button label in confirm mode. */
  cancelText?: string;
};

export type ModalResult = {
  confirmed: boolean;
};
