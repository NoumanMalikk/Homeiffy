import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Terms and Conditions',
  description:
    'The terms that govern your use of the Homeiffy website, product orders, warranty and safe assembly of your furniture.',
  path: '/terms-conditions',
});

export default function TermsConditionsPage() {
  return <PolicyPageContent slug="terms-conditions" />;
}
