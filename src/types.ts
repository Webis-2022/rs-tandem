export const ROUTES = {
  Landing: '/landing',
  Login: '/login',
  Dashboard: '/dashboard',
  Library: '/library',
  Practice: '/practice',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export type AuthState = {
  isAuthenticated: boolean;
  login?: string;
};

type User = {
  id: string;
  name: string;
  token: string;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

type GameState = {
  topicId: number;
  difficulty: Difficulty | '';
  round: number;
  score: number;
  usedHints: string[];
  wrongAnswers: number[];
  questions: string[];
};

export type AppState = {
  user: User | null;
  game: GameState;
  isLoading: boolean;
};

export type Question = {
  level: string;
  answer: string;
  options: string[];
  question: string;
};
