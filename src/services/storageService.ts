import type { AppState } from '../types';

const ACTIVE_GAME_KEY = 'activeGame'; // 'activeGame' - имя ключа в localStorage

// возьми тип поля game из типа AppState
export function saveActiveGame(game: AppState['game']): void {
  localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(game)); // localStorage умеет хранить только строки
}

export function getActiveGame(): AppState['game'] | null {
  const raw = localStorage.getItem(ACTIVE_GAME_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppState['game']; // снова делаем из строки объект
  } catch {
    return null;
  }
}

// понадобится при logout, после завершения игры и тп
export function clearActiveGame(): void {
  localStorage.removeItem(ACTIVE_GAME_KEY);
}
