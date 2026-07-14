import type { Room } from '@/lib/types';

export const rooms: Room[] = [
  {
    id: 'living-room',
    slug: 'living-room',
    title: 'Living Room',
    description:
      'Lounge seating, ottomans, side tables and media furniture for everyday living.',
    collectionPath: '/collections/living-room',
  },
  {
    id: 'bedroom',
    slug: 'bedroom',
    title: 'Bedroom',
    description: 'Beds, nightstands, dressers and upholstered bed benches.',
    collectionPath: '/collections/bedroom',
  },
  {
    id: 'dining-room',
    slug: 'dining-room',
    title: 'Dining Room',
    description: 'Tables, chairs, benches and sideboards for shared meals.',
    collectionPath: '/collections/dining',
  },
  {
    id: 'small-dining-area',
    slug: 'small-dining-area',
    title: 'Small Dining Area',
    description: 'Compact and extendable tables for smaller dining spaces.',
    collectionPath: '/collections/small-space-dining',
  },
  {
    id: 'kitchen',
    slug: 'kitchen',
    title: 'Kitchen',
    description: 'Drop-leaf and compact dining tables suited to kitchen dining nooks.',
    collectionPath: '/collections/small-space-dining',
  },
  {
    id: 'flexible-living-area',
    slug: 'flexible-living-area',
    title: 'Flexible Living Area',
    description: 'Furniture that adapts between dining, lounge and work functions.',
    collectionPath: '/collections/living-room',
  },
  {
    id: 'entryway',
    slug: 'entryway',
    title: 'Entryway',
    description: 'Benches, consoles, shoe cabinets and hall storage for arrivals.',
    collectionPath: '/collections/entryway',
  },
  {
    id: 'hallway',
    slug: 'hallway',
    title: 'Hallway',
    description: 'Narrow consoles, benches and shoe storage for transitional spaces.',
    collectionPath: '/collections/entryway',
  },
  {
    id: 'mudroom-style-area',
    slug: 'mudroom-style-area',
    title: 'Mudroom-Style Area',
    description: 'Hall trees and durable entry storage for outerwear and daily items.',
    collectionPath: '/collections/entryway',
  },
  {
    id: 'home-office',
    slug: 'home-office',
    title: 'Home Office',
    description: 'Desks, desk chairs and bookcases for focused work at home.',
    collectionPath: '/collections/home-office',
  },
  {
    id: 'small-home-office',
    slug: 'small-home-office',
    title: 'Small Home Office',
    description: 'Compact and foldaway desks for limited workspace footprints.',
    collectionPath: '/collections/home-office',
  },
  {
    id: 'bedroom-workspace',
    slug: 'bedroom-workspace',
    title: 'Bedroom Workspace',
    description: 'Writing desks and desk chairs sized for bedroom work corners.',
    collectionPath: '/collections/home-office',
  },
  {
    id: 'home-workspace',
    slug: 'home-workspace',
    title: 'Home Workspace',
    description: 'Consoles and chairs that support reading and writing at home.',
    collectionPath: '/collections/home-office',
  },
  {
    id: 'living-area',
    slug: 'living-area',
    title: 'Living Area',
    description: 'Desks and consoles that fit open living layouts.',
    collectionPath: '/collections/living-room',
  },
  {
    id: 'reading-area',
    slug: 'reading-area',
    title: 'Reading Area',
    description: 'Lounge chairs, loveseats and side tables for quiet reading.',
    collectionPath: '/collections/lounge-chairs',
  },
  {
    id: 'home-office-lounge',
    slug: 'home-office-lounge',
    title: 'Home Office Lounge',
    description: 'Compact loveseats for lounge seating near a workspace.',
    collectionPath: '/collections/loveseats',
  },
  {
    id: 'flexible-lounge',
    slug: 'flexible-lounge',
    title: 'Flexible Lounge',
    description: 'Modular seating that can be rearranged within a lounge layout.',
    collectionPath: '/collections/modular-seating',
  },
  {
    id: 'studio-apartment',
    slug: 'studio-apartment',
    title: 'Studio Apartment',
    description: 'Room dividers and flexible storage for single-room layouts.',
    collectionPath: '/collections/storage',
  },
  {
    id: 'dining-area',
    slug: 'dining-area',
    title: 'Dining Area',
    description: 'Mobile storage and flexible tables for multi-use dining zones.',
    collectionPath: '/collections/dining',
  },
];

export const roomBySlug = Object.fromEntries(
  rooms.map((room) => [room.slug, room]),
) as Record<string, Room>;

export const roomById = Object.fromEntries(
  rooms.map((room) => [room.id, room]),
) as Record<string, Room>;
