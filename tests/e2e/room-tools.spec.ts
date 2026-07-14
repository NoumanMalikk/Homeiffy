import { expect, test } from '@playwright/test';

test.describe('Room planning tools', () => {
  test('loads room rhythm builder with slot controls', async ({ page }) => {
    await page.goto('/room-rhythm-builder');

    await expect(
      page.getByRole('heading', { name: /Room rhythm builder/i }),
    ).toBeVisible();
    await expect(page.getByLabel('Room builder slots')).toBeVisible();
    await expect(page.getByText(/anchor|seating|storage|table|accent/i).first()).toBeVisible();
  });

  test('loads room board canvas', async ({ page }) => {
    await page.goto('/room-board');

    await expect(page.getByRole('heading', { name: /Room board/i })).toBeVisible();
    await expect(page.getByLabel('Room board canvas')).toBeVisible();
  });
});
