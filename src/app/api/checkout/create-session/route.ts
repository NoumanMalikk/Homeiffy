import { NextResponse, type NextRequest } from 'next/server';

import {
  parseCheckoutRequest,
  processCheckoutSession,
} from '@/lib/checkout-api';
import { safeApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseCheckoutRequest(request);

    if (!parsed.ok) {
      return NextResponse.json(
        {
          error: parsed.error,
          blockers: parsed.blockers,
          warnings: parsed.warnings,
        },
        { status: parsed.status },
      );
    }

    const idempotencyKey =
      request.headers.get('Idempotency-Key') ??
      request.headers.get('idempotency-key') ??
      undefined;

    const result = await processCheckoutSession(
      request,
      parsed.body,
      { idempotencyKey },
    );

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          blockers: result.blockers,
          warnings: result.warnings,
        },
        { status: result.status },
      );
    }

    if (result.stripeUrl) {
      return NextResponse.json({
        url: result.stripeUrl,
        pendingId: result.pendingId,
        orderReference: result.orderReference,
      });
    }

    return NextResponse.json({
      stagingCheckout: true,
      requiresDemoComplete: true,
      pendingId: result.pendingId,
      orderReference: result.orderReference,
      message:
        'Stripe is not configured. Use staging checkout completion for interface testing.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: safeApiError(error) },
      { status: 500 },
    );
  }
}
