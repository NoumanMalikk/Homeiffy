# Shipping Setup

Homeiffy does **not** currently integrate live carrier rate APIs. Shipping at checkout uses **demonstration estimates** or **quote-required** flows, clearly labeled.

## Shipping classes

Defined in `src/data/shipping-classes.ts`:

| ID | Name | Flags |
|----|------|-------|
| `small-furniture-parcel` | Small Furniture Parcel | - |
| `standard-furniture-parcel` | Standard Furniture Parcel | - |
| `multi-box-furniture` | Multi-Box Furniture | - |
| `oversized-furniture` | Oversized Furniture | - |
| `upholstered-furniture` | Upholstered Furniture | `upholsteredHandling: true` |
| `fragile-surface` | Fragile Surface | `fragileHandling: true` |
| `glass-component` | Glass Component | `fragileHandling: true` |
| `freight-review-required` | Freight Review Required | `requiresFreightReview: true` |

Each product assigns `shippingClass` in `src/data/products.ts`. Prefer the catalog field over auto-assignment.

Helper `assignShippingClassFromAttributes()` in `src/lib/shipping.ts` can infer class from dimensions/box count when reviewing new products - production paths use `product.shippingClass`.

## Demonstration rates

`calculateDemoShipping()` in `src/lib/shipping.ts`:

- Returns `isDemonstrationRate: true` always
- Label: **"Demonstration shipping estimate"**
- Base rates by class (USD, illustrative):

| Class | Base |
|-------|------|
| small-furniture-parcel | $29 |
| standard-furniture-parcel | $49 |
| multi-box-furniture | $89 |
| oversized-furniture | $149 |
| upholstered-furniture | $129 |
| fragile-surface | $69 |
| glass-component | $79 |
| freight-review-required | $0 |

Adjustments:

- Region multiplier from destination ZIP prefix
- Extra per additional box (+$18 × multiplier)
- Upholstered handling (+$35 × multiplier)
- Fragile handling (+$22 × multiplier)
- Freight-review items: $0 demonstration amount, note explains manual review

**These are not contracted carrier rates.** UI and checkout must not present them as guaranteed shipping costs.

## Checkout shipping methods

| Method | When used |
|--------|-----------|
| `demo-estimate` | Default when no freight-review items in cart |
| `quote-required` | Forced when any item has `freight-review-required` class |

When `quote-required`:

- Shipping line shows $0 at payment
- Fulfillment status may be `shipping-review-required`
- Final shipping quoted after manual review

## Delivery access fields

Collected when `requiresDeliveryAccessInfo()` returns true:

- Multi-box furniture
- Oversized furniture
- Upholstered handling
- Freight-review items

Fields: building type, floor level, elevator, loading dock, notes.

## Disabled services

The following are **disabled** in `src/data/store-config.ts` and must not be advertised until explicitly enabled:

| Flag | Status |
|------|--------|
| `localPickupEnabled` | `false` |
| `localDeliveryEnabled` | `false` |
| `whiteGloveDeliveryEnabled` | `false` |
| `assemblyServiceEnabled` | `false` |

Do not enable without operational capacity and updated policies.

Also not implemented:

- Room-of-choice delivery
- Threshold delivery as a selectable method
- Packaging removal
- White-glove delivery

## Box count

`boxCount` on each product affects demonstration rate calculation. Unknown box counts default to `1` in shipping math (`normalizeBoxCount`). Verify box count from supplier before marking production ready.

## Production shipping path

To replace demonstration rates:

1. Integrate carrier API or shipping platform (ShipStation, EasyPost, etc.)
2. Replace or supplement `calculateDemoShipping()` with live quotes
3. Update checkout labels - remove "Demonstration" wording
4. Update shipping policy in `legal-config.ts`
5. Test multi-box, upholstered, and oversized carts

Until then, **launch with demonstration labeling** or **quote-required** for freight items only.

## Product editing

When adding products, assign the most conservative applicable class. See [product-editing.md](product-editing.md).

## Related

- [order-processing.md](order-processing.md)
- [product-editing.md](product-editing.md)
