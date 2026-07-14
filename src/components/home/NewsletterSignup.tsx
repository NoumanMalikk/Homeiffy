'use client';

import Link from 'next/link';
import { useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!consent) {
      setStatus('error');
      setMessage('Please confirm you agree to receive updates.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Unable to subscribe. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(
        data.message ??
          'Thank you. You will receive a confirmation email when double opt-in is enabled.',
      );
      setEmail('');
      setConsent(false);
    } catch {
      setStatus('error');
      setMessage('Unable to subscribe. Please try again.');
    }
  }

  return (
    <Section spacing="lg" background="cream">
      <Container size="md">
        <div className="rounded-2xl border border-border-sand bg-soft-white px-5 py-8 shadow-soft sm:px-8 sm:py-9">
          <h2 className="font-display text-xl font-medium text-night-ink sm:text-2xl lg:text-3xl">
            Receive new furniture and room-guide updates.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-graphite sm:mt-3">
            Occasional catalog and measuring-guide updates. No promotional
            discount promises.
          </p>

          <form className="mt-6 space-y-4 sm:mt-8" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="newsletter-email">Email address</Label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={status === 'loading' || status === 'success'}
                placeholder="you@example.com"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="newsletter-consent"
                name="consent"
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                disabled={status === 'loading' || status === 'success'}
                className="mt-1 size-4 rounded border-border-sand text-haven-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
              />
              <Label
                htmlFor="newsletter-consent"
                className="font-normal leading-relaxed text-graphite"
              >
                I agree to receive email updates from Homeiffy. Read the{' '}
                <Link
                  href="/privacy-policy"
                  className="text-haven-blue underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </Label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe to updates'}
            </button>

            {message ? (
              <p
                role={status === 'error' ? 'alert' : 'status'}
                className={cn(
                  'text-sm',
                  status === 'error' ? 'text-destructive' : 'text-haven-blue',
                )}
              >
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </Container>
    </Section>
  );
}
