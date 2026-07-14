# Launch Checklist

Pre-production QA aligned with the 105-item final quality assurance brief. Check each item before setting `NEXT_PUBLIC_SITE_ENV=live` and `productionLaunchBlocked: false`.

**Legend:** `[CODE]` = verifiable in repository; `[OPS]` = business/operations; `[TEST]` = manual or automated test

---

## Catalog integrity (1-21)

| # | Item | Status |
|---|------|--------|
| 1 | `[CODE]` Repository inspected; generic starter content removed | ☐ |
| 2 | `[CODE]` Exactly **26 products** in `src/data/products.ts` (`PRODUCT_COUNT`) | ☐ |
| 3 | `[CODE]` Catalog includes entryway furniture | ☐ |
| 4 | `[CODE]` Catalog includes dining furniture | ☐ |
| 5 | `[CODE]` Catalog includes workspace furniture | ☐ |
| 6 | `[CODE]` Catalog includes lounge furniture | ☐ |
| 7 | `[CODE]` Catalog includes bedroom furniture | ☐ |
| 8 | `[CODE]` Catalog includes flexible reset furniture | ☐ |
| 9 | `[CODE]` Catalog includes modular seating (HMF-LIV-016) | ☐ |
| 10 | `[CODE]` Catalog includes expandable furniture (HMF-DIN-006) | ☐ |
| 11 | `[CODE]` Catalog includes storage furniture across categories | ☐ |
| 12 | `[CODE]` Catalog includes furniture composition set (HMF-SET-026) | ☐ |
| 13 | `[OPS]` Catalog is original - not copied generic assortment | ☐ |
| 14 | `[CODE]` Every product maps to correct daily moment(s) | ☐ |
| 15 | `[CODE]` No owner name invented (`ownerName: null`) | ☐ |
| 16 | `[CODE]` No product `productionReady: true` without verified data | ☐ |
| 17 | `[OPS]` Every product title matches verified dimensions | ☐ |
| 18 | `[OPS]` Drawer counts match verified images/specs | ☐ |
| 19 | `[OPS]` Shelf counts match verified images/specs | ☐ |
| 20 | `[OPS]` Expandable products have verified state documentation + images | ☐ |
| 21 | `[OPS]` Upholstery options match exact product variants | ☐ |

## Images and truthfulness (22-40)

| # | Item | Status |
|---|------|--------|
| 22 | `[OPS]` Furniture set HMF-SET-026 lists exact component pieces | ☐ |
| 23 | `[OPS]` Every image matches exact product (see image-credits.ts) | ☐ |
| 24 | `[CODE]` No fake showroom claims (`isPublicShowroom: false`) | ☐ |
| 25 | `[CODE]` No fake manufacturing/factory claims on site | ☐ |
| 26 | `[OPS]` No made-in-USA claims without verification | ☐ |
| 27 | `[CODE]` No sleep-improvement marketing copy | ☐ |
| 28 | `[CODE]` No unverified comfort/productivity claims | ☐ |
| 29 | `[CODE]` No commercial-grade claims without verification | ☐ |
| 30 | `[CODE]` No fake weight capacities (VR/pending in data) | ☐ |
| 31 | `[OPS]` No AI-generated branded furniture in catalog | ☐ |
| 32 | `[CODE]` Missing images use placeholder + pending/missing status | ☐ |
| 33 | `[TEST]` Incomplete products blocked from **live** checkout | ☐ |
| 34 | `[TEST]` Product cards equal height / consistent layout | ☐ |
| 35 | `[TEST]` Image boxes use 1:1 aspect ratio | ☐ |
| 36 | `[TEST]` Long titles do not break card height (line clamp) | ☐ |
| 37 | `[TEST]` Predictive search works | ☐ |
| 38 | `[TEST]` Daily moment navigation works (6 moments) | ☐ |
| 39 | `[TEST]` Room/collection navigation works | ☐ |
| 40 | `[TEST]` Product category filters work | ☐ |

## Filters, tools, cart (41-59)

| # | Item | Status |
|---|------|--------|
| 41 | `[TEST]` Dimension filters work | ☐ |
| 42 | `[TEST]` Finish filters work | ☐ |
| 43 | `[TEST]` Upholstery filters work | ☐ |
| 44 | `[TEST]` Expandable product filters work | ☐ |
| 45 | `[TEST]` Sorting options work (no fake "best selling") | ☐ |
| 46 | `[TEST]` Product comparison (up to 4) works | ☐ |
| 47 | `[TEST]` Room rhythm builder works | ☐ |
| 48 | `[TEST]` Room board works | ☐ |
| 49 | `[TEST]` Wishlist persistence works | ☐ |
| 50 | `[TEST]` Cart drawer and cart page work | ☐ |
| 51 | `[TEST]` Quote request form submits / validates | ☐ |
| 52 | `[TEST]` Checkout flow completable (demo or test Stripe) | ☐ |
| 53 | `[TEST]` Multi-box shipping calculation (demo rates) | ☐ |
| 54 | `[TEST]` Oversized shipping handling | ☐ |
| 55 | `[TEST]` Upholstered furniture shipping handling | ☐ |
| 56 | `[TEST]` Delivery-access fields when required | ☐ |
| 57 | `[TEST]` Assembly blocking in live mode when instructions missing | ☐ |
| 58 | `[TEST]` Safety blocking in live mode when verification pending | ☐ |
| 59 | `[TEST]` Billing same-as-shipping and separate billing | ☐ |

## Payments, orders, forms (60-76)

| # | Item | Status |
|---|------|--------|
| 60 | `[TEST]` Tax display (demo estimate or Stripe Tax) | ☐ |
| 61 | `[TEST]` Stripe test mode checkout | ☐ |
| 62 | `[TEST]` Webhook signature verification | ☐ |
| 63 | `[TEST]` Idempotent order creation on webhook retry | ☐ |
| 64 | `[TEST]` Order success page verifies session server-side | ☐ |
| 65 | `[TEST]` Confirmation email trigger (live + Resend) | ☐ |
| 66 | `[TEST]` Order tracking by reference + email | ☐ |
| 67 | `[TEST]` Contact form validation and rate limit | ☐ |
| 68 | `[TEST]` Legal/policy pages render (approved content) | ☐ |
| 69 | `[TEST]` Mobile navigation drawer | ☐ |
| 70 | `[TEST]` Responsive layouts key breakpoints | ☐ |
| 71 | `[TEST]` Keyboard navigation critical paths | ☐ |
| 72 | `[TEST]` Reduced motion (`prefers-reduced-motion`) | ☐ |
| 73 | `[TEST]` Empty states (cart, wishlist, search) | ☐ |
| 74 | `[TEST]` Error states (checkout, forms) | ☐ |
| 75 | `[TEST]` 404 page | ☐ |
| 76 | `[TEST]` No `/admin` route exists | ☐ |

## Trust and marketing claims (77-93)

| # | Item | Status |
|---|------|--------|
| 77 | `[CODE]` No fake testimonials | ☐ |
| 78 | `[CODE]` No fake reviews or star ratings | ☐ |
| 79 | `[CODE]` No fake discounts or compare-at prices | ☐ |
| 80 | `[CODE]` No unverified warranty claims | ☐ |
| 81 | `[CODE]` No invented email (`CONTACT_EMAIL` only) | ☐ |
| 82 | `[CODE]` No store hours displayed | ☐ |
| 83 | `[CODE]` Registered address not presented as showroom | ☐ |
| 84 | `[OPS]` Trailing address "2" not mislabeled Apt/Unit/Suite/Floor | ☐ |
| 85 | `[CODE]` Launch blocked until address format confirmed | ☐ |
| 86 | `[CODE]` `localPickupEnabled: false` | ☐ |
| 87 | `[CODE]` `localDeliveryEnabled: false` | ☐ |
| 88 | `[CODE]` `whiteGloveDeliveryEnabled: false` | ☐ |
| 89 | `[CODE]` `assemblyServiceEnabled: false` | ☐ |
| 90 | `[CODE]` `designServiceEnabled: false` | ☐ |
| 91 | `[CODE]` `customFurnitureEnabled: false` | ☐ |
| 92 | `[TEST]` End-to-end checkout with verified product + live credentials | ☐ |
| 93 | `[OPS]` All documentation complete (this suite) | ☐ |

## Build and engineering (81-86 brief overlap)

| # | Item | Status |
|---|------|--------|
| 94 | `[TEST]` `npm run lint` passes | ☐ |
| 95 | `[TEST]` TypeScript build (`npm run build`) passes | ☐ |
| 96 | `[TEST]` Unit tests pass (when present) | ☐ |
| 97 | `[TEST]` Playwright tests pass (when present) | ☐ |

## Production configuration (97-105)

| # | Item | Status |
|---|------|--------|
| 98 | `[OPS]` Legal placeholders replaced - `productionLaunchBlocked: false` | ☐ |
| 99 | `[OPS]` `ADDRESS_UNIT_FORMAT_CONFIRMED=true` + legal-config updated | ☐ |
| 100 | `[OPS]` All 26 products `productionReady: true` with verified flags | ☐ |
| 101 | `[OPS]` Verified images in `public/products/[slug]/` | ☐ |
| 102 | `[OPS]` `CONTACT_EMAIL` and Resend configured | ☐ |
| 103 | `[OPS]` Stripe live keys + webhook on production URL | ☐ |
| 104 | `[OPS]` `STRIPE_TAX_ENABLED` per tax advisor guidance | ☐ |
| 105 | `[OPS]` `canLaunchProduction()` returns `{ allowed: true, blockers: [] }` | ☐ |

---

## Automated launch gate check

Run before go-live:

```bash
# Inspect launch-gates logic - add temporary script or test calling canLaunchProduction()
npm run build
```

Programmatic blockers from `src/lib/launch-gates.ts`:

- `productionLaunchBlocked`
- Address unit format not confirmed
- Legal placeholders present
- Any product not `productionReady` in live mode
- Stripe not configured or live keys in staging mode
- `CONTACT_EMAIL` missing
- `RESEND_API_KEY` missing
- Items in `legalConfig.launchBlockers`

---

## Post-launch monitoring (first 72 hours)

- [ ] Stripe Dashboard webhooks delivering 200
- [ ] Test order fulfillment path
- [ ] Contact and quote emails arriving at `CONTACT_EMAIL`
- [ ] No demonstration shipping labels visible without "Demonstration" wording
- [ ] Error monitoring for checkout API 4xx/5xx

---

## Related documentation

- [README.md](../README.md)
- [legal-review.md](legal-review.md)
- [address-verification.md](address-verification.md)
- [deployment.md](deployment.md)
- [image-sourcing.md](image-sourcing.md)
