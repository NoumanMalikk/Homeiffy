# Furniture Safety Documentation

Safety information is tracked per product in `src/data/product-safety.ts` and surfaced on `/furniture-safety` and product specification sections.

## Verification status

All 26 products initialize with `verificationStatus: 'pending'` and field values of `Verification required` or product-specific pending notes.

Product-level gate: `safetyVerificationStatus: 'verified'` required for live purchase.

## Fields tracked

| Field | Applies to |
|-------|------------|
| `weightCapacity` | Seating, shelves, benches |
| `tipOverRisk` | Tall storage, hall trees, bookcases |
| `wallAnchoring` | Tip-prone units |
| `drawerSafety` | Drawer units |
| `shelfLoad` | Bookcases, shelves |
| `casterLocks` | Mobile cabinet (HMF-RST-025) |
| `foldingMechanism` | Foldaway desk |
| `extensionMechanism` | Drop-leaf table |
| `pinchPoints` | Tilt-out cabinet, extension tables |
| `storageHinges` | Storage bench, ottoman |
| `glassComponents` | If glass present |
| `sharpCorners` | As applicable |
| `assemblyHardware` | All assembly-required items |
| `flammabilityDocumentation` | Upholstered products |
| `manufacturerWarnings` | All |
| `recallStatus` | All |

Use `null` or "Not applicable" overrides in `createSafetyRecord()` when field truly does not apply - document in `notes`.

## Prohibited claims

Do not publish until manufacturer documentation supports:

- Tip-resistant or anti-tip certified
- Child-safe, climb-safe, sleep-safe
- Commercial or contract grade
- Fire resistant
- Safe above a specific weight without tested limit

Site copy: *"Homeiffy does not claim tip resistance, child safety, commercial grade use or fire resistance without verified manufacturer documentation."*

## Checkout blocking

`evaluateCheckoutBlockers()` checks `isProductPurchaseable()` which requires `safetyVerificationStatus: 'verified'`.

Additional live blocker when `assemblyRequired === true` and `assemblyInstructions` not published.

## High-priority products

Records with enhanced notes in `product-safety.ts`:

- **HMF-ENT-001** - storage hinges, tip-over
- **HMF-ENT-003** - tilt-out pinch points
- **HMF-ENT-004** - hall tree tip-over, anchoring, shelf load
- **HMF-DIN-006** - extension mechanism, pinch points
- **HMF-DSK-011** - folding mechanism
- **HMF-BED-022** - tip-over (dresser)
- Additional records include product-specific pending notes

Review each record before marking verified.

## Verification workflow

1. Collect manufacturer safety sheet, warning labels, test reports
2. Confirm recall status (CPSC, manufacturer notices)
3. Update applicable fields with verified values or "Not applicable"
4. Set record `verificationStatus: 'verified'`
5. Set product `safetyVerificationStatus: 'verified'`
6. Publish warnings in product `warnings` field when provided by manufacturer
7. Link assembly wall-anchor guidance where required

## Customer-facing page

`/furniture-safety` lists all records with verification status. Update pending count automatically from data.

## Launch blocker

- Any product with pending safety verification cannot be purchased live
- `legalConfig.launchBlockers` includes "Safety documentation pending verification"
- Launch checklist items 66, 38, 39

## Related

- [assembly-readiness.md](assembly-readiness.md)
- [product-editing.md](product-editing.md)
- [launch-checklist.md](launch-checklist.md)
