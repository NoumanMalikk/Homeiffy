import type { Metadata } from 'next';

import { CatalogLayout } from '@/components/catalog/CatalogLayout';
import { storeConfig } from '@/data/store-config';
import { searchProducts } from '@/lib/products';
import type { CatalogSearchParams } from '@/lib/catalog';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim() : '';

  if (!query) {
    return {
      title: 'Search',
      description:
        'Search Homeiffy furniture by name, SKU, room, category and specifications.',
    };
  }

  return {
    title: `Search: ${query}`,
    description: `Search results for “${query}” in the ${storeConfig.brandName} catalog.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const products = query ? searchProducts(query) : [];

  return (
    <CatalogLayout
      title={query ? `Search results for “${query}”` : 'Search'}
      description={
        query
          ? 'Results match product titles, SKUs, categories, rooms, dimensions and verified specification fields.'
          : 'Enter a search term using the site search or add ?q= to the URL.'
      }
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Search', href: '/search' },
      ]}
      products={products}
      searchParams={params}
      showFilters={Boolean(query)}
    />
  );
}
