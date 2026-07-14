import { expect, test } from '@playwright/test';

test.describe('Accessibility basics', () => {
  test('exposes skip link and header keyboard focus', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await skipLink.focus();
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('renders homepage with reduced motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: /Make room for every version of your day/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Shop Furniture' })).toBeVisible();
  });
});
