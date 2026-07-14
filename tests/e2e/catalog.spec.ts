import { expect, test } from '@playwright/test';

test.describe('Catalog browsing', () => {
  test('shop page renders catalog controls and products', async ({ page }) => {
    await page.goto('/shop');

    await expect(
      page.getByRole('heading', { name: /Shop the catalog/i }),
    ).toBeVisible();
    await expect(page.getByLabel('Catalog filters')).toBeVisible();
    await expect(page.getByLabel('Sort products')).toBeVisible();
    await expect(page.getByText('HMF-TBL-018').first()).toBeVisible();
  });

  test('supports sort and filter query params', async ({ page }) => {
    await page.goto('/shop?sort=price-asc');
    await expect(page.getByLabel('Sort products')).toHaveValue('price-asc');

    await page.goto('/shop?moment=arrive');
    await expect(page.getByLabel('Active filters')).toBeVisible();
    await expect(page.getByText('HMF-ENT-001').first()).toBeVisible();
  });

  test('loads collection and moment pages', async ({ page }) => {
    await page.goto('/collections/living-room');
    await expect(page.getByRole('heading', { name: /Living Room/i })).toBeVisible();

    await page.goto('/moments/focus');
    await expect(page.getByRole('heading', { name: /Focus/i })).toBeVisible();
    await expect(page.getByText('HMF-DSK-010').first()).toBeVisible();
  });
});
