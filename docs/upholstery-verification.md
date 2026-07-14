# Upholstery Verification

Upholstered products require verified fabric, foam, and color documentation before live sale.

## Product fields

| Field | Purpose |
|-------|---------|
| `upholsteryMaterial` | Fabric composition |
| `upholsteryColor` | Default color label or null |
| `foamSpecification` | Cushion/foam spec |
| `colorways` (type `upholstery`) | Selectable swatches |

Brand upholstery colorways include: Moss Linen, Quiet Plum, Cloud Cream, Clay Rose (see `BRAND_COLORWAYS`).

## What not to claim without proof

- Genuine leather / vegan leather
- Performance fabric, stain or spill resistance
- Rub count (Wyzenbeek/Martindale)
- High-density foam, IFD ratings
- Pet-friendly or child-safe upholstery
- Flame resistance / CAL TB-117 compliance

Customer page `/upholstery-care` documents these limits.

## Image requirements

- Main and detail shots must match selected upholstery colorway
- `upholstery-closeup.webp` for texture documentation
- Separate assets per colorway when visual difference is significant
- Image credit `exactUpholstery` must list allowed colorways

## Cart and checkout

Cart stores `selectedUpholsteryId`. Validation ensures ID exists on product colorways with `type: 'upholstery'`.

## Shipping interaction

Products with upholstery colorways or `upholstered-furniture` shipping class receive upholstered handling surcharge in demonstration shipping (`src/lib/shipping.ts`).

## Verification workflow

1. Obtain fabric spec sheet (composition, cleaning code, country of manufacture)
2. Obtain foam specification if applicable
3. Verify physical swatch matches hex/colorway label
4. Photograph each offered upholstery variant
5. Update `upholsteryMaterial`, `foamSpecification`, `careInstructions`
6. Update image credits and gallery
7. Complete safety flammability field in `product-safety.ts` if applicable
8. Include in specification verification sign-off

## Products with upholstery

Entry bench, dining chairs, dining bench, desk chair, lounge chair, loveseat, modular seat, storage ottoman, bed bench, hall tree (bench portion), and composition set components as applicable.

## Blocks live purchase

- `specificationVerificationStatus !== 'verified'`
- Unverified upholstery in main product image
- Missing flammability documentation where required for upholstered items (safety gate)

## Related

- [material-verification.md](material-verification.md)
- [furniture-safety.md](furniture-safety.md)
- [image-sourcing.md](image-sourcing.md)
