import type { LegalConfig } from '@/lib/types';

import { storeConfig } from '@/data/store-config';

const POLICY_PLACEHOLDER =
  '[BUSINESS REVIEW REQUIRED: insert approved policy]';

export const legalConfig: LegalConfig = {
  productionLaunchBlocked: true,
  addressVerificationRequired: true,
  addressVerificationNote: storeConfig.registeredAddress.verificationNote,
  launchBlockers: [
    'Policy pages contain business-review placeholders',
    'Registered address unit format not confirmed',
    'Product specifications pending verification',
    'Product images pending verification',
    'Safety documentation pending verification',
    'CONTACT_EMAIL environment variable not configured for production',
  ],
  policies: [
    {
      id: 'privacy-policy',
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: POLICY_PLACEHOLDER,
      lastReviewed: null,
      requiresBusinessReview: true,
    },
    {
      id: 'terms-conditions',
      slug: 'terms-conditions',
      title: 'Terms and Conditions',
      content: POLICY_PLACEHOLDER,
      lastReviewed: null,
      requiresBusinessReview: true,
    },
    {
      id: 'shipping-policy',
      slug: 'shipping-policy',
      title: 'Shipping Policy',
      content: POLICY_PLACEHOLDER,
      lastReviewed: null,
      requiresBusinessReview: true,
    },
    {
      id: 'return-refund-policy',
      slug: 'return-refund-policy',
      title: 'Return and Refund Policy',
      content: POLICY_PLACEHOLDER,
      lastReviewed: null,
      requiresBusinessReview: true,
    },
    {
      id: 'accessibility',
      slug: 'accessibility',
      title: 'Accessibility Statement',
      content: POLICY_PLACEHOLDER,
      lastReviewed: null,
      requiresBusinessReview: true,
    },
  ],
};

export function isProductionLaunchAllowed(): boolean {
  return (
    !legalConfig.productionLaunchBlocked &&
    !legalConfig.addressVerificationRequired &&
    legalConfig.policies.every((policy) => !policy.requiresBusinessReview)
  );
}

export function getPolicyBySlug(slug: string) {
  return legalConfig.policies.find((policy) => policy.slug === slug);
}
