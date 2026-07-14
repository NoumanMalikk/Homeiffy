import { describe, expect, it } from 'vitest';

import { calculateFootprint, getProductBySku } from '@/lib/products';
import {
  formatDimensionValue,
  formatDimensions,
  formatInchesCm,
  inchesToCm,
} from '@/lib/utils';

describe('dimension formatting and footprint', () => {
  const sofa = getProductBySku('HMF-LIV-001')!;
  const nestingTables = getProductBySku('HMF-LIV-008')!;
  const entryBench = getProductBySku('HMF-ENT-003')!;

  it('formats complete dimensions as W × D × H', () => {
    expect(formatDimensions(46, 18, 16)).toBe('46" W × 16" D × 18" H');
    expect(formatDimensions(46, 18, 16, 'cm')).toBe('46 cm W × 16 cm D × 18 cm H');
  });

  it('returns empty string when all dimensions are null', () => {
    expect(formatDimensions(null, null, null)).toBe('');
    expect(formatDimensionValue(null)).toBe(null);
    expect(formatInchesCm(null)).toBe('');
  });

  it('formats partial dimensions omitting unknown values', () => {
    expect(formatDimensions(46, null, null)).toBe('46" W');
    expect(formatDimensions(null, 18, 16)).toBe('16" D × 18" H');
  });

  it('converts inches to centimeters', () => {
    expect(inchesToCm(10)).toBe(25.4);
    expect(formatInchesCm(10)).toBe('10" (25.4 cm)');
  });

  it('calculates combined footprint when dimensions are complete', () => {
    const footprint = calculateFootprint([sofa]);

    expect(footprint.width).toBe(sofa.width);
    expect(footprint.depth).toBe(sofa.depth);
    expect(footprint.height).toBe(sofa.height);
    expect(footprint.productCount).toBe(1);
    expect(footprint.note).toMatch(/bounding footprint/i);
    expect(footprint.note).not.toMatch(/unverified dimensions/i);
  });

  it('notes unverified dimensions in footprint calculations', () => {
    const footprint = calculateFootprint([nestingTables, entryBench]);

    expect(footprint.note).toMatch(/unverified dimensions/i);
    expect(footprint.productCount).toBe(2);
  });
});
