'use client';

import { Phone } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/brand/Logo';
import { Drawer } from '@/components/ui/drawer';
import { storeConfig } from '@/data/store-config';
import { navigation, primaryNavigation } from '@/data/navigation';
import { useUiStore } from '@/stores/ui-store';
import { formatPhoneLink } from '@/lib/utils';

export function MobileNav() {
  const open = useUiStore((s) => s.mobileNavOpen);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);

  const customerSection = navigation.find(
    (s) => s.id === 'customer-information',
  );

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => !isOpen && closeMobileNav()}
      title="Menu"
      side="left"
      className="max-w-sm"
    >
      <div className="mb-6 border-b border-border-sand pb-4">
        <Logo
          variant="horizontal"
          width={160}
          linkToHome
          className="max-h-12"
        />
      </div>
      <nav aria-label="Mobile navigation" className="space-y-6">
        {primaryNavigation.map((section) => (
          <div key={section.id}>
            {section.href ? (
              <Link
                href={section.href}
                onClick={closeMobileNav}
                className="font-display text-lg font-medium text-night-ink hover:text-haven-blue"
              >
                {section.label}
              </Link>
            ) : (
              <p className="font-display text-lg font-medium text-night-ink">
                {section.label}
              </p>
            )}
            {section.children ? (
              <ul className="mt-2 space-y-1 pl-2">
                {section.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={closeMobileNav}
                      className="block py-2 text-sm text-graphite hover:text-haven-blue"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {customerSection?.children ? (
          <div>
            <p className="font-display text-lg font-medium text-night-ink">
              Customer Information
            </p>
            <ul className="mt-2 space-y-1 pl-2">
              {customerSection.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={closeMobileNav}
                    className="block py-2 text-sm text-graphite hover:text-haven-blue"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-t border-border-sand pt-6">
          <a
            href={`tel:${formatPhoneLink(storeConfig.phoneE164)}`}
            className="inline-flex h-11 min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-md border border-border-sand bg-transparent px-4 text-sm font-medium text-night-ink transition-colors hover:bg-cloud-cream"
          >
            <Phone className="size-4" />
            {storeConfig.phoneDisplay}
          </a>
        </div>
      </nav>
    </Drawer>
  );
}
