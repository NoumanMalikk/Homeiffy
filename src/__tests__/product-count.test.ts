import { describe, expect, it } from 'vitest';

import { dailyMoments } from '@/data/daily-moments';
import { PRODUCT_COUNT, products } from '@/data/products';
import { storeConfig } from '@/data/store-config';
import {
  getAllProducts,
  getProductBySku,
} from '@/lib/products';

const SKU_PATTERN = /^HMF-[A-Z]{3}-\d{3}$/;

const EXPECTED_SKUS = [
  'HMF-LIV-001',
  'HMF-LIV-002',
  'HMF-LIV-003',
  'HMF-LIV-004',
  'HMF-LIV-005',
  'HMF-LIV-006',
  'HMF-LIV-007',
  'HMF-LIV-008',
  'HMF-LIV-009',
  'HMF-BED-001',
  'HMF-BED-002',
  'HMF-BED-003',
  'HMF-BED-004',
  'HMF-BED-005',
  'HMF-BED-006',
  'HMF-DIN-001',
  'HMF-DIN-002',
  'HMF-DIN-003',
  'HMF-DIN-004',
  'HMF-DIN-005',
  'HMF-ENT-001',
  'HMF-ENT-002',
  'HMF-ENT-003',
  'HMF-ENT-004',
  'HMF-STO-001',
  'HMF-OFF-001',
] as const;

describe('catalog product count and integrity', () => {
  it('exports exactly 26 products', () => {
    expect(products.length).toBe(26);
    expect(PRODUCT_COUNT).toBe(26);
    expect(getAllProducts().length).toBe(26);
    expect(EXPECTED_SKUS).toHaveLength(26);

    for (const sku of EXPECTED_SKUS) {
      expect(getProductBySku(sku), sku).toBeDefined();
    }

    expect(getProductBySku('HMF-SET-026')).toBeUndefined();
  });

  it('marks every product as not production ready', () => {
    for (const product of products) {
      expect(product.productionReady).toBe(false);
    }
  });

  it('assigns required HMF-*-* SKUs to every product', () => {
    for (const product of products) {
      expect(product.sku).toMatch(SKU_PATTERN);
      expect(product.id).toBe(product.sku.toLowerCase());
    }
  });

  it('maps daily moments to existing catalog SKUs', () => {
    const momentSlugs = dailyMoments.map((moment) => moment.slug);

    for (const product of products) {
      for (const moment of product.dailyMoments) {
        expect(momentSlugs).toContain(moment);
      }
    }

    for (const moment of dailyMoments) {
      for (const sku of moment.productSkus) {
        expect(
          getProductBySku(sku),
          `SKU ${sku} in ${moment.slug}`,
        ).toBeDefined();
      }
    }
  });

  it('describes nesting table and dining chair set contents', () => {
    const nestingTables = getProductBySku('HMF-LIV-008');
    const diningChairs = getProductBySku('HMF-DIN-003');

    expect(nestingTables).toBeDefined();
    expect(nestingTables!.packageContents).toMatch(/set of 3/i);
    expect(nestingTables!.title).toMatch(/nesting/i);

    expect(diningChairs).toBeDefined();
    expect(diningChairs!.packageContents).toMatch(/set of 2/i);
    expect(diningChairs!.title).toMatch(/dining chairs/i);
  });

  it('does not expose an owner name in storeConfig', () => {
    expect(storeConfig.ownerName).toBeNull();
    expect(storeConfig.showOwnerNamePublicly).toBe(false);
    expect(storeConfig.siteEnv).toMatch(/^(staging|production)$/);
  });
});
