import { legalConfig } from '@/data/legal-config';
import { storeConfig } from '@/data/store-config';
import { products } from '@/data/products';
import { isStripeConfigured, isStripeStagingSafe } from '@/lib/stripe';

export interface LaunchGateResult {
  allowed: boolean;
  blockers: string[];
}

/**
 * Confirms the registered address has been reviewed by the business.
 * The address is used for legal notices and policy contact blocks, so it must
 * be signed off before the storefront can take live orders.
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

/** True when a policy has no body content to show a customer. */
function hasEmptyPolicies(): boolean {
  return legalConfig.policies.some(
    (policy) =>
      policy.sections.length === 0 ||
      policy.sections.every(
        (section) =>
          (section.body?.length ?? 0) === 0 &&
          (section.bullets?.length ?? 0) === 0 &&
          !section.table,
      ),
  );
}

/** True when the live catalog contains a product that cannot be sold. */
function hasUnsellableProducts(): boolean {
  return products.some((product) => !product.purchaseEnabled);
}

function isContactEmailConfigured(): boolean {
  return Boolean(process.env.CONTACT_EMAIL ?? storeConfig.contactEmail);
}

/**
 * Deployment readiness check.
 *
 * Catalog and policy content is complete in the repository, so the remaining
 * blockers are environment credentials that only the operator can supply.
 * Run this against the deployment environment before pointing DNS at the site.
 */
export function canLaunchProduction(): LaunchGateResult {
  const blockers: string[] = [];

  if (legalConfig.productionLaunchBlocked) {
    blockers.push('Production launch is explicitly blocked in legalConfig.');
  }

  if (!isAddressUnitFormatConfirmed()) {
    blockers.push(
      'Registered address has not been confirmed for production launch.',
    );
  }

  if (hasEmptyPolicies()) {
    blockers.push('One or more legal policies have no published content.');
  }

  if (hasUnsellableProducts()) {
    blockers.push('One or more catalog products have purchasing disabled.');
  }

  if (!isStripeConfigured()) {
    blockers.push('STRIPE_SECRET_KEY is not configured.');
  } else if (!isStripeStagingSafe()) {
    blockers.push(
      'Stripe live keys are configured while the storefront is not in live mode.',
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    blockers.push(
      'STRIPE_WEBHOOK_SECRET is not configured, so payment confirmations cannot be verified.',
    );
  }

  if (!isContactEmailConfigured()) {
    blockers.push('CONTACT_EMAIL is not configured for production notifications.');
  }

  if (!process.env.RESEND_API_KEY) {
    blockers.push('RESEND_API_KEY is not configured for transactional email.');
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    blockers.push(
      'NEXT_PUBLIC_SITE_URL is not configured, so canonical URLs and Stripe redirects will be wrong.',
    );
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
