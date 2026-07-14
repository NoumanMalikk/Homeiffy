import { expect, test } from '@playwright/test';

test.describe('Contact and quote forms', () => {
  test('validates contact form required fields', async ({ page }) => {
    await page.goto('/contact');

    await page.getByRole('button', { name: /Send message/i }).click();

    await expect(page.getByText(/Name is required|Enter a valid email/i).first()).toBeVisible();
    await expect(page.getByText(/Consent is required/i).first()).toBeVisible();
  });

  test('validates quote request consent and product selection', async ({
    page,
  }) => {
    await page.goto('/request-a-quote');

    await page.getByRole('button', { name: /Submit quote request/i }).click();

    await expect(page.getByText(/Contact name is required|Enter a valid email/i).first()).toBeVisible();
    await expect(
      page.getByText(/Add at least one product|Select a product/i).first(),
    ).toBeVisible();
    await expect(page.getByText(/Consent is required/i).first()).toBeVisible();
  });
});
