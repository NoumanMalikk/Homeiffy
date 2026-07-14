import type { CartItem, Product } from '@/lib/types';

export function cartItemFromProduct(
  product: Product,
  overrides: Partial<CartItem> = {},
): CartItem {
  return {
    productId: product.id,
    sku: product.sku,
    slug: product.slug,
    title: product.title,
    quantity: 1,
    unitPrice: product.price,
    selectedFinishId: null,
    selectedUpholsteryId: null,
    selectedConfiguration: null,
    dimensionsSnapshot: {
      width: product.width,
      height: product.height,
      depth: product.depth,
    },
    boxCount: product.boxCount,
    shippingClass: product.shippingClass,
    assemblyRequired: product.assemblyRequired,
    productionReady: product.productionReady,
    ...overrides,
  };
}
