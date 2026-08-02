# Image verification

No product may become purchasable until its primary image is verified.

## Primary image rules

The first gallery image must be `main-front-[variant].webp` (or the catalog `main.webp` during onboarding) and must show:

- The exact product, model, SKU, dimensions, configuration, color, upholstery, finish, drawer/shelf/door count, orientation and included pieces
- Full product on a clean white or near-white background
- Straight or slightly elevated front three-quarter view
- No room scene, props, people, pets, text, watermark or competitor branding

## Verification record

Before publishing an image, confirm:

- Product ID, SKU, supplier SKU, manufacturer model
- Exact variant, finish, upholstery, orientation, dimensions, package contents
- Original source, permission basis, dates, verified by, notes, production approval

## Forbidden sources

Do not use Amazon, Walmart, Target, Wayfair, IKEA, Article, Castlery, West Elm, Pottery Barn, Crate and Barrel, Burrow, marketplace sellers, Pinterest, Instagram, Facebook Marketplace, blogs or search thumbnails.

Do not hotlink images permanently. Store approved files locally under `public/products/[product-slug]/`.

## Status values

- `pending`: catalog display only; production purchase blocked
- `verified`: exact match confirmed and permission documented
- `missing` / `blocked`: remove from purchase paths

Set `imageVerificationStatus: 'verified'` only after human review against the physical product or approved supplier media.
