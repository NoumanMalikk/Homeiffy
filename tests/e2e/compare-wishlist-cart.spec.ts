import { expect, test } from '@playwright/test';

import {
  addDemoProductFromPdp,
  DEMO_PRODUCT_SLUG,
  DEMO_PRODUCT_SKU,
} from './helpers';

test.describe('Compare, wishlist, and cart flows', () => {
  test('adds wishlist and compare items from the product page', async ({
    page,
  }) => {
    await page.goto(`/products/${DEMO_PRODUCT_SLUG}`);

    await page.getByRole('button', { name: 'Wishlist', exact: true }).first().click();
    await expect(page.getByRole('link', { name: /Wishlist, 1 items/i })).toBeVisible();

    await page.goto('/wishlist');
    await expect(page.getByText('Orbit Nesting Side Tables, Set of 3')).toBeVisible();

    await page.goto(`/products/${DEMO_PRODUCT_SLUG}`);
    await page.getByRole('button', { name: 'Compare', exact: true }).first().click();
    await page.goto('/compare');
    await expect(
      page.getByRole('heading', { name: /Compare products/i }),
    ).toBeVisible();
    await expect(
      page.getByText('Orbit Nesting Side Tables, Set of 3').first(),
    ).toBeVisible();
  });

  test('adds a demo item to cart from the product page', async ({ page }) => {
    await addDemoProductFromPdp(page);

    await expect(
      page.getByRole('button', { name: /Cart, 1 items/i }),
    ).toBeVisible();

    await page.goto('/cart');
    await expect(page.getByText('Orbit Nesting Side Tables, Set of 3')).toBeVisible();
    await expect(page.getByRole('link', { name: /Continue to checkout/i })).toBeVisible();
  });

  test('links product cards to the PDP from shop', async ({ page }) => {
    await page.goto('/shop?q=HMF-TBL-018');

    await page
      .locator('article')
      .filter({ hasText: DEMO_PRODUCT_SKU })
      .first()
      .getByRole('link', { name: /Orbit Nesting Side Tables/i })
      .click();

    await expect(page).toHaveURL(new RegExp(`/products/${DEMO_PRODUCT_SLUG}$`));
  });
});
