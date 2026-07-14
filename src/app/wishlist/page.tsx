import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { WishlistContent } from '@/components/wishlist/WishlistContent';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { storeConfig } from '@/data/store-config';

export const metadata: Metadata = {
  title: 'Wishlist',
  description:
    'Save Homeiffy products with your finish, upholstery and configuration choices. No account required.',
  openGraph: {
    title: `Wishlist · ${storeConfig.brandName}`,
    description:
      'Save Homeiffy products with your finish, upholstery and configuration choices. No account required.',
  },
};

export default function WishlistPage() {
  return (
    <Section spacing="default" background="white">
      <Container size="lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Wishlist', href: '/wishlist' },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="font-display text-3xl font-medium text-night-ink sm:text-4xl">
            Wishlist
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
            Save products while you compare dimensions and finishes. Your
            wishlist is stored locally on this device - no account required.
          </p>
        </header>

        <WishlistContent />
      </Container>
    </Section>
  );
}
