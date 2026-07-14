# Homeiffy LLC

Customer-facing furniture storefront for **Homeiffy LLC**, a Burkville, Alabama-based furniture retailer.

**Brand line:** Furniture that earns its space.  
**Supporting line:** Clear dimensions. Exact products. Better room decisions.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS
- Zustand (cart, wishlist, compare, room builder)
- Stripe Checkout + webhooks
- Resend (transactional email)
- Vitest + Playwright

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default environment is **staging** (`NEXT_PUBLIC_SITE_ENV=staging`): Stripe test mode, noindex, functional checkout testing, fulfilment blocked.

## Catalog

Exactly **26** catalog products across living, bedroom, dining, entryway, storage and home office.

Purchase enablement requires:

- `productionReady: true`
- verified primary product images
- verified specifications
- verified safety documentation

Until supplier media and specifications are approved, products remain non-purchasable in production.

See `docs/product-onboarding.md` and `docs/image-verification.md`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit tests |
| `npm run test:e2e` | Playwright e2e |

## Documentation

Full operations docs live in `/docs`:

- Setup, deployment, launch checklist
- Product onboarding / editing
- Image sourcing and verification
- Payment, shipping, tax, email
- Room builder, furniture safety, legal review

## Business defaults

- Legal name: Homeiffy LLC
- Phone: (202) 938-3566
- Public location label: Burkville, Alabama
- Full registered address visibility: configurable in `src/data/store-config.ts` (`showFullBusinessAddress`)
- No public showroom, pickup, local delivery, white-glove, or assembly services enabled
- Contact email: `CONTACT_EMAIL` env only (never invent an email)

## Production launch

Production (`NEXT_PUBLIC_SITE_ENV=production`) is blocked until legal policies are approved, products are verified, Stripe live credentials are configured, and `CONTACT_EMAIL` / Resend are set. See `docs/launch-checklist.md` and `src/lib/launch-gates.ts`.
