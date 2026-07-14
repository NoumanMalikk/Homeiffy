# Local Setup

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm (bundled with Node)
- Git

Optional for full checkout testing:

- [Stripe](https://dashboard.stripe.com) account (test mode)
- [Resend](https://resend.com) account (not required for staging UI)

## Clone and install

```bash
git clone <repository-url>
cd Dream-Haven
npm install
```

## Environment configuration

```bash
cp .env.example .env.local
```

Edit `.env.local`. Minimum for local UI:

```env
NEXT_PUBLIC_SITE_ENV=demo
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Variable reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_ENV` | Yes | `demo` or `live`. Default: `demo` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Base URL for redirects and metadata |
| `ADDRESS_UNIT_FORMAT_CONFIRMED` | Launch only | `true` after business confirms `4318 HWY 21` formatting. Must align with `legal-config.ts` updates |
| `CONTACT_EMAIL` | Live launch | Order/contact notification recipient. No invented emails |
| `STRIPE_SECRET_KEY` | Checkout | `sk_test_*` for demo; `sk_live_*` for live |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Client-side Stripe if needed |
| `STRIPE_WEBHOOK_SECRET` | Webhook testing | From Stripe CLI or Dashboard |
| `STRIPE_TAX_ENABLED` | Optional | `true` to enable Stripe Tax at checkout |
| `RESEND_API_KEY` | Live launch | Transactional email |
| `RESEND_FROM_EMAIL` | Live launch | Verified sender address |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Future order persistence |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side Supabase access |

Store-level defaults (phone, address, disabled services) live in `src/data/store-config.ts`, not env vars.

## npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `npm run dev` | Start Next.js dev server on port 3000 |
| `build` | `npm run build` | Production build |
| `start` | `npm run start` | Serve production build |
| `lint` | `npm run lint` | Run ESLint |

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Staging checkout without Stripe

When `STRIPE_SECRET_KEY` is unset and `NEXT_PUBLIC_SITE_ENV=demo`:

1. Add products to cart (only `productionReady: true` items can be added in staging after verification)
2. Complete checkout steps
3. Client calls `/api/checkout/create-session` → returns `requiresDemoComplete: true`
4. Client calls `/api/checkout/staging-complete` to simulate paid order

**Do not use `/api/checkout/staging-complete` in live mode** - endpoint returns 403.

## Stripe webhook testing (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Order storage (local)

Orders and pending checkout payloads persist to `.data/` at the project root (JSON files). This directory is created at runtime. For Vercel serverless, persistence falls back to in-memory storage unless Supabase is configured.

## TypeScript paths

Imports use `@/` alias mapped to `src/` (see `tsconfig.json`).

## Common issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Live Stripe key error in staging | `sk_live_*` with `NEXT_PUBLIC_SITE_ENV=demo` | Use test key or switch to live mode |
| No email on contact submit | Staging mode or missing `RESEND_API_KEY` | Expected in demo; configure Resend for live |
| All products show placeholder images | No files in `public/products/[slug]/` | Add verified images per [image-sourcing.md](image-sourcing.md) |
| Live checkout blocked | `productionReady: false` on all products | Complete product verification workflow |
| Launch blocked | `legalConfig.productionLaunchBlocked: true` | Complete [legal-review.md](legal-review.md) |

## Next steps

- [deployment.md](deployment.md) - Vercel production setup
- [product-editing.md](product-editing.md) - Catalog maintenance
- [launch-checklist.md](launch-checklist.md) - Pre-launch QA
