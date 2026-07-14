'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { roomRhythmSlots } from '@/components/home/home-data';
import { ProductCardImage } from '@/components/product/ProductImagePlaceholder';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Swatch } from '@/components/ui/swatch';
import { roomCompatibilityGroupById } from '@/data/room-compatibility';
import { storeConfig } from '@/data/store-config';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import {
  getColorwayLabel,
  formatProductDimensions,
  getProductMainImage,
} from '@/lib/product-display';
import { getAllProducts, getProductById } from '@/lib/products';
import { cn, formatDimensions, formatPrice } from '@/lib/utils';
import {
  useRoomBuilderStore,
  type RoomSlotId,
} from '@/stores';
import type { Product } from '@/lib/types';

const SLOT_HINTS: Record<RoomSlotId, string> = {
  anchor: 'Hall tree or console',
  seating: 'Bench or lounge seat',
  storage: 'Shoe cabinet or ottoman',
  table: 'Nesting side tables',
  accent: 'Room divider or narrow console',
};

function slotRoleForSlotId(slotId: RoomSlotId): string {
  if (slotId === 'accent') {
    return 'flexible-accent';
  }

  return slotId;
}

function isProductCompatibleWithSlot(
  product: Product,
  slotId: RoomSlotId,
): boolean {
  if (product.roomCompatibilityIds.length === 0) {
    return true;
  }

  const role = slotRoleForSlotId(slotId);

  return product.roomCompatibilityIds.some((groupId) => {
    const group = roomCompatibilityGroupById[groupId];
    return group?.role === role;
  });
}

function SlotPanel({ slotId }: { slotId: RoomSlotId }) {
  const slot = useRoomBuilderStore((state) => state.slots[slotId]);
  const setSlot = useRoomBuilderStore((state) => state.setSlot);
  const clearSlot = useRoomBuilderStore((state) => state.clearSlot);
  const [pickerOpen, setPickerOpen] = useState(false);

  const product = slot.productId ? getProductById(slot.productId) : null;
  const compatibleProducts = useMemo(
    () =>
      getAllProducts().filter((entry) =>
        isProductCompatibleWithSlot(entry, slotId),
      ),
    [slotId],
  );

  const slotLabel =
    roomRhythmSlots.find((entry) => entry.id === slotId)?.label ?? slotId;

  function handleSelectProduct(productId: string) {
    const selected = getProductById(productId);

    if (!selected) {
      return;
    }

    setSlot(slotId, selected);
    setPickerOpen(false);
  }

  return (
    <article className="rounded-lg border border-border-sand bg-soft-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-haven-blue">
            {slotLabel}
          </p>
          <p className="mt-1 text-sm text-graphite">{SLOT_HINTS[slotId]}</p>
        </div>
        {product ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Clear ${slotLabel}`}
            onClick={() => clearSlot(slotId)}
          >
            <Trash2 />
          </Button>
        ) : null}
      </div>

      {product ? (
        <div className="mt-4 space-y-4">
          <Link
            href={`/products/${product.slug}`}
            className="block overflow-hidden rounded-lg"
          >
            <ProductCardImage
              {...getProductMainImage(product)}
            />
          </Link>

          <div>
            <Link
              href={`/products/${product.slug}`}
              className="font-medium text-night-ink hover:text-haven-blue"
            >
              {product.title}
            </Link>
            <p className="mt-1 font-mono-data text-xs text-graphite">
              {product.sku}
            </p>
          </div>

          <p className="font-mono-data text-sm text-night-ink">
            {formatProductDimensions(product)}
          </p>

          <div className="space-y-2">
            {slot.selectedFinishId ? (
              <Swatch
                label={`Finish: ${getColorwayLabel(product, slot.selectedFinishId, 'finish')}`}
                hex={
                  product.colorways.find(
                    (colorway) => colorway.id === slot.selectedFinishId,
                  )?.hex ?? '#E8E4DF'
                }
              />
            ) : null}
            {slot.selectedUpholsteryId ? (
              <Swatch
                label={`Upholstery: ${getColorwayLabel(product, slot.selectedUpholsteryId, 'upholstery')}`}
                hex={
                  product.colorways.find(
                    (colorway) => colorway.id === slot.selectedUpholsteryId,
                  )?.hex ?? '#E8E4DF'
                }
              />
            ) : null}
          </div>

          <p className="font-display text-lg font-medium text-night-ink">
            {formatPrice(product.price, product.currency)}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            Change product
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            Choose product
          </Button>
          <p className="mt-3 text-xs text-graphite">
            {compatibleProducts.length} compatible{' '}
            {compatibleProducts.length === 1 ? 'product' : 'products'} in catalog
          </p>
        </div>
      )}

      <Dialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title={`Choose ${slotLabel.toLowerCase()}`}
        description="Products are filtered by room compatibility where catalog records include compatibility groups."
        className="max-w-2xl"
      >
        <div className="max-h-[24rem] space-y-2 overflow-y-auto">
          {compatibleProducts.length === 0 ? (
            <p className="text-sm text-graphite">
              No compatible products found for this slot.
            </p>
          ) : (
            compatibleProducts.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => handleSelectProduct(entry.id)}
                className="flex w-full items-center justify-between gap-3 rounded-md border border-border-sand px-4 py-3 text-left transition-colors hover:bg-cloud-cream"
              >
                <span>
                  <span className="block font-medium text-night-ink">
                    {entry.title}
                  </span>
                  <span className="mt-1 block font-mono-data text-xs text-graphite">
                    {entry.sku} · {formatProductDimensions(entry)}
                  </span>
                </span>
                <span className="shrink-0 font-display text-sm text-night-ink">
                  {formatPrice(entry.price, entry.currency)}
                </span>
              </button>
            ))
          )}
        </div>
      </Dialog>
    </article>
  );
}

export function RoomRhythmBuilderContent() {
  const getCombinedTotal = useRoomBuilderStore((state) => state.getCombinedTotal);
  const getCombinedFootprint = useRoomBuilderStore(
    (state) => state.getCombinedFootprint,
  );
  const clearAll = useRoomBuilderStore((state) => state.clearAll);
  const slots = useRoomBuilderStore((state) => state.slots);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<RoomSlotId>('anchor');
  const reducedMotion = useReducedMotion();

  const total = getCombinedTotal();
  const footprint = getCombinedFootprint();
  const filledCount = Object.values(slots).filter(
    (slot) => slot.productId,
  ).length;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-graphite">
          {filledCount} of 5 slots filled · saved locally on this device
        </p>
        <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
          Clear all
        </Button>
      </div>

      <div
        className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        role="tablist"
        aria-label="Room builder slots"
      >
        {roomRhythmSlots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            role="tab"
            aria-selected={activeSlot === slot.id}
            onClick={() => setActiveSlot(slot.id as RoomSlotId)}
            className={cn(
              'rounded-lg border px-3 py-4 text-left transition-colors',
              activeSlot === slot.id
                ? 'border-haven-blue bg-soft-white shadow-soft'
                : 'border-border-sand/80 bg-cloud-cream/40 hover:border-haven-blue/40',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-haven-blue">
              {slot.label}
            </p>
            <p className="mt-1 text-sm text-graphite">
              {slots[slot.id as RoomSlotId].productId ? 'Filled' : 'Empty'}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          {roomRhythmSlots.map((slot) => (
            <div
              key={slot.id}
              className={cn(
                activeSlot === slot.id ? 'block' : 'hidden sm:block',
              )}
            >
              <SlotPanel slotId={slot.id as RoomSlotId} />
            </div>
          ))}
        </div>

        <aside className="h-fit space-y-4 rounded-lg border border-border-sand bg-cloud-cream/40 p-6">
          <h2 className="font-display text-xl font-medium text-night-ink">
            Combined summary
          </h2>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-graphite">Combined total</dt>
              <dd className="font-display text-2xl font-medium text-night-ink">
                {formatPrice(total, storeConfig.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-graphite">Approximate footprint</dt>
              <dd className="font-mono-data text-night-ink">
                {formatDimensions(footprint.width, footprint.height, footprint.depth)}
              </dd>
              <dd className="mt-1 text-xs text-graphite">{footprint.note}</dd>
            </div>
          </dl>

          <p className="text-xs leading-relaxed text-graphite">
            Confirm room, doorway and circulation dimensions before ordering. No
            bundled discounts, fit guarantees or fabricated savings are shown.
          </p>

          <Link
            href="/measuring-guide"
            className="inline-block text-sm text-haven-blue hover:underline"
          >
            Measuring guide
          </Link>
        </aside>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Clear room builder?"
        description="This removes all slot selections from this device."
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              clearAll();
              setConfirmOpen(false);
            }}
          >
            Clear all slots
          </Button>
        </div>
      </Dialog>
    </motion.div>
  );
}
