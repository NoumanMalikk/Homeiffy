import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';

import { storeConfig } from '@/data/store-config';
import { getClientIp } from '@/lib/api-utils';
import {
  buildOrderLineItems,
  calculateCheckoutTotals,
  evaluateCheckoutBlockers,
  requiresShippingQuote,
  resolveBillingAddress,
  toCheckoutCustomer,
} from '@/lib/checkout';
import { calculateCartTotals } from '@/lib/cart';
import { generateOrderReference } from '@/lib/orders';
import {
  attachSessionToPending,
  savePendingCheckout,
  type PendingCheckoutPayload,
} from '@/lib/order-store';
import {
  checkRateLimit,
  formRateLimits,
  rateLimitKeys,
} from '@/lib/rate-limit';
import {
  createCheckoutSession,
  isStripeConfigured,
  isStripeStagingSafe,
} from '@/lib/stripe';
import type { CartItem } from '@/lib/types';
import { checkoutSessionRequestSchema } from '@/lib/validators';

export interface CheckoutProcessResult {
  ok: true;
  pendingId: string;
  orderReference: string;
  totals: ReturnType<typeof calculateCheckoutTotals>;
  stripeUrl?: string;
  stagingCheckout?: boolean;
  requiresDemoComplete?: boolean;
}

export interface CheckoutProcessError {
  ok: false;
  status: number;
  error: string;
  blockers?: string[];
  warnings?: string[];
}

function getOrigin(request: NextRequest): string {
  return (
    request.headers.get('origin') ??
    request.nextUrl.origin ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000'
  );
}

export async function parseCheckoutRequest(
  request: NextRequest,
): Promise<
  | { ok: true; body: ReturnType<typeof checkoutSessionRequestSchema.parse> }
  | CheckoutProcessError
> {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(
    rateLimitKeys.checkout(ip),
    formRateLimits.checkout,
  );

  if (!rateLimit.allowed) {
    return {
      ok: false,
      status: 429,
      error: 'Too many checkout attempts. Please try again later.',
    };
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { ok: false, status: 400, error: 'Invalid request body.' };
  }

  const parsed = checkoutSessionRequestSchema.safeParse(body);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: 'Checkout information is incomplete or invalid.',
    };
  }

  if (
    !parsed.data.billing.sameAsShipping &&
    !parsed.data.billing.address
  ) {
    return {
      ok: false,
      status: 400,
      error: 'Billing address is required when not same as shipping.',
    };
  }

  return { ok: true, body: parsed.data };
}

export async function processCheckoutSession(
  request: NextRequest,
  body: ReturnType<typeof checkoutSessionRequestSchema.parse>,
  options?: { idempotencyKey?: string },
): Promise<CheckoutProcessResult | CheckoutProcessError> {
  const cartItems = body.cartItems as CartItem[];
  const evaluation = evaluateCheckoutBlockers(cartItems);

  if (!evaluation.allowed) {
    return {
      ok: false,
      status: 400,
      error: 'Checkout cannot proceed.',
      blockers: evaluation.blockers,
      warnings: evaluation.warnings,
    };
  }

  const forcedQuote = requiresShippingQuote(cartItems);
  const shippingMethod = forcedQuote
    ? 'quote-required'
    : body.shippingMethod.method;

  const totals = calculateCheckoutTotals(
    cartItems,
    shippingMethod,
    body.shippingAddress.postalCode,
  );

  if (!totals) {
    return { ok: false, status: 400, error: 'Unable to calculate order totals.' };
  }

  const cartTotals = calculateCartTotals(cartItems, {
    revalidateAgainstCatalog: true,
  });

  const orderReference = generateOrderReference();
  const pendingId = randomUUID();
  const customer = toCheckoutCustomer(body.customer);

  const payload: PendingCheckoutPayload = {
    customer,
    shippingAddress: body.shippingAddress,
    billingAddress: resolveBillingAddress(
      body.shippingAddress,
      body.billing.sameAsShipping,
      body.billing.address,
    ),
    deliveryAccess: body.deliveryAccess ?? null,
    lineItems: buildOrderLineItems(cartTotals.validatedItems),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    shippingLabel: totals.shippingLabel,
    shippingNote: totals.shippingNote,
    tax: totals.tax.calculatedAtPayment ? 0 : totals.tax.amount,
    taxLabel: totals.tax.label,
    taxNote: totals.tax.note,
    total: totals.total,
    currency: totals.currency,
    shippingMethod,
    agreements: body.agreements,
    marketingConsent: body.agreements.marketingConsent ?? false,
    purchaseOrderNumber: body.customer.purchaseOrderNumber?.trim()
      ? body.customer.purchaseOrderNumber.trim()
      : null,
    isStagingOrder: storeConfig.siteEnv === 'staging',
  };

  await savePendingCheckout(payload, { pendingId });

  const origin = getOrigin(request);
  const successUrl = `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/checkout`;

  const taxForStripe = totals.tax.calculatedAtPayment
    ? 0
    : totals.tax.amount;

  if (isStripeConfigured() && isStripeStagingSafe()) {
    try {
      const result = await createCheckoutSession({
        cartItems,
        customerEmail: customer.email,
        successUrl,
        cancelUrl,
        shippingAmount: totals.shipping,
        shippingLabel: totals.shippingLabel,
        taxAmount: taxForStripe,
        idempotencyKey: options?.idempotencyKey,
        pendingCheckoutId: pendingId,
        metadata: {
          orderReference,
        },
      });

      if (!result?.session.url) {
        return {
          ok: false,
          status: 500,
          error: 'Unable to start secure checkout.',
        };
      }

      await attachSessionToPending(pendingId, result.session.id);

      return {
        ok: true,
        pendingId,
        orderReference,
        totals,
        stripeUrl: result.session.url,
      };
    } catch {
      return {
        ok: false,
        status: 500,
        error: 'Unable to start secure checkout.',
      };
    }
  }

  if (storeConfig.siteEnv === 'staging') {
    return {
      ok: true,
      pendingId,
      orderReference,
      totals,
      stagingCheckout: true,
      requiresDemoComplete: true,
    };
  }

  return {
    ok: false,
    status: 503,
    error: 'Payment processing is not configured.',
  };
}
