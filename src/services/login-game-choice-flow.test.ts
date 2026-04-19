import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  resolveCurrentGame: vi.fn(),
  showModal: vi.fn(),
}));

vi.mock('./current-game', () => ({
  resolveCurrentGame: mocks.resolveCurrentGame,
}));

vi.mock('../components/ui/modal/modal', () => ({
  showModal: mocks.showModal,
}));

import { runLoginGameChoiceFlow } from './login-game-choice-flow';

describe('login-game-choice-flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns no-game when there is no current game', async () => {
    mocks.resolveCurrentGame.mockResolvedValue({ status: 'no-game' });

    await expect(runLoginGameChoiceFlow('user-1')).resolves.toEqual({
      status: 'no-game',
    });
  });

  it('returns continued when user chooses continue', async () => {
    mocks.resolveCurrentGame.mockResolvedValue({
      status: 'success',
      gameId: 1,
    });
    mocks.showModal.mockResolvedValue({ confirmed: true });

    await expect(runLoginGameChoiceFlow('user-1')).resolves.toEqual({
      status: 'continued',
      gameId: 1,
    });
  });

  it('returns start-new when user chooses new game', async () => {
    mocks.resolveCurrentGame.mockResolvedValue({
      status: 'success',
      gameId: 1,
    });
    mocks.showModal.mockResolvedValue({ confirmed: false });

    await expect(runLoginGameChoiceFlow('user-1')).resolves.toEqual({
      status: 'start-new',
    });
  });
});
