import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { storeConfig } from '@/data/store-config';
import { cn } from '@/lib/utils';

export function AboutStoreBand() {
  return (
    <section className="border-b border-wd-line bg-wd-surface py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="wd-section-label">Burkville, Alabama</p>
            <h2 className="wd-section-title mt-3">About Homeiffy</h2>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-wd-muted sm:text-base">
              Homeiffy LLC is a Burkville, Alabama-based furniture retailer
              offering furniture for living rooms, bedrooms, dining areas,
              entryways, storage and home workspaces. The catalog is built to
              help customers review exact product images, dimensions, finishes,
              upholstery, assembly and shipping information before ordering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
              >
                Read More
              </Link>
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: 'primary', size: 'default' }))}
              >
                Contact Us
              </Link>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-wd-muted">
              {storeConfig.phoneDisplay} · {storeConfig.publicLocationLabel}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
