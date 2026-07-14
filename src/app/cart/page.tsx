import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CartPageContent } from '@/components/cart/CartPageContent';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { storeConfig } from '@/data/store-config';

export const metadata: Metadata = {
  title: 'Cart',
  description:
    'Review cart items with dimensions, finishes, shipping class and pricing before checkout.',
  openGraph: {
    title: `Cart · ${storeConfig.brandName}`,
    description:
      'Review cart items with dimensions, finishes, shipping class and pricing before checkout.',
  },
};

export default function CartPage() {
  return (
    <Section spacing="default" background="white">
      <Container size="lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="font-display text-3xl font-medium text-night-ink sm:text-4xl">
            Cart
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
            Review line items with exact image or placeholder, SKU, finish,
            upholstery, configuration, dimensions, quantity and shipping class.
            Prices are confirmed at checkout.
          </p>
        </header>

        <CartPageContent />
      </Container>
    </Section>
  );
}
