import type { ProductSafetyRecord } from '@/lib/types';

const pendingSafetyFields = {
  weightCapacity: 'Verification required' as const,
  tipOverRisk: 'Verification required' as const,
  wallAnchoring: 'Verification required' as const,
  drawerSafety: 'Verification required' as const,
  shelfLoad: 'Verification required' as const,
  casterLocks: 'Verification required' as const,
  foldingMechanism: 'Verification required' as const,
  extensionMechanism: 'Verification required' as const,
  pinchPoints: 'Verification required' as const,
  storageHinges: 'Verification required' as const,
  glassComponents: 'Verification required' as const,
  sharpCorners: 'Verification required' as const,
  assemblyHardware: 'Verification required' as const,
  flammabilityDocumentation: 'Verification required' as const,
  manufacturerWarnings: 'Verification required' as const,
  recallStatus: 'Verification required' as const,
  verificationStatus: 'pending' as const,
};

function createSafetyRecord(
  productId: string,
  sku: string,
  overrides: Partial<ProductSafetyRecord> = {},
): ProductSafetyRecord {
  return {
    productId,
    sku,
    ...pendingSafetyFields,
    notes:
      'Safety documentation pending supplier verification and physical product inspection. Live purchase blocked until complete.',
    ...overrides,
  };
}

export const productSafetyRecords: ProductSafetyRecord[] = [
  createSafetyRecord('hmf-liv-001', 'HMF-LIV-001'),
  createSafetyRecord('hmf-liv-002', 'HMF-LIV-002'),
  createSafetyRecord('hmf-liv-003', 'HMF-LIV-003'),
  createSafetyRecord('hmf-liv-004', 'HMF-LIV-004'),
  createSafetyRecord('hmf-liv-005', 'HMF-LIV-005'),
  createSafetyRecord('hmf-liv-006', 'HMF-LIV-006'),
  createSafetyRecord('hmf-liv-007', 'HMF-LIV-007'),
  createSafetyRecord('hmf-liv-008', 'HMF-LIV-008'),
  createSafetyRecord('hmf-liv-009', 'HMF-LIV-009'),
  createSafetyRecord('hmf-bed-001', 'HMF-BED-001'),
  createSafetyRecord('hmf-bed-002', 'HMF-BED-002'),
  createSafetyRecord('hmf-bed-003', 'HMF-BED-003'),
  createSafetyRecord('hmf-bed-004', 'HMF-BED-004'),
  createSafetyRecord('hmf-bed-005', 'HMF-BED-005'),
  createSafetyRecord('hmf-bed-006', 'HMF-BED-006'),
  createSafetyRecord('hmf-din-001', 'HMF-DIN-001'),
  createSafetyRecord('hmf-din-002', 'HMF-DIN-002'),
  createSafetyRecord('hmf-din-003', 'HMF-DIN-003'),
  createSafetyRecord('hmf-din-004', 'HMF-DIN-004'),
  createSafetyRecord('hmf-din-005', 'HMF-DIN-005'),
  createSafetyRecord('hmf-ent-001', 'HMF-ENT-001'),
  createSafetyRecord('hmf-ent-002', 'HMF-ENT-002'),
  createSafetyRecord('hmf-ent-003', 'HMF-ENT-003'),
  createSafetyRecord('hmf-ent-004', 'HMF-ENT-004'),
  createSafetyRecord('hmf-sto-001', 'HMF-STO-001'),
  createSafetyRecord('hmf-off-001', 'HMF-OFF-001'),
];

export const productSafetyByProductId = Object.fromEntries(
  productSafetyRecords.map((record) => [record.productId, record]),
) as Record<string, ProductSafetyRecord>;

export const productSafetyBySku = Object.fromEntries(
  productSafetyRecords.map((record) => [record.sku, record]),
) as Record<string, ProductSafetyRecord>;
