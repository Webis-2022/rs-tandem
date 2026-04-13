import type { AppState } from '../types';

const ACTIVE_GAME_KEY = 'activeGame';

export function saveActiveGame(game: AppState['game']): void {
  localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(game));
}

export function getActiveGame(): AppState['game'] | null {
  const raw = localStorage.getItem(ACTIVE_GAME_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppState['game'];
  } catch {
    return null;
  }
}

export function clearActiveGame(): void {
  localStorage.removeItem(ACTIVE_GAME_KEY);
}
