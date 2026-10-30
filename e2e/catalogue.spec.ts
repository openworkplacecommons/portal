import { expect, test } from '@playwright/test';

test.describe('curricula catalogue filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/curricula/');
  });

  const visibleTitles = (page: import('@playwright/test').Page) =>
    page.locator('[data-course]:visible h3').allTextContents();

  test('search hides non-matching cards (not just updates the counter)', async ({ page }) => {
    await expect(page.locator('[data-course]:visible')).not.toHaveCount(1);
    await page.getByLabel('Search').fill('privacy');
    await expect(page.locator('[data-count]')).toHaveText('1 curriculum');
    expect(await visibleTitles(page)).toEqual(['Data Privacy Essentials']);
    await expect(page.getByText('Cybersecurity Awareness')).toBeHidden();
  });

  test('status filter hides cards with another status', async ({ page }) => {
    await page.getByLabel('Status').selectOption('coming-soon');
    const titles = await visibleTitles(page);
    expect(titles).toContain('Cybersecurity Awareness');
    await expect(page.locator('[data-course][data-status="draft"]:visible')).toHaveCount(0);
    await expect(page.locator('[data-course][data-status="draft"]')).not.toHaveCount(0);
  });

  test('no matches shows the empty message and restoring the query restores cards', async ({
    page,
  }) => {
    await page.getByLabel('Search').fill('zzzz-no-match');
    await expect(page.locator('[data-course]:visible')).toHaveCount(0);
    await expect(page.locator('[data-empty]')).toBeVisible();
    await page.getByLabel('Search').fill('');
    await expect(page.locator('[data-empty]')).toBeHidden();
    await expect(page.locator('[data-course]:visible').first()).toBeVisible();
  });
});
