'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { getProductsBySkus } from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { getProductMainImage } from '@/lib/product-display';
import { cn } from '@/lib/utils';

const RESET_SKUS = [
  'HMF-DIN-006',
  'HMF-TBL-018',
  'HMF-RST-024',
  'HMF-LIV-017',
  'HMF-DSK-011',
];

const arrangements = [
  {
    id: 'dining',
    label: 'Compact dining',
    description: 'Drop-leaf table with nesting side tables along the wall.',
    productSkus: ['HMF-DIN-006', 'HMF-TBL-018'],
  },
  {
    id: 'studio',
    label: 'Studio divide',
    description: 'Open room shelf defining workspace from lounge storage.',
    productSkus: ['HMF-RST-024', 'HMF-LIV-017'],
  },
  {
    id: 'entry-work',
    label: 'Entry to work',
    description: 'Foldaway console desk transitioning from hallway to desk.',
    productSkus: ['HMF-DSK-011', 'HMF-TBL-018'],
  },
] as const;

type ArrangementId = (typeof arrangements)[number]['id'];

export function ResetCollection() {
  const prefersReducedMotion = useReducedMotion();
  const products = getProductsBySkus(RESET_SKUS);
  const [activeArrangement, setActiveArrangement] = useState<ArrangementId>(
    arrangements[0].id,
  );

  const current =
    arrangements.find((item) => item.id === activeArrangement) ??
    arrangements[0];
  const highlighted = getProductsBySkus([...current.productSkus]);

  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          eyebrow="Reset"
          title="Flexible furniture when rooms change purpose."
          description="Drop-leaf tables, nesting side tables, room-divider shelves, storage ottomans and foldaway console desks. Mechanisms and functions shown only where verified."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-8">
          <div className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {arrangements.map((arrangement) => (
              <button
                key={arrangement.id}
                type="button"
                onClick={() => setActiveArrangement(arrangement.id)}
                aria-pressed={activeArrangement === arrangement.id}
                className={cn(
                  'shrink-0 rounded-lg border px-4 py-3 text-left text-sm transition-colors lg:shrink',
                  activeArrangement === arrangement.id
                    ? 'border-haven-blue bg-soft-white shadow-soft'
                    : 'border-border-sand bg-cloud-cream/40 hover:border-haven-blue/40',
                )}
              >
                {arrangement.label}
              </button>
            ))}
          </div>

          <div className="relative min-h-[16rem] overflow-hidden rounded-2xl border border-border-sand bg-gradient-to-br from-cloud-cream to-soft-white p-5 shadow-soft sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              >
                <p className="text-sm leading-relaxed text-graphite">
                  {current.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {highlighted.map((product) => {
                    const image = getProductMainImage(product);

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group overflow-hidden rounded-lg border border-border-sand bg-white transition-shadow hover:shadow-soft"
                      >
                        <div className="relative aspect-square bg-white">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 640px) 45vw, 200px"
                            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                        <div className="border-t border-border-sand/60 px-2.5 py-2">
                          <p className="line-clamp-2 text-xs font-medium text-night-ink">
                            {product.title}
                          </p>
                          <p className="font-mono-data text-[0.65rem] text-graphite">
                            {product.sku}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                className="block rounded-lg border border-border-sand bg-soft-white px-4 py-3 text-sm transition-colors hover:border-haven-blue/40"
              >
                <span className="font-medium text-night-ink">
                  {product.title}
                </span>
                <span className="mt-1 block font-mono-data text-xs text-graphite">
                  {product.sku}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/moments/reset"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Explore Reset moment
          </Link>
        </div>
      </Container>
    </Section>
  );
}
