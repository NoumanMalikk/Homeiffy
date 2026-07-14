# Material Verification

Material and construction fields must reflect supplier documentation - not marketing assumptions.

## Product fields

| Field | Content |
|-------|---------|
| `materials` | Primary materials summary |
| `woodSpecies` | Species when verified |
| `woodConstruction` | Solid, veneer, engineered - only when documented |
| `frameMaterial` | Frame composition |
| `surfaceFinish` | Finish system (e.g. painted, stained) |
| `careInstructions` | Manufacturer care |
| `countryOfOrigin` | When verified |
| `manufacturer` | When verified |

Sentinel values until verified:

- `Verification required`
- `Pending manufacturing specification`
- `Pending supplier documentation`

## What not to claim without proof

Do not publish until supplier/manufacturer confirms:

- Solid wood / hardwood
- FSC or other sustainability certification
- Veneer vs solid distinction (if unknown, leave PMS/VR)
- Powder-coated steel, specific alloy
- Scratch, water, or heat resistance
- Recycled content percentages

Customer-facing page `/materials-finishes` repeats these restrictions.

## Finish colorways

Finish-type colorways in `BRAND_COLORWAYS` (e.g. Pale Oak, Night Ink) are **display names** for the catalog - not claims of material composition until `surfaceFinish` and related fields are verified.

## Verification workflow

1. Request bill of materials or spec sheet from supplier
2. Map fields to product record in `products.ts`
3. Align finish swatches on PDP with verified finish names
4. Update care instructions from manufacturer only
5. Include material closeup in image gallery (`wood-finish-closeup.webp`) when photographed
6. Set `specificationVerificationStatus: 'verified'` only when **full** spec package is complete (materials, dimensions, weight, package, assembly as applicable)

## Screen vs physical variation

Public copy should note natural grain and finish variation. Do not promise exact color match to screen swatches.

## Comparison and filters

Wood tone filters operate on colorway labels. Do not add "solid wood" filter until material verification supports it (currently excluded by design).

## Blocks live purchase

`specificationVerificationStatus !== 'verified'` prevents `isProductPurchaseable()` from returning true.

## Related

- [upholstery-verification.md](upholstery-verification.md)
- [product-editing.md](product-editing.md)
- `/materials-finishes` on site
