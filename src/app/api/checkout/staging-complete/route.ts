import { randomUUID } from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';

import { getClientIp, safeApiError } from '@/lib/api-utils';
import { processCheckoutSession } from '@/lib/checkout-api';
import { sendOrderConfirmation } from '@/lib/email';
import { generateOrderReference } from '@/lib/orders';
import {
  buildAndSaveOrderFromPending,
} from '@/lib/order-store';
import {
  checkRateLimit,
  formRateLimits,
  rateLimitKeys,
} from '@/lib/rate-limit';
import { storeConfig } from '@/data/store-config';
import { checkoutSessionRequestSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  if (storeConfig.siteEnv !== 'staging') {
    return NextResponse.json(
      { error: 'Staging checkout completion is only available in staging mode.' },
      { status: 403 },
    );
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(
    rateLimitKeys.checkout(ip),
    formRateLimits.checkout,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const parsed = checkoutSessionRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Checkout information is incomplete or invalid.' },
      { status: 400 },
    );
  }

  try {
    const checkoutResult = await processCheckoutSession(request, parsed.data);

    if (!checkoutResult.ok) {
      return NextResponse.json(
        {
          error: checkoutResult.error,
          blockers: checkoutResult.blockers,
        },
        { status: checkoutResult.status },
      );
    }

    const demoSessionId = `demo_cs_${randomUUID()}`;
    const orderReference = generateOrderReference();

    const { order, created } = await buildAndSaveOrderFromPending(
      checkoutResult.pendingId,
      demoSessionId,
      orderReference,
      {
        paymentStatus: 'paid',
        fulfillmentStatus:
          checkoutResult.totals?.shipping === 0 &&
          parsed.data.shippingMethod.method === 'quote-required'
            ? 'shipping-review-required'
            : 'payment-confirmed',
      },
    );

    if (created) {
      await sendOrderConfirmation({
        reference: order.reference,
        customer: {
          email: order.customerEmail,
          firstName: order.customerFirstName,
          lastName: order.customerLastName,
          phone: order.customerPhone,
          companyName: order.companyName,
        },
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        lineItems: order.lineItems,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        paymentProviderReference: demoSessionId,
      });
    }

    return NextResponse.json({
      sessionId: demoSessionId,
      orderReference: order.reference,
      redirectUrl: `/order/success?session_id=${encodeURIComponent(demoSessionId)}`,
      demonstration: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: safeApiError(error) },
      { status: 500 },
    );
  }
}
