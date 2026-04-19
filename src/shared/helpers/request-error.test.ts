import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getApiErrorMessage, withApiErrorHandling } from './request-error';

describe('request-error', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns fallback when online', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);

    expect(getApiErrorMessage('Failed to load data')).toBe(
      'Failed to load data'
    );
  });

  it('returns no internet message when offline', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);

    expect(getApiErrorMessage('Failed to load data')).toBe(
      'No internet connection.'
    );
  });

  it('returns request result when request succeeds', async () => {
    const request = vi.fn().mockResolvedValue('ok');

    await expect(withApiErrorHandling(request, 'Failed')).resolves.toBe('ok');
  });

  it('throws fallback error when request fails', async () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);

    const request = vi.fn().mockRejectedValue(new Error('boom'));

    await expect(withApiErrorHandling(request, 'Failed')).rejects.toThrow(
      'Failed'
    );
    expect(console.error).toHaveBeenCalled();
  });
});
