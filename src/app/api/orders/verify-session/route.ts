import { NextResponse, type NextRequest } from 'next/server';

import { formatOrderStatus } from '@/lib/checkout';
import { getOrderBySessionId } from '@/lib/order-store';
import { retrieveCheckoutSession } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { verified: false, error: 'Session ID is required.' },
      { status: 400 },
    );
  }

  if (sessionId.startsWith('demo_cs_')) {
    const order = await getOrderBySessionId(sessionId);

    if (!order) {
      return NextResponse.json({
        verified: false,
        error: 'Staging order not found.',
      });
    }

    return NextResponse.json({
      verified: true,
      staging: true,
      order: {
        reference: order.reference,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        fulfillmentStatusLabel: formatOrderStatus(order.fulfillmentStatus),
        total: order.total,
        currency: order.currency,
        customerEmail: order.customerEmail,
        lineItemCount: order.lineItems.reduce(
          (count, item) => count + item.quantity,
          0,
        ),
        createdAt: order.createdAt,
        assemblyRequired: order.lineItems.some(
          (item) => item.assemblyRequired === true,
        ),
      },
    });
  }

  const session = await retrieveCheckoutSession(sessionId);

  if (!session) {
    return NextResponse.json({
      verified: false,
      error: 'Unable to verify payment session.',
    });
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({
      verified: false,
      error: 'Payment has not been confirmed.',
    });
  }

  const order = await getOrderBySessionId(sessionId);

  return NextResponse.json({
    verified: true,
    order: order
      ? {
          reference: order.reference,
          paymentStatus: order.paymentStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          fulfillmentStatusLabel: formatOrderStatus(order.fulfillmentStatus),
          total: order.total,
          currency: order.currency,
          customerEmail: order.customerEmail,
          lineItemCount: order.lineItems.reduce(
            (count, item) => count + item.quantity,
            0,
          ),
          createdAt: order.createdAt,
          assemblyRequired: order.lineItems.some(
            (item) => item.assemblyRequired === true,
          ),
        }
      : {
          reference: session.metadata?.orderReference ?? null,
          paymentStatus: 'paid',
          fulfillmentStatus: 'payment-confirmed',
          fulfillmentStatusLabel: formatOrderStatus('payment-confirmed'),
          total: (session.amount_total ?? 0) / 100,
          currency: (session.currency ?? 'usd').toUpperCase(),
          customerEmail: session.customer_details?.email ?? null,
          lineItemCount: null,
          createdAt: null,
          assemblyRequired: false,
          pendingFulfillmentRecord: true,
        },
  });
}
