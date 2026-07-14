import type { MetadataRoute } from 'next';

import { categories } from '@/data/categories';
import { dailyMoments } from '@/data/daily-moments';
import { legalConfig } from '@/data/legal-config';
import { getAllProducts } from '@/lib/products';
import { absoluteUrl } from '@/lib/seo';

const staticRoutes = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/request-a-quote',
  '/materials-finishes',
  '/upholstery-care',
  '/measuring-guide',
  '/furniture-safety',
  '/assembly-information',
  '/faq',
  ...legalConfig.policies.map((policy) => `/${policy.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const collectionEntries: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: absoluteUrl(category.collectionPath),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
  );

  const momentEntries: MetadataRoute.Sitemap = dailyMoments.map((moment) => ({
    url: absoluteUrl(`/moments/${moment.slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = getAllProducts().map(
    (product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    }),
  );

  return [
    ...staticEntries,
    ...collectionEntries,
    ...momentEntries,
    ...productEntries,
  ];
}
