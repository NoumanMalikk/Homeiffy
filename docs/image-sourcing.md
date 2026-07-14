# Image Sourcing

Every catalog image must depict the **exact** product sold - matching SKU, dimensions, finish, upholstery, configuration, and set count.

## Image priority (source order)

Use the first applicable source with documented rights:

1. Original professional photography of actual Homeiffy inventory
2. Verified supplier media licensed for retailer use
3. Official manufacturer media approved for retailer use
4. Authorized distributor media
5. Professionally commissioned photography

## Do not use images from

- Amazon, Walmart, Target, Wayfair, IKEA
- West Elm, Article, Burrow, Crate and Barrel, Pottery Barn, Room and Board
- Competitor stores, Pinterest, social media, design blogs, search thumbnails
- AI-generated furniture presented as Homeiffy product

## Missing-image rule

If no legally usable exact image exists:

1. **Do not** substitute similar products, widths, finishes, or configurations
2. Keep placeholder gallery from `defineProduct()` with `type: 'placeholder'`
3. Set `imageVerificationStatus: 'pending'` or `'missing'`
4. Keep `productionReady: false`
5. Block live purchase
6. Log the product in the pending list below
7. Update `src/data/image-credits.ts` with `productionStatus: 'blocked'`

Placeholder copy: *"Exact product image required"*

## Placeholder policy

- UI shows `ProductImagePlaceholder` component when image is unverified or type is `placeholder`
- Cart shows placeholder unless `imageVerificationStatus === 'verified'`
- Product cards mark images unverified until status is `verified` and type is not `placeholder`

## File storage

Approved images live locally:

```
public/products/[product-slug]/
```

**Do not hotlink** external product images in production.

### Recommended filenames

| Filename pattern | Use |
|------------------|-----|
| `main.webp` | Primary catalog image (default placeholder path) |
| `main-[finish-id].webp` | Finish-specific main |
| `front-[finish].webp` | Front elevation |
| `side-[finish].webp` | Side view |
| `back-[finish].webp` | Back view |
| `open-storage.webp` | Storage open |
| `closed-storage.webp` | Storage closed |
| `extended-state.webp` | Extended configuration |
| `closed-state.webp` | Closed configuration |
| `dimensions.webp` | Dimension diagram |
| `upholstery-closeup.webp` | Fabric detail |
| `wood-finish-closeup.webp` | Finish detail |
| `package-contents.webp` | Box contents |
| `assembly-hardware.webp` | Hardware layout |

Prefer WebP; provide dimensions in HTML for layout stability.

## Image credits file

`src/data/image-credits.ts` - one record per product.

Each record tracks:

- `exactDimensions`, `exactConfiguration`, `exactFinish`, `exactUpholstery`
- `exactSetCount`, `exactPackageContents`
- `sourceOrganization`, `sourceUrl`, `permissionBasis`
- `dateObtained`, `dateVerified`, `verifiedBy`
- `productionStatus`: `'blocked'` until approved
- `notes` - specific shot requirements

Update credits **before** setting `imageVerificationStatus: 'verified'`.

## Gallery configuration

In `products.ts`, replace default `placeholderGallery()` with explicit array:

```ts
imageGallery: [
  {
    src: '/products/my-slug/main.webp',
    alt: 'Exact product description including finish and dimensions',
    type: 'main',
  },
  // additional angles...
],
imageSourceRecord: 'Supplier XYZ - license agreement 2026-01-15',
imageVerificationStatus: 'verified',
```

## Pending images - all 26 products

No verified assets exist under `public/products/` as of catalog initialization. Every product requires photography or licensed supplier media.

| SKU | Slug | Reserved path | Status | Priority notes |
|-----|------|---------------|--------|----------------|
| HMF-ENT-001 | `threshold-upholstered-storage-bench-46-inch` | `/products/threshold-upholstered-storage-bench-46-inch/main.webp` | Pending | 46" width, storage opening, hinge/lift, legs |
| HMF-ENT-002 | `passage-narrow-console-table-40-inch` | `/products/passage-narrow-console-table-40-inch/main.webp` | Pending | 40" width, shallow depth, shelf/drawer layout |
| HMF-ENT-003 | `stepwell-tilt-out-shoe-cabinet-30-inch` | `/products/stepwell-tilt-out-shoe-cabinet-30-inch/main.webp` | Pending | Tilt-out doors, handle, base |
| HMF-ENT-004 | `landing-hall-tree-with-bench-and-upper-shelf` | `/products/landing-hall-tree-with-bench-and-upper-shelf/main.webp` | Pending | Bench, shelf, hooks, lower storage - no mirror unless included |
| HMF-DIN-005 | `arcfield-round-dining-table-44-inch` | `/products/arcfield-round-dining-table-44-inch/main.webp` | Pending | 44" round top, base, edge profile |
| HMF-DIN-006 | `foldline-drop-leaf-dining-table-52-inch-extended` | `/products/foldline-drop-leaf-dining-table-52-inch-extended/main.webp` | Pending | **Closed + extended** states required |
| HMF-DIN-007 | `willow-frame-upholstered-dining-chairs-set-of-2` | `/products/willow-frame-upholstered-dining-chairs-set-of-2/main.webp` | Pending | **Exactly two chairs** in main image |
| HMF-DIN-008 | `gatherline-upholstered-dining-bench-54-inch` | `/products/gatherline-upholstered-dining-bench-54-inch/main.webp` | Pending | 54" upholstered bench, no storage |
| HMF-DIN-009 | `hearthside-sideboard-60-inch` | `/products/hearthside-sideboard-60-inch/main.webp` | Pending | Door/drawer layout, 60" width |
| HMF-DSK-010 | `daybreak-writing-desk-44-inch` | `/products/daybreak-writing-desk-44-inch/main.webp` | Pending | 44" desk, drawer count, legs |
| HMF-DSK-011 | `foldaway-console-desk-with-storage-38-inch` | `/products/foldaway-console-desk-with-storage-38-inch/main.webp` | Pending | Foldaway surface, hinge mechanism |
| HMF-CHR-012 | `quietback-upholstered-desk-chair` | `/products/quietback-upholstered-desk-chair/main.webp` | Pending | Back, arms, casters, upholstery |
| HMF-STO-013 | `chapter-open-bookcase-68-inch-5-shelves` | `/products/chapter-open-bookcase-68-inch-5-shelves/main.webp` | Pending | **Exactly five shelves**, 68" height |
| HMF-LIV-014 | `cove-curved-back-lounge-chair` | `/products/cove-curved-back-lounge-chair/main.webp` | Pending | Curved back, arms, upholstery |
| HMF-LIV-015 | `harborline-compact-loveseat-60-inch` | `/products/harborline-compact-loveseat-60-inch/main.webp` | Pending | 60" two-seat - not full sofa |
| HMF-LIV-016 | `drift-modular-armless-seat` | `/products/drift-modular-armless-seat/main.webp` | Pending | Armless module only - no corner unit |
| HMF-LIV-017 | `evening-upholstered-storage-ottoman-32-inch` | `/products/evening-upholstered-storage-ottoman-32-inch/main.webp` | Pending | Storage opening, hinge, 32" size |
| HMF-TBL-018 | `orbit-nesting-side-tables-set-of-3` | `/products/orbit-nesting-side-tables-set-of-3/main.webp` | Pending | **Three tables**, nesting order, no props |
| HMF-LIV-019 | `mediafold-low-console-64-inch` | `/products/mediafold-low-console-64-inch/main.webp` | Pending | 64" media console, door/shelf layout |
| HMF-BED-020 | `horizon-platform-bed-queen` | `/products/horizon-platform-bed-queen/main.webp` | Pending | Queen frame only - **no mattress** |
| HMF-BED-021 | `stillpoint-two-drawer-nightstand-24-inch` | `/products/stillpoint-two-drawer-nightstand-24-inch/main.webp` | Pending | **Two drawers**, 24" width |
| HMF-BED-022 | `morningline-six-drawer-dresser-58-inch` | `/products/morningline-six-drawer-dresser-58-inch/main.webp` | Pending | **Six drawers**, no mirror |
| HMF-BED-023 | `softstep-upholstered-bed-bench-50-inch` | `/products/softstep-upholstered-bed-bench-50-inch/main.webp` | Pending | 50" upholstered bench |
| HMF-RST-024 | `divide-open-room-shelf-62-inch` | `/products/divide-open-room-shelf-62-inch/main.webp` | Pending | Open-cell layout - not closed bookcase |
| HMF-RST-025 | `shift-mobile-storage-cabinet-34-inch` | `/products/shift-mobile-storage-cabinet-34-inch/main.webp` | Pending | Casters, door/drawer layout |
| HMF-SET-026 | `evening-room-composition-4-piece-furniture-set` | `/products/evening-room-composition-4-piece-furniture-set/main.webp` | **Missing** | Scene: HMF-LIV-014, HMF-LIV-017, HMF-TBL-018, HMF-RST-024 only - no décor |

HMF-SET-026 is explicitly `imageVerificationStatus: 'missing'` in catalog.

## Verification workflow

1. Obtain image with documented rights
2. QA against image credit `notes` field
3. Compress and place in `public/products/[slug]/`
4. Update `imageGallery` and credits record
5. Set `imageVerificationStatus: 'verified'`
6. Re-run purchase readiness checks
7. Remove from pending table above

## Related

- [furniture-photography-guide.md](furniture-photography-guide.md)
- [campaign-image-guide.md](campaign-image-guide.md)
- [product-editing.md](product-editing.md)
