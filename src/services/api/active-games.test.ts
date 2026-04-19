import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PersistedActiveSession } from '../../types';

const mocks = vi.hoisted(() => ({
  maybeSingle: vi.fn(),
  selectEq: vi.fn(),
  select: vi.fn(),
  upsert: vi.fn(),
  deleteEq: vi.fn(),
  delete: vi.fn(),
  from: vi.fn(),
  withApiErrorHandling: vi.fn(),
}));

vi.mock('../supabase-client.ts', () => ({
  supabase: {
    from: mocks.from,
  },
}));

vi.mock('../../shared/helpers/request-error.ts', () => ({
  withApiErrorHandling: mocks.withApiErrorHandling,
}));

import {
  deleteActiveGame,
  getActiveSessionByUser,
  upsertActiveSession,
} from './active-games';

describe('active-games', () => {
  const session = {
    gameId: 1,
    game: {
      topicId: 2,
      difficulty: 'easy',
      round: 1,
    },
  } as unknown as PersistedActiveSession;

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.withApiErrorHandling.mockImplementation(
      async (callback: () => Promise<unknown>) => callback()
    );

    mocks.select.mockReturnValue({
      eq: mocks.selectEq,
    });

    mocks.selectEq.mockReturnValue({
      maybeSingle: mocks.maybeSingle,
    });

    mocks.delete.mockReturnValue({
      eq: mocks.deleteEq,
    });

    mocks.from.mockImplementation((table: string) => {
      if (table === 'active_games') {
        return {
          select: mocks.select,
          upsert: mocks.upsert,
          delete: mocks.delete,
        };
      }

      return {};
    });
  });

  it('returns active session from database', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: {
        game_id: 1,
        game_state: session.game,
      },
      error: null,
    });

    const result = await getActiveSessionByUser('user-1');

    expect(result).toEqual(session);
  });

  it('returns null when there is no game_state', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });

    const result = await getActiveSessionByUser('user-1');

    expect(result).toBeNull();
  });

  it('throws when getActiveSessionByUser gets supabase error', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: null,
      error: new Error('boom'),
    });

    await expect(getActiveSessionByUser('user-1')).rejects.toThrow('boom');
  });

  it('upserts active session', async () => {
    mocks.upsert.mockResolvedValue({
      error: null,
    });

    await upsertActiveSession('user-1', session);

    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        game_id: 1,
        game_state: session.game,
        updated_at: expect.any(String),
      }),
      { onConflict: 'user_id' }
    );
  });

  it('deletes active game', async () => {
    mocks.deleteEq.mockResolvedValue({ error: null });

    await deleteActiveGame('user-1');

    expect(mocks.delete).toHaveBeenCalled();
    expect(mocks.deleteEq).toHaveBeenCalledWith('user_id', 'user-1');
  });
});
