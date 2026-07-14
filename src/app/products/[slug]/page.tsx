import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { categoryBySlug } from '@/data/categories';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import { JsonLdScript } from '@/components/layout/JsonLdScript';
import { buildProductJsonLd } from '@/lib/seo';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = categoryBySlug[product.subcategory];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ];

  if (category) {
    breadcrumbs.push({
      label: category.title,
      href: category.collectionPath,
    });
  }

  breadcrumbs.push({
    label: product.title,
    href: `/products/${product.slug}`,
  });

  return (
    <>
      <JsonLdScript data={buildProductJsonLd(product)} />

      <Section spacing="default" background="white">
        <Container>
          <Breadcrumbs items={breadcrumbs} className="mb-8" />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <ProductGallery product={product} />
            <ProductPurchasePanel product={product} />
          </div>

          <div className="mt-16 border-t border-border-sand pt-16">
            <ProductSpecs product={product} />
          </div>

          <div className="mt-16 border-t border-border-sand pt-16">
            <RelatedProducts product={product} />
          </div>
        </Container>
      </Section>
    </>
  );
}
