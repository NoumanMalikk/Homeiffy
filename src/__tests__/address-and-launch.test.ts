import { describe, expect, it } from 'vitest';

import { legalConfig } from '@/data/legal-config';
import { storeConfig } from '@/data/store-config';
import {
  canLaunchProduction,
  isAddressUnitFormatConfirmed,
} from '@/lib/launch-gates';

describe('registered address and launch gates', () => {
  it('uses the reviewed Burkville Alabama address', () => {
    expect(storeConfig.registeredAddress.line1).toBe('4318 HWY 21');
    expect(storeConfig.registeredAddress.city).toBe('Burkville');
    expect(storeConfig.registeredAddress.state).toBe('AL');
    expect(storeConfig.registeredAddress.postalCode).toBe('36752');
    expect(storeConfig.publicLocationLabel).toBe('Burkville, Alabama');
  });

  it('treats the registered address as confirmed for launch', () => {
    expect(legalConfig.addressVerificationRequired).toBe(false);
    expect(isAddressUnitFormatConfirmed()).toBe(true);
    expect(legalConfig.productionLaunchBlocked).toBe(false);
    expect(storeConfig.registeredAddress.verificationNote).toMatch(
      /registered or mailing address/i,
    );
    expect(storeConfig.registeredAddress.verificationNote).not.toMatch(
      /without an apartment|unit format not confirmed/i,
    );
  });

  it('reports only environment credentials as remaining launch blockers', () => {
    const result = canLaunchProduction();

    // Catalog and policy content are complete in the repository. Anything left
    // must be a deployment credential the operator supplies, never content.
    for (const blocker of result.blockers) {
      expect(blocker).toMatch(
        /STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|CONTACT_EMAIL|RESEND_API_KEY|NEXT_PUBLIC_SITE_URL/,
      );
    }

    expect(result.blockers).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(/placeholder|business.review|no published content/i),
      ]),
    );
    expect(result.blockers).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(/purchasing disabled/i),
      ]),
    );
  });
});
