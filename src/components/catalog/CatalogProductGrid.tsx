'use client';

import { ProductCard } from '@/components/product/ProductCard';
import {
  ProductGrid,
  ProductGridItem,
} from '@/components/product/ProductGrid';
import { useUiStore } from '@/stores/ui-store';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export function CatalogProductGrid({ products }: { products: Product[] }) {
  const catalogView = useUiStore((state) => state.catalogView);

  const gridClass =
    catalogView === 'list'
      ? 'grid auto-rows-fr grid-cols-1 gap-4'
      : catalogView === 'technical'
        ? 'grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&_article]:font-mono-data [&_h3]:font-mono-data [&_h3]:text-sm'
        : 'grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  if (products.length === 0) {
    return (
      <div className=" border border-dashed border-wd-line bg-wd-surface p-10 text-center">
        <p className="font-display text-lg text-wd-text">
          No products match these filters
        </p>
        <p className="mt-2 text-sm text-wd-muted">
          Adjust filters or clear them to see more of the catalog.
        </p>
      </div>
    );
  }

  return (
    <ProductGrid className={gridClass}>
      {products.map((product, index) => (
        <ProductGridItem
          key={product.id}
          product={product}
          className={cn(catalogView === 'list' && 'max-w-none')}
        >
          <ProductCard
            product={product}
            // The first row is above the fold on every breakpoint, so load it
            // eagerly rather than waiting for the lazy-load observer.
            priority={index < 4}
            className={cn(catalogView === 'list' && 'sm:flex-row')}
          />
        </ProductGridItem>
      ))}
    </ProductGrid>
  );
}
