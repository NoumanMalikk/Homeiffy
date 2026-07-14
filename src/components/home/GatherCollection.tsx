import Link from 'next/link';

import { getProductsBySkus } from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const GATHER_SKUS = [
  'HMF-DIN-005',
  'HMF-DIN-006',
  'HMF-DIN-007',
  'HMF-DIN-008',
  'HMF-DIN-009',
];

export function GatherCollection() {
  const products = getProductsBySkus(GATHER_SKUS);

  return (
    <Section spacing="lg" background="cream">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Gather"
            title="Dining furniture for shared tables."
            description="Round and extendable tables, upholstered chairs, benches and sideboards. Compare width, extension and assembly before selecting."
            className="max-w-2xl"
          />
          <Link
            href="/collections/dining"
            className={cn(buttonVariants({ variant: 'outline' }), 'shrink-0')}
          >
            View dining collection
          </Link>
        </div>

        <ProductGrid className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductGridItem key={product.id} product={product}>
              <ProductCard product={product} />
            </ProductGridItem>
          ))}
        </ProductGrid>
      </Container>
    </Section>
  );
}
