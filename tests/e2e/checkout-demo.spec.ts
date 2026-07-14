import { expect, test } from '@playwright/test';

import { addDemoProductFromPdp } from './helpers';

test.describe('Checkout flow', () => {
  test('shows checkout progress after adding to cart', async ({ page }) => {
    await addDemoProductFromPdp(page);
    await page.goto('/checkout');

    await expect(
      page.getByRole('navigation', { name: 'Checkout progress' }),
    ).toBeVisible();
    await expect(
      page.getByText('Orbit Nesting Side Tables, Set of 3'),
    ).toBeVisible();
    await expect(page.getByLabel('First name')).toBeVisible();
  });

  test('staging-complete endpoint exists for staging mode', async ({ request }) => {
    const response = await request.post('/api/checkout/staging-complete', {
      data: {},
    });

    expect(response.status()).not.toBe(404);
    expect([400, 403, 429]).toContain(response.status());
  });
});
