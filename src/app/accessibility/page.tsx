import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Accessibility Statement',
  description:
    'Homeiffy aims to meet WCAG 2.1 Level AA. What we have built in, where we fall short, and how to report a barrier.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return <PolicyPageContent slug="accessibility" />;
}
