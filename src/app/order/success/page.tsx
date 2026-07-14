import type { Metadata } from 'next';
import { Suspense } from 'react';

import { OrderSuccessContent } from '@/components/order/OrderSuccessContent';

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center text-graphite">
          Verifying your order…
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
