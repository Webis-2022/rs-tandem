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

export type UITheme = 'light' | 'dark';

export type UIState = {
  theme: UITheme;
  activeRoute: RoutePath;
  isNavOpen: boolean;
  onboardingSeen: boolean;
  selectedLibraryDifficulty: Difficulty;
};

type GameState = {
  topicId: number;
  difficulty: Difficulty | null;
  round: number;
  score: number;
  usedHints: HintCounter | undefined;
  wrongAnswers: Question[];
  wrongAnswersCounter: number;
  questions: Question[];
  gameMode: string;
};

export type GameResult = {
  game_id: number;
  user_id: string;
  score: number;
  topic: string;
  difficulty: string;
  topic_id: number;
  used_hints: string;
  wrong_answers_count: number;
};

export type AppState = {
  gameId: number | null;
  user: User | null;
  game: GameState;
  isLoading: boolean;
  topics: Topic[];
  ui: UIState;
};

export const HINT_KEYS = ['50/50', 'call a friend', "i don't know"] as const;
export type HintKey = (typeof HINT_KEYS)[number];
export type HintCounter = Record<HintKey, number>;

export type Question = {
  level: Difficulty;
  answer: string;
  options: string[];
  question: string;
  explanation: string;
  isCorrected?: boolean;
};

export type GameData = {
  id: number;
  created_at: string;
  user_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  achievement: string;
};

export type Topic = {
  id: number;
  name: string;
};

// Modal types
/**
 * Options for rendering a modal dialog.
 */
export type ModalOptions = {
  /** Optional title rendered in modal header. */
  title?: string;
  /** Plain text content for modal body. Rendered via textContent. */
  messageText?: string;
  /** Optional bold part appended after messageText. Rendered via textContent inside <b>. */
  messageStrongText?: string;
  /**
   * Trusted HTML content for modal body.
   * Use buildModalParagraphsHtml([...]) for paragraph-based text.
   */
  messageHtml?: string;
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
