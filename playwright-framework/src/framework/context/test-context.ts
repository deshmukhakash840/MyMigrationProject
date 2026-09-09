export class TestContext {
  browser: string | null;
  env: string;
  headless: boolean | null;

  constructor(browser: string | null, env: string, headless: boolean | null) {
    this.browser = browser;
    this.env = env;
    this.headless = headless;
  }
}

const contextStore = new Map<string, TestContext>();

export function setTestContext(testContext: TestContext): void {
  contextStore.set('current', testContext);
}

export function getTestContext(): TestContext | undefined {
  return contextStore.get('current');
}

export function unloadTestContext(): void {
  contextStore.delete('current');
}
