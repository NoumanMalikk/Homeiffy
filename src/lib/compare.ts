import { shippingClassById } from '@/data/shipping-classes';
import type { Product, UnknownFieldValue } from '@/lib/types';
import {
  formatDimensionValue,
  formatInchesCm,
  isVerificationRequired,
} from '@/lib/utils';

export type ProductCompareType =
  | 'seating'
  | 'table'
  | 'storage'
  | 'bed'
  | 'desk';

const SEATING_SUBCATEGORIES = new Set([
  'entry-benches',
  'dining-chairs',
  'dining-benches',
  'workspace-seating',
  'lounge-chairs',
  'loveseats',
  'modular-seating',
  'ottomans',
  'bed-benches',
]);

const TABLE_SUBCATEGORIES = new Set([
  'consoles',
  'dining-tables',
  'small-space-dining',
  'coffee-side-tables',
]);

const STORAGE_SUBCATEGORIES = new Set([
  'shoe-storage',
  'hall-storage',
  'sideboards',
  'bookcases',
  'media-furniture',
  'nightstands',
  'dressers',
  'mobile-storage',
  'room-dividers',
  'furniture-sets',
]);

const BED_SUBCATEGORIES = new Set(['beds']);

const DESK_SUBCATEGORIES = new Set(['writing-desks', 'compact-desks']);

const COMPARE_TYPE_LABELS: Record<ProductCompareType, string> = {
  seating: 'Seating',
  table: 'Tables',
  storage: 'Storage',
  bed: 'Beds',
  desk: 'Desks',
};

export const COMPARE_FIELD_LABELS: Record<string, string> = {
  width: 'Overall width',
  height: 'Overall height',
  depth: 'Overall depth',
  seatWidth: 'Seat width',
  seatHeight: 'Seat height',
  seatDepth: 'Seat depth',
  armHeight: 'Arm height',
  backHeight: 'Back height',
  clearance: 'Clearance',
  upholstery: 'Upholstery',
  surfaceFinish: 'Surface finish',
  storageType: 'Storage type',
  assemblyRequired: 'Assembly',
  shippingClass: 'Shipping class',
  drawerCount: 'Drawer count',
  shelfCount: 'Shelf count',
  doorCount: 'Door count',
  seatingCapacity: 'Seating capacity',
  weightCapacity: 'Weight capacity',
  extensionMechanism: 'Extension mechanism',
  packageContents: 'Package contents',
  boxCount: 'Box count',
};

const TYPE_FIELD_ORDER: Record<ProductCompareType, string[]> = {
  seating: [
    'width',
    'height',
    'depth',
    'seatWidth',
    'seatHeight',
    'seatDepth',
    'armHeight',
    'backHeight',
    'upholstery',
    'weightCapacity',
    'assemblyRequired',
    'shippingClass',
  ],
  table: [
    'width',
    'height',
    'depth',
    'surfaceFinish',
    'extensionMechanism',
    'seatingCapacity',
    'storageType',
    'assemblyRequired',
    'packageContents',
    'shippingClass',
  ],
  storage: [
    'width',
    'height',
    'depth',
    'storageType',
    'drawerCount',
    'shelfCount',
    'doorCount',
    'surfaceFinish',
    'weightCapacity',
    'assemblyRequired',
    'shippingClass',
  ],
  bed: [
    'width',
    'height',
    'depth',
    'clearance',
    'surfaceFinish',
    'boxCount',
    'assemblyRequired',
    'shippingClass',
  ],
  desk: [
    'width',
    'height',
    'depth',
    'drawerCount',
    'surfaceFinish',
    'storageType',
    'assemblyRequired',
    'shippingClass',
  ],
};

export function getProductCompareType(product: Product): ProductCompareType {
  if (SEATING_SUBCATEGORIES.has(product.subcategory)) {
    return 'seating';
  }

  if (TABLE_SUBCATEGORIES.has(product.subcategory)) {
    return 'table';
  }

  if (STORAGE_SUBCATEGORIES.has(product.subcategory)) {
    return 'storage';
  }

  if (BED_SUBCATEGORIES.has(product.subcategory)) {
    return 'bed';
  }

  if (DESK_SUBCATEGORIES.has(product.subcategory)) {
    return 'desk';
  }

  return 'table';
}

export function getCompareTypeLabel(type: ProductCompareType): string {
  return COMPARE_TYPE_LABELS[type];
}

function formatUnknownField(value: UnknownFieldValue | string | number | boolean | null): string {
  if (value === null) {
    return 'Verification required';
  }

  const text = String(value);

  if (isVerificationRequired(text)) {
    return text;
  }

  return text;
}

function formatUpholstery(product: Product): string {
  const upholsteryColorways = product.colorways.filter(
    (colorway) => colorway.type === 'upholstery',
  );

  if (upholsteryColorways.length > 0) {
    return upholsteryColorways.map((colorway) => colorway.label).join(', ');
  }

  if (product.upholsteryColor) {
    return product.upholsteryColor;
  }

  return '-';
}

function formatAssembly(value: boolean | UnknownFieldValue): string {
  if (value === null || isVerificationRequired(String(value))) {
    return 'Verification required';
  }

  return value ? 'Required' : 'Not required';
}

export function getCompareFieldValue(
  product: Product,
  field: string,
): string {
  if (!product.comparisonFields.includes(field)) {
    return '-';
  }

  switch (field) {
    case 'width':
      return formatDimensionValue(product.width) ?? '-';
    case 'height':
      return formatDimensionValue(product.height) ?? '-';
    case 'depth':
      return formatDimensionValue(product.depth) ?? '-';
    case 'seatWidth':
      return formatInchesCm(product.seatWidth);
    case 'seatHeight':
      return formatInchesCm(product.seatHeight);
    case 'seatDepth':
      return formatInchesCm(product.seatDepth);
    case 'armHeight':
      return formatInchesCm(product.armHeight);
    case 'backHeight':
      return formatInchesCm(product.backHeight);
    case 'clearance':
      return formatInchesCm(product.clearance);
    case 'upholstery':
      return formatUpholstery(product);
    case 'surfaceFinish':
      return formatUnknownField(product.surfaceFinish);
    case 'storageType':
      return product.storageType
        ? formatUnknownField(product.storageType)
        : '-';
    case 'assemblyRequired':
      return formatAssembly(product.assemblyRequired);
    case 'shippingClass':
      return (
        shippingClassById[product.shippingClass]?.name ?? product.shippingClass
      );
    case 'drawerCount':
      return product.drawerCount === null
        ? 'Verification required'
        : String(product.drawerCount);
    case 'shelfCount':
      return product.shelfCount === null
        ? 'Verification required'
        : String(product.shelfCount);
    case 'doorCount':
      return product.doorCount === null
        ? 'Verification required'
        : String(product.doorCount);
    case 'seatingCapacity':
      return product.seatingCapacity === null
        ? '-'
        : formatUnknownField(product.seatingCapacity);
    case 'weightCapacity':
      return formatUnknownField(product.weightCapacity);
    case 'extensionMechanism':
      return product.extensionMechanism
        ? formatUnknownField(product.extensionMechanism)
        : '-';
    case 'packageContents':
      return formatUnknownField(product.packageContents);
    case 'boxCount':
      return formatUnknownField(product.boxCount);
    default:
      return '-';
  }
}

export function getCompareRowsForProducts(products: Product[]): string[] {
  if (products.length === 0) {
    return [];
  }

  const type = getProductCompareType(products[0]);
  const fieldSet = new Set<string>();

  for (const product of products) {
    for (const field of product.comparisonFields) {
      fieldSet.add(field);
    }
  }

  return TYPE_FIELD_ORDER[type].filter((field) => fieldSet.has(field));
}

export function groupProductsByCompareType(
  products: Product[],
): Partial<Record<ProductCompareType, Product[]>> {
  const groups: Partial<Record<ProductCompareType, Product[]>> = {};

  for (const product of products) {
    const type = getProductCompareType(product);
    groups[type] = [...(groups[type] ?? []), product];
  }

  return groups;
}
