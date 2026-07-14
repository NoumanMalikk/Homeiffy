import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RoomRhythmBuilderContent } from '@/components/room-builder/RoomRhythmBuilderContent';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { storeConfig } from '@/data/store-config';

export const metadata: Metadata = {
  title: 'Room Rhythm Builder',
  description:
    'Compose a room from anchor, seating, storage, table and flexible accent slots with approximate combined footprint.',
  openGraph: {
    title: `Room Rhythm Builder · ${storeConfig.brandName}`,
    description:
      'Compose a room from anchor, seating, storage, table and flexible accent slots with approximate combined footprint.',
  },
};

export default function RoomRhythmBuilderPage() {
  return (
    <Section spacing="default" background="white">
      <Container size="lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            {
              label: 'Room Rhythm Builder',
              href: '/room-rhythm-builder',
            },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="font-display text-3xl font-medium text-night-ink sm:text-4xl">
            Room rhythm builder
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
            Add an anchor, seating, storage, table and flexible accent - each
            product separately, with combined total and approximate footprint.
            No bundled savings or fit guarantees.
          </p>
        </header>

        <RoomRhythmBuilderContent />
      </Container>
    </Section>
  );
}
