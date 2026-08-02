import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getDefaultColorway, getProductById } from '@/lib/products';
import type { CartItem, Product } from '@/lib/types';

/** Cart line item with a display thumbnail. Prices are UI-only; server revalidates at checkout. */
export interface CartStoreItem extends CartItem {
  image: string;
}

interface CartState {
  items: CartStoreItem[];
  addItem: (
    product: Product,
    options?: {
      quantity?: number;
      selectedFinishId?: string | null;
      selectedUpholsteryId?: string | null;
      selectedConfiguration?: string | null;
    },
  ) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

function resolveProductImage(product: Product): string {
  const main =
    product.imageGallery.find(
      (image) =>
        image.type === 'main' &&
        Boolean(image.src) &&
        image.type !== 'placeholder',
    ) ??
    product.imageGallery.find(
      (image) => Boolean(image.src) && image.type !== 'placeholder',
    );

  return main?.src ?? '';
}

function buildLineKey(item: Pick<CartItem, 'productId' | 'selectedFinishId' | 'selectedUpholsteryId' | 'selectedConfiguration'>): string {
  return [
    item.productId,
    item.selectedFinishId ?? '',
    item.selectedUpholsteryId ?? '',
    item.selectedConfiguration ?? '',
  ].join(':');
}

function productToCartStoreItem(
  product: Product,
  options: {
    quantity: number;
    selectedFinishId: string | null;
    selectedUpholsteryId: string | null;
    selectedConfiguration: string | null;
  },
): CartStoreItem {
  return {
    productId: product.id,
    sku: product.sku,
    slug: product.slug,
    title: product.title,
    quantity: options.quantity,
    unitPrice: product.price,
    selectedFinishId: options.selectedFinishId,
    selectedUpholsteryId: options.selectedUpholsteryId,
    selectedConfiguration: options.selectedConfiguration,
    dimensionsSnapshot: {
      width: product.width,
      height: product.height,
      depth: product.depth,
    },
    boxCount: product.boxCount,
    shippingClass: product.shippingClass,
    assemblyRequired: product.assemblyRequired,
    productionReady: product.productionReady,
    image: resolveProductImage(product),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, options = {}) => {
        const quantity = options.quantity ?? 1;
        const selectedFinishId =
          options.selectedFinishId ??
          getDefaultColorway(product, 'finish')?.id ??
          null;
        const selectedUpholsteryId =
          options.selectedUpholsteryId ??
          getDefaultColorway(product, 'upholstery')?.id ??
          null;
        const selectedConfiguration = options.selectedConfiguration ?? null;

        const incoming = productToCartStoreItem(product, {
          quantity,
          selectedFinishId,
          selectedUpholsteryId,
          selectedConfiguration,
        });
        const lineKey = buildLineKey(incoming);

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => buildLineKey(item) === lineKey,
          );

          if (existingIndex === -1) {
            return { items: [...state.items, incoming] };
          }

          const nextItems = [...state.items];
          const existing = nextItems[existingIndex];

          nextItems[existingIndex] = {
            ...existing,
            quantity: existing.quantity + quantity,
            unitPrice: product.price,
            image: resolveProductImage(product),
          };

          return { items: nextItems };
        });
      },

      removeItem: (lineKey) => {
        set((state) => ({
          items: state.items.filter((item) => buildLineKey(item) !== lineKey),
        }));
      },

      updateQuantity: (lineKey, quantity) => {
        if (quantity < 1) {
          get().removeItem(lineKey);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            buildLineKey(item) === lineKey ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        ),
    }),
    {
      name: 'homeiffy-cart',
      storage: createJSONStorage(() => localStorage),
      // Refresh thumbnails from the live catalog so older carts do not keep
      // empty/placeholder image paths after photography is added.
      onRehydrateStorage: () => (state) => {
        if (!state?.items?.length) {
          return;
        }

        state.items = state.items.map((item) => {
          const product = getProductById(item.productId);
          if (!product) {
            return item;
          }
          const nextImage = resolveProductImage(product);
          return nextImage ? { ...item, image: nextImage } : item;
        });
      },
    },
  ),
);

export { buildLineKey as getCartLineKey };
