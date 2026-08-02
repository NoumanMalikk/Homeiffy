'use client';

import Image from 'next/image';
import Link from 'next/link';

import { storeConfig } from '@/data/store-config';
import { getColorwayLabel } from '@/lib/product-display';
import { getProductById } from '@/lib/products';
import { cn, formatPrice } from '@/lib/utils';
import {
  getCartLineKey,
  useCartStore,
  type CartStoreItem,
} from '@/stores';

function resolveLineImage(item: CartStoreItem): string {
  // Always prefer the live catalog gallery so checkout does not keep a stale
  // empty/placeholder path from when the item was first added to the cart.
  const product = getProductById(item.productId);
  const galleryImage =
    product?.imageGallery.find(
      (image) =>
        (image.type === 'main' || image.type === 'front') && Boolean(image.src),
    ) ?? product?.imageGallery.find((image) => Boolean(image.src));

  if (galleryImage?.src) {
    return galleryImage.src;
  }

  return item.image || '';
}

function CartSummaryLine({ item }: { item: CartStoreItem }) {
  const product = getProductById(item.productId);
  const imageSrc = resolveLineImage(item);
  const lineTotal = item.unitPrice * item.quantity;
  const finish = product
    ? getColorwayLabel(product, item.selectedFinishId, 'finish')
    : null;
  const upholstery = product
    ? getColorwayLabel(product, item.selectedUpholsteryId, 'upholstery')
    : null;

  return (
    <li className="flex gap-3 border-b border-wd-line/70 pb-4 last:border-b-0 last:pb-0">
      <Link
        href={`/products/${item.slug}`}
        className="relative size-20 shrink-0 overflow-hidden  border border-wd-line bg-gradient-to-b from-[#242424] to-[#121212] sm:size-24"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            sizes="96px"
            className="object-contain p-2"
            unoptimized
          />
        ) : (
          <span className="flex size-full items-center justify-center px-2 text-center text-[10px] text-wd-muted">
            Product image
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${item.slug}`}
          className="line-clamp-2 font-display text-sm font-medium leading-snug text-night-ink hover:text-haven-blue sm:text-base"
        >
          {item.title}
        </Link>
        <p className="mt-1 font-mono-data text-xs text-wd-muted">{item.sku}</p>
        {finish && finish !== '-' ? (
          <p className="mt-1 text-xs text-wd-muted">Finish: {finish}</p>
        ) : null}
        {upholstery && upholstery !== '-' ? (
          <p className="text-xs text-wd-muted">Upholstery: {upholstery}</p>
        ) : null}
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-xs text-wd-muted">Qty {item.quantity}</p>
          <div className="text-right">
            <p className="font-display text-sm font-medium text-night-ink sm:text-base">
              {formatPrice(lineTotal, storeConfig.currency)}
            </p>
            {item.quantity > 1 ? (
              <p className="text-[11px] text-wd-muted">
                {formatPrice(item.unitPrice, storeConfig.currency)} each
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

export function CheckoutCartSummary({
  className,
  showSubtotal = true,
}: {
  className?: string;
  showSubtotal?: boolean;
}) {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  if (items.length === 0) {
    return (
      <aside
        className={cn(
          'h-fit rounded-2xl border border-wd-line bg-wd-elevated p-5 shadow-soft',
          className,
        )}
      >
        <h2 className="font-display text-lg font-medium text-night-ink">
          Your cart
        </h2>
        <p className="mt-3 text-sm text-wd-muted">No products in your cart yet.</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex text-sm font-medium text-haven-blue hover:underline"
        >
          Continue shopping
        </Link>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'h-fit rounded-2xl border border-wd-line bg-wd-elevated p-5 shadow-soft sm:p-6',
        className,
      )}
      aria-label="Order summary"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-medium text-night-ink">
          Order summary
        </h2>
        <p className="text-sm text-wd-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <CartSummaryLine key={getCartLineKey(item)} item={item} />
        ))}
      </ul>

      {showSubtotal ? (
        <div className="mt-5 space-y-2 border-t border-wd-line pt-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-wd-muted">Subtotal</span>
            <span className="font-medium text-night-ink">
              {formatPrice(subtotal, storeConfig.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-wd-muted">Shipping</span>
            <span className="text-night-ink">Calculated next</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-wd-line/70 pt-3">
            <span className="font-display text-base font-medium text-night-ink">
              Total
            </span>
            <span className="font-display text-xl font-medium text-night-ink">
              {formatPrice(subtotal, storeConfig.currency)}
            </span>
          </div>
          <p className="pt-1 text-xs leading-relaxed text-wd-muted">
            Shipping and tax are calculated from destination and product size
            before payment.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
