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

  it('treats address verification as required via legalConfig', () => {
    expect(legalConfig.addressVerificationRequired).toBe(true);
    expect(isAddressUnitFormatConfirmed()).toBe(false);
    expect(storeConfig.registeredAddress.verificationNote).toMatch(
      /registered or mailing address/i,
    );
    expect(storeConfig.registeredAddress.verificationNote).not.toMatch(
      /without an apartment|unit format not confirmed/i,
    );
  });

  it('blocks production launch with expected blockers', () => {
    const result = canLaunchProduction();

    expect(result.allowed).toBe(false);
    expect(result.blockers.length).toBeGreaterThan(0);
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/address unit format/i),
        expect.stringMatching(/legal policies|placeholders|business-review/i),
      ]),
    );
  });
});
