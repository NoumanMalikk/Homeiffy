# Homeiffy official brand assets

The **official Homeiffy Furniture logo** (gold crest on black) is the only approved mark for customer-facing use.

## Source of truth

| File | Use |
|------|-----|
| `official-logo.png` | Full lockup - header, footer, mobile menu, emails, marketing |
| `monogram-dh.png` | Crest crop - favicon, apple touch, compact brand mark, social avatar |
| `og-brand.png` | Open Graph / social share (1200×630) |
| `social-avatar.png` | Profile / avatar square |
| `seal.png` | Crest used where a seal/square is needed |

Do not invent alternate color versions of this artwork. The official lockup is gold on black.

## App wiring

- `src/components/brand/Logo.tsx` always loads `official-logo.png`
- `src/components/brand/BrandMark.tsx` always loads `monogram-dh.png`
- Favicon / apple touch / OG metadata point at these PNGs
- Order confirmation email embeds `official-logo.png`

Legacy SVG drafts under this folder are unused and may be removed later.
