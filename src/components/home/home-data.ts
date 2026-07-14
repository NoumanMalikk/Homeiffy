import { footprints } from '@/data/footprints';
import { products } from '@/data/products';
import { getProductMainImage } from '@/lib/product-display';
import { getProductBySku } from '@/lib/products';
import type { Product } from '@/lib/types';

export const heroComposition = [
  {
    sku: 'HMF-LIV-001',
    label: 'Compact Apartment Sofa',
    placement: 'col-span-2 row-span-2',
  },
  {
    sku: 'HMF-LIV-002',
    label: 'Compact Loveseat',
    placement: 'col-span-1 row-span-1',
  },
  {
    sku: 'HMF-LIV-007',
    label: 'Lift-Top Coffee Table',
    placement: 'col-span-1 row-span-1',
  },
  {
    sku: 'HMF-LIV-009',
    label: 'Low Media Console',
    placement: 'col-span-1 row-span-1',
  },
  {
    sku: 'HMF-BED-001',
    label: 'Queen Platform Bed',
    placement: 'col-span-1 row-span-1',
  },
] as const;

export type HeroProductItem = (typeof heroComposition)[number] & {
  product: Product;
  image: ReturnType<typeof getProductMainImage>;
};

export function getHeroProducts(): HeroProductItem[] {
  const items: HeroProductItem[] = [];

  for (const item of heroComposition) {
    const product = getProductBySku(item.sku);
    if (!product) continue;
    items.push({
      ...item,
      product,
      image: getProductMainImage(product),
    });
  }

  return items;
}

export function getProductsBySkus(skus: string[]): Product[] {
  return skus
    .map((sku) => getProductBySku(sku))
    .filter((product): product is Product => Boolean(product));
}

export const footprintCategories = footprints.map((fp) => ({
  id: fp.id,
  label: fp.title,
  href: fp.href,
  sampleSkus: products
    .filter((product) => product.footprintCategory.includes(fp.slug))
    .slice(0, 3)
    .map((product) => product.sku),
  note: fp.guidance,
}));

export const materialMoodGroups = [
  {
    id: 'light-wood',
    title: 'Light wood tones',
    finishes: ['Natural Oak', 'Canvas Cream'],
    href: '/materials-finishes?group=light-wood',
  },
  {
    id: 'warm-medium',
    title: 'Warm medium wood tones',
    finishes: ['Natural Oak', 'Warm Mustard'],
    href: '/materials-finishes?group=warm-medium',
  },
  {
    id: 'deep-wood',
    title: 'Deep wood tones',
    finishes: ['Room Ink'],
    href: '/materials-finishes?group=deep-wood',
  },
  {
    id: 'painted',
    title: 'Painted surfaces',
    finishes: ['Room Ink', 'Homeiffy Teal', 'Gallery White'],
    href: '/materials-finishes?group=painted',
  },
  {
    id: 'metal-frames',
    title: 'Metal frames',
    finishes: ['Natural Oak with Room Ink frame'],
    href: '/materials-finishes?group=metal-frames',
  },
  {
    id: 'woven-upholstery',
    title: 'Woven upholstery',
    finishes: ['Deep Olive', 'Canvas Cream'],
    href: '/materials-finishes?group=woven-upholstery',
  },
  {
    id: 'textured-upholstery',
    title: 'Textured upholstery',
    finishes: ['Clay Ember', 'Soft Plum'],
    href: '/materials-finishes?group=textured-upholstery',
  },
  {
    id: 'smooth-upholstery',
    title: 'Smooth upholstery',
    finishes: ['Soft Plum', 'Clay Ember', 'Canvas Cream'],
    href: '/materials-finishes?group=smooth-upholstery',
  },
] as const;

export const roomEditSkus = {
  living: [
    'HMF-LIV-001',
    'HMF-LIV-002',
    'HMF-LIV-003',
    'HMF-LIV-004',
    'HMF-LIV-006',
    'HMF-LIV-007',
    'HMF-LIV-009',
  ],
  transforming: [
    'HMF-DIN-002',
    'HMF-LIV-007',
    'HMF-LIV-008',
    'HMF-LIV-006',
    'HMF-OFF-001',
    'HMF-LIV-003',
  ],
  bedroom: [
    'HMF-BED-001',
    'HMF-BED-002',
    'HMF-BED-003',
    'HMF-BED-004',
    'HMF-BED-005',
    'HMF-BED-006',
  ],
  dining: [
    'HMF-DIN-001',
    'HMF-DIN-002',
    'HMF-DIN-003',
    'HMF-DIN-004',
    'HMF-DIN-005',
  ],
  entryway: [
    'HMF-ENT-001',
    'HMF-ENT-002',
    'HMF-ENT-003',
    'HMF-ENT-004',
    'HMF-STO-001',
  ],
} as const;

export const orderingSteps = [
  'Choose the exact product and variant',
  'Review dimensions and package details',
  'Confirm delivery access',
  'Complete secure checkout',
] as const;

export const oneRoomTwoRolesPairings = [
  {
    id: 'console-desk-entry',
    roleA: 'Compact desk',
    roleB: 'Entry console zone',
    productSkus: ['HMF-OFF-001', 'HMF-ENT-001'],
    note: 'Foldaway desk and narrow console for wall-adjacent rooms.',
  },
  {
    id: 'storage-bench-bedroom',
    roleA: 'Entry storage bench',
    roleB: 'Bedroom bench',
    productSkus: ['HMF-ENT-003', 'HMF-BED-005'],
    note: 'Storage benches listed for entries and quiet rooms.',
  },
  {
    id: 'side-table-flexible',
    roleA: 'Nesting side tables',
    roleB: 'Flexible accent',
    productSkus: ['HMF-LIV-008'],
    note: 'Nesting tables listed for living and flexible layouts.',
  },
  {
    id: 'divider-bookcase',
    roleA: 'Room divider',
    roleB: 'Open bookcase',
    productSkus: ['HMF-STO-001'],
    note: 'Five-shelf bookcase for storage and zone definition.',
  },
  {
    id: 'drop-leaf-dining',
    roleA: 'Extendable dining table',
    roleB: 'Compact dining',
    productSkus: ['HMF-DIN-002'],
    note: 'Extendable dining table for changing footprint needs.',
  },
] as const;

export const roomRhythmSlots = [
  { id: 'anchor', label: 'Anchor piece' },
  { id: 'seating', label: 'Seating' },
  { id: 'storage', label: 'Storage' },
  { id: 'table', label: 'Table' },
  { id: 'accent', label: 'Flexible accent' },
] as const;

export const verifiedColorwayLabels = new Set(
  products.flatMap((product) => product.colorways.map((colorway) => colorway.label)),
);
