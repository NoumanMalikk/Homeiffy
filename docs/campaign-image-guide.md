# Campaign Image Guide

Rules for advertising, paid social, email hero images, and off-site creative. All catalog image rules in [image-sourcing.md](image-sourcing.md) apply, plus the requirements below.

## Mandatory match criteria

Every advertising image must show:

- The **exact product** (active SKU)
- **Exact dimensions** (width, height, depth as listed)
- **Exact finish** for the variant being promoted
- **Exact upholstery** for the variant being promoted
- **Exact configuration** (drawer count, shelf count, extension state, set count)
- **Exact package contents** when implying what is included

## Prohibited creative

Do **not** use campaign imagery that:

- Shows fake or AI-generated Homeiffy-branded furniture
- Substitutes a different width, finish, or upholstery
- Shows a full sofa when promoting a 60" loveseat (HMF-LIV-015)
- Shows one chair when promoting a set of two (HMF-DIN-007) or three tables (HMF-TBL-018)
- Includes rugs, lamps, plants, artwork, or extra furniture implied as included unless listed in `packageContents`
- Depicts a fake showroom, warehouse, factory, or design studio
- Presents **4318 HWY 21** or any business address as a walk-in location
- Implies white-glove delivery, free shipping, same-day delivery, or installation (all disabled/unverified)

## Prohibited claims in ad copy paired with images

Unless verified with documentation:

- Sleep improvement, comfort guarantees, all-day seating
- Stain resistance, pet-friendly, child-safe
- Commercial/contract grade, ergonomic certification
- Solid wood, genuine leather, performance fabric
- Fake discounts, countdown timers, artificial scarcity
- Best seller, customer favorite, star ratings
- Made in USA, sustainability certifications

## Lifestyle and room scenes

Allowed only when:

- Usage rights are documented in `image-credits.ts`
- Every purchasable item maps to an active SKU with matching finish/upholstery
- Caption or overlay distinguishes included vs staging props
- Scene is not labeled a "Homeiffy showroom" or real customer home
- Scene does not imply interior design services (`designServiceEnabled: false`)

## Set and composition advertising

**HMF-SET-026 (Evening Room Composition):**

- Show only: Cove Lounge Chair, Evening Storage Ottoman, Orbit Nesting Tables (×3), Divide Open Room Shelf
- No bundle discount language - component prices must be available individually
- Do not add décor props

**Expandable products (e.g. HMF-DIN-006):**

- If ad shows extended state, also provide closed state asset or clear copy that both states are the same SKU
- Do not claim mechanism type without verification

## Finish and upholstery variants

- Run separate creative per finish/upholstery when variants differ visually
- Swatch colors in ads must match `BRAND_COLORWAYS` hex values closely; screen variance disclaimer in landing page footers

## Dimension callouts in ads

- Only publish numeric dimensions that exist in verified product records
- Use "Verification required" products in **no** paid campaigns
- Link to product PDP for full specification - do not oversimplify in ad overlays

## Address and location

Public copy: **"Burkville, Alabama-based furniture retailer"**

Do not:

- Show maps pins at registered address implying walk-in access
- List store hours
- Use "visit us" language for 4318 HWY 21

See [address-verification.md](address-verification.md).

## Pre-flight checklist (per asset)

- [ ] SKU documented in image credit record
- [ ] Source and permission on file
- [ ] QA against `imageCreditsByProductId[sku].notes`
- [ ] No unverified product in live campaign
- [ ] Legal reviewed superlative or delivery claims
- [ ] Landing URL product matches creative variant (finish/upholstery query params if used)

## Related

- [image-sourcing.md](image-sourcing.md)
- [furniture-photography-guide.md](furniture-photography-guide.md)
- [legal-review.md](legal-review.md)
