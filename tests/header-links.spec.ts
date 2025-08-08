import { test, expect } from '@playwright/test';

const mockTemplates = [
  { name: 'python.instructions.md', download_url: 'https://raw.githubusercontent.com/github/awesome-copilot/main/instructions/python.instructions.md', size: 1000 },
];

async function routeGitHub(page) {
  await page.route('https://api.github.com/repos/github/awesome-copilot/contents/instructions', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockTemplates) });
  });
}

test('GitHub header link opens in new tab', async ({ page, context }) => {
  await routeGitHub(page);
  await page.goto('/');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'GitHub' }).click()
  ]);

  await newPage.waitForLoadState('domcontentloaded');
  expect(new URL(newPage.url()).hostname).toBe('github.com');
});
