'use client';

import { X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  categories,
  dailyMoments,
  rooms,
  shippingClasses,
} from '@/lib/catalog';
import type { ExtendedCatalogFilters } from '@/lib/catalog';

interface ActiveFiltersProps {
  filters: ExtendedCatalogFilters;
}

export function ActiveFilters({ filters }: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const chips = useMemo(() => {
    const items: { key: string; label: string }[] = [];

    for (const moment of filters.dailyMoments ?? []) {
      const match = dailyMoments.find((item) => item.slug === moment);
      items.push({ key: 'moment', label: match?.title ?? moment });
    }

    for (const room of filters.rooms ?? []) {
      const match = rooms.find((item) => item.slug === room);
      items.push({ key: 'room', label: match?.title ?? room });
    }

    for (const subcategory of filters.subcategories ?? []) {
      const match = categories.find((item) => item.slug === subcategory);
      items.push({
        key: 'subcategory',
        label: match?.title ?? subcategory,
      });
    }

    if (filters.minWidth !== undefined) {
      items.push({ key: 'minWidth', label: `Min width ${filters.minWidth}"` });
    }

    if (filters.maxWidth !== undefined) {
      items.push({ key: 'maxWidth', label: `Max width ${filters.maxWidth}"` });
    }

    if (filters.minPrice !== undefined) {
      items.push({ key: 'minPrice', label: `Min $${filters.minPrice}` });
    }

    if (filters.maxPrice !== undefined) {
      items.push({ key: 'maxPrice', label: `Max $${filters.maxPrice}` });
    }

    if (filters.hasDrawers !== undefined) {
      items.push({
        key: 'drawers',
        label: filters.hasDrawers ? 'Has drawers' : 'No drawers',
      });
    }

    if (filters.hasShelves !== undefined) {
      items.push({
        key: 'shelves',
        label: filters.hasShelves ? 'Has shelves' : 'No shelves',
      });
    }

    if (filters.hasStorage !== undefined) {
      items.push({
        key: 'storage',
        label: filters.hasStorage ? 'Has storage' : 'No storage',
      });
    }

    if (filters.isExpandable !== undefined) {
      items.push({
        key: 'expandable',
        label: filters.isExpandable ? 'Expandable' : 'Not expandable',
      });
    }

    if (filters.assemblyRequired !== undefined) {
      items.push({
        key: 'assembly',
        label: filters.assemblyRequired
          ? 'Assembly required'
          : 'No assembly required',
      });
    }

    if (filters.productionReady !== undefined) {
      items.push({
        key: 'productionReady',
        label: filters.productionReady
          ? 'Production ready'
          : 'Specifications pending',
      });
    }

    for (const shippingClass of filters.shippingClasses ?? []) {
      const match = shippingClasses.find((item) => item.id === shippingClass);
      items.push({
        key: 'shipping',
        label: match?.name ?? shippingClass,
      });
    }

    if (filters.searchQuery) {
      items.push({ key: 'q', label: `Search: ${filters.searchQuery}` });
    }

    return items;
  }, [filters]);

  if (chips.length === 0) {
    return null;
  }

  function clearAll() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <div
      className={isPending ? 'opacity-70' : undefined}
      aria-label="Active filters"
    >
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip, index) => (
          <Badge key={`${chip.key}-${index}`} variant="outline" className="gap-1">
            {chip.label}
          </Badge>
        ))}
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1 text-sm text-haven-blue hover:underline"
        >
          <X className="size-3.5" aria-hidden="true" />
          Clear all
        </button>
      </div>
    </div>
  );
}
