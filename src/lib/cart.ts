import { storeConfig } from '@/data/store-config';
import {
  getProductById,
  isProductPurchaseable,
  validateCartItem,
  type CartItemValidationResult,
} from '@/lib/products';
import type { CartItem, Product, SiteEnv } from '@/lib/types';

export type { CartItemValidationResult };

export interface CartTotals {
  subtotal: number;
  itemCount: number;
  currency: string;
  /** Reminder that client-side totals are display-only. */
  displayOnlyNote: string;
}

/**
 * Revalidates a cart line against the current catalog.
 * Server checkout must call this (or equivalent) and never trust client prices.
 */
export function validateCartItemAgainstCatalog(
  item: CartItem,
): CartItemValidationResult {
  return validateCartItem(item);
}

export function validateFinish(
  product: Product,
  finishId: string | null,
): boolean {
  if (!finishId) {
    return true;
  }

  return product.colorways.some(
    (colorway) => colorway.id === finishId && colorway.type === 'finish',
  );
}

export function validateUpholstery(
  product: Product,
  upholsteryId: string | null,
): boolean {
  if (!upholsteryId) {
    return true;
  }

  return product.colorways.some(
    (colorway) =>
      colorway.id === upholsteryId && colorway.type === 'upholstery',
  );
}

export function validateConfiguration(
  product: Product,
  configuration: string | null,
): boolean {
  if (configuration === null) {
    return true;
  }

  const normalized = configuration.trim();

  if (!normalized) {
    return false;
  }

  if (normalized.length > 120) {
    return false;
  }

  if (product.orientation && normalized === product.orientation) {
    return true;
  }

  return normalized.length >= 2;
}

export function isLivePurchaseAllowed(
  product: Product,
  siteEnv: SiteEnv = storeConfig.siteEnv,
): boolean {
  if (siteEnv === 'staging') {
    return true;
  }

  return isProductPurchaseable(product);
}

export interface ServerValidatedLineItem extends CartItem {
  lineTotal: number;
  catalogUnitPrice: number;
}

export interface ServerCartTotals extends CartTotals {
  validatedItems: ServerValidatedLineItem[];
  errors: string[];
  warnings: string[];
  valid: boolean;
}

/**
 * Calculates display totals from cart items.
 * For checkout, use validated catalog prices from `calculateCartTotals` after
 * per-item validation against the product record.
 */
export function calculateCartTotals(
  items: CartItem[],
  options?: {
    currency?: string;
    revalidateAgainstCatalog?: boolean;
  },
): ServerCartTotals {
  const currency = options?.currency ?? storeConfig.currency;
  const validatedItems: ServerValidatedLineItem[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    const validation = validateCartItemAgainstCatalog(item);

    if (!validation.valid) {
      errors.push(...validation.errors.map((error) => `${item.sku}: ${error}`));
    }

    if (!product) {
      errors.push(`${item.sku}: Product not found in catalog.`);
      continue;
    }

    if (!validateFinish(product, item.selectedFinishId)) {
      errors.push(`${item.sku}: Invalid finish selection.`);
    }

    if (!validateUpholstery(product, item.selectedUpholsteryId)) {
      errors.push(`${item.sku}: Invalid upholstery selection.`);
    }

    if (!validateConfiguration(product, item.selectedConfiguration)) {
      errors.push(`${item.sku}: Invalid configuration selection.`);
    }

    if (!isLivePurchaseAllowed(product)) {
      const message = `${item.sku}: Product is not available for live purchase.`;
      if (storeConfig.siteEnv === 'production') {
        errors.push(message);
      } else {
        warnings.push(message);
      }
    } else if (!product.productionReady && storeConfig.siteEnv === 'staging') {
      warnings.push(
        `${item.sku}: Product is not production ready - staging checkout only.`,
      );
    }

    const catalogUnitPrice = product.price;
    const unitPrice =
      options?.revalidateAgainstCatalog === false
        ? item.unitPrice
        : catalogUnitPrice;

    validatedItems.push({
      ...item,
      unitPrice,
      catalogUnitPrice,
      lineTotal: unitPrice * item.quantity,
      productionReady: product.productionReady,
      boxCount: product.boxCount,
      shippingClass: product.shippingClass,
      assemblyRequired: product.assemblyRequired,
      dimensionsSnapshot: {
        width: product.width,
        height: product.height,
        depth: product.depth,
      },
    });
  }

  const subtotal = validatedItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  const itemCount = validatedItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  return {
    subtotal,
    itemCount,
    currency,
    validatedItems,
    errors,
    warnings,
    valid: errors.length === 0 && validatedItems.length > 0,
    displayOnlyNote:
      'Client cart prices are for display only. Checkout revalidates all line items against the server catalog.',
  };
}
