import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getActiveSession: vi.fn(),
  getActiveSessionByUser: vi.fn(),
  fetchCompletedTopicIds: vi.fn(),
}));

vi.mock('./storage-service', () => ({
  getActiveSession: mocks.getActiveSession,
}));

vi.mock('./api/active-games', () => ({
  getActiveSessionByUser: mocks.getActiveSessionByUser,
}));

vi.mock('./api/fetch-completed-topic-ids', () => ({
  fetchCompletedTopicIds: mocks.fetchCompletedTopicIds,
}));

import {
  getTopicResumeCandidate,
  hasRequiredResumeData,
} from './topic-resume-candidate';
import type { PersistedActiveSession } from '../types';

describe('topic-resume-candidate', () => {
  const session = {
    gameId: 1,
    game: {
      topicId: 1,
      difficulty: 'easy',
      round: 1,
      usedHints: {
        '50/50': 0,
        'call a friend': 0,
        "i don't know": 0,
      },
      questions: [{ question: 'q' }],
    },
  } as PersistedActiveSession;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchCompletedTopicIds.mockResolvedValue([]);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('validates correct resume data', () => {
    expect(hasRequiredResumeData(session.game)).toBe(true);
  });

  it('returns local session first', async () => {
    mocks.getActiveSession.mockReturnValue(session);

    const result = await getTopicResumeCandidate('user-1');

    expect(result).toEqual(session);
  });

  it('returns server session when local is missing', async () => {
    mocks.getActiveSession.mockReturnValue(null);
    mocks.getActiveSessionByUser.mockResolvedValue(session);

    const result = await getTopicResumeCandidate('user-1');

    expect(result).toEqual(session);
  });

  it('returns null when server throws', async () => {
    mocks.getActiveSession.mockReturnValue(null);
    mocks.getActiveSessionByUser.mockRejectedValue(new Error('boom'));

    const result = await getTopicResumeCandidate('user-1');

    expect(result).toBeNull();
  });
});
