import { Suspense } from 'react';

import { ActiveFilters } from '@/components/catalog/ActiveFilters';
import { CatalogProductGrid } from '@/components/catalog/CatalogProductGrid';
import { CatalogViewToggle } from '@/components/catalog/CatalogViewToggle';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { SortSelect } from '@/components/catalog/SortSelect';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import {
  getCatalogFilterOptions,
  type CatalogSearchParams,
} from '@/lib/catalog';
import { getCatalogResults } from '@/lib/catalog';
import type { Product } from '@/lib/types';
import type { BreadcrumbItem } from '@/lib/seo';

interface CatalogLayoutProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  products: Product[];
  searchParams: CatalogSearchParams;
  showFilters?: boolean;
}

function CatalogToolbar({
  resultCount,
  sort,
}: {
  resultCount: number;
  sort: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-graphite">
        {resultCount} {resultCount === 1 ? 'product' : 'products'}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <CatalogViewToggle />
        <div className="w-52">
          <SortSelect value={sort as never} />
        </div>
      </div>
    </div>
  );
}

export function CatalogLayout({
  title,
  description,
  breadcrumbs,
  products,
  searchParams,
  showFilters = true,
}: CatalogLayoutProps) {
  const { items, filters } = getCatalogResults(products, searchParams);
  const filterOptions = getCatalogFilterOptions(products);

  return (
    <Section spacing="default" background="white">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <header className="max-w-3xl">
          <h1 className="font-display text-3xl font-medium text-night-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-graphite">
            {description}
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
          {showFilters ? (
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-lg bg-cloud-cream" />
              }
            >
              <FilterSidebar filters={filters} options={filterOptions} />
            </Suspense>
          ) : null}

          <div className="min-w-0 space-y-6">
            <CatalogToolbar
              resultCount={items.length}
              sort={filters.sort ?? 'featured'}
            />
            <Suspense fallback={null}>
              <ActiveFilters filters={filters} />
            </Suspense>
            <CatalogProductGrid products={items} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
