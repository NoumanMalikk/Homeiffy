import type { NavSection } from '@/lib/types';

export const navigation: NavSection[] = [
  {
    id: 'living',
    label: 'Living',
    href: '/collections/living-room',
    children: [
      { label: 'Apartment Sofas', href: '/collections/sofas', description: 'Compact sofas for living rooms' },
      { label: 'Loveseats', href: '/collections/loveseats', description: 'Two-seat upholstered seating' },
      { label: 'Modular Seating', href: '/collections/modular-seating', description: 'Armless modules for flexible layouts' },
      { label: 'Lounge Chairs', href: '/collections/lounge-chairs', description: 'Curved-back and reading chairs' },
      { label: 'Ottomans', href: '/collections/ottomans', description: 'Storage and lounge ottomans' },
      { label: 'Coffee Tables', href: '/collections/coffee-tables', description: 'Lift-top and coffee tables' },
      { label: 'Side Tables', href: '/collections/side-tables', description: 'Nesting and side tables' },
      { label: 'Media Furniture', href: '/collections/media-furniture', description: 'Low media consoles' },
    ],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    href: '/collections/bedroom',
    children: [
      { label: 'Platform Beds', href: '/collections/beds', description: 'Queen platform beds' },
      { label: 'Storage Beds', href: '/collections/beds', description: 'Beds with verified storage' },
      { label: 'Nightstands', href: '/collections/nightstands', description: 'Two-drawer bedside tables' },
      { label: 'Dressers', href: '/collections/dressers', description: 'Multi-drawer bedroom storage' },
      { label: 'Bedroom Benches', href: '/collections/bedroom-benches', description: 'Upholstered bedroom benches' },
      { label: 'Wardrobes', href: '/collections/wardrobes', description: 'Compact wardrobes and armoires' },
    ],
  },
  {
    id: 'dining',
    label: 'Dining',
    href: '/collections/dining',
    children: [
      { label: 'Dining Tables', href: '/collections/dining-tables', description: 'Round and extendable tables' },
      { label: 'Extendable Tables', href: '/collections/dining-tables', description: 'Drop-leaf and extendable dining' },
      { label: 'Dining Chairs', href: '/collections/dining-chairs', description: 'Exact-set dining chairs' },
      { label: 'Dining Benches', href: '/collections/dining-benches', description: 'Upholstered dining benches' },
      { label: 'Sideboards', href: '/collections/sideboards', description: 'Dining and living storage' },
      { label: 'Bar and Counter Seating', href: '/collections/dining', description: 'Additional dining seating when available' },
    ],
  },
  {
    id: 'entryway',
    label: 'Entryway',
    href: '/collections/entryway',
    children: [
      { label: 'Console Tables', href: '/collections/consoles', description: 'Narrow entry consoles' },
      { label: 'Entry Benches', href: '/collections/entryway', description: 'Storage benches for entries' },
      { label: 'Shoe Cabinets', href: '/collections/shoe-storage', description: 'Tilt-out shoe storage' },
      { label: 'Hall Trees', href: '/collections/hall-trees', description: 'Coat and hall storage' },
      { label: 'Narrow Storage', href: '/collections/consoles', description: 'Shallow-depth hallway pieces' },
    ],
  },
  {
    id: 'home-office',
    label: 'Home Office',
    href: '/collections/home-office',
    children: [
      { label: 'Writing Desks', href: '/collections/desks', description: 'Fixed writing desks' },
      { label: 'Compact Desks', href: '/collections/desks', description: 'Foldaway and wall-adjacent desks' },
      { label: 'Desk Chairs', href: '/collections/desk-chairs', description: 'Home-office seating' },
      { label: 'Bookcases', href: '/collections/bookcases', description: 'Open shelving with verified shelf counts' },
      { label: 'Mobile Storage', href: '/collections/storage', description: 'Flexible storage for workspaces' },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    href: '/collections/storage',
    children: [
      { label: 'Bookcases', href: '/collections/bookcases', description: 'Open bookcases and room shelves' },
      { label: 'Sideboards', href: '/collections/sideboards', description: 'Closed storage cabinets' },
      { label: 'Cabinets', href: '/collections/storage', description: 'Cabinets and wardrobe storage' },
      { label: 'Room Dividers', href: '/collections/bookcases', description: 'Tall open shelving' },
      { label: 'Storage Benches', href: '/collections/entryway', description: 'Benches with enclosed storage' },
      { label: 'Storage Ottomans', href: '/collections/ottomans', description: 'Ottomans with storage' },
    ],
  },
  {
    id: 'shop-by-footprint',
    label: 'Shop by Footprint',
    href: '/footprints/compact',
    children: [
      { label: 'Compact', href: '/footprints/compact', description: 'Under 36 inches' },
      { label: 'Narrow', href: '/footprints/narrow', description: 'Under 16 inches deep' },
      { label: 'Standard', href: '/footprints/standard', description: 'Standard room pieces' },
      { label: 'Wide', href: '/footprints/wide', description: 'Wide anchor furniture' },
      { label: 'Tall and Vertical', href: '/footprints/tall', description: 'Vertical storage' },
      { label: 'Expandable', href: '/footprints/expandable', description: 'Expandable furniture' },
      { label: 'Modular', href: '/footprints/modular', description: 'Modular seating and sets' },
      { label: 'Wall-Adjacent', href: '/footprints/wall-adjacent', description: 'Wall-aligned pieces' },
    ],
  },
  {
    id: 'customer-information',
    label: 'Customer Information',
    children: [
      { label: 'Materials and Finishes', href: '/materials-finishes' },
      { label: 'Upholstery and Care', href: '/upholstery-care' },
      { label: 'Measuring Guide', href: '/measuring-guide' },
      { label: 'Doorway Fit Guide', href: '/doorway-fit-guide' },
      { label: 'Assembly Information', href: '/assembly-information' },
      { label: 'Furniture Safety', href: '/furniture-safety' },
      { label: 'Shipping', href: '/shipping-policy' },
      { label: 'Returns', href: '/return-refund-policy' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export const primaryNavigation = navigation.filter((section) =>
  [
    'living',
    'bedroom',
    'dining',
    'entryway',
    'home-office',
    'storage',
    'shop-by-footprint',
  ].includes(section.id),
);

export const footerCustomerLinks =
  navigation.find((section) => section.id === 'customer-information')?.children ??
  [];

export const toolLinks = [
  { label: 'Room Builder', href: '/room-builder' },
  { label: 'Room Fit Finder', href: '/room-fit-finder' },
  { label: 'Doorway Fit Checker', href: '/doorway-fit-checker' },
  { label: 'Compare', href: '/compare' },
  { label: 'Wishlist', href: '/wishlist' },
] as const;
