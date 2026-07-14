'use client';

import { QuoteRequestForm } from '@/components/forms/QuoteRequestForm';
import { Dialog } from '@/components/ui/dialog';

export function QuoteRequestModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Request a furniture quote"
      description="Submit products, quantities and destination details for structured review."
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <QuoteRequestForm compact onSuccess={() => onOpenChange(false)} />
    </Dialog>
  );
}
