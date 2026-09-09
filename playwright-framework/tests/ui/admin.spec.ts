import { test, expect } from '../../src/framework/base/test-fixtures.js';
import { assertTrue } from '../../src/framework/utils/assertions.js';
import { LoginPage } from '../../src/framework/web/pages/login-page.js';
import { DashboardPage } from '../../src/framework/web/pages/dashboard-page.js';
import { AdminPage } from '../../src/framework/web/pages/admin-page.js';
import { Menu } from '../../src/framework/web/enums/menu.js';

test.describe('Admin flow', () => {
  test('verifyUserExists @ui-regression', async ({ page, runtimeConfig }) => {
    await page.goto(runtimeConfig.uiBaseUrl, { waitUntil: 'domcontentloaded' });

    const loginPage = new LoginPage(page);
    const loginResult = await loginPage.loginToPortal('Admin', 'admin123');
    await assertTrue(loginResult, 'Log into the portal');

    const dashboardPage = new DashboardPage(page);
    const menuResult = await dashboardPage.clickOnMenu(Menu.ADMIN);
    await assertTrue(menuResult, 'Clicked on Admin menu');

    const adminPage = new AdminPage(page);
    const userSelected = await adminPage.selectFirstUser('ESS', 'Enabled');
    await assertTrue(userSelected, 'Select first user having ESS');

    const deleteResult = await adminPage.clickOnDeleteSelectedUser();
    await assertTrue(deleteResult, 'Clicked on Delete Selected user button');

    const cancelResult = await adminPage.clickCancelBtnOnDeleteUserModal();
    await assertTrue(cancelResult, 'Clicked on Cancel button on modal popup of Deleting Selected user');
  });
});
