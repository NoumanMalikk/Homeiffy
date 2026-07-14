# Deployment (Vercel)

Homeiffy is designed for deployment on [Vercel](https://vercel.com) with Next.js App Router.

## Pre-deployment requirements

**Do not deploy to production sales until:**

- [launch-checklist.md](launch-checklist.md) is complete
- Legal policies replace placeholders in `src/data/legal-config.ts`
- Registered address unit format is confirmed ([address-verification.md](address-verification.md))
- All sellable products are `productionReady: true` with verified images, specs, and safety
- `NEXT_PUBLIC_SITE_ENV=live` is intentional

Deploying the staging configuration to a public URL for stakeholder review is acceptable; label it clearly as demonstration mode.

## Vercel project setup

1. Import the Git repository in Vercel
2. Framework preset: **Next.js**
3. Build command: `npm run build` (default)
4. Output: Next.js default
5. Install command: `npm install`

No custom `vercel.json` is required for standard deployment.

## Environment variables (Vercel)

Set in **Project → Settings → Environment Variables**. Mirror `.env.example`.

### Production (live sales)

| Variable | Environment | Notes |
|----------|-------------|-------|
| `NEXT_PUBLIC_SITE_ENV` | Production | `live` |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://your-domain.com` |
| `ADDRESS_UNIT_FORMAT_CONFIRMED` | Production | `true` only after address confirmed + code updates |
| `CONTACT_EMAIL` | Production | Business-approved inbox |
| `STRIPE_SECRET_KEY` | Production | `sk_live_*` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production | `pk_live_*` if used |
| `STRIPE_WEBHOOK_SECRET` | Production | From live webhook endpoint |
| `STRIPE_TAX_ENABLED` | Production | `true` when Stripe Tax is configured |
| `RESEND_API_KEY` | Production | Live API key |
| `RESEND_FROM_EMAIL` | Production | Verified domain sender |

### Preview / staging

Use **demo** mode and **test** Stripe keys:

```env
NEXT_PUBLIC_SITE_ENV=demo
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # from Stripe CLI or test webhook
```

Never use live Stripe keys on preview deployments.

## Stripe webhook setup (production)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events: at minimum `checkout.session.completed`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET` in Vercel
5. Redeploy after setting the secret

Webhook handler: `src/app/api/webhooks/stripe/route.ts`

- Verifies signature via `verifyStripeWebhookSignature()`
- Creates order from pending checkout metadata (`pendingCheckoutId`)
- Idempotent: duplicate session IDs return `{ duplicate: true }`
- Sends order confirmation email when live email is enabled

## Domain and URLs

Set `NEXT_PUBLIC_SITE_URL` to the canonical production URL. Used for:

- Stripe `success_url` and `cancel_url`
- SEO canonical URLs (`src/lib/seo.ts`)

After domain connection in Vercel, update the env var and redeploy.

## Persistence on Vercel

Default order store writes to `.data/` on the filesystem. On Vercel serverless:

- File writes may not persist across invocations
- In-memory fallback is used when file store fails
- For durable production orders, configure Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) or migrate to a database-backed `order-store`

Treat current storage as **development/staging adequate**, not long-term production fulfillment without external persistence.

## Security headers

Review Next.js config for security headers before launch. Ensure:

- No secrets in `NEXT_PUBLIC_*` variables except publishable Stripe key
- Webhook route is not cached
- Checkout and success routes are not statically cached with user data

## Deployment checklist

- [ ] `npm run build` succeeds locally
- [ ] All env vars set per environment
- [ ] Stripe live webhook tested with CLI or Dashboard "Send test webhook"
- [ ] Test checkout in staging with `sk_test_*`
- [ ] Confirm staging-complete endpoint is not used in live mode
- [ ] `robots.txt` and sitemap appropriate for launch state
- [ ] Legal policies approved (no `[BUSINESS REVIEW REQUIRED]` text)

## Rollback

If a bad deploy reaches production:

1. Revert Git commit in Vercel → Redeploy previous deployment
2. Set `NEXT_PUBLIC_SITE_ENV=demo` immediately if checkout is broken
3. Disable Stripe webhook or rotate `STRIPE_WEBHOOK_SECRET` if compromised

## Related docs

- [payment-setup.md](payment-setup.md)
- [email-setup.md](email-setup.md)
- [order-processing.md](order-processing.md)
