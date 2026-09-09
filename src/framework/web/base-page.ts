import type { Page } from '@playwright/test';
import { ElementActions } from '../utils/element-actions.js';

export class BasePage {
  protected readonly page: Page;
  protected readonly actions: ElementActions;

  constructor(page: Page) {
    this.page = page;
    this.actions = new ElementActions(page);
  }

  protected async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  protected async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  protected async refreshPage(): Promise<void> {
    await this.page.reload();
  }

  protected async navigateBack(): Promise<void> {
    await this.page.goBack();
  }

  protected async navigateForward(): Promise<void> {
    await this.page.goForward();
  }
}
