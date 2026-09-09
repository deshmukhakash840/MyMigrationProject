import type { Locator, Page } from '@playwright/test';

export class ElementActions {
  constructor(private readonly page: Page) {}

  public locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  public async waitForClickable(selector: string, timeout = 10000): Promise<Locator | null> {
    const element = this.locator(selector).first();
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  public async enterText(selector: string, text: string): Promise<void> {
    await this.locator(selector).first().fill(text);
  }

  public async click(selector: string, timeout = 10000): Promise<void> {
    await this.locator(selector).first().click({ timeout });
  }

  public async getElements(selector: string): Promise<Locator[]> {
    return await this.locator(selector).all();
  }

  public async getAttribute(selector: string, attributeName: string): Promise<string> {
    const value = await this.locator(selector).first().getAttribute(attributeName);
    return value ?? '';
  }

  public async scrollIntoView(selector: string): Promise<void> {
    await this.locator(selector).first().scrollIntoViewIfNeeded();
  }
}
