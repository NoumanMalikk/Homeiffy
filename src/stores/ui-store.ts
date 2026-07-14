'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CatalogView = 'editorial' | 'technical' | 'list';

interface UiState {
  searchOpen: boolean;
  cartOpen: boolean;
  mobileNavOpen: boolean;
  activeMegaMenu: string | null;
  catalogView: CatalogView;
  announcementPaused: boolean;
  compareDrawerOpen: boolean;

  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  setActiveMegaMenu: (id: string | null) => void;
  setCatalogView: (view: CatalogView) => void;
  setAnnouncementPaused: (paused: boolean) => void;
  setCompareDrawerOpen: (open: boolean) => void;
  closeAllOverlays: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      searchOpen: false,
      cartOpen: false,
      mobileNavOpen: false,
      activeMegaMenu: null,
      catalogView: 'editorial',
      announcementPaused: false,
      compareDrawerOpen: false,

      openSearch: () =>
        set({ searchOpen: true, mobileNavOpen: false, activeMegaMenu: null }),
      closeSearch: () => set({ searchOpen: false }),
      toggleSearch: () =>
        set((state) => ({
          searchOpen: !state.searchOpen,
          mobileNavOpen: false,
          activeMegaMenu: null,
        })),
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
      openMobileNav: () =>
        set({ mobileNavOpen: true, searchOpen: false, activeMegaMenu: null }),
      closeMobileNav: () => set({ mobileNavOpen: false }),
      toggleMobileNav: () =>
        set((state) => ({
          mobileNavOpen: !state.mobileNavOpen,
          searchOpen: false,
          activeMegaMenu: null,
        })),
      setActiveMegaMenu: (id) => set({ activeMegaMenu: id }),
      setCatalogView: (view) => set({ catalogView: view }),
      setAnnouncementPaused: (paused) => set({ announcementPaused: paused }),
      setCompareDrawerOpen: (open) => set({ compareDrawerOpen: open }),
      closeAllOverlays: () =>
        set({
          searchOpen: false,
          cartOpen: false,
          mobileNavOpen: false,
          activeMegaMenu: null,
          compareDrawerOpen: false,
        }),
    }),
    {
      name: 'homeiffy-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ catalogView: state.catalogView }),
    },
  ),
);
