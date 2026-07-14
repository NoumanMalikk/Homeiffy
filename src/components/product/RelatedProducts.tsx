import { ProductCard } from '@/components/product/ProductCard';
import {
  ProductGrid,
  ProductGridItem,
} from '@/components/product/ProductGrid';
import { getRelatedProducts } from '@/lib/products';
import type { Product } from '@/lib/types';

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const related = getRelatedProducts(product.id, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-products-heading">
      <h2
        id="related-products-heading"
        className="font-display text-2xl font-medium text-night-ink"
      >
        Related products
      </h2>
      <div className="mt-6">
        <ProductGrid>
          {related.map((item) => (
            <ProductGridItem key={item.id} product={item}>
              <ProductCard product={item} />
            </ProductGridItem>
          ))}
        </ProductGrid>
      </div>
    </section>
  );
}
