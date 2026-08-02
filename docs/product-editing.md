# Product Editing

Catalog data is maintained in TypeScript files - there is no admin UI. All changes require code edit, review, and deploy.

## Primary files

| File | Purpose |
|------|---------|
| `src/data/products.ts` | Product catalog (26 products) |
| `src/data/supplier-spec-sheet.ts` | Supplier-confirmed specs (load rating, origin, manufacturer) |
| `src/data/product-safety.ts` | Per-product safety fields |
| `src/data/shipping-classes.ts` | Shipping class definitions |
| `src/data/room-compatibility.ts` | Room builder compatibility groups |
| `src/data/daily-moments.ts` | Moment slugs and copy |
| `src/data/rooms.ts` | Room taxonomy |
| `src/lib/types.ts` | Product type definitions |

## Adding a new product

**Current catalog is fixed at 26 products.** The build throws if count ≠ 26:

```ts
if (productsList.length !== 26) {
  throw new Error(`Expected exactly 26 products, found ${productsList.length}`);
}
```

To add a product, edit `scripts/generate-catalog.py`, regenerate the catalog and safety records, and add the SKU to `supplier-spec-sheet.ts`. Update the count in `src/__tests__/product-count.test.ts`.

### Use `defineProduct()`

New entries should use the `defineProduct()` helper, which automatically sets:

- `currency: 'USD'`
- `imageGallery`: placeholder pointing to `/products/[slug]/main.webp`
- `imageSourceRecord: 'Pending supplier documentation'`
- `imageVerificationStatus: 'pending'`
- `specificationVerificationStatus: 'pending'`
- `safetyVerificationStatus: 'pending'`
- `productionReady: false`

### Required fields

See `Product` interface in `src/lib/types.ts`. Minimum for a new entry:

- `id`, `slug`, `sku`, `supplierSku`, `title`
- `category`, `subcategory`
- `dailyMoments[]`, `rooms[]`
- `colorways[]` (from `BRAND_COLORWAYS` or new colorway objects)
- Dimensions: `width`, `height`, `depth` (use `null` if unknown - do not guess)
- `shippingClass`, `price`
- `relatedProductIds`, `crossSellProductIds`, `comparisonFields`, `roomCompatibilityIds`, `searchKeywords`
- `seoTitle`, `seoDescription`

Use sentinel strings for unknowns:

- `'Verification required'`
- `'Pending manufacturing specification'`
- `'Pending supplier documentation'`
- `'Pending physical product inspection'`

## SKU conventions

Format: `HMF-{CATEGORY}-{NNN}`

Examples: `HMF-ENT-001`, `HMF-DIN-007`, `HMF-SET-026`

- `supplierSku`: supplier/manufacturer reference when verified; otherwise sentinel
- SKU must match across `products.ts`, `product-safety.ts`, `supplier-spec-sheet.ts`, and cart validation

## Dimensions

Product dimensions (inches unless noted):

| Field | Use |
|-------|-----|
| `width`, `height`, `depth` | Overall product |
| `seatWidth`, `seatHeight`, `seatDepth` | Seating |
| `armHeight`, `backHeight` | Seating/back |
| `clearance` | Floor clearance |
| `packageDimensions` | `{ width, height, depth, unit: 'in', note? }` |

Use `null` for unknown - never estimate from photos.

Dimension diagram image: add to gallery with `type: 'dimensions'` when verified. See [dimension-verification.md](dimension-verification.md).

## Finishes and upholstery

Colorways are typed:

```ts
{ id, label, type: 'finish' | 'upholstery', hex }
```

Shared palette: `BRAND_COLORWAYS` in `products.ts`.

- **Finish** colorways: wood tone, frame, painted surface
- **Upholstery** colorways: fabric selections

Product purchase panel reads selected finish/upholstery IDs from cart item. Invalid selections fail `validateCartItem()`.

## Expandable states

Products with extension (e.g. HMF-DIN-006 drop-leaf):

- Set `extensionMechanism` when verified
- Gallery must include `type: 'extended'` and `type: 'closed'` images when applicable
- Do not claim mechanism type without supplier documentation

## Storage configuration

| Field | Purpose |
|-------|---------|
| `storageType` | Description of storage |
| `drawerCount`, `shelfCount`, `doorCount` | Counts (null if N/A) |
| Gallery `open-storage`, `closed-storage` | Verified mechanism views |

## Box count

`boxCount`: number when verified, otherwise `'Verification required'`.

Affects:

- Demonstration shipping calculation
- Cart validation snapshot
- Order line items

## Shipping class

Assign one of eight IDs from `src/data/shipping-classes.ts`. See [shipping-setup.md](shipping-setup.md).

When in doubt, choose the class requiring more handling (e.g. upholstered over standard parcel).

## Images

1. Place files under `public/products/[slug]/`
2. Update `imageGallery` array - replace placeholder from `defineProduct()`
3. Run `python3 scripts/make-detail-images.py` to regenerate the detail view
4. Set `imageVerificationStatus: 'verified'` only after QA

Image types: `main`, `front`, `side`, `back`, `detail`, `open-storage`, `closed-storage`, `extended`, `closed`, `dimensions`, `lifestyle`, `placeholder`

See [image-sourcing.md](image-sourcing.md) and [furniture-photography-guide.md](furniture-photography-guide.md).

## Assembly verification

Before `productionReady: true` when `assemblyRequired === true`:

- `assemblyInstructions` must be verified (not null/PSD)
- `hardwareIncluded`, `toolsRequired` documented
- Live checkout blocks if assembly required but instructions not published (`evaluateCheckoutBlockers`)

See [assembly-readiness.md](assembly-readiness.md).

## Safety verification

Update `src/data/product-safety.ts` for the product ID. Set `verificationStatus: 'verified'` when complete.

Product-level `safetyVerificationStatus: 'verified'` must align.

See [furniture-safety.md](furniture-safety.md).

## Marking production ready

Set on the product object (override `defineProduct` default):

```ts
productionReady: true,
imageVerificationStatus: 'verified',
specificationVerificationStatus: 'verified',
safetyVerificationStatus: 'verified',
```

**Only after:**

- Exact images in place
- Dimensions, materials, weight, package data verified
- Safety record complete
- Assembly docs if required
- Price confirmed for live (currently `price` field used at checkout)
- Image credit record updated with `productionStatus: 'approved'`

`isProductPurchaseable()` enforces all verification flags.

## Daily moments

Valid slugs: `arrive`, `gather`, `focus`, `unwind`, `restore`, `reset`

Assign `dailyMoments: [...]` per product. Used in navigation, filters, and moment pages.

## Rooms

String room IDs on product (e.g. `entryway`, `bedroom`, `living-room`). Must align with `src/data/rooms.ts` slugs for filters.

## Room compatibility

`roomCompatibilityIds` references groups in `src/data/room-compatibility.ts`.

Room rhythm builder filters products by group **role** matching slot type (anchor, seating, storage, table, flexible-accent).

When adding products, assign to appropriate groups or create new groups with explicit `compatibleGroupIds`.

See [room-builder-guide.md](room-builder-guide.md).

## Blocking incomplete products

| Layer | Behavior |
|-------|----------|
| `isProductPurchaseable()` | Returns false until all verification flags true |
| Cart (live) | Cannot add non-purchaseable products |
| `evaluateCheckoutBlockers()` | Blockers in live; warnings in staging |
| `canLaunchProduction()` | Any `productionReady: false` blocks live launch |
| SEO | Offer schema only for verified production-ready products |

## Furniture set (HMF-SET-026)

Composition set links component SKUs. Do not imply bundle discount. `packageContents` must list exact components. Set pricing only after all components verified.

## Deploy workflow

1. Edit data files
2. Run `npm run build`
3. Verify product count guard passes
4. Test product page, cart, checkout validation
5. Deploy via Vercel

## Related

- [dimension-verification.md](dimension-verification.md)
- [material-verification.md](material-verification.md)
- [upholstery-verification.md](upholstery-verification.md)
- [launch-checklist.md](launch-checklist.md)
