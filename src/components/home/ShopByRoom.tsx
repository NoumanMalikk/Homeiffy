import Link from 'next/link';
import Image from 'next/image';

import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/home/SectionHeading';
import { getProductBySku } from '@/lib/products';
import { getProductMainImage } from '@/lib/product-display';

const roomTiles = [
  {
    title: 'Living Room',
    href: '/collections/living-room',
    sku: 'HMF-LIV-001',
    tone: 'bg-[#456C6A]/10',
  },
  {
    title: 'Bedroom',
    href: '/collections/bedroom',
    sku: 'HMF-BED-001',
    tone: 'bg-[#766275]/10',
  },
  {
    title: 'Dining Room',
    href: '/collections/dining',
    sku: 'HMF-DIN-001',
    tone: 'bg-[#B76D55]/10',
  },
  {
    title: 'Entryway',
    href: '/collections/entryway',
    sku: 'HMF-ENT-001',
    tone: 'bg-[#65705B]/12',
  },
  {
    title: 'Home Office',
    href: '/collections/home-office',
    sku: 'HMF-OFF-001',
    tone: 'bg-[#C69E51]/12',
  },
  {
    title: 'Flexible Space',
    href: '/collections/storage',
    sku: 'HMF-STO-001',
    tone: 'bg-[#BCA98C]/18',
  },
] as const;

export function ShopByRoom() {
  return (
    <section aria-labelledby="shop-by-room-heading" className="border-b border-border-sand/50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          id="shop-by-room-heading"
          eyebrow="Shop by room"
          title="Start with the room you are furnishing"
          description="Each room collection uses active catalog products with clear dimensions and finish options."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roomTiles.map((tile) => {
            const product = getProductBySku(tile.sku);
            const image = product ? getProductMainImage(product) : null;
            return (
              <li key={tile.href}>
                <Link
                  href={tile.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-sand/70 bg-white transition hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-homeiffy-teal"
                >
                  <div className={`relative aspect-[5/4] ${tile.tone}`}>
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <h3 className="font-display text-xl text-room-ink">{tile.title}</h3>
                    <span className="text-sm text-homeiffy-teal">Shop</span>
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
