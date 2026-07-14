'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { formatPrice } from '@/lib/utils';

interface VerifiedOrder {
  reference: string | null;
  paymentStatus: string;
  fulfillmentStatus: string;
  fulfillmentStatusLabel: string;
  total: number;
  currency: string;
  customerEmail: string | null;
  lineItemCount: number | null;
  createdAt: string | null;
  assemblyRequired: boolean;
  pendingFulfillmentRecord?: boolean;
}

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'verified' | 'failed'>(
    () => (sessionId ? 'loading' : 'failed'),
  );
  const [order, setOrder] = useState<VerifiedOrder | null>(null);
  const [error, setError] = useState<string | null>(() =>
    sessionId ? null : 'No payment session to verify.',
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const response = await fetch(
          `/api/orders/verify-session?session_id=${encodeURIComponent(sessionId!)}`,
        );
        const data = (await response.json()) as {
          verified?: boolean;
          order?: VerifiedOrder;
          error?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok || !data.verified || !data.order) {
          setStatus('failed');
          setError(data.error ?? 'Payment could not be verified.');
          return;
        }

        setOrder(data.order);
        setStatus('verified');
      } catch {
        if (!cancelled) {
          setStatus('failed');
          setError('Unable to verify payment. Please contact support.');
        }
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <Section spacing="lg">
      <Container size="md">
        <div className="space-y-6 rounded-2xl border border-border-sand bg-soft-white px-6 py-10 sm:px-10">
          {status === 'loading' ? (
            <p className="text-graphite">Verifying your payment…</p>
          ) : null}

          {status === 'failed' ? (
            <>
              <h1 className="font-display text-3xl font-medium text-night-ink">
                Payment not confirmed
              </h1>
              <p className="text-graphite" role="alert">
                {error}
              </p>
              <Link href="/checkout">
                <Button variant="primary">Return to checkout</Button>
              </Link>
            </>
          ) : null}

          {status === 'verified' && order ? (
            <>
              <h1 className="font-display text-3xl font-medium text-night-ink">
                Thank you for your order
              </h1>
              <p className="text-graphite">
                Payment verified. Your order reference is:
              </p>
              <p className="font-mono-data text-2xl font-medium text-haven-blue">
                {order.reference ?? 'Pending assignment'}
              </p>

              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-graphite">Status</dt>
                  <dd className="font-medium text-night-ink">
                    {order.fulfillmentStatusLabel}
                  </dd>
                </div>
                {order.total > 0 ? (
                  <div>
                    <dt className="text-graphite">Total</dt>
                    <dd className="font-medium text-night-ink">
                      {formatPrice(order.total, order.currency)}
                    </dd>
                  </div>
                ) : null}
                {order.lineItemCount !== null ? (
                  <div>
                    <dt className="text-graphite">Items</dt>
                    <dd className="font-medium text-night-ink">
                      {order.lineItemCount}
                    </dd>
                  </div>
                ) : null}
                {order.customerEmail ? (
                  <div>
                    <dt className="text-graphite">Confirmation sent to</dt>
                    <dd className="font-medium text-night-ink">
                      {order.customerEmail}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {order.pendingFulfillmentRecord ? (
                <p className="text-sm text-graphite">
                  Your payment is confirmed. Full order details will appear in
                  your account once fulfillment processing completes.
                </p>
              ) : null}

              <div className="rounded-md border border-border-sand bg-cloud-cream px-4 py-3 text-sm text-graphite">
                <p className="font-medium text-night-ink">Tracking your order</p>
                <p className="mt-1">
                  Use the Track Order page with your order reference and the
                  email used at checkout. Carrier tracking numbers appear only
                  when recorded - they are never fabricated.
                </p>
                <Link
                  href="/track-order"
                  className="mt-2 inline-block text-haven-blue underline-offset-4 hover:underline"
                >
                  Track order
                </Link>
              </div>

              {order.assemblyRequired ? (
                <div className="rounded-md border border-haven-blue/30 bg-haven-blue/10 px-4 py-3 text-sm">
                  <p className="font-medium text-night-ink">
                    Assembly reminder
                  </p>
                  <p className="mt-1 text-graphite">
                    One or more items require assembly. Review the assembly
                    information on each product page and allow adequate clearance
                    before unpacking.
                  </p>
                  <Link
                    href="/assembly-information"
                    className="mt-2 inline-block text-haven-blue underline-offset-4 hover:underline"
                  >
                    Assembly information
                  </Link>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Link href="/shop">
                  <Button variant="outline">Continue shopping</Button>
                </Link>
                <Link href="/track-order">
                  <Button variant="primary">Track this order</Button>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
