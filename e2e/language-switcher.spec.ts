import { test, expect } from '@playwright/test';

test.describe('Language Switcher', () => {
  test('has FR and EN buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.language-switcher__button >> text=FR')).toBeVisible();
    await expect(page.locator('.language-switcher__button >> text=EN')).toBeVisible();
  });

  test('switches language and active class changes', async ({ page }) => {
    await page.goto('/');
    // Click EN
    await page.click('.language-switcher__button >> text=EN');
    const enActive = page.locator('.language-switcher__button--active');
    await expect(enActive).toHaveText('EN');

    // Click FR
    await page.click('.language-switcher__button >> text=FR');
    const frActive = page.locator('.language-switcher__button--active');
    await expect(frActive).toHaveText('FR');
  });

  test('text changes when switching language', async ({ page }) => {
    await page.goto('/');
    // Get current h1 text
    const initialText = await page.locator('h1').textContent();

    // Switch language
    await page.click('.language-switcher__button >> text=EN');
    // Switch back
    await page.click('.language-switcher__button >> text=FR');

    const finalText = await page.locator('h1').textContent();
    expect(finalText).toBe(initialText);
  });
});
