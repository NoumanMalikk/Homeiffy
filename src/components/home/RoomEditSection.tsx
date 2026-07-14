import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/home/SectionHeading';
import { getProductBySku } from '@/lib/products';
import { getProductMainImage } from '@/lib/product-display';
import { formatPrice, formatDimensions } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';

export function RoomEditSection({
  eyebrow,
  title,
  description,
  skus,
  href,
  accent = 'teal',
}: {
  eyebrow: string;
  title: string;
  description: string;
  skus: string[];
  href: string;
  accent?: 'teal' | 'olive';
}) {
  const products = skus
    .map((sku) => getProductBySku(sku))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <section
      aria-labelledby={`${eyebrow.replace(/\s+/g, '-').toLowerCase()}-edit-heading`}
      className={`border-b border-border-sand/50 py-16 sm:py-20 ${
        accent === 'olive' ? 'bg-[#3D5548]/[0.04]' : ''
      }`}
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            id={`${eyebrow.replace(/\s+/g, '-').toLowerCase()}-edit-heading`}
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <Link
            href={href}
            className="text-sm font-medium text-homeiffy-teal underline-offset-4 hover:underline"
          >
            View collection
          </Link>
        </div>
        <div className="mt-10">
          <ProductGrid>
            {products.map((product) => (
              <ProductGridItem key={product.id} product={product}>
                <ProductCard product={product} />
              </ProductGridItem>
            ))}
          </ProductGrid>
        </div>
      </Container>
    </section>
  );
}

export function ExactProductView() {
  const sequence = [
    'HMF-LIV-002',
    'HMF-LIV-004',
    'HMF-LIV-007',
    'HMF-DIN-001',
    'HMF-ENT-001',
  ]
    .map((sku) => getProductBySku(sku))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <section
      aria-labelledby="exact-product-view-heading"
      className="border-b border-border-sand/50 bg-white/70 py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          id="exact-product-view-heading"
          eyebrow="Exact product view"
          title="See the product before the room."
          description="Isolated catalog views keep the product, proportions and finish readable before lifestyle context."
        />
        <div className="mt-10 flex gap-4 overflow-x-auto pb-2">
          {sequence.map((product) => {
            const image = getProductMainImage(product);
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="w-56 shrink-0 overflow-hidden rounded-2xl border border-border-sand/70 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-homeiffy-teal sm:w-64"
              >
                <div className="relative aspect-square bg-white">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="256px"
                    className="object-contain p-5"
                  />
                </div>
                <div className="space-y-1 border-t border-border-sand/60 px-4 py-3">
                  <p className="line-clamp-2 font-display text-base text-room-ink">
                    {product.title}
                  </p>
                  <p className="font-mono-dims text-xs text-soft-graphite">
                    {formatDimensions(product.width, product.height, product.depth)}
                  </p>
                  <p className="text-sm font-semibold text-room-ink">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function TransformingFurniture() {
  const products = [
    'HMF-DIN-002',
    'HMF-LIV-007',
    'HMF-LIV-008',
    'HMF-LIV-006',
    'HMF-OFF-001',
    'HMF-LIV-003',
  ]
    .map((sku) => getProductBySku(sku))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <section
      aria-labelledby="transforming-furniture-heading"
      className="border-b border-border-sand/50 py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          id="transforming-furniture-heading"
          eyebrow="Transforming furniture"
          title="Pieces that change how a room works"
          description="Drop-leaf tables, lift-top storage, nesting sets, foldaway desks and modular seats, only where the mechanism is listed in the product record."
        />
        <div className="mt-10">
          <ProductGrid>
            {products.map((product) => (
              <ProductGridItem key={product.id} product={product}>
                <ProductCard product={product} />
              </ProductGridItem>
            ))}
          </ProductGrid>
        </div>
      </Container>
    </section>
  );
}

export function RoomFitPreview() {
  return (
    <section
      aria-labelledby="room-fit-preview-heading"
      className="border-b border-border-sand/50 bg-[#12161C] py-16 text-[#ECEAE4] sm:py-20"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8793A]">
              Room-fit finder
            </p>
            <h2
              id="room-fit-preview-heading"
              className="mt-3 font-display text-3xl sm:text-4xl"
            >
              Match furniture to your available width, depth and doorway.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#D9D1C5]">
              Enter room and delivery-route measurements to see catalog products
              whose configured dimensions fit within your inputs. Results are
              estimates only. Confirm the complete room and delivery route before
              ordering.
            </p>
            <Link
              href="/room-fit-finder"
              className="mt-8 inline-flex rounded-md bg-[#0F6B63] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c5751]"
            >
              Open room-fit finder
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 font-mono-dims text-sm leading-7 text-[#D9D1C5]">
            <p>1. Choose the room</p>
            <p>2. Enter max width and depth</p>
            <p>3. Enter doorway width</p>
            <p>4. Note stairs or elevator</p>
            <p>5. Prefer storage or expandable?</p>
            <p className="mt-4 text-[#B8793A]">→ Matching catalog products</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
