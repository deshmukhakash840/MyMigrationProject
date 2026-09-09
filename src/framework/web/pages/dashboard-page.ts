import type { Page } from '@playwright/test';
import { LoggerUtil } from '../../utils/logger.js';
import { formatLocator } from '../../utils/locator.js';
import { BasePage } from '../base-page.js';
import { Menu } from '../enums/menu.js';

export class DashboardPage extends BasePage {
  private static readonly MENU_TEMPLATE = "//span[text()='%s']/parent::a[@class='oxd-main-menu-item']";

  constructor(page: Page) {
    super(page);
  }

  public async clickOnMenu(menuName: Menu): Promise<boolean> {
    const selector = formatLocator(DashboardPage.MENU_TEMPLATE, menuName.getValue());
    try {
      await this.page.locator(selector).first().click({ timeout: 10000 });
      LoggerUtil.info(`Clicked Menu '${menuName.getValue()}'`);
      return true;
    } catch (error) {
      LoggerUtil.error(`Could not click on Menu '${menuName.getValue()}'`, error);
      return false;
    }
  }
}
