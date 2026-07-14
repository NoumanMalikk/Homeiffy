import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RoomRhythmBuilderContent } from '@/components/room-builder/RoomRhythmBuilderContent';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { storeConfig } from '@/data/store-config';

export const metadata: Metadata = {
  title: 'Room Builder',
  description:
    'Build a coordinated space with anchor, seating, table, storage and flexible accent pieces. Each item remains an individual SKU.',
  openGraph: {
    title: `Room Builder · ${storeConfig.brandName}`,
    description:
      'Build a coordinated space with anchor, seating, table, storage and flexible accent pieces.',
  },
};

export default function RoomBuilderPage() {
  return (
    <Section spacing="default" background="white">
      <Container size="lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Room Builder', href: '/room-builder' },
          ]}
          className="mb-6"
        />
        <header className="mb-8">
          <h1 className="font-display text-3xl font-medium text-room-ink sm:text-4xl">
            Build a coordinated space
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-soft-graphite">
            Select an anchor product, secondary seating, a table, storage and a
            flexible accent. Combined price and approximate footprint are shown
            for planning only — each product is added to the cart as an
            individual SKU with no bundle discount.
          </p>
        </header>
        <RoomRhythmBuilderContent />
      </Container>
    </Section>
  );
}
