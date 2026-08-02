/**
 * Supplier-confirmed product facts.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FOR HOMEIFFY LLC: this is the only file you need to edit to publish the
 * remaining product specifications. Everything else in the catalog is done.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * These four fields are deliberately left blank rather than estimated, because
 * each one is a factual claim about a physical product that only your supplier
 * can confirm:
 *
 *   weightCapacity   A load rating. Publishing a number that is too high is a
 *                    physical injury risk and a product liability exposure.
 *   countryOfOrigin  Required for customs, and a claim regulated by the FTC.
 *   manufacturer     Needed for warranty claims and any CPSC recall notice.
 *   flammability     For upholstered items, the applicable flammability
 *                    standard the supplier certifies against.
 *
 * The storefront hides any field left as null, so the site is fully shippable
 * today with these blank. Fill a value in and it appears on the product page
 * and in the specification table automatically. No other change is needed.
 *
 * Enter values exactly as the supplier documents them, for example:
 *   weightCapacity: '250 lb evenly distributed'
 *   countryOfOrigin: 'Vietnam'
 *   manufacturer: 'Acme Furniture Co., Ltd.'
 *   flammability: 'Complies with California TB 117-2013'
 */

export interface SupplierConfirmedSpec {
  /** Catalog SKU this record applies to. */
  sku: string;
  /** Supplier part number, if you track one. */
  supplierSku: string | null;
  /** Manufacturer model designation, if different from the supplier SKU. */
  manufacturerModel: string | null;
  /** Rated load, worded as the supplier documents it. */
  weightCapacity: string | null;
  /** Country of manufacture, as declared for customs. */
  countryOfOrigin: string | null;
  /** Legal name of the manufacturing entity. */
  manufacturer: string | null;
  /** Flammability standard certified by the supplier. Upholstered items only. */
  flammability: string | null;
}

function pending(sku: string): SupplierConfirmedSpec {
  return {
    sku,
    supplierSku: null,
    manufacturerModel: null,
    weightCapacity: null,
    countryOfOrigin: null,
    manufacturer: null,
    flammability: null,
  };
}

export const supplierSpecSheet: SupplierConfirmedSpec[] = [
  // ── Living ──
  pending('HMF-LIV-001'),
  pending('HMF-LIV-002'),
  pending('HMF-LIV-003'),
  pending('HMF-LIV-004'),
  pending('HMF-LIV-005'),
  pending('HMF-LIV-006'),
  pending('HMF-LIV-007'),
  pending('HMF-LIV-008'),
  pending('HMF-LIV-009'),
  pending('HMF-LIV-010'),
  pending('HMF-LIV-011'),
  pending('HMF-LIV-012'),
  pending('HMF-LIV-013'),
  // ── Bedroom ──
  pending('HMF-BED-001'),
  pending('HMF-BED-002'),
  pending('HMF-BED-003'),
  pending('HMF-BED-004'),
  pending('HMF-BED-005'),
  pending('HMF-BED-006'),
  pending('HMF-BED-007'),
  pending('HMF-BED-008'),
  pending('HMF-BED-009'),
  pending('HMF-BED-010'),
  // ── Dining ──
  pending('HMF-DIN-001'),
  pending('HMF-DIN-002'),
  pending('HMF-DIN-003'),
  pending('HMF-DIN-004'),
  pending('HMF-DIN-005'),
  pending('HMF-DIN-006'),
  pending('HMF-DIN-007'),
  pending('HMF-DIN-008'),
  pending('HMF-DIN-009'),
  // ── Entryway ──
  pending('HMF-ENT-001'),
  pending('HMF-ENT-002'),
  pending('HMF-ENT-003'),
  pending('HMF-ENT-004'),
  pending('HMF-ENT-005'),
  pending('HMF-ENT-006'),
  // ── Workspace ──
  pending('HMF-OFF-001'),
  pending('HMF-OFF-002'),
  pending('HMF-OFF-003'),
  pending('HMF-OFF-004'),
  // ── Storage ──
  pending('HMF-STO-001'),
  pending('HMF-STO-002'),
  pending('HMF-STO-003'),
  // ── Sets ──
  pending('HMF-SET-001'),
];

export const supplierSpecBySku: Record<string, SupplierConfirmedSpec> =
  Object.fromEntries(supplierSpecSheet.map((spec) => [spec.sku, spec]));

/** Returns the confirmed value for a SKU, or null while it is still pending. */
export function getConfirmedSpec(
  sku: string,
  field: keyof Omit<SupplierConfirmedSpec, 'sku'>,
): string | null {
  return supplierSpecBySku[sku]?.[field] ?? null;
}

/** SKUs still awaiting supplier confirmation. Useful for an ops checklist. */
export function getPendingSupplierSkus(): string[] {
  return supplierSpecSheet
    .filter(
      (spec) =>
        spec.weightCapacity === null ||
        spec.countryOfOrigin === null ||
        spec.manufacturer === null,
    )
    .map((spec) => spec.sku);
}
