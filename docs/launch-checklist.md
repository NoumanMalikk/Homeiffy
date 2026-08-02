# Launch Checklist

Status of the Homeiffy storefront and the steps left before it takes real orders.

**Legend:** `[DONE]` complete in the repository, `[YOU]` needs an action from
Homeiffy LLC, `[OPTIONAL]` improves the site but does not block launch.

---

## 1. Blocking: environment credentials

None of these can live in the repository. Set them in Vercel Project Settings
(or your host's equivalent) before pointing DNS at the site. See `.env.example`.

| # | Variable | Why it blocks launch | Status |
|---|----------|----------------------|--------|
| 1 | `NEXT_PUBLIC_SITE_URL` | Canonical links, sitemap and Stripe redirect URLs all point at the wrong host without it | `[YOU]` |
| 2 | `STRIPE_SECRET_KEY` | No payment can be taken | `[YOU]` |
| 3 | `STRIPE_WEBHOOK_SECRET` | Payments succeed but orders are never confirmed as paid | `[YOU]` |
| 4 | `RESEND_API_KEY` and `RESEND_FROM_EMAIL` | Customers receive no order confirmation | `[YOU]` |
| 5 | `CONTACT_EMAIL` | Contact form, quotes and order alerts go nowhere. This address is also published across all five policy pages and the FAQ | `[YOU]` |

Verify the whole set at once by running the readiness check in
`src/lib/launch-gates.ts` against the deployed environment. It returns a plain
list of anything still missing.

## 2. Blocking: confirm the support email exists

Every policy page, the FAQ and the footer publish `CONTACT_EMAIL`, falling back
to `support@homeiffy.com`. Confirm that mailbox exists and is monitored, or set
`CONTACT_EMAIL` to the address you actually use. A published address that
bounces is worse than none.

| Item | Status |
|------|--------|
| Support mailbox exists and is monitored | `[YOU]` |
| Stripe webhook endpoint created at `/api/webhooks/stripe` | `[YOU]` |
| Resend sender domain verified | `[YOU]` |

## 3. Blocking before you sell tall storage: supplier specifications

Four fields per SKU are deliberately blank because only your supplier can
confirm them. Fill them in `src/data/supplier-spec-sheet.ts`. The storefront
hides a blank field, so the site ships fine without them, but you should not
sell a dresser or bookcase long-term without a documented load rating.

| Field | Why it matters |
|-------|----------------|
| `weightCapacity` | Publishing a rating that is too high is a physical injury risk and a liability exposure |
| `countryOfOrigin` | Customs, and an FTC-regulated claim |
| `manufacturer` | Warranty claims and any CPSC recall notice |
| `flammability` | Upholstered goods, for example California TB 117-2013 |

Fill a value in and it appears on the product page automatically. No code change
is needed.

## 4. Product photography

29 of 46 products have studio photography. The remaining 17 render a branded
"Studio photography in progress" tile rather than a broken image.

```bash
# list what is still missing
python3 scripts/add-product-photo.py --list

# install a photo (converts, crops square, generates the detail view)
python3 scripts/add-product-photo.py <product-slug> path/to/photo.jpg
```

After adding photos, regenerate the catalog so the galleries pick them up:

```bash
python3 scripts/generate-catalog.py src/data/products.ts
```

| Item | Status |
|------|--------|
| 29 products with full studio photography | `[DONE]` |
| Second gallery view (detail shot) generated for every photographed product | `[DONE]` |
| 17 products awaiting photography | `[YOU]` |

## 5. Complete in the repository

| Area | Status |
|------|--------|
| 46 products with full dimensions, selling copy and specifications | `[DONE]` |
| Privacy Policy, Terms, Shipping, Returns, Accessibility written in full | `[DONE]` |
| Safe-use and anchoring guidance published per SKU | `[DONE]` |
| CPSC tip-over warning on every tall storage product | `[DONE]` |
| Shipping rate card matches the published Shipping Policy | `[DONE]` |
| Product JSON-LD with dimensions, material, price and availability | `[DONE]` |
| Sitemap covers all 46 products and all policy pages | `[DONE]` |
| Search engine indexing enabled | `[DONE]` |
| No placeholder or internal QA language anywhere customer-facing | `[DONE]` |
| Room builder compatibility groups resolve correctly | `[DONE]` |
| Typecheck, lint and 57 unit tests passing | `[DONE]` |

## 6. Recommended before or shortly after launch

| Item | Status |
|------|--------|
| Legal review of the five policy documents by counsel | `[OPTIONAL]` |
| Supabase configured so orders survive a serverless redeploy | `[OPTIONAL]` |
| `STRIPE_TAX_ENABLED=true` once nexus and tax registration are set up | `[OPTIONAL]` |
| Test the full checkout with a Stripe test card end to end | `[OPTIONAL]` |
| Submit the sitemap in Google Search Console | `[OPTIONAL]` |

## 7. Regenerating catalog data

The catalog and safety records are generated, so edit the generator rather than
the output file:

```bash
python3 scripts/generate-catalog.py src/data/products.ts
python3 scripts/generate-safety-records.py src/data/product-safety.ts
python3 scripts/make-detail-images.py
```

`src/__tests__/taxonomy.test.ts` fails the build if any category, room, moment,
shipping class, related product or compatibility group reference stops
resolving, so run `npm test` after any catalog change.
