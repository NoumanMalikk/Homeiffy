'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormErrorSummary } from '@/components/forms/FormErrorSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { contactTopics } from '@/data/contact-topics';
import { getProductBySlug } from '@/lib/products';
import {
  contactFormSchema,
} from '@/lib/validators';
import { cn } from '@/lib/utils';
import type { z } from 'zod';

type ContactFormInput = z.input<typeof contactFormSchema>;

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function ContactFormFields() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');
  const product = productSlug ? getProductBySlug(productSlug) : undefined;

  const defaultMessage = useMemo(() => {
    if (!product) {
      return '';
    }

    return `Product reference: ${product.title} (${product.sku})\n\n`;
  }, [product]);

  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: defaultMessage,
      consent: undefined,
    },
  });

  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message));

  async function onSubmit(values: ContactFormInput) {
    setStatus('loading');
    setServerMessage('');

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      setStatus('error');
      setServerMessage('Please check the form and try again.');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
        retryAfter?: number;
      };

      if (response.status === 429) {
        setStatus('error');
        setServerMessage(
          data.error ??
            `Too many requests. Please wait ${data.retryAfter ?? 60} seconds before trying again.`,
        );
        return;
      }

      if (!response.ok) {
        setStatus('error');
        setServerMessage(data.error ?? 'Unable to send your message. Please try again.');
        return;
      }

      setStatus('success');
      setServerMessage(
        data.message ??
          'Thank you. Your message has been received and will be reviewed.',
      );
      reset({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        consent: undefined,
      });
    } catch {
      setStatus('error');
      setServerMessage('Unable to send your message. Please try again.');
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-describedby={errorMessages.length > 0 ? 'form-error-summary' : undefined}
    >
      <FormErrorSummary errors={errorMessages} />

      {product ? (
        <p className="rounded-lg border border-border-sand bg-cloud-cream/40 px-4 py-3 text-sm text-graphite">
          Your message will reference{' '}
          <Link
            href={`/products/${product.slug}`}
            className="font-medium text-haven-blue hover:underline"
          >
            {product.title}
          </Link>{' '}
          ({product.sku}).
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-name" required>
            Full name
          </Label>
          <Input
            id="contact-name"
            autoComplete="name"
            disabled={status === 'loading' || status === 'success'}
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email" required>
            Email
          </Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            disabled={status === 'loading' || status === 'success'}
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            disabled={status === 'loading' || status === 'success'}
            aria-invalid={Boolean(errors.phone)}
            {...register('phone')}
          />
          {errors.phone ? (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-subject" required>
            Topic
          </Label>
          <Select
            id="contact-subject"
            defaultValue=""
            disabled={status === 'loading' || status === 'success'}
            aria-invalid={Boolean(errors.subject)}
            {...register('subject')}
          >
            <option value="" disabled>
              Select a topic
            </option>
            {contactTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
          {errors.subject ? (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-message" required>
            Message
          </Label>
          <Textarea
            id="contact-message"
            rows={6}
            disabled={status === 'loading' || status === 'success'}
            aria-invalid={Boolean(errors.message)}
            {...register('message')}
          />
          {errors.message ? (
            <p className="text-sm text-destructive">{errors.message.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="contact-consent"
          type="checkbox"
          disabled={status === 'loading' || status === 'success'}
          className="mt-1 size-4 rounded border-border-sand text-haven-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
          {...register('consent')}
        />
        <Label htmlFor="contact-consent" className="font-normal leading-relaxed text-graphite">
          I consent to Homeiffy contacting me about this inquiry. Read the{' '}
          <Link href="/privacy-policy" className="text-haven-blue underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </Label>
      </div>
      {errors.consent ? (
        <p className="text-sm text-destructive">{errors.consent.message}</p>
      ) : null}

      <Button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </Button>

      {serverMessage ? (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={cn(
            'text-sm',
            status === 'error' ? 'text-destructive' : 'text-haven-blue',
          )}
        >
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-graphite" aria-live="polite">
          Loading contact form…
        </p>
      }
    >
      <ContactFormFields />
    </Suspense>
  );
}
