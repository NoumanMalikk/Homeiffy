import { NextResponse, type NextRequest } from 'next/server';

import { getClientIp } from '@/lib/api-utils';
import { formatOrderStatus, PUBLIC_TRACKABLE_STATUSES } from '@/lib/checkout';
import { findOrderByReferenceAndEmail } from '@/lib/order-store';
import {
  checkRateLimit,
  formRateLimits,
  rateLimitKeys,
} from '@/lib/rate-limit';
import { trackOrderSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(
    rateLimitKeys.trackOrder(ip),
    formRateLimits.trackOrder,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      },
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

  const parsed = trackOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a valid order reference and email address.' },
      { status: 400 },
    );
  }

  const order = await findOrderByReferenceAndEmail(
    parsed.data.orderRef,
    parsed.data.email,
  );

  if (!order) {
    return NextResponse.json(
      {
        found: false,
        error:
          'No matching order was found. Check your order reference and email address.',
      },
      { status: 404 },
    );
  }

  const status = PUBLIC_TRACKABLE_STATUSES.includes(
    order.fulfillmentStatus as (typeof PUBLIC_TRACKABLE_STATUSES)[number],
  )
    ? order.fulfillmentStatus
    : 'processing';

  return NextResponse.json({
    found: true,
    order: {
      reference: order.reference,
      status,
      statusLabel: formatOrderStatus(status),
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemCount: order.lineItems.reduce(
        (count, item) => count + item.quantity,
        0,
      ),
      total: order.total,
      currency: order.currency,
      shippingNote: order.shippingNote,
      trackingAvailable: order.fulfillmentStatus === 'shipped',
      trackingNumber: null,
      carrier: null,
      message:
        order.fulfillmentStatus === 'shipped'
          ? 'Your order has shipped. Carrier tracking details will appear here when recorded in your order.'
          : order.fulfillmentStatus === 'shipping-review-required'
            ? 'Shipping is being reviewed. Homeiffy will contact you with a verified quote before dispatch.'
            : 'Fulfillment updates appear here as your order progresses. Tracking numbers are never fabricated.',
    },
  });
}
