'use client';

import { motion } from 'framer-motion';
import { GitCompare, X } from 'lucide-react';
import Link from 'next/link';

import { ProductCardImage } from '@/components/product/ProductImagePlaceholder';
import { Button } from '@/components/ui/button';
import {
  getCompareFieldValue,
  getCompareRowsForProducts,
  getCompareTypeLabel,
  groupProductsByCompareType,
  COMPARE_FIELD_LABELS,
  type ProductCompareType,
} from '@/lib/compare';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { getProductMainImage } from '@/lib/product-display';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { MAX_COMPARE_ITEMS, useCompareStore } from '@/stores';
import type { Product } from '@/lib/types';

function CompareTable({
  type,
  products,
}: {
  type: ProductCompareType;
  products: Product[];
}) {
  const remove = useCompareStore((state) => state.remove);
  const rows = getCompareRowsForProducts(products);

  return (
    <section className="space-y-4" aria-labelledby={`compare-${type}`}>
      <h2
        id={`compare-${type}`}
        className="font-display text-xl font-medium text-night-ink"
      >
        {getCompareTypeLabel(type)}
      </h2>

      <div className="overflow-x-auto rounded-lg border border-border-sand">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-sand bg-cloud-cream/50">
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-[10rem] bg-cloud-cream/95 px-4 py-3 text-left font-medium text-graphite"
              >
                Specification
              </th>
              {products.map((product) => {
                const image = getProductMainImage(product);

                return (
                  <th
                    key={product.id}
                    scope="col"
                    className="min-w-[12rem] px-4 py-3 text-left align-top"
                  >
                    <div className="space-y-3">
                      <div className="w-28 overflow-hidden rounded-md">
                        <ProductCardImage
                          src={image.src}
                          alt={image.alt}
                          verified={image.verified}
                        />
                      </div>
                      <div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-medium text-night-ink hover:text-haven-blue"
                        >
                          {product.title}
                        </Link>
                        <p className="mt-1 font-mono-data text-xs text-graphite">
                          {product.sku}
                        </p>
                        <p className="mt-2 font-display text-base text-night-ink">
                          {formatPrice(product.price, product.currency)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.title} from compare`}
                      >
                        <X />
                        Remove
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((field) => (
              <tr
                key={field}
                className="border-b border-border-sand/70 last:border-b-0"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-soft-white px-4 py-3 text-left font-medium text-graphite"
                >
                  {COMPARE_FIELD_LABELS[field] ?? field}
                </th>
                {products.map((product) => (
                  <td
                    key={`${product.id}-${field}`}
                    className="px-4 py-3 font-mono-data text-night-ink"
                  >
                    {getCompareFieldValue(product, field)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CompareContent() {
  const items = useCompareStore((state) => state.items);
  const limitNotice = useCompareStore((state) => state.limitNotice);
  const clearLimitNotice = useCompareStore((state) => state.clearLimitNotice);
  const clear = useCompareStore((state) => state.clear);
  const reducedMotion = useReducedMotion();

  const products = items
    .map((item) => getProductById(item.productId))
    .filter((product): product is Product => Boolean(product));

  const groups = groupProductsByCompareType(products);
  const typeOrder: ProductCompareType[] = [
    'seating',
    'table',
    'storage',
    'bed',
    'desk',
  ];

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-sand bg-cloud-cream/40 px-6 py-16 text-center">
        <GitCompare
          className="mx-auto size-10 text-haven-blue/70"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-display text-2xl font-medium text-night-ink">
          No products to compare
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-graphite">
          Add up to {MAX_COMPARE_ITEMS} products from the catalog to compare
          verified specification fields side by side.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 min-h-[2.75rem] items-center justify-center rounded-md bg-night-ink px-4 text-sm font-medium text-cloud-cream hover:bg-night-ink/90"
        >
          Shop the catalog
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-graphite">
          Comparing {products.length} of {MAX_COMPARE_ITEMS} products. Empty
          fields reflect specifications not yet listed for that product.
        </p>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear all
        </Button>
      </div>

      {limitNotice ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-sand bg-cloud-cream/60 px-4 py-3 text-sm text-graphite"
          role="status"
        >
          <span>{limitNotice}</span>
          <Button variant="ghost" size="sm" onClick={clearLimitNotice}>
            Dismiss
          </Button>
        </div>
      ) : null}

      {typeOrder.map((type) => {
        const group = groups[type];

        if (!group?.length) {
          return null;
        }

        return <CompareTable key={type} type={type} products={group} />;
      })}
    </motion.div>
  );
}
