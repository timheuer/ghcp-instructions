import { test, expect } from '@playwright/test';

const mockTemplates = [
  { name: 'python.instructions.md', download_url: 'https://raw.githubusercontent.com/github/awesome-copilot/main/instructions/python.instructions.md', size: 1000 },
  { name: 'react.instructions.md', download_url: 'https://raw.githubusercontent.com/github/awesome-copilot/main/instructions/react.instructions.md', size: 1000 },
  { name: 'azure.instructions.md', download_url: 'https://raw.githubusercontent.com/github/awesome-copilot/main/instructions/azure.instructions.md', size: 1000 },
];

const mockContent = '# Title\nSome content';

async function routeGitHub(page) {
  await page.route('https://api.github.com/repos/github/awesome-copilot/contents/instructions', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockTemplates) });
  });
  await page.route(/https:\/\/raw\.githubusercontent\.com\/github\/awesome-copilot\/main\/instructions\/.+/, async route => {
    await route.fulfill({ status: 200, contentType: 'text/markdown', body: mockContent });
  });
}

test('search filters templates and preview shows content', async ({ page }) => {
  await routeGitHub(page);
  await page.goto('/');

  // Type in search
  await page.getByPlaceholder('Search templates (e.g., python, react, azure)...').fill('azu');
  // Should show 1 result header
  await expect(page.getByText('1 template found for "azu"')).toBeVisible();

  // Open preview for the Azure card: find template card with matching heading
  const azureCard = page.locator('.template-card').filter({ has: page.getByRole('heading', { name: /^azure$/i }) });
  await expect(azureCard).toBeVisible();
  await azureCard.locator('button[aria-label="Preview azure"]').click();

  // Modal appears with content
  await expect(page.getByRole('heading', { name: /^Preview: azure$/i })).toBeVisible();
  await expect(page.locator('.preview-content pre')).toContainText('Some content');

  // Close modal
  await page.locator('.close-preview-btn').click();
  await expect(page.locator('.preview-modal-overlay')).toHaveCount(0);
});
