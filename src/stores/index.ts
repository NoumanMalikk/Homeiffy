export {
  useCartStore,
  getCartLineKey,
  type CartStoreItem,
} from '@/stores/cart-store';

export { useWishlistStore } from '@/stores/wishlist-store';

export {
  useCompareStore,
  MAX_COMPARE_ITEMS,
} from '@/stores/compare-store';

export {
  useRoomBuilderStore,
  type RoomSlotId,
  type RoomSlotSelection,
} from '@/stores/room-builder-store';

export {
  useRoomBoardStore,
  type BoardPlacement,
} from '@/stores/room-board-store';

export {
  useUiStore,
  type CatalogView,
} from '@/stores/ui-store';
