import { expect, test } from '@playwright/test';

import { dailyMoments } from '../../src/data/daily-moments';

test.describe('Homepage', () => {
  test('loads hero, moments section, and primary CTAs', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: /Make room for every version of your day/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /Six rhythms that shape the home/i }),
    ).toBeVisible();

    for (const moment of dailyMoments) {
      await expect(page.getByRole('link', { name: new RegExp(moment.title, 'i') }).first()).toBeVisible();
    }

    await expect(
      page.getByRole('link', { name: 'Shop Furniture' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Explore Daily Moments' }),
    ).toBeVisible();
  });

  test('does not show fake testimonials or customer reviews', async ({ page }) => {
    await page.goto('/');

    const bodyText = (await page.locator('body').innerText()).toLowerCase();

    expect(bodyText).not.toMatch(/testimonial/);
    expect(bodyText).not.toMatch(/customer review/);
    expect(bodyText).not.toMatch(/★★★★★/);
    expect(bodyText).not.toMatch(/verified buyer/);
  });
});
