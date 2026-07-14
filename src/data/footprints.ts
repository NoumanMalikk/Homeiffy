export interface FootprintCategory {
  id: string;
  slug: string;
  title: string;
  shortLabel: string;
  description: string;
  href: string;
  /** Non-guaranteed guidance for filtering — confirm measurements before ordering. */
  guidance: string;
  diagram: 'compact' | 'narrow' | 'standard' | 'wide' | 'tall' | 'expandable' | 'modular' | 'wall-adjacent';
}

export const footprints: FootprintCategory[] = [
  {
    id: 'fp-compact',
    slug: 'compact',
    title: 'Compact',
    shortLabel: 'Under 36 in',
    description:
      'Furniture sized for tighter walls, alcoves and apartment layouts where every inch matters.',
    href: '/footprints/compact',
    guidance: 'Typically under 36 inches in the primary footprint dimension.',
    diagram: 'compact',
  },
  {
    id: 'fp-narrow',
    slug: 'narrow',
    title: 'Narrow',
    shortLabel: 'Under 16 in deep',
    description:
      'Shallower pieces for entryways, hallways and wall-adjacent placements.',
    href: '/footprints/narrow',
    guidance: 'Typically under 16 inches deep.',
    diagram: 'narrow',
  },
  {
    id: 'fp-standard',
    slug: 'standard',
    title: 'Standard',
    shortLabel: 'Standard room pieces',
    description:
      'Familiar proportions for everyday living rooms, bedrooms and dining areas.',
    href: '/footprints/standard',
    guidance: 'Standard furniture footprint ranges for typical residential rooms.',
    diagram: 'standard',
  },
  {
    id: 'fp-wide',
    slug: 'wide',
    title: 'Wide',
    shortLabel: 'Wide anchor furniture',
    description:
      'Longer anchor pieces that define seating, media or dining walls.',
    href: '/footprints/wide',
    guidance: 'Wider primary dimension relative to compact alternatives.',
    diagram: 'wide',
  },
  {
    id: 'fp-tall',
    slug: 'tall',
    title: 'Tall and Vertical',
    shortLabel: 'Vertical storage',
    description:
      'Upright bookcases, wardrobes and hall storage that use wall height.',
    href: '/footprints/tall',
    guidance: 'Emphasizes height over floor footprint.',
    diagram: 'tall',
  },
  {
    id: 'fp-expandable',
    slug: 'expandable',
    title: 'Expandable',
    shortLabel: 'Expandable furniture',
    description:
      'Drop-leaf, extendable and lift-top pieces that change footprint when in use.',
    href: '/footprints/expandable',
    guidance: 'Review both closed and extended dimensions before ordering.',
    diagram: 'expandable',
  },
  {
    id: 'fp-modular',
    slug: 'modular',
    title: 'Modular',
    shortLabel: 'Modular furniture',
    description:
      'Modules and coordinating pieces that can be rearranged as rooms change.',
    href: '/footprints/modular',
    guidance: 'Each module remains an individual SKU.',
    diagram: 'modular',
  },
  {
    id: 'fp-wall-adjacent',
    slug: 'wall-adjacent',
    title: 'Wall-Adjacent',
    shortLabel: 'Wall-adjacent',
    description:
      'Consoles, desks and storage designed to sit flush along a wall.',
    href: '/footprints/wall-adjacent',
    guidance: 'Intended for placement along a wall; confirm clearance.',
    diagram: 'wall-adjacent',
  },
];

export function getFootprintBySlug(slug: string): FootprintCategory | undefined {
  return footprints.find((item) => item.slug === slug);
}
