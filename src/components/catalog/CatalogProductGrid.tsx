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
      <div className="rounded-lg border border-dashed border-border-sand bg-cloud-cream/50 p-10 text-center">
        <p className="font-display text-lg text-night-ink">
          No products match these filters
        </p>
        <p className="mt-2 text-sm text-graphite">
          Adjust filters or clear them to see more of the catalog.
        </p>
      </div>
    );
  }

  return (
    <ProductGrid className={gridClass}>
      {products.map((product) => (
        <ProductGridItem
          key={product.id}
          product={product}
          className={cn(catalogView === 'list' && 'max-w-none')}
        >
          <ProductCard
            product={product}
            className={cn(catalogView === 'list' && 'sm:flex-row')}
          />
        </ProductGridItem>
      ))}
    </ProductGrid>
  );
}
