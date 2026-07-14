import { customAlphabet } from 'nanoid';

import { storeConfig } from '@/data/store-config';
import type {
  OrderAddress,
  OrderLineItem,
  OrderStatus,
  PaymentStatus,
} from '@/lib/types';

/** Alphabet excludes 0, 1, I, O to avoid ambiguous characters. */
const ORDER_REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generateReferenceSuffix = customAlphabet(ORDER_REFERENCE_ALPHABET, 14);
const generateReferenceTime = customAlphabet(ORDER_REFERENCE_ALPHABET, 8);

export const ORDER_STATUSES: OrderStatus[] = [
  'order-received',
  'payment-confirmed',
  'processing',
  'preparing-for-shipment',
  'shipping-review-required',
  'shipped',
  'delivered',
  'cancelled',
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  'pending',
  'paid',
  'failed',
  'refunded',
];

export interface CheckoutCustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string | null;
}

export interface CreateOrderPayload {
  reference: string;
  customer: CheckoutCustomerInfo;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  lineItems: OrderLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderStatus;
  paymentProviderReference: string | null;
  deliveryAccess?: {
    buildingType: string | null;
    floorLevel: string | null;
    elevatorAvailable: boolean | null;
    loadingDockAvailable: boolean | null;
    notes: string | null;
  };
}

/** Generates a non-guessable order reference for customer-facing tracking. */
export function generateOrderReference(): string {
  return `DH-${generateReferenceTime()}-${generateReferenceSuffix()}`;
}

export function createOrderPayload(
  input: Omit<CreateOrderPayload, 'reference' | 'currency'> & {
    reference?: string;
    currency?: string;
  },
): CreateOrderPayload {
  return {
    ...input,
    reference: input.reference ?? generateOrderReference(),
    currency: input.currency ?? storeConfig.currency,
  };
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return ORDER_STATUSES.includes(status as OrderStatus);
}

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return PAYMENT_STATUSES.includes(status as PaymentStatus);
}
