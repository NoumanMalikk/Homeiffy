import Link from 'next/link';

import {
  getProductsBySkus,
  oneRoomTwoRolesPairings,
} from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';

export function OneRoomTwoRoles() {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          eyebrow="Flexible placement"
          title="One room, two roles."
          description="Furniture that may serve multiple spaces when verified in the product record, without unsupported multifunction claims."
        />

        <ul className="mt-10 space-y-4 sm:mt-12 sm:space-y-5">
          {oneRoomTwoRolesPairings.map((pairing) => {
            const products = getProductsBySkus([...pairing.productSkus]);

            return (
              <li
                key={pairing.id}
                className="grid gap-5 rounded-2xl border border-border-sand bg-soft-white p-5 shadow-soft sm:p-6 lg:grid-cols-[minmax(0,12rem)_1fr_minmax(0,12rem)] lg:items-center lg:gap-6"
              >
                <div className="text-center lg:text-right">
                  <p className="font-display text-lg font-medium text-night-ink sm:text-xl">
                    {pairing.roleA}
                  </p>
                </div>

                <div className="border-y border-border-sand/70 py-4 text-center lg:border-x lg:border-y-0 lg:px-6">
                  <p className="text-sm leading-relaxed text-graphite">
                    {pairing.note}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {products.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-sm font-medium text-haven-blue hover:underline"
                        >
                          {product.sku}: {product.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center lg:text-left">
                  <p className="font-display text-lg font-medium text-night-ink sm:text-xl">
                    {pairing.roleB}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
