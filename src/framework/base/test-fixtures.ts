import { test as base, expect as baseExpect } from '@playwright/test';
import { getRuntimeConfig, type RuntimeConfig } from '../config/config.js';

export type FrameworkFixtures = {
  runtimeConfig: RuntimeConfig;
};

export const test = base.extend<FrameworkFixtures>({
  runtimeConfig: async ({}, use) => {
    await use(getRuntimeConfig());
  },
});

export const expect = baseExpect;
