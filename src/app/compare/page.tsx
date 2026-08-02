import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CompareContent } from '@/components/compare/CompareContent';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { storeConfig } from '@/data/store-config';

export const metadata: Metadata = {
  title: 'Compare Products',
  description:
    'Compare up to four Homeiffy products by seating, table, storage, bed or desk specification fields.',
  openGraph: {
    title: `Compare Products · ${storeConfig.brandName}`,
    description:
      'Compare up to four Homeiffy products by seating, table, storage, bed or desk specification fields.',
  },
};

export default function ComparePage() {
  return (
    <Section spacing="default" background="white">
      <Container size="lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Compare', href: '/compare' },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="font-display text-3xl font-medium text-night-ink sm:text-4xl">
            Compare products
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
            Side-by-side specification comparison for up to four catalog
            products. Where a figure is not published for a product, the row
            is left blank rather than filled with a guess.
          </p>
        </header>

        <CompareContent />
      </Container>
    </Section>
  );
}
