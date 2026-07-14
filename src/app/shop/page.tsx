import type { Metadata } from 'next';

import { CatalogLayout } from '@/components/catalog/CatalogLayout';
import { storeConfig } from '@/data/store-config';
import { getAllProducts } from '@/lib/products';
import type { CatalogSearchParams } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse the full Homeiffy catalog with verified dimensions, finishes and specification-first filters.',
  openGraph: {
    title: `Shop · ${storeConfig.brandName}`,
    description:
      'Browse the full Homeiffy catalog with verified dimensions, finishes and specification-first filters.',
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;

  return (
    <CatalogLayout
      title="Shop the catalog"
      description="Filter by room, daily moment, dimensions, finishes and specification fields."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
      ]}
      products={getAllProducts()}
      searchParams={params}
    />
  );
}
