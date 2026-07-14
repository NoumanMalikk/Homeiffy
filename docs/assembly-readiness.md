# Assembly Readiness

Assembly documentation must be complete before live sale of any product where `assemblyRequired === true`.

## Product fields

| Field | Description |
|-------|-------------|
| `assemblyRequired` | `true`, `false`, or verification sentinel |
| `assemblyInstructions` | Availability / URL / reference when verified |
| `hardwareIncluded` | Packaged hardware list |
| `toolsRequired` | Customer-supplied tools |
| `packageContents` | Component list |

## Service status

`storeConfig.assemblyServiceEnabled: false` - paid assembly is **not** offered. Do not advertise installation services.

`/assembly-information` states paid assembly is not enabled.

## Checkout gate

From `evaluateCheckoutBlockers()`:

> If `assemblyRequired === true` and `assemblyInstructions === null` (or pending sentinel treated as unavailable): **live mode blocker**

Staging mode surfaces as warning only.

## What not to publish without verification

- Estimated assembly time
- "Easy assembly" or difficulty claims
- Number of people recommended (unless documented)
- Instruction video unless accurate and approved

## Documentation deliverables (when verified)

- Step-by-step instructions (PDF or web)
- Parts inventory list
- Floor-protection guidance where applicable
- Wall-anchor guidance for tip-prone units
- Missing-parts contact route via `/contact`

## Verification workflow

1. Confirm `assemblyRequired` boolean from supplier
2. Obtain instruction document; verify version matches current SKU
3. List hardware and tools from packing list
4. Update product fields in `products.ts`
5. Optional: add `assembly-hardware.webp` to gallery
6. Cross-check safety record `assemblyHardware` field
7. Re-test checkout blocker clearance

## Products likely requiring assembly

Most case goods (desks, bookcases, beds, sideboards, hall tree, media console, room divider, mobile cabinet) - confirm per supplier rather than assume.

Upholstered seating may ship assembled - verify per SKU.

## Customer messaging

Product pages show assembly status via `formatAssemblyStatus()`. Pending status displays "Verification required".

## Blocks launch

- Live checkout with assembly-required SKU lacking instructions
- Advertising assembly ease without documentation

## Related

- [furniture-safety.md](furniture-safety.md)
- [product-editing.md](product-editing.md)
- Site: `/assembly-information`
