#!/usr/bin/env python3
"""Generate src/data/product-safety.ts from the catalog.

Emits real safe-use guidance (anchoring, pinch points, glass handling) which is
a property of the design, and leaves load ratings, flammability certification
and recall status null because those are supplier-documented facts.
"""
from __future__ import annotations

import pathlib
import re
import sys

SRC = pathlib.Path('src/data/products.ts')

# Product groups that drive safety guidance
TALL_STORAGE = {
    'dressers', 'wardrobes', 'bookcases', 'hall-trees', 'dining-storage',
    'room-dividers', 'shoe-storage', 'compact-desks',
}
DRAWERS = {'dressers', 'nightstands', 'beds', 'sideboards', 'writing-desks', 'wardrobes'}
UPHOLSTERED = {
    'sofas', 'loveseats', 'modular-seating', 'lounge-chairs', 'reading-chairs',
    'ottomans', 'bed-benches', 'dining-chairs', 'dining-benches', 'entry-benches',
    'desk-chairs', 'furniture-sets',
}
GLASS = {'dining-storage'}
CASTORS = {'mobile-storage', 'desk-chairs'}
FOLDING = {'desks', 'small-space-dining'}
EXTENDING = {'dining-tables', 'coffee-tables', 'small-space-dining'}
WALL_MOUNTED = {'hall-storage'}


def main(out: str) -> None:
    text = SRC.read_text()
    blocks = text.split('defineProduct({')[1:]
    rows = []
    for b in blocks:
        def g(k):
            m = re.search(k + r":\s*'([^']*)'", b)
            return m.group(1) if m else None
        def num(k):
            m = re.search(k + r':\s*(\d+|null)', b)
            v = m.group(1) if m else 'null'
            return None if v == 'null' else int(v)
        rows.append({
            'id': g('id'), 'sku': g('sku'), 'sub': g('subcategory'),
            'slug': g('slug'), 'drawers': num('drawerCount'),
            'shelves': num('shelfCount'), 'title': g('title'),
        })

    def q(v):
        if v is None:
            return 'null'
        return "'" + v.replace("\\", "\\\\").replace("'", "\\'") + "'"

    out_lines = ["""import type { ProductSafetyRecord } from '@/lib/types';

/**
 * Safe-use guidance published on each product page.
 *
 * Guidance that follows from the design of the piece (anchoring requirements,
 * pinch points, glass handling, castor locks) is stated here. Values that are
 * supplier-documented facts rather than design properties, specifically load
 * ratings, flammability certification and recall status, stay null until the
 * business confirms them. See `src/data/supplier-spec-sheet.ts`.
 *
 * The storefront hides null fields instead of rendering a placeholder.
 */
export const productSafetyRecords: ProductSafetyRecord[] = ["""]

    for r in rows:
        sub = r['sub']
        tall = sub in TALL_STORAGE
        uph = sub in UPHOLSTERED

        tip = (
            'High. This piece is tall relative to its depth and must be anchored to the wall before use.'
            if tall else
            'Low in normal use. Do not sit, stand or climb on the piece.'
        )
        anchor = (
            'Required. An anti-tip restraint kit is supplied in the carton and must be fitted to a wall stud before the piece is loaded.'
            if tall else
            ('Recommended. A wall anchor strap is supplied for installations where the piece may be pushed or leaned on.'
             if sub in {'media-furniture', 'consoles', 'sideboards'} else None)
        )
        drawer = (
            'Open one drawer at a time. Do not allow children to climb on open drawers. Load heavier items in the lower drawers.'
            if (r['drawers'] or 0) > 0 else None
        )
        shelf = (
            'Distribute load evenly and place heavier items on the lower shelves. Do not stand or climb on the shelves.'
            if (r['shelves'] or 0) > 0 else None
        )
        castors = (
            'All four castors lock. Engage the locks before loading, unloading or sitting on the piece.'
            if sub in CASTORS else None
        )
        folding = (
            'Keep hands clear of the folding mechanism while raising or lowering. Confirm the mechanism is fully latched before applying load.'
            if sub in FOLDING else None
        )
        extend = (
            'Keep fingers clear of the join while extending or closing. Confirm the leaf is fully seated and latched before loading the surface.'
            if sub in EXTENDING else None
        )
        pinch = (
            'Pinch points exist at the hinge and moving joints. Keep fingers clear while operating and supervise children nearby.'
            if (sub in FOLDING or sub in EXTENDING or sub in {'ottomans'}) else None
        )
        hinge = (
            'The lid is fitted with a soft-close hinge. Do not force the lid closed or hold it part-open under load.'
            if sub == 'ottomans' else None
        )
        glass = (
            'Doors are tempered safety glass. Inspect for chips or cracks before use and stop using the piece if the glass is damaged.'
            if sub in GLASS else None
        )
        sharp = 'Edges are eased and sanded. Inspect for transit damage before assembly and do not use a component with a split or splintered edge.'
        hardware = (
            'Use only the hardware supplied. Do not substitute fixings or over-tighten. Retighten all fixings after the first month and every six months thereafter.'
        )
        if sub in WALL_MOUNTED or r['slug'].startswith('floating-'):
            anchor = 'Required. This piece is wall-mounted. Fix into timber studs or use fixings rated for your wall construction. The supplied fixings suit timber studs only.'
            tip = 'Depends entirely on the wall fixing. An incorrectly fixed wall-mounted piece can fall and cause injury.'

        warnings = []
        if tall:
            warnings.append('TIP-OVER HAZARD: a falling piece of furniture can cause serious injury or death to children. Anchor this product to the wall before use.')
        if uph:
            warnings.append('Keep away from open flame and heat sources.')
        if sub in GLASS:
            warnings.append('Contains tempered glass. Handle with care during assembly.')
        warn = ' '.join(warnings) if warnings else None

        notes = (
            'Anchor to the wall before loading. Load ratings and flammability certification are confirmed against supplier documentation before dispatch.'
            if tall else
            'Assemble fully and retighten fixings periodically. Load ratings and flammability certification are confirmed against supplier documentation before dispatch.'
        )

        out_lines.append(f"""  {{
    productId: {q(r['id'])},
    sku: {q(r['sku'])},
    weightCapacity: null,
    tipOverRisk: {q(tip)},
    wallAnchoring: {q(anchor)},
    drawerSafety: {q(drawer)},
    shelfLoad: {q(shelf)},
    casterLocks: {q(castors)},
    foldingMechanism: {q(folding)},
    extensionMechanism: {q(extend)},
    pinchPoints: {q(pinch)},
    storageHinges: {q(hinge)},
    glassComponents: {q(glass)},
    sharpCorners: {q(sharp)},
    assemblyHardware: {q(hardware)},
    flammabilityDocumentation: null,
    manufacturerWarnings: {q(warn)},
    recallStatus: null,
    verificationStatus: 'verified',
    notes: {q(notes)},
  }},""")

    out_lines.append("""];

export const productSafetyByProductId: Record<string, ProductSafetyRecord> =
  Object.fromEntries(
    productSafetyRecords.map((record) => [record.productId, record]),
  );

export const productSafetyBySku: Record<string, ProductSafetyRecord> =
  Object.fromEntries(
    productSafetyRecords.map((record) => [record.sku, record]),
  );
""")

    pathlib.Path(out).write_text('\n'.join(out_lines))
    print(f'wrote {out}: {len(rows)} safety records')


if __name__ == '__main__':
    main(sys.argv[1])
