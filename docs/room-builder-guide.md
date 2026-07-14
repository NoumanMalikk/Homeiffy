# Room Builder Guide

Homeiffy provides two room-planning tools - both for **exploration only**, not professional space planning or guaranteed fit.

## Room Rhythm Builder

**Route:** `/room-rhythm-builder`  
**Component:** `src/components/room-builder/RoomRhythmBuilderContent.tsx`  
**State:** `useRoomBuilderStore` (Zustand, persisted locally)

### Slots

| Slot ID | Role | Example products |
|---------|------|------------------|
| `anchor` | Anchor piece | Console, hall tree, desk, bed |
| `seating` | Seating | Bench, chair, loveseat |
| `storage` | Storage | Shoe cabinet, ottoman, dresser |
| `table` | Tables | Nesting side tables |
| `accent` | Flexible accent | Room divider, narrow console |

### Compatibility logic

Products declare `roomCompatibilityIds` pointing to groups in `src/data/room-compatibility.ts`.

Picker filters products where group **role** matches slot role:

- `accent` slot → groups with role `flexible-accent`
- Other slots → matching role name

Products with empty `roomCompatibilityIds` appear in all slots (fallback).

### What the builder shows

Per slot: image, title, dimensions, finish, upholstery, price  
Combined: total price, approximate footprint via `calculateFootprint()`

### Rules (enforced in copy and code)

- Each product added **separately** - no fake bundles or bundle discounts
- Footprint is approximate bounding box - **not guaranteed fit**
- Disclaimer: *"Confirm room, doorway and circulation dimensions before ordering."*
- Staging mode banner when `siteEnv === 'demo'`
- Incomplete products show verification status; purchase still gated elsewhere

### Maintaining compatibility

When adding/editing products:

1. Assign `roomCompatibilityIds` from existing groups or create new group in `room-compatibility.ts`
2. Set `compatibleGroupIds` for cross-slot pairing
3. Map `productIds` in each group for documentation (builder uses product-level IDs)

Groups organized by moment context: entryway-arrive, dining-gather, workspace-focus, living-unwind, bedroom-restore, flexible-reset.

## Room Board

**Route:** `/room-board`  
**Component:** `src/components/room-board/RoomBoardContent.tsx`

Visual drag-arrange floor view with proportional scaling where dimensions verified.

### Requirements

- Exact product cutouts (verified images)
- Dimensions, finish, upholstery, individual prices visible
- Combined total price
- No architectural accuracy claim
- No code compliance or professional design claim
- Measuring/clearance disclaimer required

## Integration points

From wishlist/product pages, users can send items to room builder or room board (where implemented in UI).

Wishlist preserves finish/upholstery selections when moving to cart.

## Shareable links

Shareable room compositions are **not** implemented as secure public URLs unless added later with signed tokens. Current state: local persistence only.

## Do not enable without business confirmation

- Design services (`designServiceEnabled: false`)
- Custom furniture (`customFurnitureEnabled: false`)
- Guaranteed layout fit language

## Testing checklist

- [ ] Compatible products appear per slot
- [ ] Incompatible products filtered out
- [ ] Footprint note appears when dimensions missing
- [ ] Combined price sums `price` correctly
- [ ] Clear slot removes product
- [ ] Reduced motion respected (Framer Motion)

## Related

- [product-editing.md](product-editing.md) - `roomCompatibilityIds`
- [dimension-verification.md](dimension-verification.md)
- `/measuring-guide` - customer measuring guidance
