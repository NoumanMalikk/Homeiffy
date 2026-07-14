'use client';

import { GitCompare, Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { primaryNavigation } from '@/data/navigation';
import { useUiStore } from '@/stores/ui-store';
import {
  useCartStore,
  useCompareStore,
  useWishlistStore,
} from '@/stores';
import { cn } from '@/lib/utils';

import { MegaMenu, MegaMenuTrigger } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { SearchOverlay } from './SearchOverlay';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const activeMegaMenu = useUiStore((s) => s.activeMegaMenu);
  const setActiveMegaMenu = useUiStore((s) => s.setActiveMegaMenu);
  const toggleSearch = useUiStore((s) => s.toggleSearch);
  const toggleCart = useUiStore((s) => s.toggleCart);
  const openMobileNav = useUiStore((s) => s.openMobileNav);

  const cartCount = useCartStore((s) =>
    s.items.reduce((count, item) => count + item.quantity, 0),
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  const activeSection = primaryNavigation.find(
    (s) => s.id === activeMegaMenu,
  );

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 w-full border-b transition-[background-color,box-shadow,border-color] duration-250',
          scrolled
            ? 'border-wd-line bg-wd-black/95 shadow-elevated backdrop-blur-md'
            : 'border-wd-line/60 bg-wd-black',
        )}
      >
        <Container className="relative">
          <div className="flex h-[4.5rem] items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={openMobileNav}
                aria-label="Open menu"
              >
                <Menu />
              </Button>

              <Logo
                variant="horizontal"
                theme="light"
                linkToHome
                width={168}
                priority
                className="max-h-10 sm:max-h-11"
              />
            </div>

            <nav
              className="hidden items-center gap-0.5 lg:flex"
              aria-label="Primary navigation"
            >
              {primaryNavigation.map((section) => (
                <MegaMenuTrigger
                  key={section.id}
                  section={section}
                  isOpen={activeMegaMenu === section.id}
                  onToggle={() =>
                    setActiveMegaMenu(
                      activeMegaMenu === section.id ? null : section.id,
                    )
                  }
                  onClose={() => setActiveMegaMenu(null)}
                />
              ))}
              <Link
                href="/shop"
                className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-wd-text transition-colors hover:text-wd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent"
              >
                Shop
              </Link>
              <Link
                href="/room-builder"
                className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-wd-text transition-colors hover:text-wd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent"
              >
                Room Builder
              </Link>
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                aria-label="Search products"
              >
                <Search />
              </Button>

              <Link
                href="/wishlist"
                className="relative inline-flex size-11 min-h-[2.75rem] min-w-[2.75rem] items-center justify-center text-wd-text transition-colors hover:text-wd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent"
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
              >
                <Heart className="size-4" />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-wd-accent text-[10px] font-bold text-wd-black">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/compare"
                className="relative inline-flex size-11 min-h-[2.75rem] min-w-[2.75rem] items-center justify-center text-wd-text transition-colors hover:text-wd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent"
                aria-label={`Compare${compareCount ? `, ${compareCount} items` : ''}`}
              >
                <GitCompare className="size-4" />
                {compareCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-wd-accent text-[10px] font-bold text-wd-black">
                    {compareCount}
                  </span>
                ) : null}
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
                className="relative"
              >
                <ShoppingBag />
                {cartCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-wd-accent text-[10px] font-bold text-wd-black">
                    {cartCount}
                  </span>
                ) : null}
              </Button>
            </div>
          </div>

          {activeSection ? (
            <MegaMenu
              section={activeSection}
              open={Boolean(activeMegaMenu)}
              onClose={() => setActiveMegaMenu(null)}
            />
          ) : null}
        </Container>
      </header>

      <MobileNav />
      <SearchOverlay />
    </>
  );
}
