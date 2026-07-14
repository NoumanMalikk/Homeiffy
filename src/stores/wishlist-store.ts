import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getDefaultColorway, getProductById } from '@/lib/products';
import type { Product, WishlistItem } from '@/lib/types';

import { useCartStore } from '@/stores/cart-store';

interface WishlistState {
  items: WishlistItem[];
  add: (
    product: Product,
    selections?: {
      selectedFinishId?: string | null;
      selectedUpholsteryId?: string | null;
      selectedConfiguration?: string | null;
    },
  ) => void;
  remove: (productId: string) => void;
  toggle: (
    product: Product,
    selections?: {
      selectedFinishId?: string | null;
      selectedUpholsteryId?: string | null;
      selectedConfiguration?: string | null;
    },
  ) => void;
  clear: () => void;
  isInWishlist: (productId: string) => boolean;
  updateSelection: (
    productId: string,
    selections: {
      selectedFinishId?: string | null;
      selectedUpholsteryId?: string | null;
      selectedConfiguration?: string | null;
    },
  ) => void;
  moveToCart: (productId: string, quantity?: number) => boolean;
}

function productToWishlistItem(
  product: Product,
  selections: {
    selectedFinishId: string | null;
    selectedUpholsteryId: string | null;
    selectedConfiguration: string | null;
  },
): WishlistItem {
  return {
    productId: product.id,
    sku: product.sku,
    slug: product.slug,
    title: product.title,
    addedAt: new Date().toISOString(),
    selectedFinishId: selections.selectedFinishId,
    selectedUpholsteryId: selections.selectedUpholsteryId,
    selectedConfiguration: selections.selectedConfiguration,
  };
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product, selections = {}) => {
        if (get().isInWishlist(product.id)) {
          return;
        }

        const item = productToWishlistItem(product, {
          selectedFinishId:
            selections.selectedFinishId ??
            getDefaultColorway(product, 'finish')?.id ??
            null,
          selectedUpholsteryId:
            selections.selectedUpholsteryId ??
            getDefaultColorway(product, 'upholstery')?.id ??
            null,
          selectedConfiguration: selections.selectedConfiguration ?? null,
        });

        set((state) => ({ items: [...state.items, item] }));
      },

      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      toggle: (product, selections = {}) => {
        if (get().isInWishlist(product.id)) {
          get().remove(product.id);
          return;
        }

        get().add(product, selections);
      },

      clear: () => set({ items: [] }),

      isInWishlist: (productId) =>
        get().items.some((item) => item.productId === productId),

      updateSelection: (productId, selections) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  selectedFinishId:
                    selections.selectedFinishId ?? item.selectedFinishId,
                  selectedUpholsteryId:
                    selections.selectedUpholsteryId ??
                    item.selectedUpholsteryId,
                  selectedConfiguration:
                    selections.selectedConfiguration ??
                    item.selectedConfiguration,
                }
              : item,
          ),
        }));
      },

      moveToCart: (productId, quantity = 1) => {
        const wishlistItem = get().items.find(
          (item) => item.productId === productId,
        );

        if (!wishlistItem) {
          return false;
        }

        const product = getProductById(productId);

        if (!product) {
          return false;
        }

        useCartStore.getState().addItem(product, {
          quantity,
          selectedFinishId: wishlistItem.selectedFinishId,
          selectedUpholsteryId: wishlistItem.selectedUpholsteryId,
          selectedConfiguration: wishlistItem.selectedConfiguration,
        });

        get().remove(productId);
        return true;
      },
    }),
    {
      name: 'homeiffy-wishlist',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
