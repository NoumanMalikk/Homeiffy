import type { StoreConfig } from '@/lib/types';

export const storeConfig: StoreConfig = {
  legalName: 'Homeiffy LLC',
  brandName: 'Homeiffy',
  tagline: 'Furniture that earns its space.',
  ownerName: null,
  showOwnerNamePublicly: false,
  phoneDisplay: '(202) 938-3566',
  phoneE164: '+12029383566',
  registeredAddress: {
    line1: '4318 HWY 21',
    city: 'Burkville',
    state: 'AL',
    postalCode: '36752',
    country: 'United States',
    verificationNote:
      'Registered or mailing address supplied by the business. Not presented as a public showroom, storefront, warehouse, or pickup location.',
  },
  publicLocationLabel: 'Burkville, Alabama',
  showFullBusinessAddress: false,
  isPublicStorefront: false,
  isPublicShowroom: false,
  localPickupEnabled: false,
  localDeliveryEnabled: false,
  whiteGloveDeliveryEnabled: false,
  assemblyServiceEnabled: false,
  designServiceEnabled: false,
  customFurnitureEnabled: false,
  contactEmail: process.env.CONTACT_EMAIL ?? null,
  /**
   * Customer-facing support address shown in policies, the footer and email.
   * Override with CONTACT_EMAIL so the published address always matches the
   * inbox that is actually monitored.
   */
  supportEmail: process.env.CONTACT_EMAIL ?? 'support@homeiffy.com',
  currency: 'USD',
  defaultCountry: 'United States',
  siteEnv:
    (process.env.NEXT_PUBLIC_SITE_ENV as 'staging' | 'production' | undefined) ??
    'production',
};

export const brandLines = {
  primary: 'Furniture that earns its space.',
  supporting: 'Clear dimensions. Exact products. Better room decisions.',
  seal: 'Homeiffy • Furniture for Real Rooms',
} as const;

export const announcementMessages = [
  'Furniture with exact dimensions and product imagery',
  'Secure online checkout',
  'Shipping calculated by item size and destination',
  'Measure your room and delivery route before ordering',
] as const;

export function isStagingMode(): boolean {
  return storeConfig.siteEnv !== 'production';
}

export function isProductionMode(): boolean {
  return storeConfig.siteEnv === 'production';
}
