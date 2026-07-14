import { categories, categoryBySlug } from '@/data/categories';
import { dailyMoments } from '@/data/daily-moments';
import { rooms } from '@/data/rooms';
import { shippingClasses } from '@/data/shipping-classes';
import {
  filterProducts,
  getAllProducts,
  sortProducts,
} from '@/lib/products';
import type {
  Category,
  DailyMomentSlug,
  Product,
  ProductFilters,
  ProductSortOption,
  ShippingClassId,
} from '@/lib/types';

export type CatalogSearchParams = Record<
  string,
  string | string[] | undefined
>;

export interface ExtendedCatalogFilters extends ProductFilters {
  finishIds?: string[];
  upholsteryIds?: string[];
  hasDrawers?: boolean;
  hasShelves?: boolean;
  hasStorage?: boolean;
  isExpandable?: boolean;
  sort?: ProductSortOption;
}

const VALID_SORTS: ProductSortOption[] = [
  'featured',
  'newest',
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
  'width-asc',
  'depth-asc',
  'height-asc',
];

function parseArrayParam(
  value: string | string[] | undefined,
): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const items = (Array.isArray(value) ? value : value.split(','))
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

function parseNumberParam(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBooleanParam(value: string | undefined): boolean | undefined {
  if (value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  return undefined;
}

export function parseCatalogSearchParams(
  params: CatalogSearchParams,
): ExtendedCatalogFilters {
  const moments = parseArrayParam(params.moment) as
    | DailyMomentSlug[]
    | undefined;
  const roomSlugs = parseArrayParam(params.room);
  const categorySlugs = parseArrayParam(params.category);
  const subcategorySlugs = parseArrayParam(params.subcategory);
  const finishIds = parseArrayParam(params.finish);
  const upholsteryIds = parseArrayParam(params.upholstery);
  const shippingParam = parseArrayParam(params.shipping) as
    | ShippingClassId[]
    | undefined;

  const sortParam = typeof params.sort === 'string' ? params.sort : undefined;
  const sort = VALID_SORTS.includes(sortParam as ProductSortOption)
    ? (sortParam as ProductSortOption)
    : 'featured';

  return {
    dailyMoments: moments,
    rooms: roomSlugs,
    categories: categorySlugs,
    subcategories: subcategorySlugs,
    minWidth: parseNumberParam(
      typeof params.minWidth === 'string' ? params.minWidth : undefined,
    ),
    maxWidth: parseNumberParam(
      typeof params.maxWidth === 'string' ? params.maxWidth : undefined,
    ),
    minPrice: parseNumberParam(
      typeof params.minPrice === 'string' ? params.minPrice : undefined,
    ),
    maxPrice: parseNumberParam(
      typeof params.maxPrice === 'string' ? params.maxPrice : undefined,
    ),
    shippingClasses: shippingParam,
    assemblyRequired: parseBooleanParam(
      typeof params.assembly === 'string' ? params.assembly : undefined,
    ),
    productionReady: parseBooleanParam(
      typeof params.productionReady === 'string'
        ? params.productionReady
        : undefined,
    ),
    searchQuery:
      typeof params.q === 'string' && params.q.trim()
        ? params.q.trim()
        : undefined,
    finishIds,
    upholsteryIds,
    hasDrawers: parseBooleanParam(
      typeof params.drawers === 'string' ? params.drawers : undefined,
    ),
    hasShelves: parseBooleanParam(
      typeof params.shelves === 'string' ? params.shelves : undefined,
    ),
    hasStorage: parseBooleanParam(
      typeof params.storage === 'string' ? params.storage : undefined,
    ),
    isExpandable: parseBooleanParam(
      typeof params.expandable === 'string' ? params.expandable : undefined,
    ),
    sort,
  };
}

function getDescendantCategories(parentId: string): Category[] {
  const children = categories.filter((category) => category.parentId === parentId);

  return children.flatMap((child) => [
    child,
    ...getDescendantCategories(child.id),
  ]);
}

export function getCollectionSlugs(): string[] {
  const slugs = new Set<string>();

  for (const category of categories) {
    if (category.collectionPath.startsWith('/collections/')) {
      slugs.add(category.collectionPath.slice('/collections/'.length));
    }

    slugs.add(category.slug);
  }

  return [...slugs]
    .filter((slug) => slug.length > 0 && !slug.includes('/'))
    .sort();
}

export function getProductsForCollection(slug: string): Product[] {
  const category = categoryBySlug[slug];

  if (!category) {
    return [];
  }

  const descendants = getDescendantCategories(category.id);
  const subcategoryKeys = new Set<string>([
    category.id,
    category.slug,
    ...descendants.flatMap((item) => [item.id, item.slug]),
  ]);

  let results = getAllProducts().filter((product) =>
    subcategoryKeys.has(product.subcategory),
  );

  if (slug === 'reading-chairs') {
    const readingMatches = getAllProducts().filter(
      (product) =>
        product.subcategory === 'lounge-chairs' &&
        product.rooms.some((roomId) => category.roomIds.includes(roomId)),
    );

    const merged = new Map(results.map((product) => [product.id, product]));

    for (const product of readingMatches) {
      merged.set(product.id, product);
    }

    results = [...merged.values()];
  }

  return results;
}

export function getProductsForMoment(slug: DailyMomentSlug): Product[] {
  const moment = dailyMoments.find((item) => item.slug === slug);

  if (!moment) {
    return [];
  }

  const byTag = getAllProducts().filter((product) =>
    product.dailyMoments.includes(slug),
  );
  const bySku = moment.productSkus
    .map((sku) => getAllProducts().find((product) => product.sku === sku))
    .filter((product): product is Product => Boolean(product));

  const merged = new Map<string, Product>();

  for (const product of [...byTag, ...bySku]) {
    merged.set(product.id, product);
  }

  return [...merged.values()];
}

function applyExtendedFilters(
  products: Product[],
  filters: ExtendedCatalogFilters,
): Product[] {
  return products.filter((product) => {
    if (
      filters.finishIds?.length &&
      !filters.finishIds.some((finishId) =>
        product.colorways.some(
          (colorway) =>
            colorway.type === 'finish' && colorway.id === finishId,
        ),
      )
    ) {
      return false;
    }

    if (
      filters.upholsteryIds?.length &&
      !filters.upholsteryIds.some((upholsteryId) =>
        product.colorways.some(
          (colorway) =>
            colorway.type === 'upholstery' && colorway.id === upholsteryId,
        ),
      )
    ) {
      return false;
    }

    if (filters.hasDrawers !== undefined) {
      const hasDrawers =
        product.drawerCount !== null && product.drawerCount > 0;

      if (filters.hasDrawers !== hasDrawers) {
        return false;
      }
    }

    if (filters.hasShelves !== undefined) {
      const hasShelves =
        product.shelfCount !== null && product.shelfCount > 0;

      if (filters.hasShelves !== hasShelves) {
        return false;
      }
    }

    if (filters.hasStorage !== undefined) {
      const hasStorage = product.storageType !== null;

      if (filters.hasStorage !== hasStorage) {
        return false;
      }
    }

    if (filters.isExpandable !== undefined) {
      const isExpandable = product.extensionMechanism !== null;

      if (filters.isExpandable !== isExpandable) {
        return false;
      }
    }

    return true;
  });
}

export function applyCatalogFilters(
  products: Product[],
  filters: ExtendedCatalogFilters,
): Product[] {
  const { sort, finishIds, upholsteryIds, hasDrawers, hasShelves, hasStorage, isExpandable, ...baseFilters } =
    filters;

  const baseFiltered = filterProducts(baseFilters);
  const allowedIds = new Set(products.map((product) => product.id));
  const scoped = baseFiltered.filter((product) => allowedIds.has(product.id));

  return applyExtendedFilters(scoped, {
    finishIds,
    upholsteryIds,
    hasDrawers,
    hasShelves,
    hasStorage,
    isExpandable,
    sort,
  });
}

export function getCatalogResults(
  products: Product[],
  params: CatalogSearchParams,
): { items: Product[]; filters: ExtendedCatalogFilters } {
  const filters = parseCatalogSearchParams(params);
  const filtered = applyCatalogFilters(products, filters);
  const items = sortProducts(filtered, filters.sort ?? 'featured');

  return { items, filters };
}

export interface CatalogFilterOptions {
  finishes: { id: string; label: string; hex: string }[];
  upholsteries: { id: string; label: string; hex: string }[];
  widthRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

export function getCatalogFilterOptions(
  products: Product[] = getAllProducts(),
): CatalogFilterOptions {
  const finishMap = new Map<string, { id: string; label: string; hex: string }>();
  const upholsteryMap = new Map<
    string,
    { id: string; label: string; hex: string }
  >();

  let minWidth = Infinity;
  let maxWidth = 0;
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const product of products) {
    for (const colorway of product.colorways) {
      if (colorway.type === 'finish') {
        finishMap.set(colorway.id, colorway);
      }

      if (colorway.type === 'upholstery') {
        upholsteryMap.set(colorway.id, colorway);
      }
    }

    if (product.width !== null) {
      minWidth = Math.min(minWidth, product.width);
      maxWidth = Math.max(maxWidth, product.width);
    }

    minPrice = Math.min(minPrice, product.price);
    maxPrice = Math.max(maxPrice, product.price);
  }

  return {
    finishes: [...finishMap.values()].sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    upholsteries: [...upholsteryMap.values()].sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    widthRange: {
      min: Number.isFinite(minWidth) ? minWidth : 0,
      max: Number.isFinite(maxWidth) ? maxWidth : 0,
    },
    priceRange: {
      min: Number.isFinite(minPrice) ? minPrice : 0,
      max: Number.isFinite(maxPrice) ? maxPrice : 0,
    },
  };
}

export function buildCatalogQueryString(
  current: CatalogSearchParams,
  updates: Record<string, string | string[] | null | undefined>,
): string {
  const params = new URLSearchParams();

  const merged: Record<string, string | string[] | null | undefined> = {
    ...current,
    ...updates,
  };

  for (const [key, value] of Object.entries(merged)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(','));
      }
      continue;
    }

    params.set(key, value);
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

export { categories, dailyMoments, rooms, shippingClasses };
