import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Shipping Policy',
  description:
    'Homeiffy shipping policy - subject to business review before production launch.',
  path: '/shipping-policy',
});

export default function ShippingPolicyPage() {
  return <PolicyPageContent slug="shipping-policy" />;
}
