# Legal Review

Legal policies and launch flags live in `src/data/legal-config.ts`. **Production launch is blocked** until business-approved content replaces placeholders.

## Current state (blocks launch)

```ts
productionLaunchBlocked: true,
addressVerificationRequired: true,
```

All policies contain:

```
[BUSINESS REVIEW REQUIRED: insert approved policy]
```

Policies requiring review:

| ID | Route | Title |
|----|-------|-------|
| `privacy-policy` | `/privacy-policy` | Privacy Policy |
| `terms-conditions` | `/terms-conditions` | Terms and Conditions |
| `shipping-policy` | `/shipping-policy` | Shipping Policy |
| `return-refund-policy` | `/return-refund-policy` | Return and Refund Policy |
| `accessibility` | `/accessibility` | Accessibility Statement |

Each has `requiresBusinessReview: true` and `lastReviewed: null`.

## Launch blockers array

Configured blockers (in addition to runtime checks):

- Policy pages contain business-review placeholders
- Registered address unit format not confirmed
- Product specifications pending verification
- Product images pending verification
- Safety documentation pending verification
- CONTACT_EMAIL environment variable not configured for production

`canLaunchProduction()` merges these with dynamic checks (Stripe, products, email, etc.).

## What legal counsel must define

Do **not** invent in code without approval:

| Topic | Policy location |
|-------|-----------------|
| Return window and restocking fees | Return and Refund |
| Refund processing time | Return and Refund |
| Shipping timelines and carriers | Shipping |
| Freight and oversized handling | Shipping |
| Damaged item process | Return and Refund / Terms |
| Cancellation window | Terms |
| Warranty | Terms (currently no warranty claimed) |
| Final sale products | Terms / Returns |
| White-glove / assembly | Shipping (services disabled) |
| Privacy data retention, cookies | Privacy |
| Marketing consent | Privacy / Terms |
| Accessibility contact | Accessibility |

## Approval workflow

1. Draft policies with qualified counsel for New York / US e-commerce
2. Replace `content` in each policy object in `legal-config.ts`
3. Set `lastReviewed: 'YYYY-MM-DD'`
4. Set `requiresBusinessReview: false`
5. Remove `[BUSINESS REVIEW REQUIRED]` substring from all content
6. Set `productionLaunchBlocked: false` when all gates satisfied
7. Trim resolved items from `launchBlockers` array
8. Deploy and verify pages render approved text

`isProductionLaunchAllowed()` helper checks the above flags.

## Runtime detection

`hasLegalPlaceholders()` in `launch-gates.ts` scans for placeholder string or `requiresBusinessReview: true`.

Any match → launch blocked.

## Checkout agreements

Checkout requires customer acknowledgments (terms, privacy, dimension review, delivery access, finish/upholstery confirmation, assembly review). Agreement text must align with approved policies.

## SEO and schema

- No fake reviews or AggregateRating
- No LocalBusiness hours or showroom schema
- Offer schema only for verified active products

## Related pages (informational, not legal-config)

These are site content but support compliance:

- `/furniture-safety`
- `/assembly-information`
- `/materials-finishes`
- `/upholstery-care`
- `/measuring-guide`

Ensure they do not contradict approved policies.

## Related

- [address-verification.md](address-verification.md)
- [launch-checklist.md](launch-checklist.md)
- [deployment.md](deployment.md)
