import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Privacy Policy',
  description:
    'How Homeiffy collects, uses and protects your personal information. We do not sell your data and run no advertising or analytics trackers.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return <PolicyPageContent slug="privacy-policy" />;
}
