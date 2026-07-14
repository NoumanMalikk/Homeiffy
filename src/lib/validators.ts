import { z } from 'zod';

const usPhonePattern = /^(\+1[\s.-]?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/;

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is required').max(120),
    email: z.email('Enter a valid email address'),
    phone: z
      .string()
      .trim()
      .regex(usPhonePattern, 'Enter a valid phone number')
      .optional()
      .or(z.literal('')),
    subject: z.string().trim().min(3, 'Subject is required').max(160),
    message: z
      .string()
      .trim()
      .min(20, 'Please provide a few more details')
      .max(4000),
    consent: z.union([z.boolean(), z.undefined()]),
  })
  .superRefine((values, context) => {
    if (values.consent !== true) {
      context.addIssue({
        code: 'custom',
        path: ['consent'],
        message: 'Consent is required to respond to your inquiry.',
      });
    }
  });

export const quoteRequestFormSchema = z
  .object({
    contactName: z.string().trim().min(2).max(120),
    companyName: z.string().trim().max(160).optional().or(z.literal('')),
    email: z.email(),
    phone: z.string().trim().regex(usPhonePattern, 'Enter a valid phone number'),
    shippingPostalCode: z
      .string()
      .trim()
      .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid US ZIP code'),
    lineItems: z
      .array(
        z.object({
          productId: z.string().min(1),
          sku: z.string().min(1),
          title: z.string().min(1),
          finishId: z.string().nullable(),
          upholsteryId: z.string().nullable(),
          configuration: z.string().nullable(),
          quantity: z.number().int().min(1).max(99),
        }),
      )
      .min(1, 'Add at least one product to your quote request'),
    buildingType: z.string().trim().max(80).nullable(),
    floorLevel: z.string().trim().max(40).nullable(),
    elevatorAvailable: z.boolean().nullable(),
    loadingDockAvailable: z.boolean().nullable(),
    requestedDeliveryWindow: z.string().trim().max(160).nullable(),
    additionalDetails: z.string().trim().max(4000).nullable(),
    contactConsent: z.union([z.boolean(), z.undefined()]),
    privacyAcknowledged: z.union([z.boolean(), z.undefined()]),
  })
  .superRefine((values, context) => {
    if (values.contactConsent !== true) {
      context.addIssue({
        code: 'custom',
        path: ['contactConsent'],
        message: 'Consent is required to respond to your quote request.',
      });
    }

    if (values.privacyAcknowledged !== true) {
      context.addIssue({
        code: 'custom',
        path: ['privacyAcknowledged'],
        message: 'Please acknowledge the Privacy Policy.',
      });
    }
  });

const optionalTriState = z.enum(['', 'yes', 'no']);

function parseTriStateBoolean(value: '' | 'yes' | 'no'): boolean | null {
  if (value === 'yes') {
    return true;
  }

  if (value === 'no') {
    return false;
  }

  return null;
}

export const quoteRequestFormInputSchema = z
  .object({
    contactName: z.string().trim().min(2, 'Contact name is required').max(120),
    companyName: z.string().trim().max(160).optional().or(z.literal('')),
    email: z.email('Enter a valid email address'),
    phone: z
      .string()
      .trim()
      .regex(usPhonePattern, 'Enter a valid phone number'),
    shippingPostalCode: z
      .string()
      .trim()
      .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid US ZIP code'),
    lineItems: z
      .array(
        z.object({
          productId: z.string().min(1, 'Select a product'),
          sku: z.string().min(1),
          title: z.string().min(1),
          finishId: z.string().nullable().or(z.literal('')),
          upholsteryId: z.string().nullable().or(z.literal('')),
          configuration: z.string().nullable().or(z.literal('')),
          quantity: z.number().int().min(1).max(99),
        }),
      )
      .min(1, 'Add at least one product to your quote request'),
    buildingType: z.string().trim().max(80).optional().or(z.literal('')),
    floorLevel: z.string().trim().max(40).optional().or(z.literal('')),
    elevatorAvailable: optionalTriState,
    loadingDockAvailable: optionalTriState,
    requestedDeliveryWindow: z.string().trim().max(160).optional().or(z.literal('')),
    additionalDetails: z.string().trim().max(4000).optional().or(z.literal('')),
    contactConsent: z.union([z.boolean(), z.undefined()]),
    privacyAcknowledged: z.union([z.boolean(), z.undefined()]),
  })
  .superRefine((values, context) => {
    if (values.contactConsent !== true) {
      context.addIssue({
        code: 'custom',
        path: ['contactConsent'],
        message: 'Consent is required to respond to your quote request.',
      });
    }

    if (values.privacyAcknowledged !== true) {
      context.addIssue({
        code: 'custom',
        path: ['privacyAcknowledged'],
        message: 'Please acknowledge the Privacy Policy.',
      });
    }
  })
  .transform(
    (values): QuoteRequestFormValues => ({
      contactName: values.contactName,
      companyName: values.companyName ?? '',
      email: values.email,
      phone: values.phone,
      shippingPostalCode: values.shippingPostalCode,
      lineItems: values.lineItems.map((item) => ({
        productId: item.productId,
        sku: item.sku,
        title: item.title,
        finishId: item.finishId || null,
        upholsteryId: item.upholsteryId || null,
        configuration: item.configuration || null,
        quantity: item.quantity,
      })),
      buildingType: values.buildingType?.trim() || null,
      floorLevel: values.floorLevel?.trim() || null,
      elevatorAvailable: parseTriStateBoolean(values.elevatorAvailable),
      loadingDockAvailable: parseTriStateBoolean(values.loadingDockAvailable),
      requestedDeliveryWindow: values.requestedDeliveryWindow?.trim() || null,
      additionalDetails: values.additionalDetails?.trim() || null,
      contactConsent: values.contactConsent,
      privacyAcknowledged: values.privacyAcknowledged,
    }),
  );

export const newsletterSchema = z.object({
  email: z.email(),
  source: z.string().trim().max(80).optional(),
});

export const checkoutCustomerInfoSchema = z.object({
  email: z.email(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().regex(usPhonePattern, 'Enter a valid phone number'),
  companyName: z.string().trim().max(160).optional().or(z.literal('')),
  purchaseOrderNumber: z.string().trim().max(80).optional().or(z.literal('')),
});

export const shippingAddressSchema = z.object({
  line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(2).max(80),
  state: z
    .string()
    .trim()
    .length(2, 'Use the two-letter state code')
    .transform((value) => value.toUpperCase()),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid US ZIP code'),
  country: z.string().trim().min(2).max(80).default('United States'),
});

export const deliveryAccessSchema = z.object({
  buildingType: z
    .enum(['residential', 'commercial', 'mixed-use', 'other'])
    .nullable(),
  floorLevel: z.string().trim().max(40).nullable(),
  elevatorAvailable: z.boolean().nullable(),
  loadingDockAvailable: z.boolean().nullable(),
  narrowStairwell: z.boolean().optional(),
  restrictedAccess: z.boolean().optional(),
  contactPhone: z
    .string()
    .trim()
    .regex(usPhonePattern, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  notes: z.string().trim().max(1000).nullable(),
});

export const trackOrderSchema = z.object({
  orderRef: z
    .string()
    .trim()
    .regex(/^DH-[A-Z0-9-]+$/, 'Enter a valid order reference'),
  email: z.email(),
});

const cartItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  unitPrice: z.number().nonnegative(),
  selectedFinishId: z.string().nullable(),
  selectedUpholsteryId: z.string().nullable(),
  selectedConfiguration: z.string().nullable(),
  dimensionsSnapshot: z.object({
    width: z.number().nullable(),
    height: z.number().nullable(),
    depth: z.number().nullable(),
  }),
  boxCount: z.union([z.number(), z.string(), z.null()]),
  shippingClass: z.string(),
  assemblyRequired: z.union([z.boolean(), z.string(), z.null()]),
  productionReady: z.boolean(),
});

export const shippingMethodSchema = z.object({
  method: z.enum(['staging-estimate', 'quote-required']),
});

export const billingAddressFormSchema = z
  .object({
    sameAsShipping: z.boolean(),
    address: shippingAddressSchema.optional(),
  })
  .refine((data) => data.sameAsShipping || Boolean(data.address), {
    message: 'Billing address is required when not same as shipping.',
    path: ['address'],
  });

export const checkoutAgreementsSchema = z.object({
  termsAccepted: z.literal(true, {
    error: 'You must accept the Terms and Conditions.',
  }),
  privacyAccepted: z.literal(true, {
    error: 'You must acknowledge the Privacy Policy.',
  }),
  dimensionsReviewed: z.literal(true, {
    error: 'Confirm you have reviewed product dimensions.',
  }),
  accessReviewed: z.literal(true, {
    error: 'Confirm you have reviewed doorway and delivery access.',
  }),
  finishUpholsteryCorrect: z.literal(true, {
    error: 'Confirm finish and upholstery selections are correct.',
  }),
  assemblyReviewed: z.literal(true, {
    error: 'Confirm you have reviewed assembly requirements.',
  }),
  marketingConsent: z.boolean().optional(),
});

export const checkoutSessionRequestSchema = z.object({
  cartItems: z.array(cartItemSchema).min(1),
  customer: checkoutCustomerInfoSchema,
  shippingAddress: shippingAddressSchema,
  deliveryAccess: deliveryAccessSchema.optional(),
  shippingMethod: shippingMethodSchema,
  billing: billingAddressFormSchema,
  agreements: checkoutAgreementsSchema,
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type QuoteRequestFormValues = z.infer<typeof quoteRequestFormSchema>;
export type QuoteRequestFormInputValues = z.input<
  typeof quoteRequestFormInputSchema
>;
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
export type CheckoutCustomerInfoValues = z.infer<
  typeof checkoutCustomerInfoSchema
>;
export type ShippingAddressValues = z.infer<typeof shippingAddressSchema>;
export type DeliveryAccessValues = z.infer<typeof deliveryAccessSchema>;
export type TrackOrderValues = z.infer<typeof trackOrderSchema>;
export type CheckoutAgreementsValues = z.infer<typeof checkoutAgreementsSchema>;
export type CheckoutSessionRequest = z.infer<
  typeof checkoutSessionRequestSchema
>;
