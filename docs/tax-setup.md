# Tax Setup (Stripe Tax)

Sales tax is calculated server-side. Client-side tax manipulation is not permitted.

## Configuration

```env
STRIPE_TAX_ENABLED=true
STRIPE_SECRET_KEY=sk_test_...   # or sk_live_...
```

When `STRIPE_TAX_ENABLED=true` and Stripe is configured:

- Checkout session created with `automatic_tax: { enabled: true }`
- Tax line item is **not** pre-added - Stripe calculates at payment
- UI shows label: **"Calculated at payment"**

Implementation: `src/lib/stripe.ts` (`createCheckoutSession`), `src/lib/checkout.ts` (`calculateCheckoutTax`).

## Staging mode without Stripe Tax

When `STRIPE_TAX_ENABLED` is not `true`:

- **Staging mode:** illustrative tax at 8.875% on subtotal + shipping
- Label: **"Demonstration tax estimate"**
- Note explains final tax depends on destination

This rate is for interface preview only - not a filing rate.

## Live mode without Stripe Tax

If Stripe Tax is disabled in live mode:

- Tax amount may be $0 at session creation with note "Tax will be calculated at payment"
- **Not recommended for production** - configure Stripe Tax or another compliant service before live launch

## Stripe Tax setup (Dashboard)

1. Stripe Dashboard → **Tax → Settings**
2. Enable Stripe Tax for your account
3. Configure business address and tax registrations
4. Test in test mode with test addresses
5. Set `STRIPE_TAX_ENABLED=true` in production env

## Launch requirement

`canLaunchProduction()` does not currently require `STRIPE_TAX_ENABLED=true`, but live furniture sales typically require compliant tax calculation. Treat tax configuration as a **business launch blocker** even if not enforced in code.

## Checkout display

| State | Subtotal tax line | Stripe session |
|-------|-------------------|----------------|
| Stripe Tax on | $0, "Calculated at payment" | `automatic_tax.enabled` |
| Staging estimate | Computed 8.875% | Tax as separate line item |
| Live, tax off | $0 placeholder | Manual line items only |

## Related

- [payment-setup.md](payment-setup.md)
- [legal-review.md](legal-review.md) - tax language in Terms
