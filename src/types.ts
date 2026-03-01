export const ROUTES = {
  Landing: '/landing',
  Login: '/login',
  Dashboard: '/dashboard',
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

type GameState = {
  currentQuestionIndex: number;
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
