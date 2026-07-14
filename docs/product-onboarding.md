# Product onboarding

Homeiffy LLC publishes exactly **26** catalog products. Do not add a 27th product.

## Workflow

1. Identify an actual furniture product from an approved supplier, manufacturer or authorized distributor.
2. Confirm commercial permission to use the product image and information.
3. Capture exact supplier SKU, manufacturer model, title, dimensions, finish, upholstery, configuration, package contents, package dimensions and box count.
4. Download the exact original studio product image (white / near-white background, full product, front three-quarter preferred).
5. Store images under `public/products/[product-slug]/` using the required filenames in `docs/image-sourcing.md`.
6. Update `src/data/products.ts` with verified fields only — never guess.
7. Add or update `src/data/image-credits.ts` and `src/data/product-safety.ts`.
8. Keep `productionReady: false` and `purchaseEnabled: false` until image, specification and safety verification are complete.
9. Only then set verification statuses to `verified` and enable purchase.

## Required assortment slots

Living (9), bedroom (6), dining (5), entryway/storage (5), home office (1). See the project brief or `src/data/products.ts` for slot coverage.

## Unknown fields

Use only:

- `"Verification required"`
- `"Pending supplier documentation"`
- `"Pending physical product inspection"`
- `null`

## Production gate

`src/lib/launch-gates.ts` and `isProductPurchaseable()` block live purchase until the full verification set is complete.
