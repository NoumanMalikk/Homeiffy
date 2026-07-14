import Stripe from 'stripe';

import { storeConfig } from '@/data/store-config';
import { calculateCartTotals } from '@/lib/cart';
import type { CartItem } from '@/lib/types';

let stripeClient: Stripe | null = null;

function isTestStripeKey(key: string): boolean {
  return key.startsWith('sk_test_') || key.startsWith('rk_test_');
}

export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2026-06-24.dahlia',
      typescript: true,
    });
  }

  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isStripeStagingSafe(): boolean {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return true;
  }

  if (storeConfig.siteEnv === 'staging') {
    return isTestStripeKey(secretKey);
  }

  return true;
}

export interface CheckoutSessionLineItem {
  name: string;
  amount: number;
  quantity: number;
  description?: string;
}

export interface CreateCheckoutSessionInput {
  cartItems: CartItem[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  shippingAmount?: number;
  shippingLabel?: string;
  taxAmount?: number;
  idempotencyKey?: string;
  pendingCheckoutId?: string;
}

export interface CreateCheckoutSessionResult {
  session: Stripe.Checkout.Session;
  validatedSubtotal: number;
}

/**
 * Creates a Stripe Checkout session using server-validated catalog prices.
 * Safe for staging mode when paired with Stripe test keys.
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult | null> {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  if (!isStripeStagingSafe()) {
    throw new Error(
      'Live Stripe keys cannot be used while NEXT_PUBLIC_SITE_ENV is staging.',
    );
  }

  const totals = calculateCartTotals(input.cartItems, {
    revalidateAgainstCatalog: true,
  });

  if (!totals.valid) {
    throw new Error(`Cart validation failed: ${totals.errors.join(' ')}`);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    totals.validatedItems.map((item) => ({
      price_data: {
        currency: totals.currency.toLowerCase(),
        unit_amount: Math.round(item.catalogUnitPrice * 100),
        product_data: {
          name: item.title,
          description: item.sku,
          metadata: {
            productId: item.productId,
            finishId: item.selectedFinishId ?? '',
            upholsteryId: item.selectedUpholsteryId ?? '',
            configuration: item.selectedConfiguration ?? '',
          },
        },
      },
      quantity: item.quantity,
    }));

  if (input.shippingAmount && input.shippingAmount > 0) {
    lineItems.push({
      price_data: {
        currency: totals.currency.toLowerCase(),
        unit_amount: Math.round(input.shippingAmount * 100),
        product_data: {
          name: input.shippingLabel ?? 'Shipping',
          description: 'Shipping charge',
        },
      },
      quantity: 1,
    });
  }

  if (input.taxAmount && input.taxAmount > 0) {
    lineItems.push({
      price_data: {
        currency: totals.currency.toLowerCase(),
        unit_amount: Math.round(input.taxAmount * 100),
        product_data: {
          name: 'Tax',
          description: 'Sales tax',
        },
      },
      quantity: 1,
    });
  }

  const stripeTaxEnabled = process.env.STRIPE_TAX_ENABLED === 'true';

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      customer_email: input.customerEmail,
      line_items: lineItems,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      automatic_tax: stripeTaxEnabled ? { enabled: true } : undefined,
      metadata: {
        siteEnv: storeConfig.siteEnv,
        pendingCheckoutId: input.pendingCheckoutId ?? '',
        ...input.metadata,
      },
    },
    input.idempotencyKey
      ? { idempotencyKey: input.idempotencyKey }
      : undefined,
  );

  return {
    session,
    validatedSubtotal: totals.subtotal,
  };
}

export function verifyStripeWebhookSignature(
  payload: string,
  signature: string | null,
): Stripe.Event | null {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || !signature) {
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return null;
  }
}

export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}
