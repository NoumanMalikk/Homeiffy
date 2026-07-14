import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { roomCompatibilityGroupById } from '@/data/room-compatibility';
import {
  calculateFootprint,
  getDefaultColorway,
  getProductById,
} from '@/lib/products';
import type { FootprintResult, Product } from '@/lib/types';

export type RoomSlotId = 'anchor' | 'seating' | 'storage' | 'table' | 'accent';

export interface RoomSlotSelection {
  productId: string | null;
  selectedFinishId: string | null;
  selectedUpholsteryId: string | null;
  selectedConfiguration: string | null;
}

interface RoomBuilderState {
  slots: Record<RoomSlotId, RoomSlotSelection>;
  setSlot: (
    slotId: RoomSlotId,
    product: Product | null,
    selections?: {
      selectedFinishId?: string | null;
      selectedUpholsteryId?: string | null;
      selectedConfiguration?: string | null;
    },
  ) => void;
  clearSlot: (slotId: RoomSlotId) => void;
  clearAll: () => void;
  getCombinedTotal: () => number;
  getCombinedFootprint: () => FootprintResult;
}

const emptySelection = (): RoomSlotSelection => ({
  productId: null,
  selectedFinishId: null,
  selectedUpholsteryId: null,
  selectedConfiguration: null,
});

const initialSlots = (): Record<RoomSlotId, RoomSlotSelection> => ({
  anchor: emptySelection(),
  seating: emptySelection(),
  storage: emptySelection(),
  table: emptySelection(),
  accent: emptySelection(),
});

function slotRoleForSlotId(slotId: RoomSlotId): string {
  if (slotId === 'accent') {
    return 'flexible-accent';
  }

  return slotId;
}

function isProductCompatibleWithSlot(
  product: Product,
  slotId: RoomSlotId,
): boolean {
  if (product.roomCompatibilityIds.length === 0) {
    return true;
  }

  const role = slotRoleForSlotId(slotId);

  return product.roomCompatibilityIds.some((groupId) => {
    const group = roomCompatibilityGroupById[groupId];
    return group?.role === role;
  });
}

function getSelectedProducts(
  slots: Record<RoomSlotId, RoomSlotSelection>,
): Product[] {
  return Object.values(slots)
    .map((slot) => (slot.productId ? getProductById(slot.productId) : null))
    .filter((product): product is Product => Boolean(product));
}

export const useRoomBuilderStore = create<RoomBuilderState>()(
  persist(
    (set, get) => ({
      slots: initialSlots(),

      setSlot: (slotId, product, selections = {}) => {
        if (!product) {
          get().clearSlot(slotId);
          return;
        }

        if (!isProductCompatibleWithSlot(product, slotId)) {
          return;
        }

        set((state) => ({
          slots: {
            ...state.slots,
            [slotId]: {
              productId: product.id,
              selectedFinishId:
                selections.selectedFinishId ??
                getDefaultColorway(product, 'finish')?.id ??
                null,
              selectedUpholsteryId:
                selections.selectedUpholsteryId ??
                getDefaultColorway(product, 'upholstery')?.id ??
                null,
              selectedConfiguration: selections.selectedConfiguration ?? null,
            },
          },
        }));
      },

      clearSlot: (slotId) => {
        set((state) => ({
          slots: {
            ...state.slots,
            [slotId]: emptySelection(),
          },
        }));
      },

      clearAll: () => set({ slots: initialSlots() }),

      getCombinedTotal: () =>
        getSelectedProducts(get().slots).reduce(
          (total, product) => total + product.price,
          0,
        ),

      getCombinedFootprint: () =>
        calculateFootprint(getSelectedProducts(get().slots)),
    }),
    {
      name: 'homeiffy-room-rhythm',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
