import { test, expect } from '@playwright/test';

// Mock responses for GitHub API list and raw file content
const mockTemplates = [
  {
    name: 'python.instructions.md',
    download_url: 'https://raw.githubusercontent.com/github/awesome-copilot/main/instructions/python.instructions.md',
    size: 2048,
  },
  {
    name: 'react.instructions.md',
    download_url: 'https://raw.githubusercontent.com/github/awesome-copilot/main/instructions/react.instructions.md',
    size: 1024,
  },
];

const toTemplate = (f: any) => ({
  name: f.name.replace('.instructions.md', ''),
  fileName: f.name,
  downloadUrl: f.download_url,
  size: f.size,
});

const mockContent = `---\ndescription: Sample template\nappliesTo: [\"demo\"]\n---\n# Instructions\n- Do the thing\n`;

// Route helpers
async function routeGitHubList(page) {
  await page.route('https://api.github.com/repos/github/awesome-copilot/contents/instructions', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockTemplates),
    });
  });
}

async function routeRawContent(page) {
  await page.route(/https:\/\/raw\.githubusercontent\.com\/github\/awesome-copilot\/main\/instructions\/.+/, async route => {
    await route.fulfill({ status: 200, contentType: 'text/markdown', body: mockContent });
  });
}

// Basic app smoke
test('loads homepage and shows title', async ({ page }) => {
  await routeGitHubList(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Copilot Instructions Generator' })).toBeVisible();
  // results counter appears after fetch
  await expect(page.getByText(/template(s)? found/)).toBeVisible();
});

// Theme toggle cycles label
test('theme toggle cycles label text', async ({ page }) => {
  await routeGitHubList(page);
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /Switch theme/ });
  await expect(toggle).toBeVisible();
  const label = page.locator('.theme-label');
  const first = await label.textContent();
  await toggle.click();
  const second = await label.textContent();
  expect(second && second !== first).toBeTruthy();
});

// Selecting a template enables Generate Instructions and shows Export modal after generation
test('select template, generate, and see export actions', async ({ page }) => {
  await routeGitHubList(page);
  await routeRawContent(page);

  await page.goto('/');

  // Click first template card by its title
  const firstName = toTemplate(mockTemplates[0]).name;
  await page.getByRole('heading', { name: new RegExp('^' + firstName + '$') }).click();

  // Selected bar appears
  await expect(page.getByRole('heading', { name: /Selected Templates \(1\)/ })).toBeVisible();

  // Generate button should be enabled and clickable
  const generate = page.getByRole('button', { name: /Generate Instructions/ });
  await expect(generate).toBeEnabled();
  await generate.click();

  // Export handler shows
  await expect(page.getByRole('heading', { name: '🎉 Instructions Generated Successfully!' })).toBeVisible();

  // Actions visible
  await expect(page.getByRole('button', { name: /Preview Content/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Download File|Downloaded!/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Copy to Clipboard|Copied!/ })).toBeVisible();
});
