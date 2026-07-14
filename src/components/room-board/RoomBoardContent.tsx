'use client';

import { motion } from 'framer-motion';
import { RotateCw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { storeConfig } from '@/data/store-config';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import {
  getColorwayLabel,
  formatProductDimensions,
} from '@/lib/product-display';
import { getAllProducts, getDefaultColorway, getProductById } from '@/lib/products';
import { cn, formatDimensions, formatPrice } from '@/lib/utils';
import {
  useRoomBoardStore,
  type BoardPlacement,
} from '@/stores';
import type { Product } from '@/lib/types';

type BoardCategory =
  | 'seating'
  | 'tables'
  | 'storage'
  | 'beds'
  | 'desks'
  | 'dividers';

const BOARD_CATEGORIES: { id: BoardCategory; label: string }[] = [
  { id: 'seating', label: 'Seating' },
  { id: 'tables', label: 'Tables' },
  { id: 'storage', label: 'Storage' },
  { id: 'beds', label: 'Beds' },
  { id: 'desks', label: 'Desks' },
  { id: 'dividers', label: 'Dividers' },
];

const SEATING_SUBCATEGORIES = new Set([
  'entry-benches',
  'dining-chairs',
  'dining-benches',
  'workspace-seating',
  'lounge-chairs',
  'loveseats',
  'modular-seating',
  'ottomans',
  'bed-benches',
]);

const TABLE_SUBCATEGORIES = new Set([
  'consoles',
  'dining-tables',
  'small-space-dining',
  'coffee-side-tables',
]);

const STORAGE_SUBCATEGORIES = new Set([
  'shoe-storage',
  'hall-storage',
  'sideboards',
  'bookcases',
  'media-furniture',
  'nightstands',
  'dressers',
  'mobile-storage',
  'furniture-sets',
]);

const BED_SUBCATEGORIES = new Set(['beds']);
const DESK_SUBCATEGORIES = new Set(['writing-desks', 'compact-desks']);

function matchesBoardCategory(product: Product, category: BoardCategory): boolean {
  switch (category) {
    case 'seating':
      return SEATING_SUBCATEGORIES.has(product.subcategory);
    case 'tables':
      return TABLE_SUBCATEGORIES.has(product.subcategory);
    case 'storage':
      return STORAGE_SUBCATEGORIES.has(product.subcategory);
    case 'beds':
      return BED_SUBCATEGORIES.has(product.subcategory);
    case 'desks':
      return DESK_SUBCATEGORIES.has(product.subcategory);
    case 'dividers':
      return product.subcategory === 'room-dividers';
    default:
      return false;
  }
}

function getPlacementDimensions(
  product: Product,
  maxWidth: number,
  maxDepth: number,
): { widthPct: number; heightPct: number } {
  const width = product.width ?? 12;
  const depth = product.depth ?? 12;

  return {
    widthPct: Math.max(8, (width / maxWidth) * 42),
    heightPct: Math.max(8, (depth / maxDepth) * 42),
  };
}

function PlacementBox({
  placement,
  maxWidth,
  maxDepth,
  selected,
  onSelect,
  onDrag,
  onRotate,
  onRemove,
}: {
  placement: BoardPlacement;
  maxWidth: number;
  maxDepth: number;
  selected: boolean;
  onSelect: () => void;
  onDrag: (x: number, y: number) => void;
  onRotate: () => void;
  onRemove: () => void;
}) {
  const product = getProductById(placement.productId);

  if (!product) {
    return null;
  }

  const { widthPct, heightPct } = getPlacementDimensions(
    product,
    maxWidth,
    maxDepth,
  );

  return (
    <div
      className={cn(
        'absolute touch-none select-none rounded border-2 bg-haven-blue/15',
        selected
          ? 'border-haven-blue shadow-elevated'
          : 'border-haven-blue/50',
      )}
      style={{
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        transform: `translate(-50%, -50%) rotate(${placement.rotation}deg)`,
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        onSelect();

        const board = event.currentTarget.parentElement;

        if (!board) {
          return;
        }

        const rect = board.getBoundingClientRect();

        function handleMove(moveEvent: PointerEvent) {
          const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
          const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
          onDrag(
            Math.min(95, Math.max(5, x)),
            Math.min(95, Math.max(5, y)),
          );
        }

        function handleUp() {
          window.removeEventListener('pointermove', handleMove);
          window.removeEventListener('pointerup', handleUp);
        }

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
      }}
      role="button"
      tabIndex={0}
      aria-label={`${product.title} placement`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex h-full flex-col justify-between p-1.5 text-[10px] leading-tight text-night-ink">
        <span className="line-clamp-2 font-medium">{product.title}</span>
        <span className="font-mono-data">
          {formatDimensions(product.width, product.height, product.depth)}
        </span>
        <span className="font-display">
          {formatPrice(product.price, product.currency)}
        </span>
      </div>

      {selected ? (
        <div className="absolute -right-2 -top-2 flex gap-1">
          <button
            type="button"
            className="rounded-full border border-border-sand bg-soft-white p-1 shadow-soft"
            onClick={(event) => {
              event.stopPropagation();
              onRotate();
            }}
            aria-label={`Rotate ${product.title}`}
          >
            <RotateCw className="size-3" />
          </button>
          <button
            type="button"
            className="rounded-full border border-border-sand bg-soft-white p-1 shadow-soft"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove ${product.title}`}
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function RoomBoardContent() {
  const placements = useRoomBoardStore((state) => state.placements);
  const addPlacement = useRoomBoardStore((state) => state.addPlacement);
  const updatePlacement = useRoomBoardStore((state) => state.updatePlacement);
  const removePlacement = useRoomBoardStore((state) => state.removePlacement);
  const clearBoard = useRoomBoardStore((state) => state.clearBoard);

  const [category, setCategory] = useState<BoardCategory>('seating');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const categoryProducts = useMemo(
    () =>
      getAllProducts().filter((product) =>
        matchesBoardCategory(product, category),
      ),
    [category],
  );

  const placementProducts = useMemo(
    () =>
      placements
        .map((placement) => getProductById(placement.productId))
        .filter((product): product is Product => Boolean(product)),
    [placements],
  );

  const maxWidth = Math.max(
    ...placementProducts.map((product) => product.width ?? 12),
    12,
  );
  const maxDepth = Math.max(
    ...placementProducts.map((product) => product.depth ?? 12),
    12,
  );

  const combinedTotal = placementProducts.reduce(
    (total, product) => total + product.price,
    0,
  );

  const handleAddProduct = useCallback(
    (productId: string) => {
      const product = getProductById(productId);

      if (!product) {
        return;
      }

      const finish = getDefaultColorway(product, 'finish');
      const upholstery = getDefaultColorway(product, 'upholstery');

      const id = addPlacement({
        productId: product.id,
        x: 40 + placements.length * 6,
        y: 45 + placements.length * 4,
        rotation: 0,
        finish: finish?.label ?? null,
        upholstery: upholstery?.label ?? null,
      });

      setSelectedId(id);
    },
    [addPlacement, placements.length],
  );

  return (
    <motion.div
      className="grid gap-8 lg:grid-cols-[18rem_1fr]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
    >
      <aside className="space-y-4">
        <div className="rounded-lg border border-border-sand bg-soft-white p-4">
          <h2 className="font-display text-lg font-medium text-night-ink">
            Add furniture
          </h2>
          <p className="mt-1 text-xs text-graphite">
            Placeholders use proportional width and depth from catalog records.
          </p>

          <label className="mt-4 block space-y-2 text-sm">
            <span className="font-medium text-night-ink">Category</span>
            <Select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as BoardCategory)
              }
            >
              {BOARD_CATEGORIES.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </Select>
          </label>

          <ul className="mt-4 max-h-[20rem] space-y-2 overflow-y-auto">
            {categoryProducts.length === 0 ? (
              <li className="text-sm text-graphite">
                No products in this category.
              </li>
            ) : (
              categoryProducts.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => handleAddProduct(product.id)}
                    className="w-full rounded-md border border-border-sand px-3 py-2 text-left text-sm transition-colors hover:bg-cloud-cream"
                  >
                    <span className="block font-medium text-night-ink">
                      {product.title}
                    </span>
                    <span className="mt-1 block font-mono-data text-xs text-graphite">
                      {formatProductDimensions(product)}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-border-sand bg-cloud-cream/40 p-4 text-sm">
          <h2 className="font-display text-lg font-medium text-night-ink">
            Combined total
          </h2>
          <p className="mt-2 font-display text-2xl font-medium text-night-ink">
            {formatPrice(combinedTotal, storeConfig.currency)}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-graphite">
            {placements.length}{' '}
            {placements.length === 1 ? 'placement' : 'placements'} on board
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setConfirmOpen(true)}
          >
            Clear board
          </Button>
        </div>
      </aside>

      <div className="space-y-4">
        <div
          ref={boardRef}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-dashed border-border-sand bg-cloud-cream/30"
          aria-label="Room board canvas"
          onClick={() => setSelectedId(null)}
        >
          <div className="pointer-events-none absolute inset-4 rounded border border-border-sand/60" />

          {placements.map((placement) => (
            <PlacementBox
              key={placement.id}
              placement={placement}
              maxWidth={maxWidth}
              maxDepth={maxDepth}
              selected={selectedId === placement.id}
              onSelect={() => setSelectedId(placement.id)}
              onDrag={(x, y) => updatePlacement(placement.id, { x, y })}
              onRotate={() =>
                updatePlacement(placement.id, {
                  rotation: (placement.rotation + 45) % 360,
                })
              }
              onRemove={() => {
                removePlacement(placement.id);
                if (selectedId === placement.id) {
                  setSelectedId(null);
                }
              }}
            />
          ))}

          {placements.length === 0 ? (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-graphite">
              Add furniture from the sidebar to place proportional cutouts on
              the board.
            </p>
          ) : null}
        </div>

        {selectedId ? (
          <div className="rounded-lg border border-border-sand bg-soft-white p-4 text-sm">
            {(() => {
              const placement = placements.find(
                (entry) => entry.id === selectedId,
              );
              const product = placement
                ? getProductById(placement.productId)
                : null;

              if (!placement || !product) {
                return null;
              }

              return (
                <dl className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-graphite">Product</dt>
                    <dd className="text-night-ink">{product.title}</dd>
                  </div>
                  <div>
                    <dt className="text-graphite">Dimensions</dt>
                    <dd className="font-mono-data text-night-ink">
                      {formatProductDimensions(product)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-graphite">Finish</dt>
                    <dd className="text-night-ink">
                      {placement.finish ??
                        getColorwayLabel(
                          product,
                          getDefaultColorway(product, 'finish')?.id ?? null,
                          'finish',
                        )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-graphite">Upholstery</dt>
                    <dd className="text-night-ink">
                      {placement.upholstery ??
                        getColorwayLabel(
                          product,
                          getDefaultColorway(product, 'upholstery')?.id ??
                            null,
                          'upholstery',
                        )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-graphite">Price</dt>
                    <dd className="font-display text-night-ink">
                      {formatPrice(product.price, product.currency)}
                    </dd>
                  </div>
                </dl>
              );
            })()}
          </div>
        ) : null}

        <div className="rounded-lg border border-border-sand bg-cloud-cream/40 p-4 text-xs leading-relaxed text-graphite">
          <p>
            This board is an illustrative layout aid only - not architectural
            accuracy, not professional space planning, and not code compliance.
          </p>
          <p className="mt-2">
            Measure room width, doorway clearance and delivery route before
            ordering.{' '}
            <Link href="/measuring-guide" className="text-haven-blue hover:underline">
              Measuring guide
            </Link>
          </p>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Clear room board?"
        description="This removes all placements from this device."
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              clearBoard();
              setConfirmOpen(false);
              setSelectedId(null);
            }}
          >
            Clear board
          </Button>
        </div>
      </Dialog>
    </motion.div>
  );
}
