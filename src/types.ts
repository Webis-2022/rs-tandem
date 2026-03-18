export const ROUTES = {
  Landing: '/landing',
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
export type ModalOptions = {
  title?: string;
  message: string;
  showConfirm?: boolean; // if true, show both Confirm and Cancel buttons
  confirmText?: string;
  cancelText?: string;
};

export type ModalResult = {
  confirmed: boolean;
};
