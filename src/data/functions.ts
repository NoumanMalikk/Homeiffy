export interface FunctionCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
}

export const functions: FunctionCategory[] = [
  {
    id: 'fn-sit',
    slug: 'sit',
    title: 'Sit',
    description: 'Sofas, loveseats, lounge chairs, benches and modular seating.',
    href: '/shop?function=sit',
  },
  {
    id: 'fn-gather',
    slug: 'gather',
    title: 'Gather',
    description: 'Dining tables, chairs, benches and sideboards for shared meals.',
    href: '/shop?function=gather',
  },
  {
    id: 'fn-store',
    slug: 'store',
    title: 'Store',
    description: 'Dressers, cabinets, bookcases, ottomans and entry storage.',
    href: '/shop?function=store',
  },
  {
    id: 'fn-work',
    slug: 'work',
    title: 'Work',
    description: 'Desks, desk chairs and storage for home workspaces.',
    href: '/shop?function=work',
  },
  {
    id: 'fn-rest',
    slug: 'rest',
    title: 'Rest',
    description: 'Beds, nightstands and bedroom pieces for quiet rooms.',
    href: '/shop?function=rest',
  },
  {
    id: 'fn-divide',
    slug: 'divide',
    title: 'Divide',
    description: 'Open shelving and tall storage that help define zones.',
    href: '/shop?function=divide',
  },
  {
    id: 'fn-transform',
    slug: 'transform',
    title: 'Transform',
    description:
      'Lift-top, drop-leaf, foldaway and expandable furniture with verified mechanisms.',
    href: '/shop?function=transform',
  },
];

export function getFunctionBySlug(slug: string): FunctionCategory | undefined {
  return functions.find((item) => item.slug === slug);
}
