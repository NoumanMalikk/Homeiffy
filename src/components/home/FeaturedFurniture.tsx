import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { getFeaturedProducts } from '@/lib/products';

export function FeaturedFurniture() {
  const featured = getFeaturedProducts();

  return (
    <Section spacing="lg" background="subtle">
      <Container>
        <SectionHeading
          title="Furniture selected for real spaces"
          description="A balanced selection across living, bedroom, dining, entryway, storage and home office, shown with configured dimensions from the product record."
        />

        <ProductGrid className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductGridItem key={product.id} product={product}>
              <ProductCard product={product} />
            </ProductGridItem>
          ))}
        </ProductGrid>
      </Container>
    </Section>
  );
}
