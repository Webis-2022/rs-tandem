import { beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { getGameResult } from '../../services/api/get-game-result';
import { getGames } from '../../services/api/get-games';

vi.mock('../../services/api/get-game-result', () => ({
  getGameResult: vi.fn(),
}));

vi.mock('../../services/api/get-games', () => ({
  getGames: vi.fn(),
}));

const mockGameResult = [
  {
    game_id: 226,
    user_id: 'd6c58d3c-e6ea-405c-87d7-28e698ebc457',
    score: 3,
    topic: 'Semantic Tags',
    difficulty: 'easy',
    topic_id: 2,
    used_hints: '{"50/50":0,"call a friend":0,"i don\'t know":0}',
    wrong_answers_count: 2,
  },
];

const mockGames = [
  {
    id: 226,
    created_at: '2026-04-08 19:40:16.976313+00',
    user_id: 'd6c58d3c-e6ea-405c-87d7-28e698ebc457',
    difficulty: 'easy',
    achievement: '/img/html-and-css-guru.png',
  },
];

import { createDashboardView } from './dashboard';

describe('createDashboardView', () => {
  beforeEach(() => {
    vi.mocked(getGameResult).mockResolvedValue(mockGameResult);
    vi.mocked(getGames).mockResolvedValue(mockGames);
    const section = createDashboardView();
    document.body.append(section);
  });
  test('selects level difficulty and insert games into game selector', async () => {
    await waitFor(() => {
      expect(document.querySelector('.difficulty-selector')).not.toBeNull();
    });
    await waitFor(() => {
      expect(document.querySelector('.game-selector')).not.toBeNull();
    });

    const difficultySelector = document.querySelector('.difficulty-selector');
    const gameSelector = document.querySelector('.game-selector');

    if (difficultySelector instanceof HTMLSelectElement) {
      await userEvent.selectOptions(difficultySelector, 'easy');
    }

    await waitFor(() => {
      expect(gameSelector?.children.length).toBeGreaterThan(1);
    });
    expect(gameSelector?.children[1].textContent).toContain('Game 1');
  });
  test('game results shown in table', async () => {
    const gameSelector = document.querySelector('.game-selector');
    if (gameSelector instanceof HTMLSelectElement) {
      await userEvent.selectOptions(gameSelector, '226');
    }
    await waitFor(() => {
      expect(
        document.querySelector('.panel-content')?.children.length
      ).not.toBeNull();
      expect(document.querySelector('.panel-content')?.textContent).toContain(
        'Semantic Tags'
      );
    });
  });
});
