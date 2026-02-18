import { describe, it, expect } from 'vitest';
import { sum } from './math';

describe('Math utils', () => {
  it('должна складывать числа', () => {
    const result = sum(1, 2) as number;
    expect(result).toBe(5);
  });
});
