'use client';

import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { ProductCardImage } from '@/components/product/ProductImagePlaceholder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { shippingClassById } from '@/data/shipping-classes';
import { storeConfig } from '@/data/store-config';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import {
  formatAssemblyStatus,
  formatBoxCount,
  getColorwayLabel,
} from '@/lib/product-display';
import { getProductById } from '@/lib/products';
import { formatDimensions, formatPrice } from '@/lib/utils';
import {
  getCartLineKey,
  useCartStore,
  useWishlistStore,
  type CartStoreItem,
} from '@/stores';

function CartLineItem({ item }: { item: CartStoreItem }) {
  const product = getProductById(item.productId);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const addWishlist = useWishlistStore((state) => state.add);
  const lineKey = getCartLineKey(item);
  const shippingClass = shippingClassById[item.shippingClass];
  const lineTotal = item.unitPrice * item.quantity;
  const imageSrc =
    item.image ||
    product?.imageGallery.find((img) => img.type === 'main' || img.type === 'front')
      ?.src ||
    '';

  function handleMoveToWishlist() {
    if (!product) {
      return;
    }

    addWishlist(product, {
      selectedFinishId: item.selectedFinishId,
      selectedUpholsteryId: item.selectedUpholsteryId,
      selectedConfiguration: item.selectedConfiguration,
    });
    removeItem(lineKey);
  }

  return (
    <li className="rounded-lg border border-border-sand bg-soft-white p-4 shadow-soft sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[8rem_1fr_auto]">
        <Link
          href={`/products/${item.slug}`}
          className="block overflow-hidden rounded-lg border border-border-sand/60"
        >
          <ProductCardImage
            src={imageSrc}
            alt={item.title}
            verified={Boolean(imageSrc)}
          />
        </Link>

        <div className="space-y-3">
          <div>
            <Link
              href={`/products/${item.slug}`}
              className="font-display text-lg font-medium text-night-ink hover:text-haven-blue"
            >
              {item.title}
            </Link>
            <p className="mt-1 font-mono-data text-sm text-graphite">
              {item.sku}
            </p>
          </div>

          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-graphite">Finish</dt>
              <dd className="font-mono-data text-night-ink">
                {product
                  ? getColorwayLabel(product, item.selectedFinishId, 'finish')
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-graphite">Upholstery</dt>
              <dd className="font-mono-data text-night-ink">
                {product
                  ? getColorwayLabel(
                      product,
                      item.selectedUpholsteryId,
                      'upholstery',
                    )
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-graphite">Configuration</dt>
              <dd className="font-mono-data text-night-ink">
                {item.selectedConfiguration ?? '-'}
              </dd>
            </div>
            <div>
              <dt className="text-graphite">Dimensions</dt>
              <dd className="font-mono-data text-night-ink">
                {formatDimensions(
                  item.dimensionsSnapshot.width,
                  item.dimensionsSnapshot.height,
                  item.dimensionsSnapshot.depth,
                )}
              </dd>
            </div>
            <div>
              <dt className="text-graphite">Box count</dt>
              <dd className="font-mono-data text-night-ink">
                {formatBoxCount(item.boxCount)}
              </dd>
            </div>
            <div>
              <dt className="text-graphite">Shipping class</dt>
              <dd className="font-mono-data text-night-ink">
                {shippingClass?.name ?? item.shippingClass}
              </dd>
            </div>
            <div>
              <dt className="text-graphite">Assembly</dt>
              <dd className="font-mono-data text-night-ink">
                {formatAssemblyStatus(item.assemblyRequired)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            {!item.productionReady ? (
              <Badge variant="outline">Specifications pending</Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <p className="font-mono-data text-sm text-night-ink">
            {formatPrice(item.unitPrice, storeConfig.currency)}{' '}
            each
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => updateQuantity(lineKey, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </Button>
            <span
              className="w-8 text-center text-sm"
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => updateQuantity(lineKey, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <p className="font-display text-lg font-medium text-night-ink">
            {formatPrice(lineTotal, storeConfig.currency)}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMoveToWishlist}>
              <Heart />
              Wishlist
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(lineKey)}
              aria-label={`Remove ${item.title}`}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function CartPageContent() {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const reducedMotion = useReducedMotion();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-sand bg-cloud-cream/40 px-6 py-16 text-center">
        <ShoppingBag
          className="mx-auto size-10 text-haven-blue/70"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-display text-2xl font-medium text-night-ink">
          Your cart is empty
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-graphite">
          Add products from the catalog to review dimensions, finishes and
          pricing before checkout.
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
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <motion.ul
        className="space-y-4"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.25 }}
      >
        {items.map((item) => (
          <CartLineItem key={getCartLineKey(item)} item={item} />
        ))}
      </motion.ul>

      <aside className="h-fit rounded-lg border border-border-sand bg-cloud-cream/40 p-6">
        <h2 className="font-display text-xl font-medium text-night-ink">
          Order summary
        </h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-graphite">Subtotal</dt>
            <dd className="font-display text-lg font-medium text-night-ink">
              {formatPrice(subtotal, storeConfig.currency)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs leading-relaxed text-graphite">
          Shipping is calculated at checkout based on package data, destination
          and product shipping class.
        </p>

        <p className="mt-3 text-xs leading-relaxed text-graphite">
          Confirm room, doorway and delivery-route dimensions before ordering.{' '}
          <Link href="/measuring-guide" className="text-haven-blue hover:underline">
            Measuring guide
          </Link>
        </p>

        <Link
          href="/checkout"
          className="mt-6 inline-flex h-11 min-h-[2.75rem] w-full items-center justify-center rounded-md bg-night-ink px-4 text-sm font-medium text-cloud-cream hover:bg-night-ink/90"
        >
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}
