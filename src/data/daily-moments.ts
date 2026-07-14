import type { DailyMoment } from '@/lib/types';

/**
 * Legacy moment groupings kept for catalog filters and related browsing.
 * Primary public navigation uses rooms, footprints and functions.
 */
export const dailyMoments: DailyMoment[] = [
  {
    slug: 'arrive',
    title: 'Arrive',
    shortCopy: 'Furniture for entries and transition zones.',
    accentColor: '#3D5548',
    productSkus: ['HMF-ENT-001', 'HMF-ENT-002', 'HMF-ENT-003', 'HMF-ENT-004'],
  },
  {
    slug: 'gather',
    title: 'Gather',
    shortCopy: 'Furniture for meals and conversation.',
    accentColor: '#0F6B63',
    productSkus: [
      'HMF-DIN-001',
      'HMF-DIN-002',
      'HMF-DIN-003',
      'HMF-DIN-004',
      'HMF-DIN-005',
      'HMF-LIV-001',
      'HMF-LIV-002',
    ],
  },
  {
    slug: 'focus',
    title: 'Focus',
    shortCopy: 'Furniture for reading, writing and working at home.',
    accentColor: '#B8793A',
    productSkus: ['HMF-OFF-001', 'HMF-STO-001', 'HMF-LIV-005', 'HMF-ENT-001'],
  },
  {
    slug: 'unwind',
    title: 'Unwind',
    shortCopy: 'Furniture for lounge and living areas.',
    accentColor: '#E85D4C',
    productSkus: [
      'HMF-LIV-001',
      'HMF-LIV-002',
      'HMF-LIV-003',
      'HMF-LIV-004',
      'HMF-LIV-005',
      'HMF-LIV-006',
      'HMF-LIV-007',
      'HMF-LIV-008',
      'HMF-LIV-009',
    ],
  },
  {
    slug: 'restore',
    title: 'Restore',
    shortCopy: 'Furniture for bedrooms and quiet rooms.',
    accentColor: '#554E5C',
    productSkus: [
      'HMF-BED-001',
      'HMF-BED-002',
      'HMF-BED-003',
      'HMF-BED-004',
      'HMF-BED-005',
      'HMF-BED-006',
    ],
  },
  {
    slug: 'reset',
    title: 'Reset',
    shortCopy: 'Furniture that helps a room change function.',
    accentColor: '#C4B7A0',
    productSkus: [
      'HMF-DIN-002',
      'HMF-LIV-007',
      'HMF-LIV-008',
      'HMF-OFF-001',
      'HMF-LIV-003',
      'HMF-LIV-006',
    ],
  },
];

export const dailyMomentBySlug = Object.fromEntries(
  dailyMoments.map((moment) => [moment.slug, moment]),
) as Record<string, DailyMoment>;
