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
          <p className="text-wd-muted">Your cart is empty.</p>
          <Link
            href="/shop"
            onClick={closeCart}
            className="mt-4 inline-flex h-11 min-h-[2.75rem] items-center justify-center  border border-wd-line bg-transparent px-4 text-sm font-medium text-wd-text transition-colors hover:bg-wd-elevated"
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
                product?.imageGallery.find(
                  (image) =>
                    (image.type === 'main' || image.type === 'front') &&
                    Boolean(image.src) &&
                    image.type !== 'placeholder',
                )?.src ||
                product?.imageGallery.find(
                  (image) =>
                    Boolean(image.src) && image.type !== 'placeholder',
                )?.src ||
                item.image ||
                '';
              const finish = product
                ? getColorwayLabel(product, item.selectedFinishId, 'finish')
                : null;
              const lineTotal = item.unitPrice * item.quantity;

              return (
                <li
                  key={lineKey}
                  className="flex gap-3 border-b border-wd-line pb-4"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative size-20 shrink-0 overflow-hidden border border-wd-line bg-[#1a1a1a]"
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 font-display text-sm font-medium leading-snug text-wd-text hover:text-wd-accent"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 font-mono-data text-xs text-wd-muted">
                      {item.sku}
                    </p>
                    {finish && finish !== '-' ? (
                      <p className="mt-1 text-xs text-wd-muted">{finish}</p>
                    ) : null}
                    <p className="mt-2 font-display text-sm font-medium text-wd-text">
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
                        className="ml-auto size-8 min-h-8 min-w-8 text-wd-muted"
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

          <div className="mt-4 border-t border-wd-line pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-wd-muted">Subtotal</span>
              <span className="font-display text-lg font-medium text-wd-text">
                {formatPrice(subtotal, storeConfig.currency)}
              </span>
            </div>
            <p className="mt-2 text-xs text-wd-muted">
              Shipping calculated at checkout based on product size and
              destination.
            </p>
            <div className="mt-4 space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="inline-flex h-11 min-h-[2.75rem] w-full items-center justify-center  border border-wd-line bg-transparent px-4 text-sm font-medium text-wd-text transition-colors hover:bg-wd-elevated"
              >
                View full cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="inline-flex h-11 min-h-[2.75rem] w-full items-center justify-center  bg-wd-accent px-4 text-xs font-semibold uppercase tracking-[0.08em] text-wd-black transition-colors hover:bg-wd-accent/90"
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
