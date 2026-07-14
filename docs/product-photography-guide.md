# Furniture Photography Guide

Operational guide for capturing or commissioning product images that meet Homeiffy catalog standards.

## Core principle

Photograph the **exact unit** being sold - same supplier SKU, dimensions, finish, upholstery, and configuration.

## Pre-shoot checklist

- [ ] Product record and SKU confirmed
- [ ] Image credit record created in `src/data/image-credits.ts`
- [ ] Shot list from credit `notes` field
- [ ] Finish/upholstery variant labels on set
- [ ] Clean unit - no damage, correct hardware, correct drawer count

## Background

- Pure white, near-white, or warm cream (`#F6F1E9` Cloud Cream range)
- Consistent across catalog for card grid uniformity
- No gradient clutter

Product cards use `aspect-ratio: 1/1`, `object-fit: contain`.

## Required angles (when applicable)

| Shot | Gallery type |
|------|--------------|
| Full product, primary angle | `main` or `front` |
| Side elevation | `side` |
| Back | `back` |
| Storage open | `open-storage` |
| Storage closed | `closed-storage` |
| Extension open | `extended` |
| Extension closed | `closed` |
| Drawer/shelf detail | `detail` |
| Base/legs/casters | `detail` |
| Upholstery texture | `detail` (upholstery-closeup) |
| Wood/finish texture | `detail` (wood-finish-closeup) |
| Dimension overlay | `dimensions` |
| Box contents layout | `package-contents` |
| Hardware layout | `assembly-hardware` |

## Finish variants

- Shoot separate mains when finish changes appearance: `main-pale-oak.webp`, etc.
- Link via `finishId` on gallery entries when multiple finishes share PDP

## Upholstery variants

- Shoot each offered upholstery colorway or document acceptable color correction limits in credits (prefer separate shoots)

## Set products

- **HMF-DIN-007:** exactly two chairs, matching
- **HMF-TBL-018:** three tables, nested and separate size reference
- **HMF-SET-026:** only the four component products - **no styling props**

## Expandable products

- **HMF-DIN-006:** closed and extended states, same finish, measurable reference in frame optional but dimensions must come from spec not photo measurement

## Prohibited in frame

- Watermarks, retailer logos, competitor branding
- Text overlays, fake certification badges
- Unrelated furniture implied as included
- Excessive plants, table settings, people (unless licensed lifestyle shoot)
- AI-generated product bodies

## Technical standards

- Minimum 2000px on long edge for main images
- Export WebP (keep master TIFF/PNG archived)
- Compress for web without visible artifacting on fabric grain
- Embed accurate width/height in Next.js `Image` usage
- Descriptive alt text: product title + finish + key dimension + view

## Perspective

- Minimal distortion; straight-on elevations for dimension-critical views
- Avoid wide-angle exaggeration of depth

## Lifestyle photography

Only when:

- Rights documented
- Every sellable item is an active SKU with matching variant
- Caption distinguishes props
- Not labeled as showroom or customer home

See [campaign-image-guide.md](campaign-image-guide.md).

## Post-production

- Color-correct against physical swatch
- Do not change drawer count, shelf count, or silhouette in retouching
- Document retoucher and date in image credit

## File naming and placement

```
public/products/[slug]/main.webp
public/products/[slug]/extended-state.webp
...
```

Update `products.ts` gallery and set `imageVerificationStatus: 'verified'`.

## Related

- [image-sourcing.md](image-sourcing.md)
- [dimension-verification.md](dimension-verification.md)
- [campaign-image-guide.md](campaign-image-guide.md)
