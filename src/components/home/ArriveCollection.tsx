import Link from 'next/link';

import { getProductsBySkus } from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const ARRIVE_SKUS = [
  'HMF-ENT-001',
  'HMF-ENT-002',
  'HMF-ENT-003',
  'HMF-ENT-004',
];

export function ArriveCollection() {
  const products = getProductsBySkus(ARRIVE_SKUS);

  return (
    <Section spacing="lg">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Arrive"
              title="Entryway furniture for the threshold."
              description="Narrow consoles, storage benches, shoe cabinets and hall storage, framed by the architectural line of the doorway."
            />
            <Link
              href="/collections/entryway"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'mt-6',
              )}
            >
              View entryway collection
            </Link>
          </div>

          <ProductGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {products.map((product) => (
              <ProductGridItem key={product.id} product={product}>
                <ProductCard product={product} />
              </ProductGridItem>
            ))}
          </ProductGrid>
        </div>
      </Container>
    </Section>
  );
}
