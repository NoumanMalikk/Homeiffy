import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Accessibility Statement',
  description:
    'Homeiffy accessibility statement - subject to business review before production launch.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return <PolicyPageContent slug="accessibility" />;
}
