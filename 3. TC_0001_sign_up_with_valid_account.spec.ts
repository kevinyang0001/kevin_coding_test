import { test, expect, chromium } from '@playwright/test';
import fs from 'fs';

// Adjust test timeout
test.setTimeout(300000);

async function takeScreenshot(page: any, fileName: string) {
  // Get current date
  const date: Date = new Date();

  // Have unique directory and file name
  const uniqueTimeStamp: string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`;

  // Create root directory if it doesn't exist
  const rootDirectoryPath: string = 'screenshots';
  if (!fs.existsSync(rootDirectoryPath)) fs.mkdirSync(rootDirectoryPath);

  const subDirectoryPath: string = rootDirectoryPath + '/' + uniqueTimeStamp;

  // Create sub-directory if it doesn't exist
  if (!fs.existsSync(subDirectoryPath)) fs.mkdirSync(subDirectoryPath);

  // Create unique screenshot filename
  const filePath: string =
    subDirectoryPath + '/' + uniqueTimeStamp + '-00_' + fileName + '_' + '.png';

  // Save screenshot
  await page.screenshot({ path: filePath });
}

test('Signn up with valid account', async () => {
  // Open a new browser
  const browser = await chromium.launch();
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  // Adjust page size
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Move to target url
  await page.goto('http://13.209.85.69/');

  // Wait until page gets loaded
  await page.waitForLoadState();

  // Validate availability of each fields
  const userName = page.getByLabel('Username:');
  await expect(userName).toBeVisible();

  const password = page.getByLabel('Password:');
  await expect(userName).toBeVisible();

  const email = page.getByLabel('Email:');
  await expect(userName).toBeVisible();

  const subscribe = page.getByLabel('Subscribe to newsletter');
  await expect(subscribe).toBeVisible();

  const registerButton = page.getByLabel('Register:');
  await expect(registerButton).toBeVisible();

  // Fill out user name
  await userName.click();
  await userName.fill('qa_test_001');
  await page.waitForFunction(() => new Promise((resolve) => setTimeout(resolve, 1000)));

  // Fill out password
  await password.click();
  await password.fill('Aaa12345!');
  await page.waitForFunction(() => new Promise((resolve) => setTimeout(resolve, 1000)));

  await email.click();
  await email.fill('qa_test_001@gmail.com');
  await page.waitForFunction(() => new Promise((resolve) => setTimeout(resolve, 1000)));

  // Opt-in subscribe
  await page.getByLabel('Subscribe to newsletter').check();
  await page.waitForFunction(() => new Promise((resolve) => setTimeout(resolve, 1000)));

  // Submit sign up form
  await registerButton.click();
  await page.waitForFunction(() => new Promise((resolve) => setTimeout(resolve, 1000)));

  // Make sure that we have response 200
  let isSuccessResponseObserved = false;
  page.on('response', async (response) => {
    // Specify the URL or part of it you're interested in
    if (response.url().includes('13.209.85.69')) {
      // Check if the status code is 200
      if (response.status() === 200) {
        isSuccessResponseObserved = true;
      }
    }
  });

  expect(isSuccessResponseObserved).toBe(true);

  // Take screenshot
  await takeScreenshot(page, 'sign_up_with_valid_account');
});
