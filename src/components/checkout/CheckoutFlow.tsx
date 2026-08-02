'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { CheckoutCartSummary } from '@/components/checkout/CheckoutCartSummary';
import { ErrorSummary } from '@/components/checkout/ErrorSummary';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/ui/section';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { US_STATES } from '@/data/us-states';
import { storeConfig } from '@/data/store-config';
import {
  calculateCheckoutTotals,
  hasAssemblyRequired,
  requiresDeliveryAccessInfo,
  requiresShippingQuote,
} from '@/lib/checkout';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { useCartStore } from '@/stores';
import { formatDimensions, formatPrice } from '@/lib/utils';
import {
  billingAddressFormSchema,
  checkoutAgreementsSchema,
  checkoutCustomerInfoSchema,
  deliveryAccessSchema,
  shippingAddressSchema,
  shippingMethodSchema,
} from '@/lib/validators';

const checkoutFormSchema = z.object({
  customer: checkoutCustomerInfoSchema,
  shippingAddress: shippingAddressSchema,
  deliveryAccess: deliveryAccessSchema,
  shippingMethod: shippingMethodSchema,
  billing: billingAddressFormSchema,
  agreements: checkoutAgreementsSchema,
});

type CheckoutFormValues = z.input<typeof checkoutFormSchema>;

type StepId =
  | 'customer'
  | 'shipping'
  | 'delivery-access'
  | 'validation'
  | 'shipping-method'
  | 'billing'
  | 'tax'
  | 'review'
  | 'agreements'
  | 'payment';

const STEP_LABELS: Record<StepId, string> = {
  customer: 'Contact',
  shipping: 'Shipping',
  'delivery-access': 'Delivery access',
  validation: 'Validation',
  'shipping-method': 'Shipping method',
  billing: 'Billing',
  tax: 'Tax',
  review: 'Summary',
  agreements: 'Confirmations',
  payment: 'Payment',
};

interface ValidationResponse {
  allowed: boolean;
  blockers: string[];
  warnings: string[];
  valid: boolean;
  errors: string[];
}

export function CheckoutFlow() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const isDemo = storeConfig.siteEnv === 'staging';

  const needsDeliveryAccess = useMemo(
    () => requiresDeliveryAccessInfo(items),
    [items],
  );
  const needsQuote = useMemo(() => requiresShippingQuote(items), [items]);
  const assemblyInCart = useMemo(() => hasAssemblyRequired(items), [items]);

  const activeSteps = useMemo<StepId[]>(() => {
    const steps: StepId[] = [
      'customer',
      'shipping',
    ];

    if (needsDeliveryAccess) {
      steps.push('delivery-access');
    }

    steps.push(
      'validation',
      'shipping-method',
      'billing',
      'tax',
      'review',
      'agreements',
      'payment',
    );

    return steps;
  }, [needsDeliveryAccess]);

  const [stepIndex, setStepIndex] = useState(0);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentStep = activeSteps[stepIndex] ?? 'customer';

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customer: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        companyName: '',
        purchaseOrderNumber: '',
      },
      shippingAddress: {
        line1: '',
        line2: '',
        city: '',
        state: 'NY',
        postalCode: '',
        country: 'United States',
      },
      deliveryAccess: {
        buildingType: null,
        floorLevel: null,
        elevatorAvailable: null,
        loadingDockAvailable: null,
        narrowStairwell: false,
        restrictedAccess: false,
        contactPhone: '',
        notes: null,
      },
      shippingMethod: {
        method: needsQuote ? 'quote-required' : 'standard',
      },
      billing: {
        sameAsShipping: true,
        address: undefined,
      },
      agreements: {
        termsAccepted: undefined as unknown as true,
        privacyAccepted: undefined as unknown as true,
        dimensionsReviewed: undefined as unknown as true,
        accessReviewed: undefined as unknown as true,
        finishUpholsteryCorrect: undefined as unknown as true,
        assemblyReviewed: undefined as unknown as true,
        marketingConsent: false,
      },
    },
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = form;

  const watchedValues = watch();
  const billingSameAsShipping = watchedValues.billing?.sameAsShipping ?? true;
  const shippingMethod = watchedValues.shippingMethod?.method ?? 'standard';
  const postalCode = watchedValues.shippingAddress?.postalCode ?? '';

  const totals = useMemo(() => {
    if (!postalCode || items.length === 0) {
      return null;
    }

    return calculateCheckoutTotals(items, shippingMethod, postalCode);
  }, [items, shippingMethod, postalCode]);

  useEffect(() => {
    if (needsQuote) {
      setValue('shippingMethod.method', 'quote-required');
    }
  }, [needsQuote, setValue]);

  const fieldErrors = useMemo(() => {
    const list: string[] = [];

    const collect = (node: unknown, prefix = ''): void => {
      if (!node || typeof node !== 'object') {
        return;
      }

      for (const [key, value] of Object.entries(node)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && 'message' in value) {
          const message = (value as { message?: string }).message;
          if (message) {
            list.push(message);
          }
        } else {
          collect(value, path);
        }
      }
    };

    collect(errors);
    return list;
  }, [errors]);

  const runServerValidation = useCallback(async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/checkout/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: items }),
      });

      const data = (await response.json()) as ValidationResponse;
      setValidationResult(data);
      return data;
    } catch {
      setValidationResult({
        allowed: false,
        blockers: ['Unable to validate cart. Please try again.'],
        warnings: [],
        valid: false,
        errors: [],
      });
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [items]);

  useEffect(() => {
    if (currentStep === 'validation' && !validationResult && !isValidating) {
      void runServerValidation();
    }
  }, [currentStep, validationResult, isValidating, runServerValidation]);

  async function validateCurrentStep(): Promise<boolean> {
    switch (currentStep) {
      case 'customer':
        return trigger('customer');
      case 'shipping':
        return trigger('shippingAddress');
      case 'delivery-access':
        return trigger('deliveryAccess');
      case 'validation': {
        if (validationResult) {
          return validationResult.allowed || isDemo;
        }
        const result = await runServerValidation();
        return Boolean(result?.allowed || (isDemo && result));
      }
      case 'shipping-method':
        return trigger('shippingMethod');
      case 'billing':
        if (billingSameAsShipping) {
          return true;
        }
        return trigger('billing.address');
      case 'tax':
        return Boolean(totals);
      case 'review':
        return true;
      case 'agreements':
        return trigger('agreements');
      case 'payment':
        return true;
      default:
        return true;
    }
  }

  async function goNext() {
    setSubmitError(null);
    const valid = await validateCurrentStep();

    if (!valid) {
      return;
    }

    if (currentStep === 'validation' && validationResult && !validationResult.allowed && !isDemo) {
      return;
    }

    setStepIndex((index) => Math.min(index + 1, activeSteps.length - 1));
  }

  function goBack() {
    setSubmitError(null);
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  async function onSubmit(values: CheckoutFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    const parsed = checkoutFormSchema.safeParse(values);

    if (!parsed.success) {
      setSubmitError('Please complete all required fields.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...parsed.data,
      cartItems: items,
    };

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        url?: string;
        requiresDemoComplete?: boolean;
        error?: string;
        blockers?: string[];
      };

      if (!response.ok) {
        setSubmitError(
          data.error ??
            data.blockers?.join(' ') ??
            'Unable to start checkout.',
        );
        return;
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
        return;
      }

      if (data.requiresDemoComplete) {
        const demoResponse = await fetch('/api/checkout/staging-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const demoData = (await demoResponse.json()) as {
          redirectUrl?: string;
          error?: string;
        };

        if (!demoResponse.ok || !demoData.redirectUrl) {
          setSubmitError(
            demoData.error ?? 'Checkout could not be completed.',
          );
          return;
        }

        clearCart();
        router.push(demoData.redirectUrl);
        return;
      }

      setSubmitError('Unable to start checkout.');
    } catch {
      setSubmitError('Unable to start checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <Section spacing="lg">
        <Container size="md">
          <div className="rounded-2xl border border-border-sand bg-soft-white px-6 py-12 text-center">
            <h1 className="font-display text-2xl font-medium text-night-ink">
              Your cart is empty
            </h1>
            <p className="mt-3 text-sm text-graphite">
              Add furniture to your cart before starting checkout.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-night-ink px-4 text-sm font-medium text-cloud-cream"
            >
              Browse furniture
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const motionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
        transition: { duration: 0.22 },
      };

  return (
    <Section spacing="lg">
      <Container size="lg">
        <div className="mb-8 space-y-4">
          <h1 className="font-display text-3xl font-medium text-night-ink">
            Checkout
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <nav aria-label="Checkout progress" className="mb-6">
              <ol className="flex flex-wrap gap-2">
                {activeSteps.map((step, index) => (
                  <li key={step}>
                    <span
                      className={
                        index === stepIndex
                          ? 'inline-flex rounded-full bg-night-ink px-3 py-1 text-xs font-medium text-cloud-cream'
                          : index < stepIndex
                            ? 'inline-flex rounded-full bg-haven-blue/15 px-3 py-1 text-xs text-haven-blue'
                            : 'inline-flex rounded-full bg-border-sand/60 px-3 py-1 text-xs text-graphite'
                      }
                    >
                      {index + 1}. {STEP_LABELS[step]}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <ErrorSummary errors={fieldErrors} className="mb-4" />
              {submitError ? (
                <ErrorSummary
                  title="Checkout could not continue"
                  errors={[submitError]}
                  className="mb-4"
                />
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div key={currentStep} {...motionProps}>
                  {currentStep === 'customer' ? (
                    <fieldset className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <legend className="px-1 font-display text-xl font-medium text-night-ink">
                        Contact information
                      </legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" required>
                            First name
                          </Label>
                          <Input id="firstName" {...register('customer.firstName')} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" required>
                            Last name
                          </Label>
                          <Input id="lastName" {...register('customer.lastName')} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" required>
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...register('customer.email')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" required>
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          {...register('customer.phone')}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company (optional)</Label>
                          <Input id="companyName" {...register('customer.companyName')} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purchaseOrderNumber">
                            PO number (optional)
                          </Label>
                          <Input
                            id="purchaseOrderNumber"
                            {...register('customer.purchaseOrderNumber')}
                          />
                        </div>
                      </div>
                    </fieldset>
                  ) : null}

                  {currentStep === 'shipping' ? (
                    <fieldset className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <legend className="px-1 font-display text-xl font-medium text-night-ink">
                        Shipping address
                      </legend>
                      <div className="space-y-2">
                        <Label htmlFor="line1" required>
                          Street address
                        </Label>
                        <Input
                          id="line1"
                          autoComplete="address-line1"
                          {...register('shippingAddress.line1')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="line2">Apartment, suite, etc.</Label>
                        <Input
                          id="line2"
                          autoComplete="address-line2"
                          {...register('shippingAddress.line2')}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2 sm:col-span-1">
                          <Label htmlFor="city" required>
                            City
                          </Label>
                          <Input id="city" {...register('shippingAddress.city')} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" required>
                            State
                          </Label>
                          <Select id="state" {...register('shippingAddress.state')}>
                            {US_STATES.map((state) => (
                              <option key={state.code} value={state.code}>
                                {state.name}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode" required>
                            ZIP code
                          </Label>
                          <Input
                            id="postalCode"
                            autoComplete="postal-code"
                            {...register('shippingAddress.postalCode')}
                          />
                        </div>
                      </div>
                      <input
                        type="hidden"
                        {...register('shippingAddress.country')}
                        value="United States"
                      />
                    </fieldset>
                  ) : null}

                  {currentStep === 'delivery-access' ? (
                    <fieldset className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <legend className="px-1 font-display text-xl font-medium text-night-ink">
                        Delivery access
                      </legend>
                      <p className="text-sm text-graphite">
                        Your order includes items that may require additional
                        delivery coordination. Provide access details so
                        Homeiffy can verify routing before dispatch.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="buildingType">Building type</Label>
                        <Select
                          id="buildingType"
                          {...register('deliveryAccess.buildingType', {
                            setValueAs: (value: string) =>
                              value === '' ? null : value,
                          })}
                        >
                          <option value="">Select…</option>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="mixed-use">Mixed use</option>
                          <option value="other">Other</option>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floorLevel">Floor level</Label>
                        <Input
                          id="floorLevel"
                          placeholder="e.g. 3rd floor"
                          {...register('deliveryAccess.floorLevel', {
                            setValueAs: (value: string) =>
                              value.trim() ? value.trim() : null,
                          })}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="elevatorAvailable">Elevator available?</Label>
                          <Select
                            id="elevatorAvailable"
                            {...register('deliveryAccess.elevatorAvailable', {
                              setValueAs: (value: string) =>
                                value === '' ? null : value === 'true',
                            })}
                          >
                            <option value="">Unknown</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="loadingDockAvailable">
                            Loading dock available?
                          </Label>
                          <Select
                            id="loadingDockAvailable"
                            {...register('deliveryAccess.loadingDockAvailable', {
                              setValueAs: (value: string) =>
                                value === '' ? null : value === 'true',
                            })}
                          >
                            <option value="">Unknown</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            {...register('deliveryAccess.narrowStairwell')}
                            className="size-4 rounded border-border-sand"
                          />
                          Narrow stairwell or restricted hallway
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            {...register('deliveryAccess.restrictedAccess')}
                            className="size-4 rounded border-border-sand"
                          />
                          Gated or restricted building access
                        </label>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">
                          On-site contact phone (optional)
                        </Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          {...register('deliveryAccess.contactPhone')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accessNotes">Additional notes</Label>
                        <Textarea
                          id="accessNotes"
                          {...register('deliveryAccess.notes', {
                            setValueAs: (value: string) =>
                              value.trim() ? value.trim() : null,
                          })}
                        />
                      </div>
                    </fieldset>
                  ) : null}

                  {currentStep === 'validation' ? (
                    <div className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <h2 className="font-display text-xl font-medium text-night-ink">
                        Product validation
                      </h2>
                      <p className="text-sm text-graphite">
                        Homeiffy revalidates every cart line against the
                        current catalog before payment. Client-side prices are
                        never trusted.
                      </p>
                      {isValidating ? (
                        <p className="text-sm text-haven-blue">Validating…</p>
                      ) : null}
                      {validationResult ? (
                        <div className="space-y-3">
                          {validationResult.blockers.length > 0 ? (
                            <ErrorSummary
                              title="Checkout blockers"
                              errors={validationResult.blockers}
                            />
                          ) : null}
                          {validationResult.warnings.length > 0 ? (
                            <div
                              role="status"
                              className="rounded-md border border-haven-blue/30 bg-haven-blue/10 px-4 py-3 text-sm"
                            >
                              <p className="font-medium">Warnings</p>
                              <ul className="mt-2 list-disc space-y-1 pl-5">
                                {validationResult.warnings.map((warning) => (
                                  <li key={warning}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          {validationResult.allowed ? (
                            <p className="text-sm text-haven-blue">
                              All items passed server validation.
                            </p>
                          ) : null}
                        </div>
                      ) : (
                        <Button type="button" variant="secondary" onClick={runServerValidation}>
                          Run validation
                        </Button>
                      )}
                    </div>
                  ) : null}

                  {currentStep === 'shipping-method' ? (
                    <fieldset className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <legend className="px-1 font-display text-xl font-medium text-night-ink">
                        Shipping method
                      </legend>
                      {needsQuote ? (
                        <div
                          role="status"
                          className="rounded-md border border-border-sand bg-cloud-cream px-4 py-3 text-sm text-graphite"
                        >
                          One or more items require freight review. A verified
                          shipping quote will be provided before dispatch - no
                          flat carrier rate is shown.
                        </div>
                      ) : (
                        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-sand p-4">
                          <input
                            type="radio"
                            value="standard"
                            {...register('shippingMethod.method')}
                            className="mt-1"
                          />
                          <span>
                            <span className="font-medium text-night-ink">
                              Standard shipping estimate
                            </span>
                            <span className="mt-1 block text-sm text-graphite">
                              Estimated rate based on package size and
                              destination. Final shipping confirmed at dispatch.
                            </span>
                            {totals ? (
                              <span className="mt-2 block font-mono-data text-sm">
                                {formatPrice(totals.shipping, totals.currency)}
                              </span>
                            ) : null}
                          </span>
                        </label>
                      )}
                      {needsQuote ? (
                        <input
                          type="hidden"
                          {...register('shippingMethod.method')}
                          value="quote-required"
                        />
                      ) : null}
                      {totals ? (
                        <p className="text-xs text-graphite">{totals.shippingNote}</p>
                      ) : null}
                    </fieldset>
                  ) : null}

                  {currentStep === 'billing' ? (
                    <fieldset className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <legend className="px-1 font-display text-xl font-medium text-night-ink">
                        Billing address
                      </legend>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...register('billing.sameAsShipping')}
                          className="size-4 rounded border-border-sand"
                        />
                        Billing address same as shipping
                      </label>
                      {!billingSameAsShipping ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingLine1" required>
                              Street address
                            </Label>
                            <Input
                              id="billingLine1"
                              {...register('billing.address.line1')}
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                              <Label htmlFor="billingCity" required>
                                City
                              </Label>
                              <Input
                                id="billingCity"
                                {...register('billing.address.city')}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingState" required>
                                State
                              </Label>
                              <Select
                                id="billingState"
                                {...register('billing.address.state')}
                              >
                                {US_STATES.map((state) => (
                                  <option key={state.code} value={state.code}>
                                    {state.name}
                                  </option>
                                ))}
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingPostalCode" required>
                                ZIP
                              </Label>
                              <Input
                                id="billingPostalCode"
                                {...register('billing.address.postalCode')}
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </fieldset>
                  ) : null}

                  {currentStep === 'tax' ? (
                    <div className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <h2 className="font-display text-xl font-medium text-night-ink">
                        Tax
                      </h2>
                      {totals ? (
                        <>
                          <p className="text-sm font-medium text-night-ink">
                            {totals.tax.label}
                          </p>
                          <p className="font-mono-data text-lg">
                            {totals.tax.calculatedAtPayment
                              ? 'Calculated at payment'
                              : formatPrice(totals.tax.amount, totals.currency)}
                          </p>
                          <p className="text-sm text-graphite">{totals.tax.note}</p>
                        </>
                      ) : (
                        <p className="text-sm text-graphite">
                          Enter a shipping ZIP code to preview tax.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {currentStep === 'review' ? (
                    <div className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <h2 className="font-display text-xl font-medium text-night-ink">
                        Order summary
                      </h2>
                      <ul className="divide-y divide-border-sand">
                        {items.map((item) => (
                          <li key={item.productId} className="py-3">
                            <p className="font-medium text-night-ink">
                              {item.quantity}× {item.title}
                            </p>
                            <p className="font-mono-data text-xs text-graphite">
                              {item.sku}
                            </p>
                            <p className="text-xs text-graphite">
                              {formatDimensions(
                                item.dimensionsSnapshot.width,
                                item.dimensionsSnapshot.height,
                                item.dimensionsSnapshot.depth,
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                      {totals ? (
                        <dl className="space-y-2 border-t border-border-sand pt-4 text-sm">
                          <div className="flex justify-between">
                            <dt>Subtotal</dt>
                            <dd>
                              {formatPrice(totals.subtotal, totals.currency)}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>{totals.shippingLabel}</dt>
                            <dd>
                              {shippingMethod === 'quote-required'
                                ? 'Quote required'
                                : formatPrice(totals.shipping, totals.currency)}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>{totals.tax.label}</dt>
                            <dd>
                              {totals.tax.calculatedAtPayment
                                ? 'At payment'
                                : formatPrice(totals.tax.amount, totals.currency)}
                            </dd>
                          </div>
                          <div className="flex justify-between font-medium">
                            <dt>Estimated total</dt>
                            <dd>
                              {formatPrice(totals.total, totals.currency)}
                            </dd>
                          </div>
                        </dl>
                      ) : null}
                    </div>
                  ) : null}

                  {currentStep === 'agreements' ? (
                    <fieldset className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <legend className="px-1 font-display text-xl font-medium text-night-ink">
                        Required confirmations
                      </legend>
                      {[
                        {
                          name: 'agreements.termsAccepted' as const,
                          label: (
                            <>
                              I accept the{' '}
                              <Link
                                href="/terms-conditions"
                                className="text-haven-blue underline-offset-4 hover:underline"
                              >
                                Terms and Conditions
                              </Link>
                              .
                            </>
                          ),
                        },
                        {
                          name: 'agreements.privacyAccepted' as const,
                          label: (
                            <>
                              I acknowledge the{' '}
                              <Link
                                href="/privacy-policy"
                                className="text-haven-blue underline-offset-4 hover:underline"
                              >
                                Privacy Policy
                              </Link>
                              .
                            </>
                          ),
                        },
                        {
                          name: 'agreements.dimensionsReviewed' as const,
                          label:
                            'I have reviewed product dimensions and confirmed they fit my space.',
                        },
                        {
                          name: 'agreements.accessReviewed' as const,
                          label:
                            'I have reviewed doorway, hallway and delivery-route access.',
                        },
                        {
                          name: 'agreements.finishUpholsteryCorrect' as const,
                          label:
                            'Finish and upholstery selections are correct.',
                        },
                        {
                          name: 'agreements.assemblyReviewed' as const,
                          label: assemblyInCart
                            ? 'I have reviewed assembly requirements for items in my order.'
                            : 'I have reviewed assembly information where applicable.',
                        },
                      ].map((item) => (
                        <label
                          key={item.name}
                          className="flex items-start gap-3 text-sm"
                        >
                          <input
                            type="checkbox"
                            {...register(item.name, {
                              setValueAs: (checked: boolean) =>
                                checked ? true : undefined,
                            })}
                            className="mt-1 size-4 rounded border-border-sand"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                      <label className="flex items-start gap-3 text-sm text-graphite">
                        <input
                          type="checkbox"
                          {...register('agreements.marketingConsent')}
                          className="mt-1 size-4 rounded border-border-sand"
                        />
                        <span>
                          Send me occasional catalog and room-guide updates
                          (optional).
                        </span>
                      </label>
                    </fieldset>
                  ) : null}

                  {currentStep === 'payment' ? (
                    <div className="space-y-4 rounded-2xl border border-border-sand bg-soft-white p-6">
                      <h2 className="font-display text-xl font-medium text-night-ink">
                        Secure payment
                      </h2>
                      <p className="text-sm text-graphite">
                        You will be redirected to Stripe Checkout to complete
                        payment. Homeiffy never collects card numbers on this
                        site.
                      </p>
                      {isDemo && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                        <p className="text-sm text-haven-blue">
                          Payment processing is being configured. Your order
                          will be confirmed once checkout is available.
                        </p>
                      ) : null}
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? 'Starting checkout…'
                          : 'Continue to secure payment'}
                      </Button>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={stepIndex === 0 || isSubmitting}
                >
                  Back
                </Button>
                {currentStep !== 'payment' ? (
                  <Button type="button" variant="primary" onClick={goNext}>
                    Continue
                  </Button>
                ) : null}
              </div>
            </form>
          </div>

          <CheckoutCartSummary className="lg:sticky lg:top-28" />
        </div>
      </Container>
    </Section>
  );
}
