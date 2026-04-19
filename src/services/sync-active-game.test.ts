import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  getState: vi.fn(),
  upsertActiveSession: vi.fn(),
  deleteActiveGame: vi.fn(),
}));

vi.mock('./auth-service', () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock('../app/state/store', () => ({
  getState: mocks.getState,
}));

vi.mock('./api/active-games', () => ({
  upsertActiveSession: mocks.upsertActiveSession,
  deleteActiveGame: mocks.deleteActiveGame,
}));

import {
  removeActiveGameFromServer,
  syncActiveGameToServer,
} from './sync-active-game';

describe('sync-active-game', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getState.mockReturnValue({
      gameId: 1,
      game: { topicId: 1, difficulty: 'easy', round: 1 },
    });
  });

  it('does nothing without user', async () => {
    mocks.getCurrentUser.mockReturnValue(null);

    await syncActiveGameToServer();

    expect(mocks.upsertActiveSession).not.toHaveBeenCalled();
  });

  it('syncs active game for current user', async () => {
    mocks.getCurrentUser.mockReturnValue({ id: 'user-1' });

    await syncActiveGameToServer();

    expect(mocks.upsertActiveSession).toHaveBeenCalled();
  });

  it('removes active game for current user', async () => {
    mocks.getCurrentUser.mockReturnValue({ id: 'user-1' });

    await removeActiveGameFromServer();

    expect(mocks.deleteActiveGame).toHaveBeenCalledWith('user-1');
  });
});
