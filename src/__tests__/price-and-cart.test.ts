import { describe, expect, it } from 'vitest';

import {
  calculateCartTotals,
  isLivePurchaseAllowed,
  validateConfiguration,
  validateFinish,
  validateUpholstery,
} from '@/lib/cart';
import { getProductBySku } from '@/lib/products';
import { cartItemFromProduct } from '@/__tests__/helpers/cart-item';

describe('cart totals and configuration validation', () => {
  const nestingTables = getProductBySku('HMF-LIV-008')!;
  const entryBench = getProductBySku('HMF-ENT-003')!;
  const diningChairs = getProductBySku('HMF-DIN-003')!;

  it('calculates subtotal and item count from catalog prices', () => {
    const items = [
      cartItemFromProduct(nestingTables, { quantity: 2 }),
      cartItemFromProduct(entryBench, { quantity: 1 }),
    ];

    const totals = calculateCartTotals(items);

    expect(totals.subtotal).toBe(nestingTables.price * 2 + entryBench.price);
    expect(totals.itemCount).toBe(3);
    expect(totals.currency).toBe('USD');
    expect(totals.valid).toBe(true);
    expect(totals.errors).toHaveLength(0);
    expect(totals.displayOnlyNote).toMatch(/display only/i);
  });

  it('revalidates line items against the catalog unit price', () => {
    const item = cartItemFromProduct(nestingTables, { unitPrice: 1 });
    const totals = calculateCartTotals([item]);

    expect(totals.validatedItems[0]?.catalogUnitPrice).toBe(nestingTables.price);
    expect(totals.validatedItems[0]?.lineTotal).toBe(nestingTables.price);
  });

  it('validates finish selections against product colorways', () => {
    const finishId = nestingTables.colorways.find((c) => c.type === 'finish')!.id;

    expect(validateFinish(nestingTables, finishId)).toBe(true);
    expect(validateFinish(nestingTables, 'invalid-finish')).toBe(false);
    expect(validateFinish(nestingTables, null)).toBe(true);
  });

  it('validates upholstery selections against product colorways', () => {
    const upholsteryId = entryBench.colorways.find(
      (c) => c.type === 'upholstery',
    )!.id;

    expect(validateUpholstery(entryBench, upholsteryId)).toBe(true);
    expect(validateUpholstery(entryBench, 'invalid-upholstery')).toBe(false);
    expect(validateUpholstery(nestingTables, null)).toBe(true);
  });

  it('validates configuration strings with length and orientation rules', () => {
    expect(validateConfiguration(nestingTables, null)).toBe(true);
    expect(validateConfiguration(nestingTables, '  ')).toBe(false);
    expect(validateConfiguration(nestingTables, 'a')).toBe(false);
    expect(validateConfiguration(nestingTables, 'Left-facing')).toBe(true);
    expect(validateConfiguration(nestingTables, 'x'.repeat(121))).toBe(false);
  });

  it('flags invalid finish and upholstery on cart totals', () => {
    const item = cartItemFromProduct(entryBench, {
      selectedFinishId: 'not-a-finish',
      selectedUpholsteryId: 'not-upholstery',
    });

    const totals = calculateCartTotals([item]);

    expect(totals.valid).toBe(false);
    expect(totals.errors.some((error) => /Invalid finish/i.test(error))).toBe(
      true,
    );
    expect(
      totals.errors.some((error) => /Invalid upholstery/i.test(error)),
    ).toBe(true);
  });

  it('accepts a live purchase without warnings for a sellable product', () => {
    const item = cartItemFromProduct(entryBench);
    const totals = calculateCartTotals([item]);

    expect(isLivePurchaseAllowed(entryBench, 'production')).toBe(true);
    expect(totals.errors).toEqual([]);
    expect(totals.warnings).toEqual([]);
  });

  it('describes dining chair set package contents in the cart context', () => {
    expect(diningChairs.packageContents).toMatch(/two dining chairs/i);
    expect(diningChairs.title).toMatch(/set of 2/i);
    expect(diningChairs.shippingClass).toBe('upholstered-furniture');

    const totals = calculateCartTotals([cartItemFromProduct(diningChairs)]);
    expect(totals.subtotal).toBe(diningChairs.price);
    expect(totals.validatedItems[0]?.shippingClass).toBe(
      'upholstered-furniture',
    );
  });
});
