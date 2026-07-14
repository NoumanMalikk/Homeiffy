'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { ProductImagePlaceholder } from '@/components/product/ProductImagePlaceholder';
import { Button } from '@/components/ui/button';
import type { Product, ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  product: Product;
}

function canDisplayImage(image: ProductImage | undefined): boolean {
  if (!image?.src) {
    return false;
  }
  return image.type !== 'placeholder';
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.imageGallery;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const activeImage = images[selectedIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden  border border-wd-line bg-gradient-to-b from-[#242424] to-[#121212]">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((image, index) => (
              <GallerySlide
                key={`${image.src}-${index}`}
                image={image}
                title={product.title}
                isActive={index === selectedIndex}
                onOpenZoom={() => {
                  setSelectedIndex(index);
                  setZoomOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        {images.length > 1 ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-wd-elevated/90"
              aria-label="Previous image"
              onClick={scrollPrev}
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-wd-elevated/90"
              aria-label="Next image"
              onClick={scrollNext}
            >
              <ChevronRight />
            </Button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Product images"
        >
          {images.map((image, index) => (
            <button
              key={`${image.src}-thumb-${index}`}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={image.alt}
              className={cn(
                'relative size-16 overflow-hidden border border-wd-line bg-[#1a1a1a]',
                index === selectedIndex
                  ? 'border-wd-accent ring-2 ring-wd-accent/30'
                  : 'border-wd-line',
              )}
              onClick={() => {
                setSelectedIndex(index);
                emblaApi?.scrollTo(index);
              }}
            >
              {canDisplayImage(image) ? (
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              ) : (
                <ProductImagePlaceholder className="aspect-square text-[10px]" />
              )}
            </button>
          ))}
        </div>
      ) : null}

      {zoomOpen ? (
        <dialog
          open
          className="fixed inset-0 z-50 m-0 flex max-h-none max-w-none items-center justify-center bg-night-ink/80 p-4 backdrop:bg-night-ink/80"
          aria-label={`Zoom view: ${activeImage?.alt ?? product.title}`}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl  bg-wd-elevated p-4">
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-2 z-10"
              onClick={() => setZoomOpen(false)}
            >
              Close
            </Button>
            <div className="relative aspect-square w-full overflow-hidden  bg-[#1a1a1a]">
              {canDisplayImage(activeImage) && activeImage ? (
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-contain p-6"
                />
              ) : (
                <ProductImagePlaceholder />
              )}
            </div>
            <p className="mt-3 text-sm text-wd-muted">{activeImage?.alt}</p>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}

function GallerySlide({
  image,
  title,
  isActive,
  onOpenZoom,
}: {
  image: ProductImage;
  title: string;
  isActive: boolean;
  onOpenZoom: () => void;
}) {
  return (
    <div className="relative min-w-0 flex-[0_0_100%]">
      <div className="relative aspect-square w-full bg-[#1a1a1a]">
        {canDisplayImage(image) ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={isActive}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6"
          />
        ) : (
          <ProductImagePlaceholder />
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute bottom-3 right-3 bg-wd-elevated/90"
          aria-label={`Zoom ${title}`}
          onClick={onOpenZoom}
        >
          <ZoomIn />
        </Button>
      </div>
      <p className="sr-only">{image.alt}</p>
    </div>
  );
}
