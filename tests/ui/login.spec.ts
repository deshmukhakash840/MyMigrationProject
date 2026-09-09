import { test, expect } from '../../src/framework/base/test-fixtures.js';
import { assertTrue } from '../../src/framework/utils/assertions.js';
import { LoginPage } from '../../src/framework/web/pages/login-page.js';

test.describe('Login flow', () => {
  test('verifyLogin @ui-smoke', async ({ page, runtimeConfig }) => {
    await page.goto(runtimeConfig.uiBaseUrl, { waitUntil: 'domcontentloaded' });
    const loginPage = new LoginPage(page);
    const result = await loginPage.loginToPortal('Admin', 'admin123');
    await assertTrue(result, 'Log into the portal');
  });
});
