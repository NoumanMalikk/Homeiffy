export { storeConfig } from '@/data/store-config';

export {
  dailyMoments,
  dailyMomentBySlug,
} from '@/data/daily-moments';

export {
  categories,
  categoryBySlug,
  categoryById,
} from '@/data/categories';

export { rooms, roomBySlug, roomById } from '@/data/rooms';

export {
  navigation,
  primaryNavigation,
  footerCustomerLinks,
} from '@/data/navigation';

export {
  shippingClasses,
  shippingClassById,
} from '@/data/shipping-classes';

export {
  roomCompatibilityGroups,
  roomCompatibilityGroupById,
  getProductsForCompatibilityGroup,
  getCompatibleGroups,
} from '@/data/room-compatibility';

export {
  productSafetyRecords,
  productSafetyByProductId,
  productSafetyBySku,
} from '@/data/product-safety';

export {
  legalConfig,
  isProductionLaunchAllowed,
  getPolicyBySlug,
} from '@/data/legal-config';

export { faqItems, faqByCategory } from '@/data/faq';

export {
  imageCredits,
  imageCreditsByProductId,
  imageCreditsBySku,
} from '@/data/image-credits';

export {
  products,
  productById,
  productBySlug,
  productBySku,
  PRODUCT_COUNT,
  BRAND_COLORWAYS,
} from '@/data/products';

export {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getProductBySku,
  getProductsByMoment,
  getProductsByCategory,
  getProductsByRoom,
  filterProducts,
  sortProducts,
  searchProducts,
  isProductPurchaseable,
  validateCartItem,
  calculateFootprint,
  getFeaturedProducts,
  getRelatedProducts,
  getCrossSellProducts,
  getProductsByCompatibilityGroup,
  getDefaultColorway,
} from '@/lib/products';

export type { CartItemValidationResult } from '@/lib/products';

export * from '@/lib/types';

export {
  cn,
  formatPrice,
  formatDimensionValue,
  formatDimensions,
  formatPackageDimensions,
  formatInchesCm,
  inchesToCm,
  slugify,
  normalizeSku,
  formatPhoneLink,
  truncate,
  isVerificationRequired,
  sumNullable,
  clamp,
} from '@/lib/utils';

export { footprints, getFootprintBySlug } from '@/data/footprints';
export { functions, getFunctionBySlug } from '@/data/functions';
export { brandColors } from '@/data/brand-colors';
export { brandLines, announcementMessages, isStagingMode, isProductionMode } from '@/data/store-config';
