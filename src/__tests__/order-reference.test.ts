import { describe, expect, it } from 'vitest';

import { generateOrderReference } from '@/lib/orders';

const REFERENCE_PATTERN = /^DH-[A-Z0-9]+-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{14}$/;

describe('generateOrderReference', () => {
  it('matches the DH- prefix and suffix format', () => {
    const reference = generateOrderReference();
    expect(reference).toMatch(REFERENCE_PATTERN);
  });

  it('generates unique references across many calls', () => {
    const references = new Set(
      Array.from({ length: 200 }, () => generateOrderReference()),
    );

    expect(references.size).toBe(200);
  });

  it('avoids ambiguous characters in the random suffix', () => {
    for (let index = 0; index < 50; index += 1) {
      const reference = generateOrderReference();
      expect(reference).not.toMatch(/[01IO]/);
    }
  });
});
