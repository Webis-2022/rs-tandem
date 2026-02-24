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
