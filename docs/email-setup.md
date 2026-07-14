# Email Setup (Resend)

Transactional email uses [Resend](https://resend.com). Production sending is gated by store mode and legal launch status.

## Configuration

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=orders@your-verified-domain.com
CONTACT_EMAIL=operations@your-verified-domain.com
```

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API authentication |
| `RESEND_FROM_EMAIL` | Sender address (must be verified in Resend) |
| `CONTACT_EMAIL` | Recipient for contact/quote notifications; fallback for from-address resolution |

**Do not invent email addresses.** Use only business-approved domains and inboxes.

## When email sends

`canSendProductionEmails()` in `src/lib/email.ts` returns `true` only when:

1. `RESEND_API_KEY` is set
2. `NEXT_PUBLIC_SITE_ENV=live`
3. `legalConfig.productionLaunchBlocked` is `false`

Otherwise sends return `{ sent: false, reason: '...' }` without throwing.

## Email types

| Function | Trigger | To |
|----------|---------|-----|
| `sendOrderConfirmation` | Webhook or staging-complete after order created | Customer email |
| `sendContactNotification` | Contact form POST | `CONTACT_EMAIL` |
| `sendQuoteNotification` | Quote request POST | `CONTACT_EMAIL` |

## Staging mode behavior

- No production emails sent
- Order confirmation attempts return reason: *"Production email delivery is disabled in staging or pre-launch mode."*
- Contact/quote forms may accept submissions but notifications are suppressed

## Resend setup steps

1. Create Resend account
2. Add and verify sending domain (DNS records)
3. Create API key → `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` to an address on verified domain
5. Set `CONTACT_EMAIL` to monitored business inbox
6. Test with live mode on staging (or temporarily enable after legal unblock)

## Launch blockers

From `canLaunchProduction()`:

- `RESEND_API_KEY` missing → blocker
- `CONTACT_EMAIL` missing → blocker

From `legalConfig.launchBlockers`:

- Explicit mention of `CONTACT_EMAIL` not configured

## Email content (current)

Order confirmation is minimal HTML:

- Customer first name
- Order reference
- Total and currency
- Fulfillment follow-up note

Expand templates before launch if brand HTML, line items, and assembly links are required.

## Fallback addresses

Code fallback `orders@homeiffy.example` is used only when resolving from-address if env and store config are empty - **not** displayed publicly. Configure real addresses before launch.

## Related

- [order-processing.md](order-processing.md)
- [deployment.md](deployment.md)
- [legal-review.md](legal-review.md)
