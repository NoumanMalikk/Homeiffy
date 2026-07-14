'use client';

import { motion } from 'framer-motion';
import {
  GitCompare,
  Heart,
  LayoutGrid,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ProductCardImage } from '@/components/product/ProductImagePlaceholder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Swatch } from '@/components/ui/swatch';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import {
  getColorwayLabel,
  formatProductDimensions,
  getProductMainImage,
} from '@/lib/product-display';
import { getProductById } from '@/lib/products';
import { formatPrice, isVerificationRequired } from '@/lib/utils';
import {
  useCompareStore,
  useRoomBoardStore,
  useRoomBuilderStore,
  useWishlistStore,
} from '@/stores';
import type { WishlistItem } from '@/lib/types';

function WishlistRow({ item }: { item: WishlistItem }) {
  const resolvedProduct = getProductById(item.productId);
  const remove = useWishlistStore((state) => state.remove);
  const updateSelection = useWishlistStore((state) => state.updateSelection);
  const moveToCart = useWishlistStore((state) => state.moveToCart);
  const addCompare = useCompareStore((state) => state.add);
  const addPlacement = useRoomBoardStore((state) => state.addPlacement);
  const [notice, setNotice] = useState<string | null>(null);

  const finishOptions = useMemo(
    () =>
      resolvedProduct?.colorways.filter(
        (colorway) => colorway.type === 'finish',
      ) ?? [],
    [resolvedProduct],
  );
  const upholsteryOptions = useMemo(
    () =>
      resolvedProduct?.colorways.filter(
        (colorway) => colorway.type === 'upholstery',
      ) ?? [],
    [resolvedProduct],
  );

  const configurationOptions = useMemo(() => {
    if (!resolvedProduct) {
      return [];
    }

    const options: string[] = [];

    if (
      resolvedProduct.seatingCapacity !== null &&
      !isVerificationRequired(String(resolvedProduct.seatingCapacity))
    ) {
      options.push(`${resolvedProduct.seatingCapacity}-seat configuration`);
    }

    if (
      resolvedProduct.extensionMechanism &&
      !isVerificationRequired(String(resolvedProduct.extensionMechanism))
    ) {
      options.push(String(resolvedProduct.extensionMechanism));
    }

    return options;
  }, [resolvedProduct]);

  if (!resolvedProduct) {
    return null;
  }

  const product = resolvedProduct;

  const image = getProductMainImage(product);

  function handleMoveToCart() {
    const moved = moveToCart(item.productId);
    setNotice(moved ? 'Moved to cart.' : 'Could not move to cart.');
  }

  function handleAddToCompare() {
    addCompare(product);
    setNotice('Added to compare.');
  }

  function handleAddToRoomBuilder() {
    const slots = ['anchor', 'seating', 'storage', 'table', 'accent'] as const;
    const state = useRoomBuilderStore.getState();

    for (const slotId of slots) {
      if (state.slots[slotId].productId) {
        continue;
      }

      state.setSlot(slotId, product, {
        selectedFinishId: item.selectedFinishId,
        selectedUpholsteryId: item.selectedUpholsteryId,
        selectedConfiguration: item.selectedConfiguration,
      });

      if (
        useRoomBuilderStore.getState().slots[slotId].productId === product.id
      ) {
        setNotice(`Added to room builder (${slotId} slot).`);
        return;
      }
    }

    setNotice('No compatible room builder slot available.');
  }

  function handleAddToRoomBoard() {
    addPlacement({
      productId: product.id,
      x: 45 + Math.random() * 10,
      y: 45 + Math.random() * 10,
      rotation: 0,
      finish: getColorwayLabel(product, item.selectedFinishId, 'finish'),
      upholstery: getColorwayLabel(
        product,
        item.selectedUpholsteryId,
        'upholstery',
      ),
    });
    setNotice('Added to room board.');
  }

  return (
    <li className="rounded-lg border border-border-sand bg-soft-white p-4 shadow-soft sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[10rem_1fr]">
        <Link
          href={`/products/${product.slug}`}
          className="block overflow-hidden rounded-lg"
        >
          <ProductCardImage
            src={image.src}
            alt={image.alt}
            verified={image.verified}
          />
        </Link>

        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link
                href={`/products/${product.slug}`}
                className="font-display text-xl font-medium text-night-ink hover:text-haven-blue"
              >
                {product.title}
              </Link>
              <p className="mt-1 font-mono-data text-sm text-graphite">
                {product.sku}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${product.title} from wishlist`}
              onClick={() => remove(item.productId)}
            >
              <Trash2 />
            </Button>
          </div>

          <p className="font-mono-data text-sm text-night-ink">
            {formatProductDimensions(product)}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {finishOptions.length > 0 ? (
              <label className="space-y-2 text-sm">
                <span className="font-medium text-night-ink">Finish</span>
                <Select
                  value={item.selectedFinishId ?? ''}
                  onChange={(event) =>
                    updateSelection(item.productId, {
                      selectedFinishId: event.target.value || null,
                    })
                  }
                >
                  <option value="">Select finish</option>
                  {finishOptions.map((finish) => (
                    <option key={finish.id} value={finish.id}>
                      {finish.label}
                    </option>
                  ))}
                </Select>
              </label>
            ) : null}

            {upholsteryOptions.length > 0 ? (
              <label className="space-y-2 text-sm">
                <span className="font-medium text-night-ink">Upholstery</span>
                <Select
                  value={item.selectedUpholsteryId ?? ''}
                  onChange={(event) =>
                    updateSelection(item.productId, {
                      selectedUpholsteryId: event.target.value || null,
                    })
                  }
                >
                  <option value="">Select upholstery</option>
                  {upholsteryOptions.map((upholstery) => (
                    <option key={upholstery.id} value={upholstery.id}>
                      {upholstery.label}
                    </option>
                  ))}
                </Select>
              </label>
            ) : null}

            {configurationOptions.length > 0 ? (
              <label className="space-y-2 text-sm">
                <span className="font-medium text-night-ink">Configuration</span>
                <Select
                  value={item.selectedConfiguration ?? ''}
                  onChange={(event) =>
                    updateSelection(item.productId, {
                      selectedConfiguration: event.target.value || null,
                    })
                  }
                >
                  <option value="">Select configuration</option>
                  {configurationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {item.selectedFinishId ? (
              <Swatch
                label={`Finish: ${getColorwayLabel(product, item.selectedFinishId, 'finish')}`}
                hex={
                  finishOptions.find((finish) => finish.id === item.selectedFinishId)
                    ?.hex ?? '#E8E4DF'
                }
              />
            ) : null}
            {item.selectedUpholsteryId ? (
              <Swatch
                label={`Upholstery: ${getColorwayLabel(product, item.selectedUpholsteryId, 'upholstery')}`}
                hex={
                  upholsteryOptions.find(
                    (upholstery) => upholstery.id === item.selectedUpholsteryId,
                  )?.hex ?? '#E8E4DF'
                }
              />
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-lg font-medium text-night-ink">
              {formatPrice(product.price, product.currency)}
            </p>
            {!product.productionReady ? (
              <Badge variant="outline">Specifications pending</Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={handleMoveToCart}>
              <ShoppingBag />
              Move to cart
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddToCompare}>
              <GitCompare />
              Compare
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddToRoomBuilder}>
              <LayoutGrid />
              Room builder
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddToRoomBoard}>
              Room board
            </Button>
          </div>

          {notice ? <p className="text-xs text-graphite">{notice}</p> : null}
        </div>
      </div>
    </li>
  );
}

export function WishlistContent() {
  const items = useWishlistStore((state) => state.items);
  const clear = useWishlistStore((state) => state.clear);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-sand bg-cloud-cream/40 px-6 py-16 text-center">
        <Heart className="mx-auto size-10 text-clay-rose/70" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-medium text-night-ink">
          Your wishlist is empty
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-graphite">
          Save products while you browse. No account required - your list stays on
          this device until you clear it.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 min-h-[2.75rem] items-center justify-center rounded-md bg-night-ink px-4 text-sm font-medium text-cloud-cream hover:bg-night-ink/90"
        >
          Shop the catalog
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-graphite">
          {items.length} saved {items.length === 1 ? 'item' : 'items'} · stored
          locally on this device
        </p>
        <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
          Clear all
        </Button>
      </div>

      <motion.ul
        className="space-y-4"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.25 }}
      >
        {items.map((item) => (
          <WishlistRow key={item.productId} item={item} />
        ))}
      </motion.ul>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Clear wishlist?"
        description="This removes every saved item from this device. This cannot be undone."
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              clear();
              setConfirmOpen(false);
            }}
          >
            Clear wishlist
          </Button>
        </div>
      </Dialog>
    </>
  );
}
