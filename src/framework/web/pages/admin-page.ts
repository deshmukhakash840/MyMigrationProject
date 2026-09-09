import type { Page } from '@playwright/test';
import { LoggerUtil } from '../../utils/logger.js';
import { formatLocator } from '../../utils/locator.js';
import { BasePage } from '../base-page.js';

export class AdminPage extends BasePage {
  private static readonly DELETE_SELECTED_BTN = "//button[contains(@class, 'label-danger')]";
  private static readonly MODAL_CANCEL_BTN = "//div[contains(@class, 'modal-footer')]/button[contains(@class, 'ghost')]";
  private static readonly USERNAME_CHK = "//div[@class='oxd-table-card'][.//div[text()='%s'] and .//div[text()='%s']]//span[contains(@class,'checkbox-input')]";

  constructor(page: Page) {
    super(page);
  }

  public async selectFirstUser(role: string, status: string): Promise<boolean> {
    try {
      const candidateRow = this.page
        .locator("div.oxd-table-card")
        .filter({ hasText: role })
        .filter({ hasText: status })
        .first();

      const count = await candidateRow.count();
      if (count === 0) {
        return false;
      }

      const checkbox = candidateRow.locator("span.checkbox-input").first();
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.click();
      const className = await checkbox.getAttribute('class');
      LoggerUtil.info(`First employee having role ${role} and status ${status} is selected`);
      return className?.includes('focus') ?? false;
    } catch (error) {
      LoggerUtil.error(`Could not select employee having role ${role} whose status is ${status}`, error);
      return false;
    }
  }

  public async clickOnDeleteSelectedUser(): Promise<boolean> {
    try {
      await this.page.locator(AdminPage.DELETE_SELECTED_BTN).first().click({ timeout: 10000 });
      LoggerUtil.info('Clicked on Delete Selected button');
      return true;
    } catch (error) {
      LoggerUtil.error('Could not click on Delete Selected button', error);
      return false;
    }
  }

  public async clickCancelBtnOnDeleteUserModal(): Promise<boolean> {
    try {
      await this.page.locator(AdminPage.MODAL_CANCEL_BTN).first().click({ timeout: 10000 });
      LoggerUtil.info('Clicked on Cancel button on Modal popup');
      return true;
    } catch (error) {
      LoggerUtil.error('Could not click on Cancel button on Modal popup', error);
      return false;
    }
  }
}
