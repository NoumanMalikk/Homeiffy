'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ErrorSummary } from '@/components/checkout/ErrorSummary';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/ui/section';
import { formatOrderStatus } from '@/lib/checkout';
import { formatPrice } from '@/lib/utils';
import { trackOrderSchema, type TrackOrderValues } from '@/lib/validators';

interface TrackOrderResult {
  found: boolean;
  order?: {
    reference: string;
    status: string;
    statusLabel: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    itemCount: number;
    total: number;
    currency: string;
    shippingNote: string;
    trackingAvailable: boolean;
    trackingNumber: null;
    carrier: null;
    message: string;
  };
  error?: string;
}

export function TrackOrderForm() {
  const [result, setResult] = useState<TrackOrderResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackOrderValues>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: {
      orderRef: '',
      email: '',
    },
  });

  const fieldErrors = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message));

  async function onSubmit(values: TrackOrderValues) {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as TrackOrderResult;
      setResult(data);
    } catch {
      setResult({
        found: false,
        error: 'Unable to look up your order. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Section spacing="lg">
      <Container size="md">
        <div className="rounded-2xl border border-border-sand bg-soft-white px-6 py-10 sm:px-10">
          <h1 className="font-display text-3xl font-medium text-night-ink">
            Track your order
          </h1>
          <p className="mt-3 text-sm text-graphite">
            Enter your order reference and the email address used at checkout.
            Tracking numbers are shown only when recorded in your order.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <ErrorSummary errors={fieldErrors} />

            <div className="space-y-2">
              <Label htmlFor="orderRef" required>
                Order reference
              </Label>
              <Input
                id="orderRef"
                placeholder="DH-…"
                {...register('orderRef')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" required>
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
            </div>

            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Looking up…' : 'Track order'}
            </Button>
          </form>

          {result ? (
            <div className="mt-8 rounded-md border border-border-sand bg-cloud-cream px-4 py-4">
              {!result.found ? (
                <p role="alert" className="text-sm text-graphite">
                  {result.error ??
                    'No matching order was found. Check your reference and email.'}
                </p>
              ) : result.order ? (
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-graphite">Reference: </span>
                    <span className="font-mono-data font-medium">
                      {result.order.reference}
                    </span>
                  </p>
                  <p>
                    <span className="text-graphite">Status: </span>
                    <span className="font-medium">
                      {result.order.statusLabel ||
                        formatOrderStatus(result.order.status)}
                    </span>
                  </p>
                  <p>
                    <span className="text-graphite">Items: </span>
                    <span>{result.order.itemCount}</span>
                  </p>
                  <p>
                    <span className="text-graphite">Total: </span>
                    <span>
                      {formatPrice(result.order.total, result.order.currency)}
                    </span>
                  </p>
                  <p className="text-graphite">{result.order.message}</p>
                  {result.order.trackingAvailable ? (
                    <p className="text-graphite">
                      Carrier tracking will appear here when available.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
