import { describe, expect, it } from 'vitest';

import {
  checkoutCustomerInfoSchema,
  checkoutSessionRequestSchema,
  contactFormSchema,
  newsletterSchema,
  quoteRequestFormInputSchema,
  quoteRequestFormSchema,
} from '@/lib/validators';
import { cartItemFromProduct } from '@/__tests__/helpers/cart-item';
import { getProductBySku } from '@/lib/products';

const validPhone = '718-555-0100';
const validEmail = 'customer@example.com';

describe('form validators', () => {
  describe('contactFormSchema', () => {
    it('accepts a complete contact submission', () => {
      const result = contactFormSchema.safeParse({
        name: 'Alex Rivera',
        email: validEmail,
        phone: validPhone,
        subject: 'Product dimensions',
        message: 'Please confirm doorway clearance for HMF-DIN-005.',
        consent: true,
      });

      expect(result.success).toBe(true);
    });

    it('requires consent and a substantive message', () => {
      const result = contactFormSchema.safeParse({
        name: 'Alex',
        email: validEmail,
        subject: 'Hi',
        message: 'Too short',
        consent: false,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('quoteRequestFormSchema', () => {
    const lineItem = {
      productId: 'hmf-liv-008',
      sku: 'HMF-LIV-008',
      title: 'Nesting Side Tables, Set of 3',
      finishId: null,
      upholsteryId: null,
      configuration: null,
      quantity: 1,
    };

    it('accepts a valid quote request', () => {
      const result = quoteRequestFormSchema.safeParse({
        contactName: 'Jordan Lee',
        companyName: '',
        email: validEmail,
        phone: validPhone,
        shippingPostalCode: '36752',
        lineItems: [lineItem],
        buildingType: null,
        floorLevel: null,
        elevatorAvailable: null,
        loadingDockAvailable: null,
        requestedDeliveryWindow: null,
        additionalDetails: null,
        contactConsent: true,
        privacyAcknowledged: true,
      });

      expect(result.success).toBe(true);
    });

    it('rejects quote requests without consent acknowledgements', () => {
      const result = quoteRequestFormSchema.safeParse({
        contactName: 'Jordan Lee',
        email: validEmail,
        phone: validPhone,
        shippingPostalCode: '36752',
        lineItems: [lineItem],
        buildingType: null,
        floorLevel: null,
        elevatorAvailable: null,
        loadingDockAvailable: null,
        requestedDeliveryWindow: null,
        additionalDetails: null,
        contactConsent: false,
        privacyAcknowledged: false,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('quoteRequestFormInputSchema', () => {
    it('normalizes empty strings to null on transform', () => {
      const result = quoteRequestFormInputSchema.safeParse({
        contactName: 'Jordan Lee',
        companyName: '',
        email: validEmail,
        phone: validPhone,
        shippingPostalCode: '36752',
        lineItems: [
          {
            productId: 'hmf-liv-008',
            sku: 'HMF-LIV-008',
            title: 'Nesting Side Tables, Set of 3',
            finishId: '',
            upholsteryId: '',
            configuration: '',
            quantity: 1,
          },
        ],
        buildingType: '',
        floorLevel: '',
        elevatorAvailable: '',
        loadingDockAvailable: '',
        requestedDeliveryWindow: '',
        additionalDetails: '',
        contactConsent: true,
        privacyAcknowledged: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lineItems[0]?.finishId).toBeNull();
        expect(result.data.elevatorAvailable).toBeNull();
      }
    });
  });

  describe('newsletterSchema', () => {
    it('accepts a valid email signup', () => {
      const result = newsletterSchema.safeParse({
        email: validEmail,
        source: 'homepage',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('checkoutCustomerInfoSchema', () => {
    it('accepts required checkout customer fields', () => {
      const result = checkoutCustomerInfoSchema.safeParse({
        email: validEmail,
        firstName: 'Alex',
        lastName: 'Rivera',
        phone: validPhone,
        companyName: '',
        purchaseOrderNumber: '',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('checkoutSessionRequestSchema', () => {
    it('requires agreements and a non-empty cart', () => {
      const product = getProductBySku('HMF-LIV-008')!;
      const cartItem = cartItemFromProduct(product);

      const result = checkoutSessionRequestSchema.safeParse({
        cartItems: [cartItem],
        customer: {
          email: validEmail,
          firstName: 'Alex',
          lastName: 'Rivera',
          phone: validPhone,
          companyName: '',
          purchaseOrderNumber: '',
        },
        shippingAddress: {
          line1: '4318 HWY 21',
          line2: '',
          city: 'Burkville',
          state: 'AL',
          postalCode: '36752',
          country: 'United States',
        },
        shippingMethod: { method: 'standard' },
        billing: { sameAsShipping: true },
        agreements: {
          termsAccepted: true,
          privacyAccepted: true,
          dimensionsReviewed: true,
          accessReviewed: true,
          finishUpholsteryCorrect: true,
          assemblyReviewed: true,
        },
      });

      expect(result.success).toBe(true);
    });
  });
});

