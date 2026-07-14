import Link from 'next/link';

import {
  footprintCategories,
  getProductsBySkus,
} from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { formatDimensions } from '@/lib/utils';

export function ShopByFootprint() {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          eyebrow="Dimensions first"
          title="Shop by room footprint."
          description="Start with width, depth and height, then confirm doorway and delivery-route clearance. Homeiffy does not guarantee fit."
        />

        <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {footprintCategories.map((category) => {
            const samples = getProductsBySkus(category.sampleSkus);

            return (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className="flex h-full flex-col rounded-xl border border-border-sand bg-soft-white p-5 shadow-soft transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
                >
                  <span className="inline-flex w-fit rounded-full border border-haven-blue/20 bg-haven-blue/5 px-3 py-1 font-mono-data text-xs font-medium text-haven-blue">
                    {category.label}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">
                    {category.note}
                  </p>

                  {samples.length > 0 ? (
                    <ul className="mt-4 space-y-2.5 border-t border-border-sand/70 pt-4">
                      {samples.slice(0, 2).map((product) => (
                        <li
                          key={product.id}
                          className="rounded-lg bg-cloud-cream/40 px-3 py-2"
                        >
                          <p className="line-clamp-1 text-sm font-medium text-night-ink">
                            {product.title}
                          </p>
                          <p className="font-mono-data text-xs text-graphite">
                            {product.sku} ·{' '}
                            {formatDimensions(
                              product.width,
                              product.height,
                              product.depth,
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <span className="mt-auto pt-4 text-sm font-medium text-haven-blue">
                    Browse {category.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
