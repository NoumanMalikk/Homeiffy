import type { Metadata } from 'next';

import { TrackOrderForm } from '@/components/order/TrackOrderForm';

export const metadata: Metadata = {
  title: 'Track order',
  description:
    'Look up your Homeiffy order status with your order reference and email.',
};

export default function TrackOrderPage() {
  return <TrackOrderForm />;
}
