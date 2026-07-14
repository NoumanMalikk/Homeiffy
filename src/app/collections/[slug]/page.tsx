import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogLayout } from '@/components/catalog/CatalogLayout';
import { categoryBySlug } from '@/data/categories';
import {
  getCollectionSlugs,
  getProductsForCollection,
  type CatalogSearchParams,
} from '@/lib/catalog';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
}

export function generateStaticParams() {
  return getCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug[slug];

  if (!category) {
    return { title: 'Collection not found' };
  }

  return {
    title: category.title,
    description: category.description,
    openGraph: {
      title: `${category.title} · Homeiffy`,
      description: category.description,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const category = categoryBySlug[slug];

  if (!category) {
    notFound();
  }

  const catalogParams = await searchParams;
  const products = getProductsForCollection(slug);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: category.title, href: `/collections/${slug}` },
  ];

  if (category.parentId) {
    const parent = categoryBySlug[category.parentId];

    if (parent) {
      breadcrumbs.splice(2, 0, {
        label: parent.title,
        href: `/collections/${parent.slug}`,
      });
    }
  }

  return (
    <CatalogLayout
      title={category.title}
      description={category.description}
      breadcrumbs={breadcrumbs}
      products={products}
      searchParams={catalogParams}
    />
  );
}
