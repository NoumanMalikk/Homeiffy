import { expect, test } from '@playwright/test';

import { primaryNavigation } from '../../src/data/navigation';

test.describe('Navigation', () => {
  test('shows desktop primary categories', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Primary navigation' });
    await expect(nav).toBeVisible();

    for (const section of primaryNavigation) {
      await expect(nav.getByRole('button', { name: section.label })).toBeVisible();
    }
  });

  test('opens mobile menu with category links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Open menu' }).click();

    const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Living' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Bedroom', exact: true })).toBeVisible();
    await expect(mobileNav.getByText('Shop by Moment')).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Arrive' })).toBeVisible();
  });
});
