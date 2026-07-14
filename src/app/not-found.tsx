import Link from 'next/link';

import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { storeConfig } from '@/data/store-config';

export default function NotFound() {
  return (
    <Section spacing="lg" background="subtle">
      <Container size="md">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-8 flex justify-center">
            <Logo variant="horizontal" theme="light" width={220} linkToHome className="max-h-14" />
          </div>
          <p className="font-mono-data text-sm uppercase tracking-[0.2em] text-haven-blue">
            404
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium text-night-ink sm:text-5xl">
            This page is not in the catalog
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-graphite">
            The route you requested does not match a {storeConfig.brandName}{' '}
            collection, product or page. Return to the shop or start from a room
            collection.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex h-11 min-h-[2.75rem] items-center justify-center rounded-md bg-night-ink px-4 text-sm font-medium text-cloud-cream transition-colors hover:bg-night-ink/90"
            >
              Browse shop
            </Link>
            <Link
              href="/collections/living-room"
              className="inline-flex h-11 min-h-[2.75rem] items-center justify-center rounded-md border border-border-sand px-4 text-sm font-medium text-night-ink transition-colors hover:bg-cloud-cream"
            >
              Living room
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 min-h-[2.75rem] items-center justify-center rounded-md px-4 text-sm font-medium text-night-ink transition-colors hover:bg-border-sand/60"
            >
              Home
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
