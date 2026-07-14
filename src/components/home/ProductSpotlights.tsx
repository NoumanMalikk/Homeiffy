import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getProductBySku } from '@/lib/products';
import { getProductMainImage } from '@/lib/product-display';
import { cn, formatDimensions, formatPrice } from '@/lib/utils';

const SPOTLIGHTS = [
  {
    sku: 'HMF-LIV-005',
    label: 'Product spotlight',
    headline: ['High-Back', 'Reading Chair.'],
    meta: [
      { label: 'Room', value: 'Living / Bedroom' },
      { label: 'Footprint', value: 'Standard' },
      { label: 'Function', value: 'Sit' },
    ],
  },
  {
    sku: 'HMF-LIV-007',
    label: 'Product spotlight',
    headline: ['Lift-Top', 'Coffee Table.'],
    meta: [
      { label: 'Room', value: 'Living' },
      { label: 'Footprint', value: 'Expandable' },
      { label: 'Function', value: 'Transform' },
    ],
  },
  {
    sku: 'HMF-BED-004',
    label: 'Product spotlight',
    headline: ['Six-Drawer', 'Dresser.'],
    meta: [
      { label: 'Room', value: 'Bedroom' },
      { label: 'Footprint', value: 'Wide' },
      { label: 'Function', value: 'Store' },
    ],
  },
] as const;

export function ProductSpotlights() {
  return (
    <section className="border-b border-wd-line bg-wd-black">
      {SPOTLIGHTS.map((spot, index) => {
        const product = getProductBySku(spot.sku);
        if (!product) return null;
        const image = getProductMainImage(product);
        const reverse = index % 2 === 1;

        return (
          <div
            key={spot.sku}
            className="border-b border-wd-line last:border-b-0"
          >
            <Container className="py-14 sm:py-20">
              <div
                className={cn(
                  'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
                  reverse && 'lg:[&>*:first-child]:order-2',
                )}
              >
                <div>
                  <p className="wd-section-label">{spot.label}</p>
                  <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-wd-text sm:text-4xl lg:text-5xl">
                    {spot.headline.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <dl className="mt-8 space-y-3 border-l border-wd-accent/50 pl-4 text-sm">
                    {spot.meta.map((row) => (
                      <div key={row.label} className="flex gap-3">
                        <dt className="w-24 uppercase tracking-[0.12em] text-wd-muted">
                          {row.label}
                        </dt>
                        <dd className="text-wd-text">{row.value}</dd>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <dt className="w-24 uppercase tracking-[0.12em] text-wd-muted">
                        Size
                      </dt>
                      <dd className="font-mono-data text-wd-text">
                        {formatDimensions(
                          product.width,
                          product.height,
                          product.depth,
                        )}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-6 font-display text-2xl text-wd-accent">
                    {formatPrice(product.price)}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className={cn(
                      buttonVariants({ variant: 'primary', size: 'lg' }),
                      'mt-8',
                    )}
                  >
                    View Product
                  </Link>
                </div>
                <div className="relative aspect-square bg-gradient-to-b from-[#242424] to-[#121212]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6 sm:p-10 drop-shadow-[0_24px_50px_rgba(0,0,0,0.55)]"
                  />
                </div>
              </div>
            </Container>
          </div>
        );
      })}
    </section>
  );
}
