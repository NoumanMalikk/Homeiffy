'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Input } from '@/components/ui/input';
import { useFocusTrap } from '@/lib/hooks/use-focus-trap';
import { useScrollLock } from '@/lib/hooks/use-scroll-lock';
import { searchProducts } from '@/lib/products';
import { useUiStore } from '@/stores/ui-store';
import { formatDimensions, formatPrice } from '@/lib/utils';

export function SearchOverlay() {
  const open = useUiStore((s) => s.searchOpen);
  const closeSearch = useUiStore((s) => s.closeSearch);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const trapRef = useFocusTrap(open);
  useScrollLock(open);

  const results = query.trim().length >= 2 ? searchProducts(query).slice(0, 8) : [];

  const handleClose = useCallback(() => {
    closeSearch();
    setQuery('');
  }, [closeSearch]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleClose]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-night-ink/50 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={handleClose}
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="relative z-10 mx-auto mt-16 w-full max-w-2xl px-4"
      >
        <div className="rounded-lg border border-border-sand bg-soft-white p-4 shadow-elevated">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite"
              aria-hidden="true"
            />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search by name, SKU, room or dimension…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
              aria-controls="search-results"
              aria-autocomplete="list"
            />
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-graphite hover:bg-border-sand/50"
              aria-label="Close search"
            >
              <X className="size-4" />
            </button>
          </div>

          {query.trim().length >= 2 ? (
            <ul
              id="search-results"
              role="listbox"
              className="mt-4 max-h-80 overflow-y-auto border-t border-border-sand pt-2"
            >
              {results.length === 0 ? (
                <li className="px-2 py-3 text-sm text-graphite">
                  No products match your search.
                </li>
              ) : (
                results.map((product) => (
                  <li
                    key={product.id}
                    role="option"
                    aria-selected={false}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="flex items-start justify-between gap-4 rounded-md px-2 py-3 transition-colors hover:bg-cloud-cream/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-night-ink">
                          {product.title}
                        </p>
                        <p className="font-mono-data text-xs text-graphite">
                          {product.sku} ·{' '}
                          {formatDimensions(
                            product.width,
                            product.height,
                            product.depth,
                          )}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-night-ink">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-graphite">
              Type at least two characters to search the catalog.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
