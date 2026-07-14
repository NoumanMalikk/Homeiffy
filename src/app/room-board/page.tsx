import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RoomBoardContent } from '@/components/room-board/RoomBoardContent';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { storeConfig } from '@/data/store-config';

export const metadata: Metadata = {
  title: 'Room Board',
  description:
    'Arrange furniture cutouts on a visual board with proportional dimensions, finishes and combined total.',
  openGraph: {
    title: `Room Board · ${storeConfig.brandName}`,
    description:
      'Arrange furniture cutouts on a visual board with proportional dimensions, finishes and combined total.',
  },
};

export default function RoomBoardPage() {
  return (
    <Section spacing="default" background="white">
      <Container size="lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Room Board', href: '/room-board' },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="font-display text-3xl font-medium text-night-ink sm:text-4xl">
            Room board
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
            Place seating, tables, storage, beds, desks and dividers on a visual
            canvas using proportional cutouts. Not architectural accuracy - an
            illustrative planning aid only.
          </p>
        </header>

        <RoomBoardContent />
      </Container>
    </Section>
  );
}
