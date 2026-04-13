import type { AppState, PersistedActiveSession } from '../types';

const ACTIVE_SESSION_KEY = 'activeGame';

export function saveActiveSession(session: PersistedActiveSession): void {
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
}

export function getActiveSession(): PersistedActiveSession | null {
  const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PersistedActiveSession | AppState['game'];
    if (parsed && typeof parsed === 'object' && 'game' in parsed) {
      return parsed as PersistedActiveSession;
    }

    return {
      gameId: null,
      game: parsed,
    };
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function saveActiveGame(game: AppState['game']): void {
  saveActiveSession({
    gameId: null,
    game,
  });
}

export function getActiveGame(): AppState['game'] | null {
  return getActiveSession()?.game ?? null;
}

export function clearActiveGame(): void {
  clearActiveSession();
}
