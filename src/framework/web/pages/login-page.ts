import type { Page } from '@playwright/test';
import { LoggerUtil } from '../../utils/logger.js';
import { BasePage } from '../base-page.js';
import { cssNameLocator, formatLocator } from '../../utils/locator.js';

export class LoginPage extends BasePage {
  private readonly txtUsername = cssNameLocator('username');
  private readonly txtPassword = cssNameLocator('password');
  private readonly btnLogin = formatLocator("//button[@type='submit']");

  constructor(page: Page) {
    super(page);
  }

  public async loginToPortal(username: string, password: string): Promise<boolean> {
    try {
      const userField = this.page.locator(this.txtUsername).first();
      await userField.waitFor({ state: 'visible' });
      await userField.fill(username);

      await this.page.locator(this.txtPassword).first().fill(password);
      await this.page.locator(this.btnLogin).click();
      LoggerUtil.info('Clicked Login button');
      return true;
    } catch (error) {
      LoggerUtil.error('Could not click on Login button because of exception', error);
      return false;
    }
  }
}
