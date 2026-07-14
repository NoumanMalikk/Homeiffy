import type { Product } from '@/lib/types';
import { formatDimensions, isVerificationRequired } from '@/lib/utils';

export function getColorwayLabel(
  product: Product,
  colorwayId: string | null,
  type: 'finish' | 'upholstery',
): string {
  if (!colorwayId) {
    return '-';
  }

  const colorway = product.colorways.find(
    (entry) => entry.id === colorwayId && entry.type === type,
  );

  return colorway?.label ?? 'Verification required';
}

export function formatAssemblyStatus(
  value: Product['assemblyRequired'],
): string {
  if (value === null || isVerificationRequired(String(value))) {
    return 'Verification required';
  }

  return value ? 'Required' : 'Not required';
}

export function formatBoxCount(value: Product['boxCount']): string {
  if (typeof value === 'number') {
    return String(value);
  }

  return String(value);
}

export function formatProductDimensions(product: Product): string {
  return formatDimensions(
    product.width,
    product.height,
    product.depth,
  );
}

export function getProductMainImage(product: Product): {
  src: string;
  alt: string;
  verified: boolean;
} {
  const main =
    product.imageGallery.find(
      (image) => image.type === 'main' || image.type === 'front',
    ) ?? product.imageGallery[0];

  const hasDisplayableImage = Boolean(
    main?.src && main.type !== 'placeholder',
  );

  return {
    src: hasDisplayableImage ? (main?.src ?? '') : '',
    alt: main?.alt ?? product.title,
    /** True when the image can be shown in UI (catalog path present). */
    verified: hasDisplayableImage,
  };
}
