import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { footprints, getFootprintBySlug } from '@/data/footprints';
import { getAllProducts } from '@/lib/products';

export function generateStaticParams() {
  return footprints.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const footprint = getFootprintBySlug(slug);
  if (!footprint) return { title: 'Footprint' };
  return {
    title: `${footprint.title} Furniture Footprint`,
    description: footprint.description,
  };
}

export default async function FootprintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const footprint = getFootprintBySlug(slug);
  if (!footprint) notFound();

  const products = getAllProducts().filter((product) =>
    product.footprintCategory.includes(footprint.slug),
  );

  return (
    <Section spacing="default" background="white">
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop by Footprint', href: '/footprints/compact' },
            { label: footprint.title, href: footprint.href },
          ]}
          className="mb-6"
        />
        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-homeiffy-teal">
            Shop by footprint
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium text-room-ink sm:text-4xl">
            {footprint.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-soft-graphite">
            {footprint.description}
          </p>
          <p className="mt-3 rounded-lg border border-border-sand bg-canvas-cream/60 px-4 py-3 text-sm text-soft-graphite">
            {footprint.guidance} Results use configured product dimensions.
            Confirm the complete room and delivery route before ordering. Homeiffy
            does not guarantee fit.
          </p>
        </header>
        {products.length > 0 ? (
          <ProductGrid>
            {products.map((product) => (
              <ProductGridItem key={product.id} product={product}>
                <ProductCard product={product} />
              </ProductGridItem>
            ))}
          </ProductGrid>
        ) : (
          <p className="text-soft-graphite">
            No products currently match this footprint category.
          </p>
        )}
      </Container>
    </Section>
  );
}
