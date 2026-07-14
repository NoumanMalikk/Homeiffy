import { shippingClassById } from '@/data/shipping-classes';
import { storeConfig } from '@/data/store-config';
import type {
  CartItem,
  Product,
  ShippingClassId,
  UnknownFieldValue,
} from '@/lib/types';

export interface StagingShippingLineBreakdown {
  sku: string;
  title: string;
  shippingClass: ShippingClassId;
  boxCount: number;
  quantity: number;
  stagingAmount: number;
  note: string;
}

export interface StagingShippingQuote {
  /** Always true - these rates are illustrative only. */
  isStagingRate: true;
  label: string;
  amount: number;
  currency: string;
  destinationZip: string;
  lineBreakdown: StagingShippingLineBreakdown[];
  note: string;
}

const STAGING_BASE_RATES: Record<ShippingClassId, number> = {
  'small-furniture-parcel': 29,
  'standard-furniture-parcel': 49,
  'multi-box-furniture': 89,
  'oversized-furniture': 149,
  'upholstered-furniture': 129,
  'fragile-surface': 69,
  'glass-component': 79,
  'freight-review-required': 0,
};

function normalizeBoxCount(boxCount: number | UnknownFieldValue): number {
  return typeof boxCount === 'number' && boxCount > 0 ? boxCount : 1;
}

function regionMultiplier(destinationZip: string): number {
  const prefix = destinationZip.trim().slice(0, 3);

  if (!/^\d{3}$/.test(prefix)) {
    return 1;
  }

  const numeric = Number(prefix);

  if (numeric >= 900 && numeric <= 966) {
    return 1.05;
  }

  if (numeric >= 0 && numeric <= 299) {
    return 1.08;
  }

  return 1;
}

/** Returns the catalog shipping class for a product. */
export function assignShippingClass(product: Product): ShippingClassId {
  return product.shippingClass;
}

/**
 * Derives a shipping class from product attributes when the catalog class
 * needs supplemental review. Prefer `product.shippingClass` in production paths.
 */
export function assignShippingClassFromAttributes(product: Product): ShippingClassId {
  const upholsterySelected = product.colorways.some(
    (colorway) => colorway.type === 'upholstery',
  );

  if (upholsteredHandlingRequired(product) || upholsterySelected) {
    return 'upholstered-furniture';
  }

  const boxCount = normalizeBoxCount(product.boxCount);

  if (boxCount > 1) {
    return 'multi-box-furniture';
  }

  const width = product.width ?? 0;
  const height = product.height ?? 0;
  const depth = product.depth ?? 0;
  const maxDimension = Math.max(width, height, depth);

  if (maxDimension >= 72) {
    return 'oversized-furniture';
  }

  if (
    product.shippingClass === 'fragile-surface' ||
    product.shippingClass === 'glass-component'
  ) {
    return product.shippingClass;
  }

  if (maxDimension <= 24) {
    return 'small-furniture-parcel';
  }

  return 'standard-furniture-parcel';
}

function upholsteredHandlingRequired(product: Product): boolean {
  const shippingClass = shippingClassById[product.shippingClass];
  return shippingClass?.upholsteredHandling ?? false;
}

function stagingLineAmount(
  item: CartItem,
  destinationZip: string,
): StagingShippingLineBreakdown {
  const shippingClass = item.shippingClass;
  const shippingMeta = shippingClassById[shippingClass];
  const boxCount = normalizeBoxCount(item.boxCount);
  const base = STAGING_BASE_RATES[shippingClass] ?? 0;
  const multiplier = regionMultiplier(destinationZip);

  let perUnit = base * multiplier;

  if (boxCount > 1) {
    perUnit += (boxCount - 1) * 18 * multiplier;
  }

  if (shippingMeta?.upholsteredHandling) {
    perUnit += 35 * multiplier;
  }

  if (shippingMeta?.fragileHandling) {
    perUnit += 22 * multiplier;
  }

  if (shippingMeta?.requiresFreightReview) {
    perUnit = 0;
  }

  const stagingAmount = Math.round(perUnit * item.quantity * 100) / 100;

  return {
    sku: item.sku,
    title: item.title,
    shippingClass,
    boxCount,
    quantity: item.quantity,
    stagingAmount,
    note: shippingMeta?.requiresFreightReview
      ? 'Freight review required - shipping quoted separately.'
      : 'Estimated shipping rate. Final amount confirmed at dispatch.',
  };
}

/**
 * Returns clearly labeled staging shipping estimates.
 * These are NOT contracted carrier rates and must not be presented as final pricing.
 */
export function calculateStagingShipping(
  items: CartItem[],
  destinationZip: string,
): StagingShippingQuote {
  const lineBreakdown = items.map((item) =>
    stagingLineAmount(item, destinationZip),
  );

  const amount =
    Math.round(
      lineBreakdown.reduce(
        (total, line) => total + line.stagingAmount,
        0,
      ) * 100,
    ) / 100;

  return {
    isStagingRate: true,
    label: 'Shipping estimate',
    amount,
    currency: storeConfig.currency,
    destinationZip: destinationZip.trim(),
    lineBreakdown,
    note:
      'Shipping estimate based on package data, destination access, box count, upholstery handling and carrier selection. Final shipping confirmed before dispatch.',
  };
}

/** @deprecated Use calculateStagingShipping */
export const calculateDemoShipping = calculateStagingShipping;
