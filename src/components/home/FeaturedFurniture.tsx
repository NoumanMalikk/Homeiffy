import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { Container } from '@/components/ui/container';
import { getFeaturedProducts } from '@/lib/products';

export function FeaturedFurniture() {
  const featured = getFeaturedProducts().slice(0, 8);

  return (
    <section className="border-b border-wd-line bg-wd-black py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="wd-section-label">Furniture for real rooms</p>
          <h2 className="wd-section-title mt-3">Featured products</h2>
          <p className="mt-3 text-sm text-wd-muted sm:text-base">
            A balanced selection across living, bedroom, dining, entryway and
            storage, with configured dimensions from each product record.
          </p>
        </div>

        <ProductGrid className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductGridItem key={product.id} product={product}>
              <ProductCard product={product} />
            </ProductGridItem>
          ))}
        </ProductGrid>
      </Container>
    </section>
  );
}
