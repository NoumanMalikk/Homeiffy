'use client';

import Link from 'next/link';
import { useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <section className="border-b border-wd-line bg-wd-accent py-14 sm:py-16">
      <Container size="md">
        <div className="text-center">
          <h2 className="font-display text-2xl font-medium text-wd-black sm:text-3xl lg:text-4xl">
            Sign up for furniture and room-planning updates
          </h2>
          <p className="mt-3 text-sm text-wd-black/80 sm:text-base">
            Be first to learn about new catalog pieces and measuring guides.
            No promotional discount promises.
          </p>
        </div>

        <form
          className="mx-auto mt-8 max-w-xl space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Label htmlFor="newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === 'loading' || status === 'success'}
              placeholder="Email address"
              className="border-wd-black/20 bg-white text-wd-black"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'default' }),
                'shrink-0 bg-wd-black text-wd-text hover:bg-wd-black/90',
              )}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          <div className="flex items-start justify-center gap-3 text-left">
            <input
              id="newsletter-consent"
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              disabled={status === 'loading' || status === 'success'}
              className="mt-1 size-4 border-wd-black/30 text-wd-black"
            />
            <Label
              htmlFor="newsletter-consent"
              className="font-normal leading-relaxed text-wd-black/85"
            >
              I agree to receive email updates from Homeiffy. Read the{' '}
              <Link href="/privacy-policy" className="underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>

          {message ? (
            <p
              role={status === 'error' ? 'alert' : 'status'}
              className={cn(
                'text-center text-sm',
                status === 'error' ? 'text-red-900' : 'text-wd-black',
              )}
            >
              {message}
            </p>
          ) : null}
        </form>
      </Container>
    </section>
  );
}
