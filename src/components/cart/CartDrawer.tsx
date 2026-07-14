'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { storeConfig } from '@/data/store-config';
import { getColorwayLabel } from '@/lib/product-display';
import { getProductById } from '@/lib/products';
import { useUiStore } from '@/stores/ui-store';
import { formatPrice } from '@/lib/utils';
import { getCartLineKey, useCartStore } from '@/stores';

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const subtotal = getSubtotal();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => !isOpen && closeCart()}
      title="Your cart"
      description={
        itemCount > 0
          ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for review`
          : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-graphite">Your cart is empty.</p>
          <Link
            href="/shop"
            onClick={closeCart}
            className="mt-4 inline-flex h-11 min-h-[2.75rem] items-center justify-center rounded-md border border-border-sand bg-transparent px-4 text-sm font-medium text-night-ink transition-colors hover:bg-cloud-cream"
          >
            Browse furniture
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 space-y-4">
            {items.map((item) => {
              const lineKey = getCartLineKey(item);
              const product = getProductById(item.productId);
              const imageSrc =
                item.image ||
                product?.imageGallery.find(
                  (image) => image.type === 'main' || image.type === 'front',
                )?.src ||
                '';
              const finish = product
                ? getColorwayLabel(product, item.selectedFinishId, 'finish')
                : null;
              const lineTotal = item.unitPrice * item.quantity;

              return (
                <li
                  key={lineKey}
                  className="flex gap-3 border-b border-border-sand pb-4"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border-sand bg-white"
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 font-display text-sm font-medium leading-snug text-night-ink hover:text-haven-blue"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 font-mono-data text-xs text-graphite">
                      {item.sku}
                    </p>
                    {finish && finish !== '-' ? (
                      <p className="mt-1 text-xs text-graphite">{finish}</p>
                    ) : null}
                    <p className="mt-2 font-display text-sm font-medium text-night-ink">
                      {formatPrice(lineTotal, storeConfig.currency)}
                    </p>

                    <div className="mt-2 flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 min-h-8 min-w-8"
                        onClick={() =>
                          updateQuantity(lineKey, item.quantity - 1)
                        }
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
                        className="size-8 min-h-8 min-w-8"
                        onClick={() =>
                          updateQuantity(lineKey, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto size-8 min-h-8 min-w-8 text-graphite"
                        onClick={() => removeItem(lineKey)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-border-sand pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-graphite">Subtotal</span>
              <span className="font-display text-lg font-medium text-night-ink">
                {formatPrice(subtotal, storeConfig.currency)}
              </span>
            </div>
            <p className="mt-2 text-xs text-graphite">
              Shipping calculated at checkout based on product size and
              destination.
            </p>
            <div className="mt-4 space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="inline-flex h-11 min-h-[2.75rem] w-full items-center justify-center rounded-md border border-border-sand bg-transparent px-4 text-sm font-medium text-night-ink transition-colors hover:bg-cloud-cream"
              >
                View full cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="inline-flex h-11 min-h-[2.75rem] w-full items-center justify-center rounded-md bg-night-ink px-4 text-sm font-medium text-cloud-cream transition-colors hover:bg-night-ink/90"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
