import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Room board placements use proportional x/y coordinates on a normalized canvas
 * (0-100). They are illustrative layout aids only - not architectural drawings,
 * not to scale with real room dimensions, and not suitable for installation planning.
 */
export interface BoardPlacement {
  id: string;
  productId: string;
  /** Normalized horizontal position (0-100) on the board canvas. */
  x: number;
  /** Normalized vertical position (0-100) on the board canvas. */
  y: number;
  /** Rotation in degrees for visual orientation only. */
  rotation: number;
  finish: string | null;
  upholstery: string | null;
}

interface RoomBoardState {
  placements: BoardPlacement[];
  addPlacement: (
    placement: Omit<BoardPlacement, 'id'> & { id?: string },
  ) => string;
  updatePlacement: (
    id: string,
    updates: Partial<Omit<BoardPlacement, 'id'>>,
  ) => void;
  removePlacement: (id: string) => void;
  clearBoard: () => void;
}

export const useRoomBoardStore = create<RoomBoardState>()(
  persist(
    (set) => ({
      placements: [],

      addPlacement: (placement) => {
        const id = placement.id ?? nanoid();
        const nextPlacement: BoardPlacement = {
          id,
          productId: placement.productId,
          x: placement.x,
          y: placement.y,
          rotation: placement.rotation,
          finish: placement.finish,
          upholstery: placement.upholstery,
        };

        set((state) => ({
          placements: [...state.placements, nextPlacement],
        }));

        return id;
      },

      updatePlacement: (id, updates) => {
        set((state) => ({
          placements: state.placements.map((placement) =>
            placement.id === id ? { ...placement, ...updates } : placement,
          ),
        }));
      },

      removePlacement: (id) => {
        set((state) => ({
          placements: state.placements.filter((placement) => placement.id !== id),
        }));
      },

      clearBoard: () => set({ placements: [] }),
    }),
    {
      name: 'homeiffy-room-board',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
