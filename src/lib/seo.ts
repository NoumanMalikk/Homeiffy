import type { Metadata } from 'next';

import { storeConfig } from '@/data/store-config';
import type { FaqItem, Product } from '@/lib/types';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://homeiffy.example';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) {
    return path;
  }

  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function createInfoPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} · Homeiffy`,
      description,
      url: canonical,
      images: [{ url: '/brand/og-brand.png', width: 1200, height: 630, alt: 'Homeiffy Furniture' }],
    },
  };
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildProductJsonLd(product: Product) {
  // Only advertise photography we actually have; a placeholder entry has no src.
  const images = product.imageGallery
    .filter((image) => image.type !== 'placeholder' && image.src)
    .map((image) => absoluteUrl(image.src));

  const purchaseable =
    product.purchaseEnabled && product.availability === 'available';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.sku,
    mpn: product.sku,
    description: product.seoDescription,
    ...(images.length > 0 ? { image: images } : {}),
    ...(product.materials ? { material: product.materials } : {}),
    ...(product.width !== null && product.height !== null && product.depth !== null
      ? {
          width: { '@type': 'QuantitativeValue', value: product.width, unitCode: 'INH' },
          height: { '@type': 'QuantitativeValue', value: product.height, unitCode: 'INH' },
          depth: { '@type': 'QuantitativeValue', value: product.depth, unitCode: 'INH' },
        }
      : {}),
    brand: {
      '@type': 'Brand',
      name: storeConfig.brandName,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: product.currency,
      price: product.price,
      availability: purchaseable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: storeConfig.legalName,
      },
    },
  };
}
