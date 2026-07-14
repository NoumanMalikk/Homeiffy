# Address Verification

**Critical launch gate.** The registered business address must be confirmed before production launch.

## Registered address (as supplied)

```
Homeiffy LLC
4318 HWY 21
Burkville, NY 36752
United States
```

Configured in `src/data/store-config.ts`:

```ts
registeredAddress: {
  line1: '4318 HWY 21',
  city: 'Burkville',
  state: 'NY',
  postalCode: '36752',
  country: 'United States',
  verificationNote:
    'The trailing number 2 was supplied without an apartment, unit, suite or floor label. Confirm the exact address formatting before production launch.',
},
```

## Do not auto-rewrite

The trailing **2** was supplied without label context. **Do not** change to:

- Apt 2
- Unit 2
- Suite 2
- Floor 2
- #2

…unless the business explicitly confirms that format.

Preserve internally as **`4318 HWY 21`** until confirmation.

## Public display rules

| Setting | Current value | Effect |
|---------|---------------|--------|
| `showFullBusinessAddress` | `false` | Full street address hidden on public pages |
| `publicLocationLabel` | `Burkville, Alabama` | Used in footer and general copy |
| `isPublicStorefront` | `false` | Not presented as walk-in retail |
| `isPublicShowroom` | `false` | Not presented as showroom |

When `showFullBusinessAddress` is enabled **after confirmation**, publish only the **confirmed** format.

## Do not describe as

- Walk-in furniture store
- Public showroom or warehouse open to customers
- Customer pickup point
- Design studio, workshop, or distribution center
- Public service location with store hours

Do **not** publish store hours or map pins implying visit-in-person access.

## Launch gate implementation

`src/lib/launch-gates.ts` - `isAddressUnitFormatConfirmed()`:

Returns `false` while `legalConfig.addressVerificationRequired === true` OR while `verificationNote` contains trigger phrases (apartment/unit/format not confirmed).

`canLaunchProduction()` adds blocker:

> Registered address unit format is not confirmed for production launch.

`src/data/legal-config.ts`:

```ts
addressVerificationRequired: true,
launchBlockers: [
  ...
  'Registered address unit format not confirmed',
],
```

## Confirmation procedure

When the business confirms correct USPS/legal formatting:

1. **Update address** in `store-config.ts` only if format changed - use exact confirmed line (may remain `4318 HWY 21` if that is correct)
2. **Replace or remove** `verificationNote` with confirmation record (date, confirmed by, source e.g. lease/utility/USPS)
3. Set `legalConfig.addressVerificationRequired: false`
4. Remove address blocker from `legalConfig.launchBlockers` array
5. Set env `ADDRESS_UNIT_FORMAT_CONFIRMED=true` in production (audit trail)
6. Re-run launch checklist items 95-97

## Environment variable

```env
ADDRESS_UNIT_FORMAT_CONFIRMED=true
```

Documented in `.env.example`. Ops should set only after steps above. Runtime gate reads `legal-config.ts` and `verificationNote` - env var alone does not unblock launch without code updates.

## Contact page

`/contact` may show internal verification reminder for staff-facing builds. Public copy uses phone and Burkville label unless full address enabled.

## SEO / schema

Do not emit LocalBusiness hours, geo coordinates, or showroom schema for this address.

## Related

- [legal-review.md](legal-review.md)
- [launch-checklist.md](launch-checklist.md) - items 95-97
- [campaign-image-guide.md](campaign-image-guide.md)
