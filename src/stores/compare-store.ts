import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CompareItem, Product } from '@/lib/types';

const MAX_COMPARE_ITEMS = 4;

interface CompareState {
  items: CompareItem[];
  /** Set when the compare limit is reached and the oldest item is replaced. */
  limitNotice: string | null;
  add: (product: Product) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
  isComparing: (productId: string) => boolean;
  clearLimitNotice: () => void;
}

function productToCompareItem(product: Product): CompareItem {
  return {
    productId: product.id,
    sku: product.sku,
    slug: product.slug,
    title: product.title,
    addedAt: new Date().toISOString(),
  };
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      limitNotice: null,

      add: (product) => {
        const { items } = get();

        if (items.some((item) => item.productId === product.id)) {
          set({ limitNotice: null });
          return true;
        }

        const nextItem = productToCompareItem(product);

        if (items.length < MAX_COMPARE_ITEMS) {
          set({
            items: [...items, nextItem],
            limitNotice: null,
          });
          return true;
        }

        const [, ...remaining] = items;

        set({
          items: [...remaining, nextItem],
          limitNotice: `Compare is limited to ${MAX_COMPARE_ITEMS} products. The oldest item was replaced.`,
        });

        return false;
      },

      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
          limitNotice: null,
        }));
      },

      clear: () => set({ items: [], limitNotice: null }),

      isComparing: (productId) =>
        get().items.some((item) => item.productId === productId),

      clearLimitNotice: () => set({ limitNotice: null }),
    }),
    {
      name: 'homeiffy-compare',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export { MAX_COMPARE_ITEMS };
