// Homeiffy LLC - core domain types for the furniture catalog and commerce layer.

export type SiteEnv = 'staging' | 'production';

export type DailyMomentSlug =
  | 'arrive'
  | 'gather'
  | 'focus'
  | 'unwind'
  | 'restore'
  | 'reset';

export type ColorwayType = 'finish' | 'upholstery';

export interface Colorway {
  id: string;
  label: string;
  type: ColorwayType;
  hex: string;
}

export type UnknownFieldValue =
  | 'Verification required'
  | 'Pending manufacturing specification'
  | 'Pending supplier documentation'
  | 'Pending physical product inspection'
  | null;

export type ImageVerificationStatus = 'pending' | 'verified' | 'missing';

export type SpecificationVerificationStatus = 'pending' | 'verified';

export type SafetyVerificationStatus = 'pending' | 'verified';

export type ShippingClassId =
  | 'small-furniture-parcel'
  | 'standard-furniture-parcel'
  | 'multi-box-furniture'
  | 'oversized-furniture'
  | 'upholstered-furniture'
  | 'fragile-surface'
  | 'glass-component'
  | 'freight-review-required';

export interface PackageDimensions {
  width: number | null;
  height: number | null;
  depth: number | null;
  unit: 'in';
  note?: string;
}

export type ProductImageType =
  | 'main'
  | 'front'
  | 'side'
  | 'back'
  | 'detail'
  | 'open-storage'
  | 'closed-storage'
  | 'extended'
  | 'closed'
  | 'dimensions'
  | 'lifestyle'
  | 'placeholder';

export interface ProductImage {
  src: string;
  alt: string;
  type: ProductImageType;
  finishId?: string;
  upholsteryId?: string;
  note?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  supplierSku: UnknownFieldValue | string;
  title: string;
  verifiedProductTitle: string | null;
  manufacturerModel: UnknownFieldValue | string;
  purchaseEnabled: boolean;
  availability: 'available' | 'pending-verification' | 'unavailable';
  category: string;
  subcategory: string;
  dailyMoments: DailyMomentSlug[];
  rooms: string[];
  footprintCategory: string[];
  functions: string[];
  style: string;
  materials: UnknownFieldValue | string;
  woodSpecies: UnknownFieldValue;
  woodConstruction: UnknownFieldValue;
  frameMaterial: UnknownFieldValue;
  surfaceFinish: UnknownFieldValue | string;
  upholsteryMaterial: UnknownFieldValue;
  upholsteryColor: string | null;
  foamSpecification: UnknownFieldValue;
  colorways: Colorway[];
  width: number | null;
  height: number | null;
  depth: number | null;
  seatWidth: number | null;
  seatHeight: number | null;
  seatDepth: number | null;
  armHeight: number | null;
  backHeight: number | null;
  clearance: number | null;
  weight: UnknownFieldValue;
  packageDimensions: PackageDimensions;
  packageWeight: UnknownFieldValue;
  boxCount: number | UnknownFieldValue;
  assemblyRequired: boolean | UnknownFieldValue;
  assemblyInstructions: UnknownFieldValue;
  hardwareIncluded: UnknownFieldValue;
  toolsRequired: UnknownFieldValue;
  weightCapacity: UnknownFieldValue;
  seatingCapacity: number | UnknownFieldValue;
  extensionMechanism: UnknownFieldValue | string;
  storageType: UnknownFieldValue | string | null;
  drawerCount: number | null;
  shelfCount: number | null;
  doorCount: number | null;
  orientation: string | null;
  careInstructions: UnknownFieldValue;
  countryOfOrigin: UnknownFieldValue;
  manufacturer: UnknownFieldValue;
  packageContents: UnknownFieldValue | string;
  warnings: UnknownFieldValue;
  shippingClass: ShippingClassId;
  price: number;
  currency: string;
  imageGallery: ProductImage[];
  imageSourceRecord: UnknownFieldValue;
  imageVerificationStatus: ImageVerificationStatus;
  specificationVerificationStatus: SpecificationVerificationStatus;
  safetyVerificationStatus: SafetyVerificationStatus;
  productionReady: boolean;
  featured: boolean;
  newArrival: boolean;
  relatedProductIds: string[];
  crossSellProductIds: string[];
  comparisonFields: string[];
  roomCompatibilityIds: string[];
  searchKeywords: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface DailyMoment {
  slug: DailyMomentSlug;
  title: string;
  shortCopy: string;
  accentColor: string;
  productSkus: string[];
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  parentId: string | null;
  roomIds: string[];
  momentSlugs: DailyMomentSlug[];
  collectionPath: string;
}

export interface Room {
  id: string;
  slug: string;
  title: string;
  description: string;
  collectionPath: string;
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavSection {
  id: string;
  label: string;
  href?: string;
  children?: NavLink[];
}

export interface ShippingClass {
  id: ShippingClassId;
  name: string;
  description: string;
  requiresFreightReview: boolean;
  upholsteredHandling: boolean;
  fragileHandling: boolean;
}

export interface RoomCompatibilityGroup {
  id: string;
  role: 'anchor' | 'seating' | 'storage' | 'table' | 'flexible-accent';
  label: string;
  description: string;
  productIds: string[];
  compatibleGroupIds: string[];
}

export interface ProductSafetyRecord {
  productId: string;
  sku: string;
  weightCapacity: UnknownFieldValue;
  tipOverRisk: UnknownFieldValue;
  wallAnchoring: UnknownFieldValue;
  drawerSafety: UnknownFieldValue;
  shelfLoad: UnknownFieldValue;
  casterLocks: UnknownFieldValue;
  foldingMechanism: UnknownFieldValue;
  extensionMechanism: UnknownFieldValue;
  pinchPoints: UnknownFieldValue;
  storageHinges: UnknownFieldValue;
  glassComponents: UnknownFieldValue;
  sharpCorners: UnknownFieldValue;
  assemblyHardware: UnknownFieldValue;
  flammabilityDocumentation: UnknownFieldValue;
  manufacturerWarnings: UnknownFieldValue;
  recallStatus: UnknownFieldValue;
  verificationStatus: SafetyVerificationStatus;
  notes: string;
}

export interface ImageCreditRecord {
  productId: string;
  sku: string;
  title: string;
  exactDimensions: string;
  exactConfiguration: string;
  exactFinish: string;
  exactUpholstery: string;
  exactSetCount: string;
  exactPackageContents: string;
  sourceOrganization: UnknownFieldValue | string;
  sourceUrl: UnknownFieldValue | string;
  permissionBasis: UnknownFieldValue | string;
  dateObtained: UnknownFieldValue | string;
  dateVerified: UnknownFieldValue | string;
  verifiedBy: UnknownFieldValue | string;
  productionStatus: 'blocked' | 'pending' | 'approved';
  notes: string;
}

export interface PolicyDocument {
  id: string;
  slug: string;
  title: string;
  content: string;
  lastReviewed: null;
  requiresBusinessReview: boolean;
}

export interface LegalConfig {
  productionLaunchBlocked: boolean;
  addressVerificationRequired: boolean;
  addressVerificationNote: string;
  policies: PolicyDocument[];
  launchBlockers: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface RegisteredAddress {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  verificationNote: string;
}

export interface StoreConfig {
  legalName: string;
  brandName: string;
  tagline: string;
  ownerName: null;
  showOwnerNamePublicly: false;
  phoneDisplay: string;
  phoneE164: string;
  registeredAddress: RegisteredAddress;
  publicLocationLabel: string;
  showFullBusinessAddress: boolean;
  isPublicStorefront: boolean;
  isPublicShowroom: boolean;
  localPickupEnabled: false;
  localDeliveryEnabled: false;
  whiteGloveDeliveryEnabled: false;
  assemblyServiceEnabled: false;
  designServiceEnabled: false;
  customFurnitureEnabled: false;
  contactEmail: string | null;
  currency: string;
  defaultCountry: string;
  siteEnv: SiteEnv;
}

export interface CartItem {
  productId: string;
  sku: string;
  slug: string;
  title: string;
  quantity: number;
  unitPrice: number;
  selectedFinishId: string | null;
  selectedUpholsteryId: string | null;
  selectedConfiguration: string | null;
  dimensionsSnapshot: {
    width: number | null;
    height: number | null;
    depth: number | null;
  };
  boxCount: number | UnknownFieldValue;
  shippingClass: ShippingClassId;
  assemblyRequired: boolean | UnknownFieldValue;
  productionReady: boolean;
}

export interface WishlistItem {
  productId: string;
  sku: string;
  slug: string;
  title: string;
  addedAt: string;
  selectedFinishId: string | null;
  selectedUpholsteryId: string | null;
  selectedConfiguration: string | null;
}

export interface CompareItem {
  productId: string;
  sku: string;
  slug: string;
  title: string;
  addedAt: string;
}

export type OrderStatus =
  | 'order-received'
  | 'payment-confirmed'
  | 'processing'
  | 'preparing-for-shipment'
  | 'shipping-review-required'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderLineItem {
  productId: string;
  sku: string;
  supplierSku: string | UnknownFieldValue;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  selectedFinishId: string | null;
  selectedUpholsteryId: string | null;
  selectedConfiguration: string | null;
  dimensionsSnapshot: {
    width: number | null;
    height: number | null;
    depth: number | null;
  };
  boxCount: number | UnknownFieldValue;
  shippingClass: ShippingClassId;
  packageWeight: UnknownFieldValue;
  packageDimensions: PackageDimensions;
  assemblyRequired: boolean | UnknownFieldValue;
  safetyVerificationStatus: SafetyVerificationStatus;
}

export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  reference: string;
  paymentProviderReference: string | null;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  companyName: string | null;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  lineItems: OrderLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequestLineItem {
  productId: string;
  sku: string;
  title: string;
  finishId: string | null;
  upholsteryId: string | null;
  configuration: string | null;
  quantity: number;
}

export interface QuoteRequest {
  contactName: string;
  companyName: string | null;
  email: string;
  phone: string;
  shippingPostalCode: string;
  lineItems: QuoteRequestLineItem[];
  buildingType: string | null;
  floorLevel: string | null;
  elevatorAvailable: boolean | null;
  loadingDockAvailable: boolean | null;
  requestedDeliveryWindow: string | null;
  additionalDetails: string | null;
  contactConsent: boolean;
  privacyAcknowledged: boolean;
}

export type ProductSortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'width-asc'
  | 'depth-asc'
  | 'height-asc';

export interface ProductFilters {
  dailyMoments?: DailyMomentSlug[];
  rooms?: string[];
  footprints?: string[];
  functions?: string[];
  categories?: string[];
  subcategories?: string[];
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  minDepth?: number;
  maxDepth?: number;
  minPrice?: number;
  maxPrice?: number;
  shippingClasses?: ShippingClassId[];
  assemblyRequired?: boolean;
  productionReady?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  searchQuery?: string;
}

export interface FootprintResult {
  width: number;
  depth: number;
  height: number;
  productCount: number;
  note: string;
}
