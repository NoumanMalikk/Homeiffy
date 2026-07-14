'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getHeroProducts } from '@/components/home/home-data';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function SignatureHero() {
  const prefersReducedMotion = useReducedMotion();
  const products = getHeroProducts();
  const featured = products[0] ?? products[1];
  const supporting = products.filter((item) => item.sku !== featured?.sku).slice(0, 4);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border-sand/50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgb(183_109_85_/_0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgb(69_108_106_/_0.12),_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas-cream via-gallery-white/80 to-canvas-cream"
      />

      <Container className="relative py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-homeiffy-teal sm:text-sm">
              Furniture designed around real rooms
            </p>
            <h1
              id="hero-heading"
              className="mt-4 font-display text-[2.15rem] font-medium leading-[1.08] tracking-tight text-room-ink sm:text-5xl lg:text-[3.35rem]"
            >
              Bring home furniture that earns its space.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-soft-graphite sm:text-lg">
              Browse living, bedroom, dining, entryway, storage and home-office
              furniture with exact product images, clear dimensions and practical
              room-planning tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}
              >
                Shop Furniture
              </Link>
              <Link
                href="/room-fit-finder"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Find Your Room Fit
              </Link>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-soft-graphite">
              Review the exact dimensions, finish, upholstery, package information
              and delivery route before ordering.
            </p>
          </div>

          <motion.div
            className="relative min-w-0"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {featured ? (
              <Link
                href={`/products/${featured.product.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-border-sand/70 bg-white shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-homeiffy-teal focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/3] w-full bg-white sm:aspect-[5/4]">
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-contain p-6 sm:p-10"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-border-sand/60 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg text-room-ink">
                      {featured.product.title}
                    </p>
                    <p className="mt-1 font-mono-dims text-sm text-soft-graphite">
                      {featured.product.width}&quot; W × {featured.product.depth}&quot; D
                    </p>
                  </div>
                  <p className="shrink-0 text-base font-semibold text-room-ink">
                    {formatPrice(featured.product.price)}
                  </p>
                </div>
              </Link>
            ) : null}

            {supporting.length > 0 ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {supporting.map((item, index) => (
                  <motion.li
                    key={item.sku}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.06, duration: 0.45 }}
                  >
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="group block overflow-hidden rounded-xl border border-border-sand/70 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-homeiffy-teal"
                    >
                      <div className="relative aspect-square bg-white">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes="120px"
                          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/** @deprecated Use SignatureHero */
export const DayToHavenHero = SignatureHero;
