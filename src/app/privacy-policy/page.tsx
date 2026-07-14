import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Privacy Policy',
  description:
    'Homeiffy privacy policy - subject to business review before production launch.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return <PolicyPageContent slug="privacy-policy" />;
}
