export type EnvironmentName = 'qa' | 'prod';

export interface RuntimeConfig {
  env: EnvironmentName;
  browser: string;
  headless: boolean;
  uiBaseUrl: string;
  apiBaseUrl: string;
  apiKey: string;
}

export function getRuntimeConfig(): RuntimeConfig {
  const env = (process.env.ENV || 'qa') as EnvironmentName;
  const browser = process.env.BROWSER || 'chrome';

  return {
    env,
    browser,
    headless: process.env.HEADLESS !== 'false',
    uiBaseUrl: process.env.UI_BASE_URL || 'https://opensource-demo.orangehrmlive.com/',
    apiBaseUrl: process.env.API_BASE_URL || 'https://reqres.in/api',
    apiKey: process.env.API_KEY || '',
  };
}
