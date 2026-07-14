import type { ShippingClass } from '@/lib/types';

export const shippingClasses: ShippingClass[] = [
  {
    id: 'small-furniture-parcel',
    name: 'Small Furniture Parcel',
    description:
      'Compact single-box items such as desk chairs, nesting table sets and small accent pieces. Rates depend on destination, weight and package dimensions.',
    requiresFreightReview: false,
    upholsteredHandling: false,
    fragileHandling: false,
  },
  {
    id: 'standard-furniture-parcel',
    name: 'Standard Furniture Parcel',
    description:
      'Mid-size furniture shipped in one or two cartons, including nightstands, consoles and dining chairs. Final carrier selection requires verified package data.',
    requiresFreightReview: false,
    upholsteredHandling: false,
    fragileHandling: false,
  },
  {
    id: 'multi-box-furniture',
    name: 'Multi-Box Furniture',
    description:
      'Larger items that ship in multiple cartons, such as dressers, sideboards, hall trees and furniture sets. Box count and coordination require supplier verification.',
    requiresFreightReview: false,
    upholsteredHandling: false,
    fragileHandling: false,
  },
  {
    id: 'oversized-furniture',
    name: 'Oversized Furniture',
    description:
      'Wide or tall pieces including platform beds, bookcases, media consoles and room dividers. Oversized handling may require additional access information.',
    requiresFreightReview: false,
    upholsteredHandling: false,
    fragileHandling: false,
  },
  {
    id: 'upholstered-furniture',
    name: 'Upholstered Furniture',
    description:
      'Padded seating and upholstered storage with additional packaging requirements. Upholstery verification must be complete before live shipment.',
    requiresFreightReview: false,
    upholsteredHandling: true,
    fragileHandling: false,
  },
  {
    id: 'fragile-surface',
    name: 'Fragile Surface',
    description:
      'Items with finish-sensitive surfaces that require protective packaging review. Applicable when supplier documentation confirms fragile handling needs.',
    requiresFreightReview: false,
    upholsteredHandling: false,
    fragileHandling: true,
  },
  {
    id: 'glass-component',
    name: 'Glass Component',
    description:
      'Products with glass panels or inserts that require verified component documentation and specialized packaging.',
    requiresFreightReview: false,
    upholsteredHandling: false,
    fragileHandling: true,
  },
  {
    id: 'freight-review-required',
    name: 'Freight Review Required',
    description:
      'Orders that require manual freight review based on combined weight, dimensions, quantity or destination access constraints.',
    requiresFreightReview: true,
    upholsteredHandling: false,
    fragileHandling: false,
  },
];

export const shippingClassById = Object.fromEntries(
  shippingClasses.map((shippingClass) => [shippingClass.id, shippingClass]),
) as Record<(typeof shippingClasses)[number]['id'], ShippingClass>;
