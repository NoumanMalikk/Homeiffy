import Link from 'next/link';

import { getProductsBySkus } from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const RESTORE_SKUS = [
  'HMF-BED-020',
  'HMF-BED-021',
  'HMF-BED-022',
  'HMF-BED-023',
  'HMF-LIV-014',
];

export function RestoreCollection() {
  const products = getProductsBySkus(RESTORE_SKUS);

  return (
    <Section spacing="lg" background="subtle">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-start lg:gap-14">
          <ProductGrid className="order-2 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:order-1">
            {products.map((product) => (
              <ProductGridItem key={product.id} product={product}>
                <ProductCard product={product} />
              </ProductGridItem>
            ))}
          </ProductGrid>

          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Restore"
                title="Bedroom furniture for quieter rooms."
                description="Platform beds, nightstands, dressers, upholstered bed benches and a curved-back reading chair, organized for bedrooms and reading areas without wellness or sleep claims."
              />
              <div
                aria-hidden
                className="my-6 h-px w-full bg-gradient-to-r from-quiet-plum/40 via-border-sand to-transparent"
              />
              <Link
                href="/collections/bedroom"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                View bedroom collection
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
