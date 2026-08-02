import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

import type { CheckoutAgreementsValues } from '@/lib/validators';
import type {
  DeliveryAccessValues,
  ShippingAddressValues,
} from '@/lib/validators';
import type { CheckoutCustomerInfo } from '@/lib/orders';
import type { Order, OrderAddress, OrderLineItem } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PENDING_DIR = path.join(DATA_DIR, 'pending-checkout');

export interface StoredOrder extends Order {
  stripeSessionId: string | null;
  deliveryAccess: DeliveryAccessValues | null;
  agreements: CheckoutAgreementsValues;
  marketingConsent: boolean;
  shippingMethod: 'standard' | 'quote-required';
  shippingLabel: string;
  shippingNote: string;
  taxLabel: string;
  taxNote: string;
  isStagingOrder: boolean;
  purchaseOrderNumber: string | null;
}

export interface PendingCheckoutRecord {
  id: string;
  stripeSessionId: string | null;
  payload: PendingCheckoutPayload;
  createdAt: string;
}

export interface PendingCheckoutPayload {
  customer: CheckoutCustomerInfo;
  shippingAddress: ShippingAddressValues;
  billingAddress: OrderAddress;
  deliveryAccess: DeliveryAccessValues | null;
  lineItems: OrderLineItem[];
  subtotal: number;
  shipping: number;
  shippingLabel: string;
  shippingNote: string;
  tax: number;
  taxLabel: string;
  taxNote: string;
  total: number;
  currency: string;
  shippingMethod: 'standard' | 'quote-required';
  agreements: CheckoutAgreementsValues;
  marketingConsent: boolean;
  purchaseOrderNumber: string | null;
  isStagingOrder: boolean;
}

const memoryOrders = new Map<string, StoredOrder>();
const memoryPending = new Map<string, PendingCheckoutRecord>();
const sessionToOrderId = new Map<string, string>();
const sessionToPendingId = new Map<string, string>();
let fileStoreAvailable = true;

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function readOrdersFromFile(): Promise<StoredOrder[]> {
  if (!fileStoreAvailable) {
    return Array.from(memoryOrders.values());
  }

  try {
    await ensureDir(DATA_DIR);
    const raw = await fs.readFile(ORDERS_FILE, 'utf8');
    const parsed = JSON.parse(raw) as StoredOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    fileStoreAvailable = false;
    return Array.from(memoryOrders.values());
  }
}

async function writeOrdersToFile(orders: StoredOrder[]): Promise<void> {
  for (const order of orders) {
    memoryOrders.set(order.id, order);
    if (order.stripeSessionId) {
      sessionToOrderId.set(order.stripeSessionId, order.id);
    }
  }

  if (!fileStoreAvailable) {
    return;
  }

  try {
    await ensureDir(DATA_DIR);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch {
    fileStoreAvailable = false;
  }
}

async function writePendingRecord(record: PendingCheckoutRecord): Promise<void> {
  memoryPending.set(record.id, record);
  if (record.stripeSessionId) {
    sessionToPendingId.set(record.stripeSessionId, record.id);
  }

  if (!fileStoreAvailable) {
    return;
  }

  try {
    await ensureDir(PENDING_DIR);
    await fs.writeFile(
      path.join(PENDING_DIR, `${record.id}.json`),
      JSON.stringify(record, null, 2),
      'utf8',
    );
  } catch {
    fileStoreAvailable = false;
  }
}

async function readPendingRecord(id: string): Promise<PendingCheckoutRecord | null> {
  const cached = memoryPending.get(id);
  if (cached) {
    return cached;
  }

  if (!fileStoreAvailable) {
    return null;
  }

  try {
    const raw = await fs.readFile(
      path.join(PENDING_DIR, `${id}.json`),
      'utf8',
    );
    const parsed = JSON.parse(raw) as PendingCheckoutRecord;
    memoryPending.set(parsed.id, parsed);
    return parsed;
  } catch {
    return null;
  }
}

export async function savePendingCheckout(
  payload: PendingCheckoutPayload,
  options?: { stripeSessionId?: string | null; pendingId?: string },
): Promise<PendingCheckoutRecord> {
  const record: PendingCheckoutRecord = {
    id: options?.pendingId ?? randomUUID(),
    stripeSessionId: options?.stripeSessionId ?? null,
    payload,
    createdAt: new Date().toISOString(),
  };

  await writePendingRecord(record);
  return record;
}

export async function attachSessionToPending(
  pendingId: string,
  sessionId: string,
): Promise<void> {
  const record = await readPendingRecord(pendingId);
  if (!record) {
    return;
  }

  record.stripeSessionId = sessionId;
  await writePendingRecord(record);
}

export async function getAllOrders(): Promise<StoredOrder[]> {
  return readOrdersFromFile();
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
  const orders = await readOrdersFromFile();
  return orders.find((order) => order.id === id) ?? memoryOrders.get(id) ?? null;
}

export async function getOrderByReference(
  reference: string,
): Promise<StoredOrder | null> {
  const orders = await readOrdersFromFile();
  return (
    orders.find((order) => order.reference === reference) ??
    Array.from(memoryOrders.values()).find(
      (order) => order.reference === reference,
    ) ??
    null
  );
}

export async function getOrderBySessionId(
  sessionId: string,
): Promise<StoredOrder | null> {
  const orderId = sessionToOrderId.get(sessionId);
  if (orderId) {
    return getOrderById(orderId);
  }

  const orders = await readOrdersFromFile();
  return orders.find((order) => order.stripeSessionId === sessionId) ?? null;
}

export async function findOrderByReferenceAndEmail(
  reference: string,
  email: string,
): Promise<StoredOrder | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const orders = await readOrdersFromFile();

  return (
    orders.find(
      (order) =>
        order.reference === reference &&
        order.customerEmail.trim().toLowerCase() === normalizedEmail,
    ) ?? null
  );
}

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  const orders = await readOrdersFromFile();
  const existingIndex = orders.findIndex(
    (entry) =>
      entry.id === order.id ||
      (order.stripeSessionId &&
        entry.stripeSessionId === order.stripeSessionId) ||
      entry.reference === order.reference,
  );

  if (existingIndex >= 0) {
    const existing = orders[existingIndex];
    memoryOrders.set(existing.id, existing);
    if (existing.stripeSessionId) {
      sessionToOrderId.set(existing.stripeSessionId, existing.id);
    }
    return existing;
  }

  orders.push(order);
  await writeOrdersToFile(orders);
  return order;
}

export async function buildAndSaveOrderFromPending(
  pendingId: string,
  sessionId: string | null,
  reference: string,
  options?: {
    paymentStatus?: Order['paymentStatus'];
    fulfillmentStatus?: Order['fulfillmentStatus'];
  },
): Promise<{ order: StoredOrder; created: boolean }> {
  if (sessionId) {
    const existing = await getOrderBySessionId(sessionId);
    if (existing) {
      return { order: existing, created: false };
    }
  }

  const pending = await readPendingRecord(pendingId);
  if (!pending) {
    throw new Error('Pending checkout record not found.');
  }

  const now = new Date().toISOString();
  const order: StoredOrder = {
    id: randomUUID(),
    reference,
    stripeSessionId: sessionId,
    customerEmail: pending.payload.customer.email,
    customerFirstName: pending.payload.customer.firstName,
    customerLastName: pending.payload.customer.lastName,
    customerPhone: pending.payload.customer.phone,
    companyName: pending.payload.customer.companyName,
    shippingAddress: pending.payload.shippingAddress,
    billingAddress: pending.payload.billingAddress,
    lineItems: pending.payload.lineItems,
    subtotal: pending.payload.subtotal,
    shipping: pending.payload.shipping,
    tax: pending.payload.tax,
    total: pending.payload.total,
    currency: pending.payload.currency,
    paymentStatus: options?.paymentStatus ?? 'paid',
    fulfillmentStatus:
      options?.fulfillmentStatus ??
      (pending.payload.shippingMethod === 'quote-required'
        ? 'shipping-review-required'
        : 'payment-confirmed'),
    createdAt: now,
    updatedAt: now,
    deliveryAccess: pending.payload.deliveryAccess,
    agreements: pending.payload.agreements,
    marketingConsent: pending.payload.marketingConsent,
    shippingMethod: pending.payload.shippingMethod,
    shippingLabel: pending.payload.shippingLabel,
    shippingNote: pending.payload.shippingNote,
    taxLabel: pending.payload.taxLabel,
    taxNote: pending.payload.taxNote,
    isStagingOrder: pending.payload.isStagingOrder,
    purchaseOrderNumber: pending.payload.purchaseOrderNumber,
    paymentProviderReference: sessionId,
  };

  const saved = await saveOrder(order);
  return { order: saved, created: true };
}

export async function getPendingCheckout(
  pendingId: string,
): Promise<PendingCheckoutRecord | null> {
  return readPendingRecord(pendingId);
}
