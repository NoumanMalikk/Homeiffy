import { expect, test } from '@playwright/test';

import { DEMO_PRODUCT_SLUG, DEMO_PRODUCT_SKU } from './helpers';

test.describe('Product detail page', () => {
  test('shows specs, verification status, and gallery placeholder', async ({
    page,
  }) => {
    await page.goto(`/products/${DEMO_PRODUCT_SLUG}`);

    await expect(
      page.getByRole('heading', { name: /Orbit Nesting Side Tables/i }),
    ).toBeVisible();
    await expect(page.getByText(DEMO_PRODUCT_SKU)).toBeVisible();
    await expect(page.getByText('Exact product image required').first()).toBeVisible();
    await expect(page.getByText('Specifications pending verification')).toBeVisible();

    await page.getByRole('link', { name: 'Product verification' }).click();
    await expect(page.locator('#verification')).toBeVisible();
    await expect(page.getByText('Image verification')).toBeVisible();
    await expect(page.getByText('pending').first()).toBeVisible();
  });
});
