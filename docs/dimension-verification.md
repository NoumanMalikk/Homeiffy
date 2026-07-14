# Dimension Verification

Accurate dimensions are required before live sale. Missing dimensions display as null or "Verification required" - never estimated from photography.

## Fields tracked

### Overall product (`src/data/products.ts`)

| Field | Unit | Notes |
|-------|------|-------|
| `width` | inches | Primary horizontal |
| `height` | inches | Vertical |
| `depth` | inches | Front to back |
| `seatWidth`, `seatHeight`, `seatDepth` | inches | Seating products |
| `armHeight`, `backHeight` | inches | Seating products |
| `clearance` | inches | Floor clearance |

### Package

| Field | Notes |
|-------|-------|
| `packageDimensions.width/height/depth` | Shipping carton |
| `packageWeight` | Verified weight |
| `boxCount` | Number of cartons |

## Verification sources

Acceptable documentation (keep on file):

- Supplier specification sheet
- Manufacturer CAD drawing
- Physical measurement of sample unit
- Verified packing list with carton dimensions

**Not acceptable:** measuring from uncalibrated photos, copying competitor listings, rounding for marketing.

## Title vs dimension consistency

Product titles include key dimensions (e.g. "46-Inch", "44-Inch Round"). Verified `width`/`height`/`depth` must match title claims.

Launch QA item: confirm every product title matches exact dimensions.

## Dimension diagram

When verified:

1. Create `dimensions.webp` in `public/products/[slug]/`
2. Add gallery entry `type: 'dimensions'`
3. Diagram shows only **verified** measurements
4. Accessible alt text listing each dimension

Do not show seat/arm fields on products where values are null.

## Room planning tools

`calculateFootprint()` in `src/lib/products.ts` sums widths and max depth/height. If any dimension is null:

> "Approximate combined bounding footprint. One or more products have unverified dimensions."

Room rhythm builder and room board must not imply architectural accuracy.

## Comparison page

Comparison tables show raw field values. Missing data displays verification sentinels - never invented substitutes.

## Checkout snapshot

Cart items store `dimensionsSnapshot` at add-to-cart time. Server validation rejects checkout if snapshot differs from current catalog (`validateCartItem`).

## Verification workflow

1. Obtain supplier/manufacturer spec
2. Cross-check physical sample if available
3. Update numeric fields in `products.ts`
4. Update `packageDimensions` and `boxCount`
5. Set `specificationVerificationStatus: 'verified'` when full spec package complete (not dimensions alone)
6. Add dimension diagram image
7. Update image credit `exactDimensions`

## Products with partial dimensions

Many initial products have `width` set but `height`/`depth` null. These remain **not production ready**.

Priority: complete height and depth for all products before live launch.

## Expandable products

HMF-DIN-006 (Foldline drop-leaf):

- Document closed width separately in spec when verified
- `extensionMechanism` field must describe verified mechanism
- Images for extended and closed states required

## Sets

HMF-SET-026: dimensions are per component - do not publish a single bounding box without component verification.

## Blocks launch when

- Live mode with unverified specification status
- Title dimension claims without matching verified fields
- Package dimensions unknown for oversized/upholstered shipping quotes (operational risk)

## Related

- [product-editing.md](product-editing.md)
- [measuring-guide](/measuring-guide) (customer-facing)
- [furniture-photography-guide.md](furniture-photography-guide.md)
