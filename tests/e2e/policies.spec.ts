import { expect, test } from '@playwright/test';

const policyPages = [
  '/privacy-policy',
  '/terms-conditions',
  '/shipping-policy',
  '/return-refund-policy',
  '/accessibility',
];

test.describe('Legal policy pages', () => {
  for (const path of policyPages) {
    test(`shows review banner on ${path}`, async ({ page }) => {
      await page.goto(path);

      await expect(page.getByText('Policy pending business review')).toBeVisible();
      await expect(
        page.getByText(/placeholder language from the legal configuration/i),
      ).toBeVisible();
    });
  }
});
