'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { buildCatalogQueryString } from '@/lib/catalog';
import type { ProductSortOption } from '@/lib/types';

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'width-asc', label: 'Width: narrow to wide' },
  { value: 'depth-asc', label: 'Depth: shallow to deep' },
  { value: 'height-asc', label: 'Height: low to tall' },
];

export function SortSelect({
  value = 'featured',
}: {
  value?: ProductSortOption;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={isPending ? 'opacity-70' : undefined}>
      <Label htmlFor="catalog-sort" className="sr-only">
        Sort products
      </Label>
      <Select
        id="catalog-sort"
        value={value}
        onChange={(event) => {
          const currentParams = Object.fromEntries(searchParams.entries());
          const query = buildCatalogQueryString(currentParams, {
            sort: event.target.value,
          });

          startTransition(() => {
            router.push(`${pathname}${query}`, { scroll: false });
          });
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
