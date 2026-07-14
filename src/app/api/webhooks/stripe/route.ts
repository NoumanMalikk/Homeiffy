import { NextResponse, type NextRequest } from 'next/server';

import { safeApiError } from '@/lib/api-utils';
import { sendOrderConfirmation } from '@/lib/email';
import { generateOrderReference } from '@/lib/orders';
import {
  buildAndSaveOrderFromPending,
  getOrderBySessionId,
} from '@/lib/order-store';
import {
  verifyStripeWebhookSignature,
} from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  const event = verifyStripeWebhookSignature(payload, signature);

  if (!event) {
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 400 },
    );
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as {
    id: string;
    payment_status?: string;
    metadata?: { pendingCheckoutId?: string; orderReference?: string };
  };

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true });
  }

  try {
    const existing = await getOrderBySessionId(session.id);
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const pendingId = session.metadata?.pendingCheckoutId;

    if (!pendingId) {
      return NextResponse.json(
        { error: 'Missing checkout context.' },
        { status: 400 },
      );
    }

    const orderReference =
      session.metadata?.orderReference ?? generateOrderReference();

    const { order, created } = await buildAndSaveOrderFromPending(
      pendingId,
      session.id,
      orderReference,
      { paymentStatus: 'paid', fulfillmentStatus: 'payment-confirmed' },
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
        paymentProviderReference: session.id,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: safeApiError(error) },
      { status: 500 },
    );
  }
}
