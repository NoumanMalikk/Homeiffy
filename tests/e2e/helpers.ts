import { expect, type Page } from '@playwright/test';

export const DEMO_PRODUCT_SLUG = 'orbit-nesting-side-tables-set-of-3';
export const DEMO_PRODUCT_SKU = 'HMF-TBL-018';

export async function dismissOverlays(page: Page) {
  const searchOverlay = page.getByRole('dialog', { name: 'Search products' });
  if (await searchOverlay.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
  }
}

export async function addDemoProductFromPdp(page: Page) {
  await page.goto(`/products/${DEMO_PRODUCT_SLUG}`);
  await page.getByRole('button', { name: /^Add to cart$/i }).click();
  await expect(
    page.getByRole('button', { name: /Cart, 1 items/i }),
  ).toBeVisible();
}
