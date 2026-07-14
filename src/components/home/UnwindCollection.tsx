import Link from 'next/link';

import { getProductsBySkus } from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const UNWIND_SKUS = [
  'HMF-LIV-014',
  'HMF-LIV-015',
  'HMF-LIV-016',
  'HMF-LIV-017',
  'HMF-TBL-018',
];

export function UnwindCollection() {
  const products = getProductsBySkus(UNWIND_SKUS);

  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Unwind"
            title="Furniture for when the pace changes."
            description="Lounge chairs, compact loveseats, modular seating, storage ottomans and nesting side tables, shown with listed upholstery colorways. Material performance claims are not published until verified."
            align="center"
            className="mx-auto"
          />
          <Link
            href="/collections/living-room"
            className={cn(buttonVariants({ variant: 'outline' }), 'mt-6')}
          >
            View living-room collection
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
