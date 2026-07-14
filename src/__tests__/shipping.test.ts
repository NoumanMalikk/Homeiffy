import { describe, expect, it } from 'vitest';

import {
  assignShippingClass,
  assignShippingClassFromAttributes,
  calculateStagingShipping,
} from '@/lib/shipping';
import { getProductBySku } from '@/lib/products';
import { cartItemFromProduct } from '@/__tests__/helpers/cart-item';
import type { Product } from '@/lib/types';

describe('shipping class assignment and staging quotes', () => {
  const upholstered = getProductBySku('HMF-ENT-003')!;
  const oversized = getProductBySku('HMF-DIN-005')!;
  const smallParcel = getProductBySku('HMF-BED-003')!;
  const standardParcel = getProductBySku('HMF-LIV-008')!;
  const freightReview = getProductBySku('HMF-BED-001')!;

  it('returns catalog shipping class via assignShippingClass', () => {
    expect(assignShippingClass(upholstered)).toBe('upholstered-furniture');
    expect(assignShippingClass(oversized)).toBe('oversized-furniture');
    expect(assignShippingClass(smallParcel)).toBe('small-furniture-parcel');
    expect(assignShippingClass(standardParcel)).toBe(
      'standard-furniture-parcel',
    );
    expect(assignShippingClass(freightReview)).toBe('freight-review-required');
  });

  it('derives upholstered handling from attributes when upholstery exists', () => {
    expect(assignShippingClassFromAttributes(upholstered)).toBe(
      'upholstered-furniture',
    );
  });

  it('derives multi-box class when box count exceeds one', () => {
    const synthetic: Product = {
      ...standardParcel,
      boxCount: 3,
      colorways: standardParcel.colorways.filter((c) => c.type === 'finish'),
    };

    expect(assignShippingClassFromAttributes(synthetic)).toBe(
      'multi-box-furniture',
    );
  });

  it('derives oversized class from max dimension', () => {
    const synthetic: Product = {
      ...standardParcel,
      width: 80,
      height: 30,
      depth: 24,
      colorways: standardParcel.colorways.filter((c) => c.type === 'finish'),
    };

    expect(assignShippingClassFromAttributes(synthetic)).toBe(
      'oversized-furniture',
    );
  });

  it('labels staging shipping as illustrative only', () => {
    const items = [
      cartItemFromProduct(upholstered, { boxCount: 2 }),
      cartItemFromProduct(oversized),
    ];

    const quote = calculateStagingShipping(items, '36752');

    expect(quote.isStagingRate).toBe(true);
    expect(quote.label).toMatch(/Shipping estimate/i);
    expect(quote.note).toMatch(/confirmed before dispatch/i);
    expect(quote.destinationZip).toBe('36752');
    expect(quote.lineBreakdown).toHaveLength(2);
    expect(quote.amount).toBeGreaterThan(0);

    for (const line of quote.lineBreakdown) {
      expect(line.note).toMatch(/Estimated shipping|Freight review/i);
    }
  });

  it('adds multi-box and upholstered surcharges in staging breakdown', () => {
    const upholsteredMultiBox = cartItemFromProduct(upholstered, {
      boxCount: 2,
    });
    const singleBox = cartItemFromProduct(standardParcel, { boxCount: 1 });

    const multiQuote = calculateStagingShipping([upholsteredMultiBox], '10001');
    const baseQuote = calculateStagingShipping([singleBox], '10001');

    expect(multiQuote.amount).toBeGreaterThan(baseQuote.amount);
    expect(multiQuote.lineBreakdown[0]?.boxCount).toBe(2);
    expect(multiQuote.lineBreakdown[0]?.shippingClass).toBe(
      'upholstered-furniture',
    );
  });

  it('returns zero staging amount for freight-review-required items', () => {
    const quote = calculateStagingShipping(
      [cartItemFromProduct(freightReview)],
      '90210',
    );

    expect(quote.lineBreakdown[0]?.shippingClass).toBe(
      'freight-review-required',
    );
    expect(quote.lineBreakdown[0]?.stagingAmount).toBe(0);
    expect(quote.lineBreakdown[0]?.note).toMatch(/Freight review required/i);
  });
});
