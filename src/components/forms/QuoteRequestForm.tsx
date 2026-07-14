'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { FormErrorSummary } from '@/components/forms/FormErrorSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

import { getAllProducts, getProductBySlug } from '@/lib/products';
import {
  quoteRequestFormInputSchema,
  type QuoteRequestFormInputValues,
  type QuoteRequestFormValues,
} from '@/lib/validators';
import { cn } from '@/lib/utils';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function emptyLineItem(): QuoteRequestFormInputValues['lineItems'][number] {
  return {
    productId: '',
    sku: '',
    title: '',
    finishId: '',
    upholsteryId: '',
    configuration: '',
    quantity: 1,
  };
}

function QuoteRequestFormFields({
  onSuccess,
  compact = false,
}: {
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');
  const products = useMemo(() => getAllProducts(), []);

  const prefilledLineItem = useMemo(() => {
    if (!productSlug) {
      return emptyLineItem();
    }

    const product = getProductBySlug(productSlug);

    if (!product) {
      return emptyLineItem();
    }

    return {
      productId: product.id,
      sku: product.sku,
      title: product.title,
      finishId:
        product.colorways.find((colorway) => colorway.type === 'finish')?.id ??
        '',
      upholsteryId:
        product.colorways.find((colorway) => colorway.type === 'upholstery')
          ?.id ?? '',
      configuration: '',
      quantity: 1,
    };
  }, [productSlug]);

  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<
    QuoteRequestFormInputValues,
    unknown,
    QuoteRequestFormValues
  >({
    resolver: zodResolver(quoteRequestFormInputSchema),
    defaultValues: {
      contactName: '',
      companyName: '',
      email: '',
      phone: '',
      shippingPostalCode: '',
      lineItems: [prefilledLineItem],
      buildingType: '',
      floorLevel: '',
      elevatorAvailable: '',
      loadingDockAvailable: '',
      requestedDeliveryWindow: '',
      additionalDetails: '',
      contactConsent: undefined,
      privacyAcknowledged: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  useEffect(() => {
    if (productSlug && prefilledLineItem.productId) {
      reset((current) => ({
        ...current,
        lineItems: [prefilledLineItem],
      }));
    }
  }, [prefilledLineItem, productSlug, reset]);

  const errorMessages = Object.entries(errors).flatMap(([key, error]) => {
    if (key === 'lineItems') {
      if (Array.isArray(error)) {
        return error.flatMap((item, index) =>
          item
            ? Object.values(item).map((fieldError) => {
                const message =
                  fieldError &&
                  typeof fieldError === 'object' &&
                  'message' in fieldError
                    ? String(fieldError.message)
                    : 'Invalid entry';
                return `Line item ${index + 1}: ${message}`;
              })
            : [],
        );
      }

      if (error && typeof error === 'object' && 'message' in error) {
        return [String(error.message)];
      }

      return [];
    }

    if (error && typeof error === 'object' && 'message' in error && error.message) {
      return [String(error.message)];
    }

    return [];
  });

  async function onSubmit(values: QuoteRequestFormValues) {
    setStatus('loading');
    setServerMessage('');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
        setServerMessage(
          data.error ?? 'Unable to submit your quote request. Please try again.',
        );
        return;
      }

      setStatus('success');
      setServerMessage(
        data.message ??
          'Thank you. Your quote request has been received for structured review.',
      );
      reset({
        contactName: '',
        companyName: '',
        email: '',
        phone: '',
        shippingPostalCode: '',
        lineItems: [emptyLineItem()],
        buildingType: '',
        floorLevel: '',
        elevatorAvailable: '',
        loadingDockAvailable: '',
        requestedDeliveryWindow: '',
        additionalDetails: '',
        contactConsent: undefined,
        privacyAcknowledged: undefined,
      });
      onSuccess?.();
    } catch {
      setStatus('error');
      setServerMessage('Unable to submit your quote request. Please try again.');
    }
  }

  function handleProductSelect(index: number, productId: string) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setValue(`lineItems.${index}.productId`, product.id);
    setValue(`lineItems.${index}.sku`, product.sku);
    setValue(`lineItems.${index}.title`, product.title);
    setValue(
      `lineItems.${index}.finishId`,
      product.colorways.find((colorway) => colorway.type === 'finish')?.id ?? '',
    );
    setValue(
      `lineItems.${index}.upholsteryId`,
      product.colorways.find((colorway) => colorway.type === 'upholstery')?.id ??
        '',
    );
  }

  return (
    <form
      className={cn('space-y-8', compact && 'space-y-6')}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <FormErrorSummary errors={errorMessages} />

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-medium text-night-ink">
          Contact information
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quote-contact-name" required>
              Contact name
            </Label>
            <Input
              id="quote-contact-name"
              autoComplete="name"
              disabled={status === 'loading' || status === 'success'}
              {...register('contactName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote-company">Company (optional)</Label>
            <Input
              id="quote-company"
              autoComplete="organization"
              disabled={status === 'loading' || status === 'success'}
              {...register('companyName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote-email" required>
              Email
            </Label>
            <Input
              id="quote-email"
              type="email"
              autoComplete="email"
              disabled={status === 'loading' || status === 'success'}
              {...register('email')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote-phone" required>
              Phone
            </Label>
            <Input
              id="quote-phone"
              type="tel"
              autoComplete="tel"
              disabled={status === 'loading' || status === 'success'}
              {...register('phone')}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="quote-zip" required>
              Destination ZIP code
            </Label>
            <Input
              id="quote-zip"
              autoComplete="postal-code"
              disabled={status === 'loading' || status === 'success'}
              {...register('shippingPostalCode')}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-medium text-night-ink">
          Requested products
        </legend>
        <p className="text-sm text-graphite">
          Add the products, finishes and quantities you are considering. Quote
          requests do not guarantee pricing, delivery timing or approval.
        </p>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const selectedProductId = watch(`lineItems.${index}.productId`);
            const selectedProduct = products.find(
              (product) => product.id === selectedProductId,
            );

            return (
              <div
                key={field.id}
                className="rounded-lg border border-border-sand bg-cloud-cream/30 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-night-ink">
                    Product {index + 1}
                  </p>
                  {fields.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={`quote-product-${index}`} required>
                      Product
                    </Label>
                    <Select
                      id={`quote-product-${index}`}
                      value={selectedProductId}
                      disabled={status === 'loading' || status === 'success'}
                      onChange={(event) =>
                        handleProductSelect(index, event.target.value)
                      }
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.title} ({product.sku})
                        </option>
                      ))}
                    </Select>
                  </div>

                  {selectedProduct ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`quote-finish-${index}`}>Finish</Label>
                        <Select
                          id={`quote-finish-${index}`}
                          disabled={status === 'loading' || status === 'success'}
                          {...register(`lineItems.${index}.finishId`)}
                        >
                          <option value="">Default / not specified</option>
                          {selectedProduct.colorways
                            .filter((colorway) => colorway.type === 'finish')
                            .map((colorway) => (
                              <option key={colorway.id} value={colorway.id}>
                                {colorway.label}
                              </option>
                            ))}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`quote-upholstery-${index}`}>
                          Upholstery
                        </Label>
                        <Select
                          id={`quote-upholstery-${index}`}
                          disabled={status === 'loading' || status === 'success'}
                          {...register(`lineItems.${index}.upholsteryId`)}
                        >
                          <option value="">Default / not specified</option>
                          {selectedProduct.colorways
                            .filter((colorway) => colorway.type === 'upholstery')
                            .map((colorway) => (
                              <option key={colorway.id} value={colorway.id}>
                                {colorway.label}
                              </option>
                            ))}
                        </Select>
                      </div>
                    </>
                  ) : null}

                  <div className="space-y-2">
                    <Label htmlFor={`quote-quantity-${index}`} required>
                      Quantity
                    </Label>
                    <Input
                      id={`quote-quantity-${index}`}
                      type="number"
                      min={1}
                      max={99}
                      disabled={status === 'loading' || status === 'success'}
                      {...register(`lineItems.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`quote-config-${index}`}>
                      Configuration notes
                    </Label>
                    <Input
                      id={`quote-config-${index}`}
                      placeholder="Optional layout or module notes"
                      disabled={status === 'loading' || status === 'success'}
                      {...register(`lineItems.${index}.configuration`)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={status === 'loading' || status === 'success'}
          onClick={() => append(emptyLineItem())}
        >
          Add another product
        </Button>
        {errors.lineItems?.message ? (
          <p className="text-sm text-destructive">{errors.lineItems.message}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-medium text-night-ink">
          Delivery access (optional)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quote-building">Building type</Label>
            <Input
              id="quote-building"
              placeholder="Residential, commercial, mixed-use"
              disabled={status === 'loading' || status === 'success'}
              {...register('buildingType')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote-floor">Floor level</Label>
            <Input
              id="quote-floor"
              disabled={status === 'loading' || status === 'success'}
              {...register('floorLevel')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote-elevator">Elevator available</Label>
            <Select
              id="quote-elevator"
              disabled={status === 'loading' || status === 'success'}
              {...register('elevatorAvailable')}
            >
              <option value="">Not specified</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote-dock">Loading dock available</Label>
            <Select
              id="quote-dock"
              disabled={status === 'loading' || status === 'success'}
              {...register('loadingDockAvailable')}
            >
              <option value="">Not specified</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="quote-window">Requested delivery window</Label>
            <Input
              id="quote-window"
              placeholder="Optional preferred timeframe (not guaranteed)"
              disabled={status === 'loading' || status === 'success'}
              {...register('requestedDeliveryWindow')}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="quote-details">Additional details</Label>
            <Textarea
              id="quote-details"
              rows={4}
              disabled={status === 'loading' || status === 'success'}
              {...register('additionalDetails')}
            />
          </div>
        </div>
      </fieldset>

      <div className="space-y-4 rounded-lg border border-border-sand bg-soft-white px-4 py-4">
        <div className="flex items-start gap-3">
          <input
            id="quote-contact-consent"
            type="checkbox"
            disabled={status === 'loading' || status === 'success'}
            className="mt-1 size-4 rounded border-border-sand text-haven-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
            {...register('contactConsent')}
          />
          <Label
            htmlFor="quote-contact-consent"
            className="font-normal leading-relaxed text-graphite"
            required
          >
            I consent to Homeiffy contacting me about this quote request.
          </Label>
        </div>
        {errors.contactConsent ? (
          <p className="text-sm text-destructive">
            {errors.contactConsent.message}
          </p>
        ) : null}

        <div className="flex items-start gap-3">
          <input
            id="quote-privacy"
            type="checkbox"
            disabled={status === 'loading' || status === 'success'}
            className="mt-1 size-4 rounded border-border-sand text-haven-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
            {...register('privacyAcknowledged')}
          />
          <Label
            htmlFor="quote-privacy"
            className="font-normal leading-relaxed text-graphite"
            required
          >
            I have read the{' '}
            <Link href="/privacy-policy" className="text-haven-blue hover:underline">
              Privacy Policy
            </Link>
            .
          </Label>
        </div>
        {errors.privacyAcknowledged ? (
          <p className="text-sm text-destructive">
            {errors.privacyAcknowledged.message}
          </p>
        ) : null}
      </div>

      <p className="text-sm text-graphite">
        Quote requests allow structured review of products and destination
        details. Homeiffy does not promise trade pricing, quantity discounts,
        delivery dates, installation or quote approval.
      </p>

      <Button type="submit" disabled={status === 'loading' || status === 'success'}>
        {status === 'loading' ? 'Submitting…' : 'Submit quote request'}
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

export function QuoteRequestForm(props: {
  onSuccess?: () => void;
  compact?: boolean;
}) {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-graphite" aria-live="polite">
          Loading quote form…
        </p>
      }
    >
      <QuoteRequestFormFields {...props} />
    </Suspense>
  );
}
