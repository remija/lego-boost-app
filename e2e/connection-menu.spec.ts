import { test, expect } from '@playwright/test';

test.describe('Connection Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows disconnected state', async ({ page }) => {
    await expect(page.locator('.connection-menu__trigger')).toBeVisible();
  });

  test('opens and closes dropdown', async ({ page }) => {
    await page.click('.connection-menu__trigger');
    await expect(page.locator('.connection-menu__dropdown')).toBeVisible();

    // Click outside to close
    await page.click('body', { position: { x: 0, y: 0 } });
    await expect(page.locator('.connection-menu__dropdown')).not.toBeVisible();
  });

  test('shows connect button in dropdown', async ({ page }) => {
    await page.click('.connection-menu__trigger');
    await expect(page.locator('.connection-menu__button--connect')).toBeVisible();
  });
});
