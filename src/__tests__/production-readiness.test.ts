import { describe, expect, it } from 'vitest';

import { productSafetyRecords } from '@/data/product-safety';
import { products } from '@/data/products';
import { isLivePurchaseAllowed } from '@/lib/cart';
import { isProductPurchaseable } from '@/lib/products';

describe('production readiness and safety gates', () => {
  it('blocks live purchase for every catalog product today', () => {
    for (const product of products) {
      expect(isProductPurchaseable(product)).toBe(false);
      expect(isLivePurchaseAllowed(product, 'production')).toBe(false);
    }
  });

  it('allows staging-mode interface testing via isLivePurchaseAllowed', () => {
    for (const product of products) {
      expect(isLivePurchaseAllowed(product, 'staging')).toBe(true);
    }
  });


  it('requires verification before purchase when productionReady is toggled', () => {
    const sample = { ...products[0]!, productionReady: true };

    expect(isProductPurchaseable(sample)).toBe(false);
    expect(sample.imageVerificationStatus).not.toBe('verified');
    expect(sample.specificationVerificationStatus).not.toBe('verified');
    expect(sample.safetyVerificationStatus).not.toBe('verified');
  });

  it('keeps safety records pending verification for all SKUs', () => {
    expect(productSafetyRecords.length).toBe(26);

    for (const record of productSafetyRecords) {
      expect(record.verificationStatus).toBe('pending');
      expect(record.sku).toMatch(/^HMF-[A-Z]{3}-\d{3}$/);
    }

    for (const product of products) {
      const safety = productSafetyRecords.find(
        (record) => record.productId === product.id,
      );
      expect(safety, product.sku).toBeDefined();
      expect(safety!.verificationStatus).toBe('pending');
    }
  });
});
