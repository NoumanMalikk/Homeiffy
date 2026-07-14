import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Terms and Conditions',
  description:
    'Homeiffy terms and conditions - subject to business review before production launch.',
  path: '/terms-conditions',
});

export default function TermsConditionsPage() {
  return <PolicyPageContent slug="terms-conditions" />;
}
