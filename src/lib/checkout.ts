import { shippingClassById } from '@/data/shipping-classes';
import { storeConfig } from '@/data/store-config';
import {
  calculateCartTotals,
  type ServerValidatedLineItem,
} from '@/lib/cart';
import { canLaunchProduction } from '@/lib/launch-gates';
import { getProductById, isProductPurchaseable } from '@/lib/products';
import { calculateStagingShipping } from '@/lib/shipping';
import { isStripeConfigured } from '@/lib/stripe';
import type { CartItem, OrderAddress, OrderLineItem } from '@/lib/types';
import type {
  CheckoutCustomerInfoValues,
  ShippingAddressValues,
} from '@/lib/validators';

export interface CheckoutBlockerResult {
  allowed: boolean;
  blockers: string[];
  warnings: string[];
}

export interface CheckoutTaxResult {
  amount: number;
  label: string;
  note: string;
  isDemonstration: boolean;
  calculatedAtPayment: boolean;
}

export interface CheckoutTotals {
  subtotal: number;
  shipping: number;
  shippingLabel: string;
  shippingNote: string;
  tax: CheckoutTaxResult;
  total: number;
  currency: string;
}

export function requiresDeliveryAccessInfo(items: CartItem[]): boolean {
  return items.some((item) => {
    const shippingMeta = shippingClassById[item.shippingClass];
    return (
      shippingMeta?.requiresFreightReview ||
      item.shippingClass === 'oversized-furniture' ||
      item.shippingClass === 'multi-box-furniture' ||
      shippingMeta?.upholsteredHandling === true
    );
  });
}

export function requiresShippingQuote(items: CartItem[]): boolean {
  return items.some(
    (item) => shippingClassById[item.shippingClass]?.requiresFreightReview,
  );
}

export function hasAssemblyRequired(items: CartItem[]): boolean {
  return items.some((item) => item.assemblyRequired === true);
}

export function evaluateCheckoutBlockers(
  items: CartItem[],
): CheckoutBlockerResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const totals = calculateCartTotals(items, { revalidateAgainstCatalog: true });

  if (items.length === 0) {
    blockers.push('Your cart is empty.');
  }

  if (!totals.valid) {
    if (storeConfig.siteEnv === 'production') {
      blockers.push(...totals.errors);
    } else {
      warnings.push(...totals.errors);
    }
  }

  for (const item of totals.validatedItems) {
    const product = getProductById(item.productId);
    if (!product) {
      continue;
    }

    if (!product.productionReady) {
      const message = `${item.sku}: Product record is not production ready.`;
      if (storeConfig.siteEnv === 'production') {
        blockers.push(message);
      } else {
        warnings.push(message);
      }
    }

    if (!isProductPurchaseable(product)) {
      const message = `${item.sku}: Verification pending for images, specifications or safety.`;
      if (storeConfig.siteEnv === 'production') {
        blockers.push(message);
      } else {
        warnings.push(message);
      }
    }

    if (item.assemblyRequired === true && product.assemblyInstructions === null) {
      const message = `${item.sku}: Assembly is required but instructions are not yet published.`;
      if (storeConfig.siteEnv === 'production') {
        blockers.push(message);
      } else {
        warnings.push(message);
      }
    }
  }

  if (storeConfig.siteEnv === 'production') {
    const launch = canLaunchProduction();
    if (!launch.allowed) {
      blockers.push(...launch.blockers);
    }
  }

  return {
    allowed: blockers.length === 0,
    blockers,
    warnings,
  };
}

export function buildOrderLineItems(
  validatedItems: ServerValidatedLineItem[],
): OrderLineItem[] {
  return validatedItems.map((item) => {
    const product = getProductById(item.productId);

    return {
      productId: item.productId,
      sku: item.sku,
      supplierSku: product?.supplierSku ?? 'Verification required',
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.catalogUnitPrice,
      lineTotal: item.lineTotal,
      selectedFinishId: item.selectedFinishId,
      selectedUpholsteryId: item.selectedUpholsteryId,
      selectedConfiguration: item.selectedConfiguration,
      dimensionsSnapshot: item.dimensionsSnapshot,
      boxCount: item.boxCount,
      shippingClass: item.shippingClass,
      packageWeight: product?.packageWeight ?? 'Verification required',
      packageDimensions: product?.packageDimensions ?? {
        width: null,
        height: null,
        depth: null,
        unit: 'in',
      },
      assemblyRequired: item.assemblyRequired,
      safetyVerificationStatus:
        product?.safetyVerificationStatus ?? 'pending',
    };
  });
}

export function resolveBillingAddress(
  shippingAddress: ShippingAddressValues,
  sameAsShipping: boolean,
  billingAddress?: ShippingAddressValues,
): OrderAddress {
  if (sameAsShipping || !billingAddress) {
    return {
      line1: shippingAddress.line1,
      line2: shippingAddress.line2 || undefined,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
    };
  }

  return {
    line1: billingAddress.line1,
    line2: billingAddress.line2 || undefined,
    city: billingAddress.city,
    state: billingAddress.state,
    postalCode: billingAddress.postalCode,
    country: billingAddress.country,
  };
}

export function calculateCheckoutTax(
  subtotal: number,
  shipping: number,
): CheckoutTaxResult {
  const stripeTaxEnabled =
    process.env.STRIPE_TAX_ENABLED === 'true' && isStripeConfigured();

  if (stripeTaxEnabled) {
    return {
      amount: 0,
      label: 'Calculated at payment',
      note: 'Sales tax will be calculated by Stripe Tax during secure checkout.',
      isDemonstration: false,
      calculatedAtPayment: true,
    };
  }

  if (storeConfig.siteEnv === 'staging') {
    const demoRate = 0.08875;
    const amount =
      Math.round((subtotal + shipping) * demoRate * 100) / 100;

    return {
      amount,
      label: 'Estimated tax',
      note: 'Estimated tax amount. Final tax depends on destination and applicable rates.',
      isDemonstration: true,
      calculatedAtPayment: false,
    };
  }

  return {
    amount: 0,
    label: 'Tax',
    note: 'Tax will be calculated at payment.',
    isDemonstration: false,
    calculatedAtPayment: true,
  };
}

export function calculateCheckoutTotals(
  items: CartItem[],
  shippingMethod: 'staging-estimate' | 'quote-required',
  destinationZip: string,
): CheckoutTotals | null {
  const cartTotals = calculateCartTotals(items, {
    revalidateAgainstCatalog: true,
  });

  if (cartTotals.validatedItems.length === 0) {
    return null;
  }

  const subtotal = cartTotals.validatedItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  let shipping = 0;
  let shippingLabel = 'Shipping quote required';
  let shippingNote =
    'Final shipping will be quoted after freight review. No carrier rate is shown until verified.';

  if (shippingMethod === 'staging-estimate') {
    const quote = calculateStagingShipping(cartTotals.validatedItems, destinationZip);
    shipping = quote.amount;
    shippingLabel = quote.label;
    shippingNote = quote.note;
  }

  const tax = calculateCheckoutTax(subtotal, shipping);
  const taxAmount = tax.calculatedAtPayment ? 0 : tax.amount;
  const total = Math.round((subtotal + shipping + taxAmount) * 100) / 100;

  return {
    subtotal,
    shipping,
    shippingLabel,
    shippingNote,
    tax,
    total,
    currency: storeConfig.currency,
  };
}

export function toCheckoutCustomer(
  values: CheckoutCustomerInfoValues,
): {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string | null;
} {
  return {
    email: values.email,
    firstName: values.firstName,
    lastName: values.lastName,
    phone: values.phone,
    companyName: values.companyName?.trim() ? values.companyName.trim() : null,
  };
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  'order-received': 'Order received',
  'payment-confirmed': 'Payment confirmed',
  processing: 'Processing',
  'preparing-for-shipment': 'Preparing for shipment',
  'shipping-review-required': 'Shipping review required',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const PUBLIC_TRACKABLE_STATUSES = [
  'order-received',
  'payment-confirmed',
  'processing',
  'preparing-for-shipment',
  'shipping-review-required',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export function formatOrderStatus(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? 'Status update';
}
