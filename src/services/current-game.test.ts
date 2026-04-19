import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getLatestGameByUser: vi.fn(),
}));

vi.mock('./api/get-games', () => ({
  getLatestGameByUser: mocks.getLatestGameByUser,
}));

import { resolveCurrentGame } from './current-game';

describe('current-game', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns no-game when no record found', async () => {
    mocks.getLatestGameByUser.mockResolvedValue(null);

    await expect(resolveCurrentGame('user-1')).resolves.toEqual({
      status: 'no-game',
    });
  });

  it('returns success for unfinished game', async () => {
    mocks.getLatestGameByUser.mockResolvedValue({
      id: 10,
      achievement: null,
    });

    await expect(resolveCurrentGame('user-1')).resolves.toEqual({
      status: 'success',
      gameId: 10,
    });
  });

  it('returns error when request fails', async () => {
    mocks.getLatestGameByUser.mockRejectedValue(new Error('boom'));

    await expect(resolveCurrentGame('user-1')).resolves.toEqual({
      status: 'error',
    });
  });
});
