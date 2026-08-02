import { describe, expect, it } from 'vitest';
import { products } from '@/data/products';
import { categoryBySlug } from '@/data/categories';
import { roomCompatibilityGroupById } from '@/data/room-compatibility';
import { rooms } from '@/data/rooms';
import { dailyMoments } from '@/data/daily-moments';
import { shippingClassById } from '@/data/shipping-classes';
import { productSafetyByProductId } from '@/data/product-safety';

describe('catalog taxonomy integrity', () => {
  it('every subcategory resolves to a category', () => {
    const bad = products.filter((p) => !categoryBySlug[p.subcategory]);
    expect(bad.map((p) => `${p.sku}:${p.subcategory}`)).toEqual([]);
  });
  it('every roomCompatibilityId resolves to a group', () => {
    const bad: string[] = [];
    for (const p of products)
      for (const id of p.roomCompatibilityIds)
        if (!roomCompatibilityGroupById[id]) bad.push(`${p.sku}:${id}`);
    expect(bad).toEqual([]);
  });
  it('every room id resolves', () => {
    const ids = new Set(rooms.map((r) => r.id));
    const bad: string[] = [];
    for (const p of products)
      for (const r of p.rooms) if (!ids.has(r)) bad.push(`${p.sku}:${r}`);
    expect(bad).toEqual([]);
  });
  it('every daily moment resolves', () => {
    const slugs = new Set(dailyMoments.map((m) => m.slug));
    const bad: string[] = [];
    for (const p of products)
      for (const m of p.dailyMoments) if (!slugs.has(m)) bad.push(`${p.sku}:${m}`);
    expect(bad).toEqual([]);
  });
  it('every shipping class resolves', () => {
    const bad = products.filter((p) => !shippingClassById[p.shippingClass]);
    expect(bad.map((p) => p.sku)).toEqual([]);
  });
  it('every related and cross-sell id resolves', () => {
    const ids = new Set(products.map((p) => p.id));
    const bad: string[] = [];
    for (const p of products)
      for (const r of [...p.relatedProductIds, ...p.crossSellProductIds])
        if (!ids.has(r)) bad.push(`${p.sku}:${r}`);
    expect(bad).toEqual([]);
  });
  it('every product has a safety record', () => {
    const bad = products.filter((p) => !productSafetyByProductId[p.id]);
    expect(bad.map((p) => p.sku)).toEqual([]);
  });
});
