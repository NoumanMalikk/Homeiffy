import { describe, expect, it } from 'vitest';

import { productSafetyRecords } from '@/data/product-safety';
import { products } from '@/data/products';
import { supplierSpecSheet } from '@/data/supplier-spec-sheet';
import { isLivePurchaseAllowed } from '@/lib/cart';
import { isProductPurchaseable } from '@/lib/products';

describe('production readiness and safety gates', () => {
  it('allows live purchase for every catalog product', () => {
    for (const product of products) {
      expect(isProductPurchaseable(product), product.sku).toBe(true);
      expect(isLivePurchaseAllowed(product, 'production'), product.sku).toBe(
        true,
      );
    }
  });

  it('takes a product off sale when the catalog disables it', () => {
    const disabled = { ...products[0]!, purchaseEnabled: false };
    expect(isProductPurchaseable(disabled)).toBe(false);

    const outOfStock = { ...products[0]!, availability: 'unavailable' as const };
    expect(isProductPurchaseable(outOfStock)).toBe(false);
  });

  it('publishes a safety record for every SKU', () => {
    expect(productSafetyRecords.length).toBe(products.length);

    for (const record of productSafetyRecords) {
      expect(record.sku).toMatch(/^HMF-[A-Z]{3}-\d{3}$/);
      expect(record.verificationStatus).toBe('verified');
      expect(record.sharpCorners).toBeTruthy();
      expect(record.assemblyHardware).toBeTruthy();
    }

    for (const product of products) {
      const safety = productSafetyRecords.find(
        (record) => record.productId === product.id,
      );
      expect(safety, product.sku).toBeDefined();
    }
  });

  it('requires wall anchoring guidance on tall storage furniture', () => {
    const tallStorage = [
      'dressers',
      'wardrobes',
      'bookcases',
      'hall-trees',
      'room-dividers',
      'dining-storage',
    ];

    for (const product of products) {
      if (!tallStorage.includes(product.subcategory)) continue;

      const safety = productSafetyRecords.find(
        (record) => record.productId === product.id,
      );

      expect(safety?.wallAnchoring, product.sku).toMatch(/required/i);
      expect(safety?.manufacturerWarnings, product.sku).toMatch(
        /tip-over hazard/i,
      );
    }
  });

  it('never fabricates a load rating or country of origin', () => {
    // These are supplier-documented facts. They stay null until the business
    // fills in src/data/supplier-spec-sheet.ts, and the storefront hides them.
    for (const product of products) {
      const confirmed = supplierSpecSheet.find(
        (spec) => spec.sku === product.sku,
      );
      expect(confirmed, product.sku).toBeDefined();

      expect(product.weightCapacity).toBe(confirmed!.weightCapacity);
      expect(product.countryOfOrigin).toBe(confirmed!.countryOfOrigin);
      expect(product.manufacturer).toBe(confirmed!.manufacturer);
    }
  });

  it('covers every catalog SKU in the supplier spec sheet', () => {
    const catalogSkus = new Set(products.map((product) => product.sku));
    const sheetSkus = new Set(supplierSpecSheet.map((spec) => spec.sku));

    expect(sheetSkus.size).toBe(catalogSkus.size);
    for (const sku of catalogSkus) {
      expect(sheetSkus.has(sku), sku).toBe(true);
    }
  });
});
