'use client';

import { GitCompare, Heart } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Swatch } from '@/components/ui/swatch';
import {
  ProductCardImage,
} from '@/components/product/ProductImagePlaceholder';
import { getDefaultColorway, isProductPurchaseable } from '@/lib/products';
import { useUiStore } from '@/stores/ui-store';
import {
  useCartStore,
  useCompareStore,
  useWishlistStore,
} from '@/stores';
import type { Product } from '@/lib/types';
import {
  cn,
  formatDimensions,
  formatPrice,
} from '@/lib/utils';

type ProductCardAction =
  | 'choose-finish'
  | 'choose-upholstery'
  | 'add-to-cart'
  | 'view-specifications';

function resolvePrimaryAction(
  product: Product,
  selectedFinishId: string | null,
  selectedUpholsteryId: string | null,
): ProductCardAction {
  const hasFinish = product.colorways.some((c) => c.type === 'finish');
  const hasUpholstery = product.colorways.some((c) => c.type === 'upholstery');

  if (hasFinish && !selectedFinishId) {
    return 'choose-finish';
  }

  if (hasUpholstery && !selectedUpholsteryId) {
    return 'choose-upholstery';
  }

  if (isProductPurchaseable(product)) {
    return 'add-to-cart';
  }

  return 'view-specifications';
}

const ACTION_LABELS: Record<ProductCardAction, string> = {
  'choose-finish': 'Choose Finish',
  'choose-upholstery': 'Choose Upholstery',
  'add-to-cart': 'Add to Cart',
  'view-specifications': 'View Specifications',
};

export interface ProductCardProps {
  product: Product;
  selectedFinishId?: string | null;
  selectedUpholsteryId?: string | null;
  className?: string;
}

export function ProductCard({
  product,
  selectedFinishId = null,
  selectedUpholsteryId = null,
  className,
}: ProductCardProps) {
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addCompare = useCompareStore((s) => s.add);
  const removeCompare = useCompareStore((s) => s.remove);
  const isComparing = useCompareStore((s) => s.isComparing(product.id));
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);

  const defaultFinish = getDefaultColorway(product, 'finish');
  const defaultUpholstery = getDefaultColorway(product, 'upholstery');
  const finishColorways = product.colorways.filter((c) => c.type === 'finish');
  const upholsteryColorways = product.colorways.filter(
    (c) => c.type === 'upholstery',
  );

  const resolvedFinishId = selectedFinishId ?? defaultFinish?.id ?? null;
  const resolvedUpholsteryId =
    selectedUpholsteryId ?? defaultUpholstery?.id ?? null;

  const primaryAction = useMemo(
    () =>
      resolvePrimaryAction(
        product,
        resolvedFinishId,
        resolvedUpholsteryId,
      ),
    [product, resolvedFinishId, resolvedUpholsteryId],
  );

  const mainImage = product.imageGallery.find(
    (img) => img.type === 'main' || img.type === 'front',
  ) ?? product.imageGallery[0];

  const dimensions = formatDimensions(
    product.width,
    product.height,
    product.depth,
  );

  function handlePrimaryAction() {
    if (primaryAction === 'add-to-cart') {
      addToCart(product, {
        selectedFinishId: resolvedFinishId,
        selectedUpholsteryId: resolvedUpholsteryId,
        selectedConfiguration: null,
      });
      openCart();
      return;
    }

    window.location.href = `/products/${product.slug}`;
  }

  const displayFinish =
    finishColorways.find((c) => c.id === resolvedFinishId) ?? defaultFinish;
  const displayUpholstery =
    upholsteryColorways.find((c) => c.id === resolvedUpholsteryId) ??
    defaultUpholstery;

  return (
    <article
      className={cn(
        'group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-sand bg-soft-white shadow-soft transition-shadow duration-250 hover:shadow-md',
        className,
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative block shrink-0 overflow-hidden border-b border-border-sand/70 bg-white"
      >
        <ProductCardImage
          src={mainImage?.src ?? ''}
          alt={mainImage?.alt ?? product.title}
          verified={product.imageVerificationStatus === 'verified'}
        />
        <Badge
          variant="outline"
          className="absolute left-3 top-3 border-border-sand/80 bg-soft-white/95 text-[10px] uppercase tracking-wide"
        >
          {(product.dailyMoments[0] ?? 'shop').replace(/^\w/, (c) =>
            c.toUpperCase(),
          )}
        </Badge>
      </Link>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="min-h-[3.25rem]">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-graphite">
            {product.category}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3
              className="line-clamp-2 min-h-[2.5rem] font-display text-base font-medium leading-snug text-night-ink group-hover:text-haven-blue"
              title={product.title}
            >
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="min-h-[2.75rem]">
          {dimensions ? (
            <>
              <p className="text-[11px] font-medium uppercase tracking-wide text-graphite">
                Dimensions
              </p>
              <p className="font-mono-data text-sm text-night-ink">{dimensions}</p>
            </>
          ) : (
            <p className="text-sm text-graphite">See product details for sizing</p>
          )}
        </div>

        <div className="min-h-[3.75rem] space-y-1">
          {displayFinish ? (
            <Swatch
              label={`Finish: ${displayFinish.label}`}
              hex={displayFinish.hex}
            />
          ) : null}
          {displayUpholstery ? (
            <Swatch
              label={`Upholstery: ${displayUpholstery.label}`}
              hex={displayUpholstery.hex}
            />
          ) : null}
          {!displayFinish && !displayUpholstery ? (
            <p className="text-xs text-graphite">Finishes pending verification</p>
          ) : null}
        </div>

        <div className="mt-auto min-h-[2rem]">
          <p className="font-display text-lg font-medium text-night-ink">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>

        <div className="flex items-center gap-2 border-t border-border-sand/60 pt-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              isInWishlist
                ? `Remove ${product.title} from wishlist`
                : `Add ${product.title} to wishlist`
            }
            aria-pressed={isInWishlist}
            onClick={() =>
              toggleWishlist(product, {
                selectedFinishId: resolvedFinishId,
                selectedUpholsteryId: resolvedUpholsteryId,
                selectedConfiguration: null,
              })
            }
          >
            <Heart
              className={cn(isInWishlist && 'fill-clay-rose text-clay-rose')}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={
              isComparing
                ? `Remove ${product.title} from compare`
                : `Add ${product.title} to compare`
            }
            aria-pressed={isComparing}
            onClick={() =>
              isComparing ? removeCompare(product.id) : addCompare(product)
            }
          >
            <GitCompare
              className={cn(isComparing && 'text-haven-blue')}
            />
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="ml-auto flex-1"
            onClick={handlePrimaryAction}
          >
            {ACTION_LABELS[primaryAction]}
          </Button>
        </div>
      </div>
    </article>
  );
}
