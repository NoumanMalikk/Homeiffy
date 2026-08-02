import { storeConfig } from '@/data/store-config';
import { products } from '@/data/products';
import type {
  CartItem,
  FootprintResult,
  Product,
  ProductFilters,
  ProductSortOption,
} from '@/lib/types';
import { normalizeSku, sumNullable } from '@/lib/utils';

const productIndex = {
  byId: new Map(products.map((product) => [product.id, product])),
  bySlug: new Map(products.map((product) => [product.slug, product])),
  bySku: new Map(products.map((product) => [product.sku, product])),
};

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return productIndex.byId.get(id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return productIndex.bySlug.get(slug);
}

export function getProductBySku(sku: string): Product | undefined {
  return productIndex.bySku.get(normalizeSku(sku));
}

export function getProductsByMoment(momentSlug: string): Product[] {
  return products.filter((product) =>
    product.dailyMoments.includes(
      momentSlug as Product['dailyMoments'][number],
    ),
  );
}

export function getProductsByCategory(category: string): Product[] {
  const normalized = category.toLowerCase();

  return products.filter(
    (product) =>
      product.category.toLowerCase() === normalized ||
      product.subcategory.toLowerCase() === normalized ||
      product.subcategory.toLowerCase().replace(/-/g, ' ') === normalized,
  );
}

export function getProductsByRoom(room: string): Product[] {
  const normalized = room.toLowerCase();

  return products.filter((product) =>
    product.rooms.some((roomId) => roomId.toLowerCase() === normalized),
  );
}

function matchesSearchQuery(product: Product, query: string): boolean {
  const haystack = [
    product.title,
    product.sku,
    String(product.supplierSku),
    product.category,
    product.subcategory,
    ...product.dailyMoments,
    ...product.rooms,
    product.style,
    String(product.materials),
    String(product.surfaceFinish),
    String(product.upholsteryColor),
    String(product.storageType),
    String(product.packageContents),
    ...product.colorways.map((colorway) => colorway.label),
    ...product.searchKeywords,
    product.width !== null ? `${product.width}` : '',
    product.height !== null ? `${product.height}` : '',
    product.depth !== null ? `${product.depth}` : '',
    product.drawerCount !== null ? `${product.drawerCount} drawer` : '',
    product.shelfCount !== null ? `${product.shelfCount} shelf` : '',
  ]
    .join(' ')
    .toLowerCase();

  const terms = query.toLowerCase().trim().split(/\s+/);

  return terms.every((term) => haystack.includes(term));
}

export function filterProducts(filters: ProductFilters = {}): Product[] {
  return products.filter((product) => {
    if (
      filters.dailyMoments?.length &&
      !filters.dailyMoments.some((moment) =>
        product.dailyMoments.includes(moment),
      )
    ) {
      return false;
    }

    if (
      filters.footprints?.length &&
      !filters.footprints.some((footprint) =>
        product.footprintCategory.includes(footprint),
      )
    ) {
      return false;
    }

    if (
      filters.functions?.length &&
      !filters.functions.some((fn) => product.functions.includes(fn))
    ) {
      return false;
    }

    if (
      filters.rooms?.length &&
      !filters.rooms.some((room) => product.rooms.includes(room))
    ) {
      return false;
    }

    if (
      filters.categories?.length &&
      !filters.categories.some(
        (category) =>
          product.category.toLowerCase() === category.toLowerCase() ||
          product.subcategory.toLowerCase() === category.toLowerCase(),
      )
    ) {
      return false;
    }

    if (
      filters.subcategories?.length &&
      !filters.subcategories.includes(product.subcategory)
    ) {
      return false;
    }

    if (
      filters.minWidth !== undefined &&
      (product.width === null || product.width < filters.minWidth)
    ) {
      return false;
    }

    if (
      filters.maxWidth !== undefined &&
      (product.width === null || product.width > filters.maxWidth)
    ) {
      return false;
    }

    if (
      filters.minHeight !== undefined &&
      (product.height === null || product.height < filters.minHeight)
    ) {
      return false;
    }

    if (
      filters.maxHeight !== undefined &&
      (product.height === null || product.height > filters.maxHeight)
    ) {
      return false;
    }

    if (
      filters.minDepth !== undefined &&
      (product.depth === null || product.depth < filters.minDepth)
    ) {
      return false;
    }

    if (
      filters.maxDepth !== undefined &&
      (product.depth === null || product.depth > filters.maxDepth)
    ) {
      return false;
    }

    if (
      filters.minPrice !== undefined &&
      product.price < filters.minPrice
    ) {
      return false;
    }

    if (
      filters.maxPrice !== undefined &&
      product.price > filters.maxPrice
    ) {
      return false;
    }

    if (
      filters.shippingClasses?.length &&
      !filters.shippingClasses.includes(product.shippingClass)
    ) {
      return false;
    }

    if (filters.assemblyRequired !== undefined) {
      if (product.assemblyRequired !== filters.assemblyRequired) {
        return false;
      }
    }

    if (
      filters.productionReady !== undefined &&
      product.productionReady !== filters.productionReady
    ) {
      return false;
    }

    if (filters.featured !== undefined && product.featured !== filters.featured) {
      return false;
    }

    if (
      filters.newArrival !== undefined &&
      product.newArrival !== filters.newArrival
    ) {
      return false;
    }

    if (
      filters.searchQuery &&
      !matchesSearchQuery(product, filters.searchQuery)
    ) {
      return false;
    }

    return true;
  });
}

export function sortProducts(
  items: Product[],
  sort: ProductSortOption = 'featured',
): Product[] {
  const sorted = [...items];

  switch (sort) {
    case 'featured':
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
    case 'newest':
      sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
      break;
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'width-asc':
      sorted.sort((a, b) => (a.width ?? Infinity) - (b.width ?? Infinity));
      break;
    case 'depth-asc':
      sorted.sort((a, b) => (a.depth ?? Infinity) - (b.depth ?? Infinity));
      break;
    case 'height-asc':
      sorted.sort((a, b) => (a.height ?? Infinity) - (b.height ?? Infinity));
      break;
    default:
      break;
  }

  return sorted;
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) {
    return [];
  }

  return sortProducts(
    filterProducts({ searchQuery: query }),
    'featured',
  );
}

/**
 * A product can be bought when the catalog marks it purchasable and in stock.
 * Set `purchaseEnabled: false` or `availability: 'unavailable'` on a product to
 * take it off sale without removing it from the catalog.
 */
export function isProductPurchaseable(product: Product): boolean {
  return product.purchaseEnabled && product.availability === 'available';
}

export interface CartItemValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCartItem(item: CartItem): CartItemValidationResult {
  const errors: string[] = [];
  const product = getProductById(item.productId);

  if (!product) {
    return { valid: false, errors: ['Product not found.'] };
  }

  if (product.sku !== item.sku) {
    errors.push('SKU does not match the current product record.');
  }

  if (product.slug !== item.slug) {
    errors.push('Product slug does not match the current product record.');
  }

  if (product.price !== item.unitPrice) {
    errors.push('Unit price does not match the current product record.');
  }

  if (product.boxCount !== item.boxCount) {
    errors.push('Box count does not match the current product record.');
  }

  if (product.shippingClass !== item.shippingClass) {
    errors.push('Shipping class does not match the current product record.');
  }

  if (product.assemblyRequired !== item.assemblyRequired) {
    errors.push('Assembly status does not match the current product record.');
  }

  if (product.productionReady !== item.productionReady) {
    errors.push('Production status does not match the current product record.');
  }

  if (
    item.dimensionsSnapshot.width !== product.width ||
    item.dimensionsSnapshot.height !== product.height ||
    item.dimensionsSnapshot.depth !== product.depth
  ) {
    errors.push('Dimensions snapshot does not match the current product record.');
  }

  if (item.selectedFinishId) {
    const finishExists = product.colorways.some(
      (colorway) =>
        colorway.id === item.selectedFinishId && colorway.type === 'finish',
    );

    if (!finishExists) {
      errors.push('Selected finish is not valid for this product.');
    }
  }

  if (item.selectedUpholsteryId) {
    const upholsteryExists = product.colorways.some(
      (colorway) =>
        colorway.id === item.selectedUpholsteryId &&
        colorway.type === 'upholstery',
    );

    if (!upholsteryExists) {
      errors.push('Selected upholstery is not valid for this product.');
    }
  }

  if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
    errors.push('Quantity must be a positive whole number.');
  }

  if (!isProductPurchaseable(product) && storeConfig.siteEnv === 'production') {
    errors.push(
      'Product is not production ready and cannot be purchased in live mode.',
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function calculateFootprint(selectedProducts: Product[]): FootprintResult {
  const widths = selectedProducts.map((product) => product.width);
  const depths = selectedProducts.map((product) => product.depth);
  const heights = selectedProducts.map((product) => product.height);

  const hasMissingDimension = [...widths, ...depths, ...heights].some(
    (value) => value === null,
  );

  if (hasMissingDimension) {
    return {
      width: sumNullable(...widths),
      depth: Math.max(...depths.map((value) => value ?? 0)),
      height: Math.max(...heights.map((value) => value ?? 0)),
      productCount: selectedProducts.length,
      note:
        'Approximate combined bounding footprint. One or more products have unverified dimensions. Confirm room, doorway and circulation dimensions before ordering.',
    };
  }

  return {
    width: sumNullable(...widths),
    depth: Math.max(...depths.map((value) => value ?? 0)),
    height: Math.max(...heights.map((value) => value ?? 0)),
    productCount: selectedProducts.length,
    note:
      'Approximate combined bounding footprint based on listed product dimensions. Confirm room, doorway and circulation dimensions before ordering.',
  };
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featured = sortProducts(
    products.filter((product) => product.featured),
    'featured',
  );

  return limit ? featured.slice(0, limit) : featured;
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);

  if (!product) {
    return [];
  }

  return product.relatedProductIds
    .map((id) => getProductById(id))
    .filter((item): item is Product => Boolean(item))
    .slice(0, limit);
}

export function getCrossSellProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);

  if (!product) {
    return [];
  }

  return product.crossSellProductIds
    .map((id) => getProductById(id))
    .filter((item): item is Product => Boolean(item))
    .slice(0, limit);
}

export function getProductsByCompatibilityGroup(groupId: string): Product[] {
  return products.filter((product) =>
    product.roomCompatibilityIds.includes(groupId),
  );
}

export function getDefaultColorway(product: Product, type: 'finish' | 'upholstery') {
  return product.colorways.find((colorway) => colorway.type === type) ?? null;
}
