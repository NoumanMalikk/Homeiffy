# Payment Setup (Stripe)

Homeiffy uses **Stripe Checkout** with server-created sessions. Card data is never collected in custom form fields.

## Architecture

| Component | Location |
|-----------|----------|
| Stripe client | `src/lib/stripe.ts` |
| Session creation | `createCheckoutSession()` |
| Checkout API | `POST /api/checkout/create-session` |
| Staging completion | `POST /api/checkout/staging-complete` |
| Webhook | `POST /api/webhooks/stripe` |
| Order build | `src/lib/checkout-api.ts`, `src/lib/order-store.ts` |

## Test mode (development / demo)

1. Create a Stripe account
2. Dashboard → **Developers → API keys** → copy **Secret key** (`sk_test_...`)
3. Set in `.env.local`:

```env
NEXT_PUBLIC_SITE_ENV=demo
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from stripe listen
```

4. Use [Stripe test cards](https://docs.stripe.com/testing) at Checkout

### Staging mode safety

`isStripeDemoSafe()` enforces:

- When `NEXT_PUBLIC_SITE_ENV=demo`, only `sk_test_*` or `rk_test_*` keys are allowed
- Live keys throw: *"Live Stripe keys cannot be used while NEXT_PUBLIC_SITE_ENV is demo."*

## Live mode (production)

Requirements before enabling:

- All catalog products verified and `productionReady: true`
- Legal policies approved
- Address unit format confirmed
- Webhook endpoint active
- Tax configured if required

```env
NEXT_PUBLIC_SITE_ENV=live
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_TAX_ENABLED=true   # optional; see tax-setup.md
```

## Checkout flow

1. Client submits cart + customer + address to `/api/checkout/create-session`
2. Server validates cart against catalog (`calculateCartTotals` with `revalidateAgainstCatalog: true`)
3. Server evaluates launch/product blockers (`evaluateCheckoutBlockers`)
4. Pending checkout saved (`savePendingCheckout`) with UUID
5. If Stripe configured:
 - `createCheckoutSession()` builds line items from **server-validated prices** (not client prices)
 - Metadata includes `pendingCheckoutId`, `orderReference`, `siteEnv`
 - Optional `Idempotency-Key` header forwarded to Stripe
6. Customer completes payment on Stripe-hosted Checkout
7. Webhook `checkout.session.completed` creates order and sends email

## Webhooks

**Endpoint:** `POST /api/webhooks/stripe`

**Required env:** `STRIPE_WEBHOOK_SECRET`

**Handled events:** `checkout.session.completed` (others acknowledged with `{ received: true }`)

**Verification:** `stripe.webhooks.constructEvent(payload, signature, secret)`

**Idempotency:** If order already exists for `session.id`, returns `{ duplicate: true }` without creating a second order.

### Local webhook testing

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

## Idempotency

- Stripe session creation accepts optional `Idempotency-Key` header on `/api/checkout/create-session`
- Passed to `stripe.checkout.sessions.create(..., { idempotencyKey })`
- Webhook duplicate detection uses `getOrderBySessionId()`

## Demo-complete endpoint - caution

`POST /api/checkout/staging-complete`

| Rule | Detail |
|------|--------|
| Availability | **Staging mode only** - returns 403 in live mode |
| Purpose | Simulate paid order when Stripe is not configured |
| Session ID | Generates `demo_cs_<uuid>` - not a real Stripe session |
| Email | Calls `sendOrderConfirmation()` but email is suppressed in staging |
| Production | **Never expose or rely on this endpoint in production** |

Use only for UI/flow testing without Stripe credentials.

## Price integrity

- Line item amounts come from `product.price` revalidated server-side
- Client cart prices that drift from catalog cause validation errors
- Shipping and tax (when not Stripe Tax) added as separate line items

## Launch blockers (payments)

From `canLaunchProduction()`:

- `STRIPE_SECRET_KEY` missing
- Live keys with staging store mode
- Unverified products in live mode
- Legal/address/contact/email blockers

## Troubleshooting

| Symptom | Check |
|---------|-------|
| 503 Payment not configured | `STRIPE_SECRET_KEY` unset in live mode |
| 500 Unable to start checkout | Stripe API error; verify key and account status |
| Success page shows unverified | `/order/success` must verify session server-side |
| Duplicate orders | Webhook retried - idempotency should prevent; check logs |
| Wrong amounts | Catalog price changed after cart add - revalidate cart |

## Related

- [tax-setup.md](tax-setup.md)
- [order-processing.md](order-processing.md)
- [deployment.md](deployment.md)
