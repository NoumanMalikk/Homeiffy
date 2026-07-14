import type { ReactNode } from 'react';

import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProductGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul
      className={
        className ??
        'grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
    >
      {children}
    </ul>
  );
}

export function ProductGridItem({
  product,
  children,
  className,
}: {
  product: Product;
  children: ReactNode;
  className?: string;
}) {
  return (
    <li
      className={cn('flex h-full', className)}
      data-product-id={product.id}
    >
      {children}
    </li>
  );
}
