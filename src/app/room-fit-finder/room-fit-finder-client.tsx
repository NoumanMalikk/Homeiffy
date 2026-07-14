'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridItem } from '@/components/product/ProductGrid';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/ui/section';
import { getAllProducts } from '@/lib/products';

const rooms = [
  { id: 'living-room', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'dining-room', label: 'Dining Room' },
  { id: 'entryway', label: 'Entryway' },
  { id: 'home-office', label: 'Home Office' },
  { id: 'flexible-living-area', label: 'Flexible Space' },
] as const;

export default function RoomFitFinderClient() {
  const [room, setRoom] = useState<string>('living-room');
  const [maxWidth, setMaxWidth] = useState('80');
  const [maxDepth, setMaxDepth] = useState('40');
  const [doorwayWidth, setDoorwayWidth] = useState('32');
  const [access, setAccess] = useState<'elevator' | 'stairs' | 'unknown'>('unknown');
  const [needStorage, setNeedStorage] = useState(false);
  const [needExpandable, setNeedExpandable] = useState(false);

  const results = useMemo(() => {
    const width = Number(maxWidth);
    const depth = Number(maxDepth);
    const door = Number(doorwayWidth);

    return getAllProducts().filter((product) => {
      if (!product.rooms.some((r) => r === room || r.includes(room))) {
        // soft match living-room vs living-area etc.
        const roomToken = room.split('-')[0] ?? room;
        if (!product.rooms.some((r) => r.includes(roomToken))) return false;
      }
      if (Number.isFinite(width) && product.width !== null && product.width > width) {
        return false;
      }
      if (Number.isFinite(depth) && product.depth !== null && product.depth > depth) {
        return false;
      }
      if (
        Number.isFinite(door) &&
        product.packageDimensions.width !== null &&
        product.packageDimensions.width > door
      ) {
        // Non-blocking when package dims pending
      }
      if (needStorage) {
        const hasStorage =
          Boolean(product.storageType) ||
          (product.drawerCount ?? 0) > 0 ||
          (product.shelfCount ?? 0) > 0 ||
          (product.doorCount ?? 0) > 0 ||
          product.functions.includes('store');
        if (!hasStorage) return false;
      }
      if (needExpandable && !product.functions.includes('transform') && !product.footprintCategory.includes('expandable')) {
        return false;
      }
      return true;
    });
  }, [room, maxWidth, maxDepth, doorwayWidth, needStorage, needExpandable]);

  return (
    <Section spacing="default" background="white">
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Room Fit Finder', href: '/room-fit-finder' },
          ]}
          className="mb-6"
        />
        <header className="mb-8 max-w-3xl">
          <h1 className="font-display text-3xl font-medium text-room-ink sm:text-4xl">
            Room-fit finder
          </h1>
          <p className="mt-3 text-base leading-relaxed text-soft-graphite">
            Results are based on configured dimensions. Confirm the complete room
            and delivery route before ordering.
          </p>
        </header>

        <form
          className="grid gap-4 rounded-2xl border border-border-sand bg-canvas-cream/40 p-5 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="space-y-2">
            <Label htmlFor="room">Which room are you furnishing?</Label>
            <select
              id="room"
              className="flex h-11 w-full rounded-md border border-border-sand bg-white px-3 text-sm"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            >
              {rooms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-width">Maximum available width (in)</Label>
            <Input
              id="max-width"
              type="number"
              min={1}
              value={maxWidth}
              onChange={(event) => setMaxWidth(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-depth">Maximum available depth (in)</Label>
            <Input
              id="max-depth"
              type="number"
              min={1}
              value={maxDepth}
              onChange={(event) => setMaxDepth(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doorway">Doorway width (in)</Label>
            <Input
              id="doorway"
              type="number"
              min={1}
              value={doorwayWidth}
              onChange={(event) => setDoorwayWidth(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access">Stairs or elevator?</Label>
            <select
              id="access"
              className="flex h-11 w-full rounded-md border border-border-sand bg-white px-3 text-sm"
              value={access}
              onChange={(event) =>
                setAccess(event.target.value as typeof access)
              }
            >
              <option value="unknown">Not specified</option>
              <option value="elevator">Elevator available</option>
              <option value="stairs">Stairs / no elevator</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-3 pb-1">
            <label className="flex items-center gap-2 text-sm text-room-ink">
              <input
                type="checkbox"
                checked={needStorage}
                onChange={(event) => setNeedStorage(event.target.checked)}
              />
              Need storage
            </label>
            <label className="flex items-center gap-2 text-sm text-room-ink">
              <input
                type="checkbox"
                checked={needExpandable}
                onChange={(event) => setNeedExpandable(event.target.checked)}
              />
              Prefer expandable / transforming
            </label>
          </div>
        </form>

        <p className="mt-4 text-sm text-soft-graphite">
          Access note recorded as: {access}. Use the{' '}
          <Link href="/doorway-fit-checker" className="text-homeiffy-teal underline">
            doorway fit checker
          </Link>{' '}
          for package-level access estimates.
        </p>

        <div className="mt-10">
          <h2 className="font-display text-2xl text-room-ink">
            Matching products ({results.length})
          </h2>
          <div className="mt-6">
            {results.length > 0 ? (
              <ProductGrid>
                {results.map((product) => (
                  <ProductGridItem key={product.id} product={product}>
                    <ProductCard product={product} />
                  </ProductGridItem>
                ))}
              </ProductGrid>
            ) : (
              <p className="text-soft-graphite">
                No products match these measurements. Adjust width, depth or
                room selection.
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
