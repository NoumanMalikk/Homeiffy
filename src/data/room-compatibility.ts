import type { RoomCompatibilityGroup } from '@/lib/types';

import { products } from '@/data/products';

/**
 * Compatibility groupings for the room builder.
 * Each product remains an individual SKU. No bundle discounts.
 *
 * Membership is derived from `product.roomCompatibilityIds` rather than listed
 * here, so a group can never drift out of sync with the catalog when a product
 * is added or recategorised.
 */
const groupDefinitions: Omit<RoomCompatibilityGroup, 'productIds'>[] = [
  {
    id: 'living-anchor',
    role: 'anchor',
    label: 'Living anchor',
    description: 'Sofa or loveseat that defines the seating wall.',
    compatibleGroupIds: ['living-seating', 'living-table', 'living-storage', 'living-accent'],
  },
  {
    id: 'living-seating',
    role: 'seating',
    label: 'Secondary seating',
    description: 'Lounge chairs, modular seats and reading chairs.',
    compatibleGroupIds: ['living-anchor', 'living-table', 'living-storage', 'living-accent'],
  },
  {
    id: 'living-table',
    role: 'table',
    label: 'Living table',
    description: 'Coffee and nesting tables.',
    compatibleGroupIds: ['living-anchor', 'living-seating', 'living-storage', 'living-accent'],
  },
  {
    id: 'living-storage',
    role: 'storage',
    label: 'Living storage',
    description: 'Media consoles and storage ottomans.',
    compatibleGroupIds: ['living-anchor', 'living-seating', 'living-table', 'living-accent'],
  },
  {
    id: 'living-accent',
    role: 'flexible-accent',
    label: 'Flexible accent',
    description: 'Modular or compact accent pieces.',
    compatibleGroupIds: ['living-anchor', 'living-seating', 'living-table', 'living-storage'],
  },
  {
    id: 'bedroom-anchor',
    role: 'anchor',
    label: 'Bedroom anchor',
    description: 'Platform or storage bed.',
    compatibleGroupIds: ['bedroom-seating', 'bedroom-storage', 'bedroom-accent'],
  },
  {
    id: 'bedroom-seating',
    role: 'seating',
    label: 'Bedroom seating',
    description: 'Bedroom benches.',
    compatibleGroupIds: ['bedroom-anchor', 'bedroom-storage', 'bedroom-accent'],
  },
  {
    id: 'bedroom-storage',
    role: 'storage',
    label: 'Bedroom storage',
    description: 'Nightstands, dressers and wardrobes.',
    compatibleGroupIds: ['bedroom-anchor', 'bedroom-seating', 'bedroom-accent'],
  },
  {
    id: 'bedroom-accent',
    role: 'flexible-accent',
    label: 'Bedroom accent',
    description: 'Nightstands and benches as flexible accents.',
    compatibleGroupIds: ['bedroom-anchor', 'bedroom-seating', 'bedroom-storage'],
  },
  {
    id: 'dining-anchor',
    role: 'anchor',
    label: 'Dining table',
    description: 'Round or extendable dining table.',
    compatibleGroupIds: ['dining-seating', 'dining-storage', 'dining-accent'],
  },
  {
    id: 'dining-seating',
    role: 'seating',
    label: 'Dining seating',
    description: 'Chair sets and dining benches.',
    compatibleGroupIds: ['dining-anchor', 'dining-storage', 'dining-accent'],
  },
  {
    id: 'dining-storage',
    role: 'storage',
    label: 'Dining storage',
    description: 'Sideboards and buffets.',
    compatibleGroupIds: ['dining-anchor', 'dining-seating', 'dining-accent'],
  },
  {
    id: 'dining-accent',
    role: 'flexible-accent',
    label: 'Dining accent',
    description: 'Bench seating as a flexible dining accent.',
    compatibleGroupIds: ['dining-anchor', 'dining-seating', 'dining-storage'],
  },
  {
    id: 'entry-anchor',
    role: 'anchor',
    label: 'Entry anchor',
    description: 'Hall tree or narrow console.',
    compatibleGroupIds: ['entry-seating', 'entry-storage', 'entry-accent'],
  },
  {
    id: 'entry-seating',
    role: 'seating',
    label: 'Entry seating',
    description: 'Storage entry benches.',
    compatibleGroupIds: ['entry-anchor', 'entry-storage', 'entry-accent'],
  },
  {
    id: 'entry-storage',
    role: 'storage',
    label: 'Entry storage',
    description: 'Shoe cabinets and hall storage.',
    compatibleGroupIds: ['entry-anchor', 'entry-seating', 'entry-accent'],
  },
  {
    id: 'entry-accent',
    role: 'flexible-accent',
    label: 'Entry accent',
    description: 'Narrow consoles as flexible accents.',
    compatibleGroupIds: ['entry-anchor', 'entry-seating', 'entry-storage'],
  },
  {
    id: 'office-anchor',
    role: 'anchor',
    label: 'Workspace anchor',
    description: 'Foldaway or compact desk.',
    compatibleGroupIds: ['office-storage', 'office-accent'],
  },
  {
    id: 'office-storage',
    role: 'storage',
    label: 'Workspace storage',
    description: 'Bookcases for home offices.',
    compatibleGroupIds: ['office-anchor', 'office-accent'],
  },
  {
    id: 'office-accent',
    role: 'flexible-accent',
    label: 'Workspace accent',
    description: 'Flexible pieces that support a work zone.',
    compatibleGroupIds: ['office-anchor', 'office-storage'],
  },
];

export const roomCompatibilityGroups: RoomCompatibilityGroup[] =
  groupDefinitions.map((group) => ({
    ...group,
    productIds: products
      .filter((product) => product.roomCompatibilityIds.includes(group.id))
      .map((product) => product.id),
  }));

export const roomCompatibilityGroupById = Object.fromEntries(
  roomCompatibilityGroups.map((group) => [group.id, group]),
) as Record<string, RoomCompatibilityGroup>;

export function getProductsForCompatibilityGroup(groupId: string): string[] {
  return roomCompatibilityGroupById[groupId]?.productIds ?? [];
}

export function getCompatibleGroups(groupId: string): RoomCompatibilityGroup[] {
  const group = roomCompatibilityGroupById[groupId];
  if (!group) return [];
  return group.compatibleGroupIds
    .map((id) => roomCompatibilityGroupById[id])
    .filter(Boolean);
}
