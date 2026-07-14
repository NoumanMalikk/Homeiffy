import { NextResponse, type NextRequest } from 'next/server';

import { evaluateCheckoutBlockers } from '@/lib/checkout';
import { calculateCartTotals } from '@/lib/cart';
import type { CartItem } from '@/lib/types';
import { z } from 'zod';

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

const validateRequestSchema = z.object({
  cartItems: z.array(cartItemSchema).min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const parsed = validateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Cart items are required.' },
      { status: 400 },
    );
  }

  const cartItems = parsed.data.cartItems as CartItem[];
  const evaluation = evaluateCheckoutBlockers(cartItems);
  const totals = calculateCartTotals(cartItems, {
    revalidateAgainstCatalog: true,
  });

  return NextResponse.json({
    allowed: evaluation.allowed,
    blockers: evaluation.blockers,
    warnings: evaluation.warnings,
    itemCount: totals.itemCount,
    subtotal: totals.subtotal,
    currency: totals.currency,
    valid: totals.valid,
    errors: totals.errors,
  });
}
