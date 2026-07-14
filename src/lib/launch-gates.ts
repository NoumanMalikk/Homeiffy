import { legalConfig } from '@/data/legal-config';
import { storeConfig } from '@/data/store-config';
import { products } from '@/data/products';
import { isStripeConfigured, isStripeStagingSafe } from '@/lib/stripe';

export interface LaunchGateResult {
  allowed: boolean;
  blockers: string[];
}

const POLICY_PLACEHOLDER = '[BUSINESS REVIEW REQUIRED: insert approved policy]';

/**
 * Confirms the registered address unit format has been reviewed.
 * Derived from storeConfig and legalConfig launch requirements.
 */
export function isAddressUnitFormatConfirmed(): boolean {
  if (legalConfig.addressVerificationRequired) {
    return false;
  }

  const note = storeConfig.registeredAddress.verificationNote.toLowerCase();

  return !(
    note.includes('without an apartment') ||
    note.includes('unit format not confirmed') ||
    note.includes('confirm the exact address formatting')
  );
}

function hasLegalPlaceholders(): boolean {
  return legalConfig.policies.some(
    (policy) =>
      policy.requiresBusinessReview ||
      policy.content.includes(POLICY_PLACEHOLDER),
  );
}

function hasUnverifiedProductsForLive(): boolean {
  if (storeConfig.siteEnv !== 'production') {
    return false;
  }

  return products.some((product) => !product.productionReady);
}

function isContactEmailConfigured(): boolean {
  return Boolean(process.env.CONTACT_EMAIL ?? storeConfig.contactEmail);
}

export function canLaunchProduction(): LaunchGateResult {
  const blockers: string[] = [];

  if (legalConfig.productionLaunchBlocked) {
    blockers.push('Production launch is explicitly blocked in legalConfig.');
  }

  if (!isAddressUnitFormatConfirmed()) {
    blockers.push(
      'Registered address unit format is not confirmed for production launch.',
    );
  }

  if (hasLegalPlaceholders()) {
    blockers.push('One or more legal policies still contain review placeholders.');
  }

  if (hasUnverifiedProductsForLive()) {
    blockers.push(
      'Live store mode requires all catalog products to be productionReady.',
    );
  }

  if (!isStripeConfigured()) {
    blockers.push('STRIPE_SECRET_KEY is not configured.');
  } else if (!isStripeStagingSafe()) {
    blockers.push(
      'Stripe live keys are configured while the storefront is not in live mode.',
    );
  }

  if (!isContactEmailConfigured()) {
    blockers.push('CONTACT_EMAIL is not configured for production notifications.');
  }

  if (!process.env.RESEND_API_KEY) {
    blockers.push('RESEND_API_KEY is not configured for transactional email.');
  }

  for (const configuredBlocker of legalConfig.launchBlockers) {
    if (!blockers.includes(configuredBlocker)) {
      blockers.push(configuredBlocker);
    }
  }

  return {
    allowed: blockers.length === 0,
    blockers,
  };
}
