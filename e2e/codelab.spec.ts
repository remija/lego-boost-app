import { test, expect } from '@playwright/test';

test.describe('CodeLab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-lab');
  });

  test('adds a block from palette', async ({ page }) => {
    // Click first palette item (move-forward)
    await page.click('.block-palette__item:first-child');
    // Block should appear in canvas
    await expect(page.locator('.program-canvas .block').first()).toBeVisible();
  });

  test('opens block editor on click', async ({ page }) => {
    await page.click('.block-palette__item:first-child');
    await page.click('.program-canvas .block');
    await expect(page.locator('.block-editor')).toBeVisible();
  });

  test('deletes a block', async ({ page }) => {
    await page.click('.block-palette__item:first-child');
    await page.click('.program-canvas .block');
    await page.click('.block-editor__button--delete');
    await expect(page.locator('.program-canvas .block')).toHaveCount(0);
  });

  test('clears all blocks', async ({ page }) => {
    // Add two blocks
    await page.click('.block-palette__item:first-child');
    await page.click('.block-palette__item:nth-child(2)');
    // Click clear
    const clearBtn = page.locator('.program-controls__button--secondary').last();
    await clearBtn.click();
    await expect(page.locator('.program-canvas .block')).toHaveCount(0);
  });

  test('save and load program flow', async ({ page }) => {
    // Add a block
    await page.click('.block-palette__item:first-child');

    // Open save modal
    await page.click('.program-controls__button--secondary >> nth=0');
    await expect(page.locator('.save-load-modal')).toBeVisible();

    // Click save-as button
    await page.click('.save-load-modal__save-button');
    await page.fill('.save-load-modal__input', 'Test Program');
    await page.click('.save-load-modal__button--save');
  });

  test('loads example program', async ({ page }) => {
    // Open save modal
    await page.click('.program-controls__button--secondary >> nth=0');

    // Click first example (Danse)
    await page.click('.save-load-modal__program--example >> nth=0');

    // Blocks should appear
    await expect(page.locator('.program-canvas .block').first()).toBeVisible();
  });
});
