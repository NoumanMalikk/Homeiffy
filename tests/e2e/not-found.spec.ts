import { expect, test } from '@playwright/test';

test.describe('404 handling', () => {
  test('shows catalog-themed not found page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(page.getByText('404')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /This page is not in the catalog/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse shop' })).toBeVisible();
  });

  test('does not expose an /admin route', async ({ page }) => {
    const response = await page.goto('/admin');

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: /This page is not in the catalog/i }),
    ).toBeVisible();
  });
});
