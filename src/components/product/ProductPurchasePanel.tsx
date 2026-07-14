'use client';

import { GitCompare, Heart, LayoutGrid, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Swatch } from '@/components/ui/swatch';
import { storeConfig } from '@/data/store-config';
import { shippingClassById } from '@/data/shipping-classes';
import { categoryBySlug } from '@/data/categories';
import { dailyMomentBySlug } from '@/data/daily-moments';
import { roomById } from '@/data/rooms';
import {
  getDefaultColorway,
  isProductPurchaseable,
} from '@/lib/products';
import { useUiStore } from '@/stores/ui-store';
import {
  useCartStore,
  useCompareStore,
  useWishlistStore,
} from '@/stores';
import { useRoomBuilderStore } from '@/stores/room-builder-store';
import type { Product } from '@/lib/types';
import {
  formatDimensions,
  formatPrice,
  isVerificationRequired,
} from '@/lib/utils';

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [selectedFinishId, setSelectedFinishId] = useState<string | null>(
    getDefaultColorway(product, 'finish')?.id ?? null,
  );
  const [selectedUpholsteryId, setSelectedUpholsteryId] = useState<
    string | null
  >(getDefaultColorway(product, 'upholstery')?.id ?? null);
  const [selectedConfiguration, setSelectedConfiguration] = useState<
    string | null
  >(null);
  const [roomBuilderNotice, setRoomBuilderNotice] = useState<string | null>(
    null,
  );

  const addToCart = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );
  const addCompare = useCompareStore((state) => state.add);
  const removeCompare = useCompareStore((state) => state.remove);
  const isComparing = useCompareStore((state) =>
    state.isComparing(product.id),
  );

  const finishOptions = product.colorways.filter(
    (colorway) => colorway.type === 'finish',
  );
  const upholsteryOptions = product.colorways.filter(
    (colorway) => colorway.type === 'upholstery',
  );

  const purchaseable = isProductPurchaseable(product);
  const canAddToCart =
    storeConfig.siteEnv === 'staging' || purchaseable;

  const category = categoryBySlug[product.subcategory];
  const shippingClass = shippingClassById[product.shippingClass];

  const configurationOptions = useMemo(() => {
    const options: string[] = [];

    if (
      product.seatingCapacity !== null &&
      !isVerificationRequired(String(product.seatingCapacity))
    ) {
      options.push(`${product.seatingCapacity}-seat configuration`);
    }

    if (product.extensionMechanism && !isVerificationRequired(String(product.extensionMechanism))) {
      options.push(String(product.extensionMechanism));
    }

    return options;
  }, [product]);

  function handleAddToCart() {
    if (!canAddToCart && storeConfig.siteEnv === 'production') {
      return;
    }

    addToCart(product, {
      selectedFinishId,
      selectedUpholsteryId,
      selectedConfiguration,
    });
    openCart();
  }

  function handleAddToRoomBuilder() {
    const slots = ['anchor', 'seating', 'storage', 'table', 'accent'] as const;
    const state = useRoomBuilderStore.getState();

    for (const slotId of slots) {
      if (state.slots[slotId].productId === product.id) {
        setRoomBuilderNotice(`Already in room builder (${slotId} slot).`);
        return;
      }
    }

    for (const slotId of slots) {
      if (state.slots[slotId].productId) {
        continue;
      }

      state.setSlot(slotId, product, {
        selectedFinishId,
        selectedUpholsteryId,
        selectedConfiguration,
      });

      if (
        useRoomBuilderStore.getState().slots[slotId].productId === product.id
      ) {
        setRoomBuilderNotice(`Added to room builder (${slotId} slot).`);
        return;
      }
    }

    setRoomBuilderNotice(
      'No compatible room builder slot available for this product.',
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-border-sand bg-soft-white p-6 shadow-soft">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-haven-blue">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-night-ink">
          {product.title}
        </h1>
        <p className="mt-2 font-mono-data text-sm text-graphite">{product.sku}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.dailyMoments.map((momentSlug) => (
          <Badge key={momentSlug} variant="outline">
            {dailyMomentBySlug[momentSlug]?.title ?? momentSlug}
          </Badge>
        ))}
      </div>

      <div className="text-sm text-graphite">
        <p>
          <span className="font-medium text-night-ink">Rooms:</span>{' '}
          {product.rooms
            .map((roomId) => roomById[roomId]?.title ?? roomId)
            .join(', ')}
        </p>
        {category ? (
          <p className="mt-1">
            <span className="font-medium text-night-ink">Collection:</span>{' '}
            <Link
              href={category.collectionPath}
              className="text-haven-blue hover:underline"
            >
              {category.title}
            </Link>
          </p>
        ) : null}
      </div>

      <p className="font-display text-2xl font-medium text-night-ink">
        {formatPrice(product.price, product.currency)}
      </p>

      <dl className="grid gap-3 border-y border-border-sand py-4 text-sm">
        <CustomerSpecRow
          label="Overall dimensions"
          value={formatDimensions(product.width, product.height, product.depth)}
        />
        <CustomerSpecRow
          label="Drawer count"
          value={
            product.drawerCount === null
              ? null
              : String(product.drawerCount)
          }
        />
        <CustomerSpecRow
          label="Shelf count"
          value={
            product.shelfCount === null
              ? null
              : String(product.shelfCount)
          }
        />
        <CustomerSpecRow
          label="Assembly"
          value={
            isVerificationRequired(String(product.assemblyRequired))
              ? null
              : product.assemblyRequired
                ? 'Required'
                : 'Not required'
          }
        />
        <CustomerSpecRow
          label="Box count"
          value={String(product.boxCount)}
        />
        <CustomerSpecRow
          label="Shipping class"
          value={shippingClass?.name ?? product.shippingClass}
        />
      </dl>

      {finishOptions.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium text-night-ink">Finish</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {finishOptions.map((finish) => (
              <button
                key={finish.id}
                type="button"
                aria-pressed={selectedFinishId === finish.id}
                className="rounded-md border border-border-sand p-2"
                onClick={() => setSelectedFinishId(finish.id)}
              >
                <Swatch label={finish.label} hex={finish.hex} />
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {upholsteryOptions.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium text-night-ink">
            Upholstery
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {upholsteryOptions.map((upholstery) => (
              <button
                key={upholstery.id}
                type="button"
                aria-pressed={selectedUpholsteryId === upholstery.id}
                className="rounded-md border border-border-sand p-2"
                onClick={() => setSelectedUpholsteryId(upholstery.id)}
              >
                <Swatch label={upholstery.label} hex={upholstery.hex} />
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {configurationOptions.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium text-night-ink">
            Configuration
          </legend>
          <div className="mt-2 space-y-2">
            {configurationOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="configuration"
                  checked={selectedConfiguration === option}
                  onChange={() => setSelectedConfiguration(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="space-y-3">
        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={!canAddToCart && storeConfig.siteEnv === 'production'}
          onClick={handleAddToCart}
        >
          <ShoppingBag />
          {canAddToCart ? 'Add to cart' : 'Live purchase unavailable'}
        </Button>

        {!product.productionReady && storeConfig.siteEnv === 'production' ? (
          <p className="text-xs text-graphite">
            Live purchase is blocked until production verification is complete.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={isInWishlist}
            onClick={() =>
              toggleWishlist(product, {
                selectedFinishId,
                selectedUpholsteryId,
                selectedConfiguration,
              })
            }
          >
            <Heart className={isInWishlist ? 'fill-clay-rose text-clay-rose' : undefined} />
            Wishlist
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={isComparing}
            onClick={() =>
              isComparing ? removeCompare(product.id) : addCompare(product)
            }
          >
            <GitCompare />
            Compare
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddToRoomBuilder}
          >
            <LayoutGrid />
            Room builder
          </Button>

          <Link
            href={`/contact?product=${product.slug}`}
            className="inline-flex h-10 min-h-[2.75rem] items-center justify-center rounded-md border border-border-sand px-3 text-sm font-medium text-night-ink transition-colors hover:bg-cloud-cream"
          >
            Request quote
          </Link>
        </div>

        {roomBuilderNotice ? (
          <p className="text-xs text-graphite">{roomBuilderNotice}</p>
        ) : null}
      </div>
    </div>
  );
}

function CustomerSpecRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value || value === 'Verification required') {
    return null;
  }

  return <SpecRow label={label} value={value} />;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-2">
      <dt className="text-graphite">{label}</dt>
      <dd className="font-mono-data text-night-ink">{value}</dd>
    </div>
  );
}
