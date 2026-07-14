import type { RoomCompatibilityGroup } from '@/lib/types';

/**
 * Compatibility groupings for the room builder.
 * Each product remains an individual SKU — no bundle discounts.
 */
export const roomCompatibilityGroups: RoomCompatibilityGroup[] = [
  {
    id: 'living-anchor',
    role: 'anchor',
    label: 'Living anchor',
    description: 'Sofa or loveseat that defines the seating wall.',
    productIds: ['hmf-liv-001', 'hmf-liv-002'],
    compatibleGroupIds: ['living-seating', 'living-table', 'living-storage', 'living-accent'],
  },
  {
    id: 'living-seating',
    role: 'seating',
    label: 'Secondary seating',
    description: 'Lounge chairs, modular seats and reading chairs.',
    productIds: ['hmf-liv-003', 'hmf-liv-004', 'hmf-liv-005'],
    compatibleGroupIds: ['living-anchor', 'living-table', 'living-storage', 'living-accent'],
  },
  {
    id: 'living-table',
    role: 'table',
    label: 'Living table',
    description: 'Coffee and nesting tables.',
    productIds: ['hmf-liv-007', 'hmf-liv-008'],
    compatibleGroupIds: ['living-anchor', 'living-seating', 'living-storage', 'living-accent'],
  },
  {
    id: 'living-storage',
    role: 'storage',
    label: 'Living storage',
    description: 'Media consoles and storage ottomans.',
    productIds: ['hmf-liv-006', 'hmf-liv-009'],
    compatibleGroupIds: ['living-anchor', 'living-seating', 'living-table', 'living-accent'],
  },
  {
    id: 'living-accent',
    role: 'flexible-accent',
    label: 'Flexible accent',
    description: 'Modular or compact accent pieces.',
    productIds: ['hmf-liv-003', 'hmf-liv-006', 'hmf-liv-008'],
    compatibleGroupIds: ['living-anchor', 'living-seating', 'living-table', 'living-storage'],
  },
  {
    id: 'bedroom-anchor',
    role: 'anchor',
    label: 'Bedroom anchor',
    description: 'Platform or storage bed.',
    productIds: ['hmf-bed-001', 'hmf-bed-002'],
    compatibleGroupIds: ['bedroom-seating', 'bedroom-storage', 'bedroom-accent'],
  },
  {
    id: 'bedroom-seating',
    role: 'seating',
    label: 'Bedroom seating',
    description: 'Bedroom benches.',
    productIds: ['hmf-bed-005'],
    compatibleGroupIds: ['bedroom-anchor', 'bedroom-storage', 'bedroom-accent'],
  },
  {
    id: 'bedroom-storage',
    role: 'storage',
    label: 'Bedroom storage',
    description: 'Nightstands, dressers and wardrobes.',
    productIds: ['hmf-bed-003', 'hmf-bed-004', 'hmf-bed-006'],
    compatibleGroupIds: ['bedroom-anchor', 'bedroom-seating', 'bedroom-accent'],
  },
  {
    id: 'bedroom-accent',
    role: 'flexible-accent',
    label: 'Bedroom accent',
    description: 'Nightstands and benches as flexible accents.',
    productIds: ['hmf-bed-003', 'hmf-bed-005'],
    compatibleGroupIds: ['bedroom-anchor', 'bedroom-seating', 'bedroom-storage'],
  },
  {
    id: 'dining-anchor',
    role: 'anchor',
    label: 'Dining table',
    description: 'Round or extendable dining table.',
    productIds: ['hmf-din-001', 'hmf-din-002'],
    compatibleGroupIds: ['dining-seating', 'dining-storage', 'dining-accent'],
  },
  {
    id: 'dining-seating',
    role: 'seating',
    label: 'Dining seating',
    description: 'Chair sets and dining benches.',
    productIds: ['hmf-din-003', 'hmf-din-004'],
    compatibleGroupIds: ['dining-anchor', 'dining-storage', 'dining-accent'],
  },
  {
    id: 'dining-storage',
    role: 'storage',
    label: 'Dining storage',
    description: 'Sideboards and buffets.',
    productIds: ['hmf-din-005'],
    compatibleGroupIds: ['dining-anchor', 'dining-seating', 'dining-accent'],
  },
  {
    id: 'dining-accent',
    role: 'flexible-accent',
    label: 'Dining accent',
    description: 'Bench seating as a flexible dining accent.',
    productIds: ['hmf-din-004'],
    compatibleGroupIds: ['dining-anchor', 'dining-seating', 'dining-storage'],
  },
  {
    id: 'entry-anchor',
    role: 'anchor',
    label: 'Entry anchor',
    description: 'Hall tree or narrow console.',
    productIds: ['hmf-ent-004', 'hmf-ent-001'],
    compatibleGroupIds: ['entry-seating', 'entry-storage', 'entry-accent'],
  },
  {
    id: 'entry-seating',
    role: 'seating',
    label: 'Entry seating',
    description: 'Storage entry benches.',
    productIds: ['hmf-ent-003'],
    compatibleGroupIds: ['entry-anchor', 'entry-storage', 'entry-accent'],
  },
  {
    id: 'entry-storage',
    role: 'storage',
    label: 'Entry storage',
    description: 'Shoe cabinets and hall storage.',
    productIds: ['hmf-ent-002', 'hmf-ent-003'],
    compatibleGroupIds: ['entry-anchor', 'entry-seating', 'entry-accent'],
  },
  {
    id: 'entry-accent',
    role: 'flexible-accent',
    label: 'Entry accent',
    description: 'Narrow consoles as flexible accents.',
    productIds: ['hmf-ent-001'],
    compatibleGroupIds: ['entry-anchor', 'entry-seating', 'entry-storage'],
  },
  {
    id: 'office-anchor',
    role: 'anchor',
    label: 'Workspace anchor',
    description: 'Foldaway or compact desk.',
    productIds: ['hmf-off-001'],
    compatibleGroupIds: ['office-storage', 'office-accent'],
  },
  {
    id: 'office-storage',
    role: 'storage',
    label: 'Workspace storage',
    description: 'Bookcases for home offices.',
    productIds: ['hmf-sto-001'],
    compatibleGroupIds: ['office-anchor', 'office-accent'],
  },
  {
    id: 'office-accent',
    role: 'flexible-accent',
    label: 'Workspace accent',
    description: 'Flexible pieces that support a work zone.',
    productIds: ['hmf-sto-001', 'hmf-liv-008'],
    compatibleGroupIds: ['office-anchor', 'office-storage'],
  },
];

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
