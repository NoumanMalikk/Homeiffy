import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Shipping Policy',
  description:
    'How Homeiffy ships furniture across the contiguous United States, what it costs, how long it takes and how to inspect your delivery.',
  path: '/shipping-policy',
});

export default function ShippingPolicyPage() {
  return <PolicyPageContent slug="shipping-policy" />;
}
