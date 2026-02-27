import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('loads R2D2 page at root', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('navigates to test page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/test"]');
    await expect(page).toHaveURL('/test');
  });

  test('navigates to code-lab page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/code-lab"]');
    await expect(page).toHaveURL('/code-lab');
  });

  test('navigates back to R2D2', async ({ page }) => {
    await page.goto('/test');
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('active nav link has active class', async ({ page }) => {
    await page.goto('/');
    const activeLink = page.locator('a[href="/"].app__nav-link--active');
    await expect(activeLink).toBeVisible();
  });
});
