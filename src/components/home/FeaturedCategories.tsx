import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { getAllProducts } from '@/lib/products';
import { getProductBySku } from '@/lib/products';
import { getProductMainImage } from '@/lib/product-display';

const CATEGORIES = [
  {
    title: 'Living',
    href: '/collections/living-room',
    sku: 'HMF-LIV-001',
    countFn: (products: ReturnType<typeof getAllProducts>) =>
      products.filter((p) => p.rooms.includes('living-room')).length,
  },
  {
    title: 'Bedroom',
    href: '/collections/bedroom',
    sku: 'HMF-BED-001',
    countFn: (products: ReturnType<typeof getAllProducts>) =>
      products.filter((p) => p.rooms.includes('bedroom')).length,
  },
  {
    title: 'Dining',
    href: '/collections/dining',
    sku: 'HMF-DIN-001',
    countFn: (products: ReturnType<typeof getAllProducts>) =>
      products.filter(
        (p) =>
          p.rooms.includes('dining-room') || p.rooms.includes('dining-area'),
      ).length,
  },
  {
    title: 'Entryway',
    href: '/collections/entryway',
    sku: 'HMF-ENT-001',
    countFn: (products: ReturnType<typeof getAllProducts>) =>
      products.filter((p) => p.rooms.includes('entryway')).length,
  },
  {
    title: 'Storage',
    href: '/collections/storage',
    sku: 'HMF-STO-001',
    countFn: (products: ReturnType<typeof getAllProducts>) =>
      products.filter(
        (p) =>
          p.functions.includes('store') ||
          p.category.toLowerCase().includes('storage'),
      ).length,
  },
] as const;

export function FeaturedCategories() {
  const all = getAllProducts();

  return (
    <section className="border-b border-wd-line bg-wd-black py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="wd-section-label">Homeiffy collections</p>
          <h2 className="wd-section-title mt-3">Featured categories</h2>
          <p className="mt-3 text-sm text-wd-muted sm:text-base">
            Browse living, bedroom, dining, entryway and storage furniture with
            exact product images and clear dimensions.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const product = getProductBySku(cat.sku);
            const image = product ? getProductMainImage(product) : null;
            const count = cat.countFn(all);

            return (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className="group relative block overflow-hidden bg-wd-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent"
                >
                  <div className="relative aspect-[4/5]">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-contain p-5 transition duration-500 group-hover:scale-[1.04] drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-xl text-wd-text">{cat.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-wd-accent">
                        {count} products
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
