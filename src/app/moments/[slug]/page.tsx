import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogLayout } from '@/components/catalog/CatalogLayout';
import { dailyMomentBySlug, dailyMoments } from '@/data/daily-moments';
import {
  getProductsForMoment,
  type CatalogSearchParams,
} from '@/lib/catalog';
import type { DailyMomentSlug } from '@/lib/types';

interface MomentPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
}

export function generateStaticParams() {
  return dailyMoments.map((moment) => ({ slug: moment.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const moment = dailyMomentBySlug[slug as DailyMomentSlug];

  if (!moment) {
    return { title: 'Daily moment not found' };
  }

  return {
    title: `${moment.title} - Daily moments`,
    description: moment.shortCopy,
    openGraph: {
      title: `${moment.title} · Homeiffy`,
      description: moment.shortCopy,
    },
  };
}

export default async function MomentPage({
  params,
  searchParams,
}: MomentPageProps) {
  const { slug } = await params;
  const moment = dailyMomentBySlug[slug as DailyMomentSlug];

  if (!moment) {
    notFound();
  }

  const catalogParams = await searchParams;
  const products = getProductsForMoment(moment.slug);

  return (
    <CatalogLayout
      title={moment.title}
      description={moment.shortCopy}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Daily moments', href: '/moments/arrive' },
        { label: moment.title, href: `/moments/${moment.slug}` },
      ]}
      products={products}
      searchParams={catalogParams}
    />
  );
}
