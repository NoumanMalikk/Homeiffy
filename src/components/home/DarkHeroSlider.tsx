'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getProductBySku } from '@/lib/products';
import { getProductMainImage } from '@/lib/product-display';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { cn, formatPrice } from '@/lib/utils';

const SLIDES = [
  {
    sku: 'HMF-LIV-004',
    eyebrow: 'Homeiffy seating',
    titleLines: ['Curved', 'Lounge Chair.'],
    copy: 'Exact product imagery, clear dimensions and finish options for real rooms.',
  },
  {
    sku: 'HMF-LIV-002',
    eyebrow: 'Compact living',
    titleLines: ['Apartment', 'Loveseat.'],
    copy: 'Sized for tighter living rooms with verified width, depth and upholstery choices.',
  },
  {
    sku: 'HMF-DIN-001',
    eyebrow: 'Dining collection',
    titleLines: ['Round', 'Dining Table.'],
    copy: 'A compact dining surface with clear footprint guidance before you order.',
  },
] as const;

export function DarkHeroSlider() {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(next, 6500);
    return () => window.clearInterval(timer);
  }, [next, reducedMotion]);

  const slide = SLIDES[index]!;
  const product = getProductBySku(slide.sku);
  const image = product ? getProductMainImage(product) : null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured furniture"
      className="relative overflow-hidden border-b border-wd-line bg-wd-black"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgb(232_162_75/0.12),transparent_55%)]" />

      <Container className="relative py-10 sm:py-14 lg:py-20">
        <div className="grid min-h-[28rem] items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.sku + '-copy'}
              initial={reducedMotion ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, x: 24 }}
              transition={{ duration: 0.45 }}
              className="relative z-10 max-w-xl"
            >
              <p className="wd-section-label">{slide.eyebrow}</p>
              <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-wd-text sm:text-5xl lg:text-6xl">
                {slide.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-wd-muted sm:text-base">
                {slide.copy}
              </p>
              {product ? (
                <p className="mt-6 font-display text-2xl text-wd-accent sm:text-3xl">
                  {formatPrice(product.price)}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {product ? (
                  <Link
                    href={`/products/${product.slug}`}
                    className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}
                  >
                    View Product
                  </Link>
                ) : null}
                <Link
                  href="/shop"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                >
                  Shop All
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.sku + '-image'}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto aspect-square w-full max-w-lg"
            >
              {image && product ? (
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 90vw, 480px"
                    className="object-contain p-4 drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)] sm:p-8"
                  />
                </Link>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Hero slides">
            {SLIDES.map((item, i) => (
              <button
                key={item.sku}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-1 w-8 transition-colors',
                  i === index ? 'bg-wd-accent' : 'bg-wd-line hover:bg-wd-muted',
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="inline-flex size-11 items-center justify-center border border-wd-line text-wd-text transition hover:border-wd-accent hover:text-wd-accent"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="inline-flex size-11 items-center justify-center border border-wd-line text-wd-text transition hover:border-wd-accent hover:text-wd-accent"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
