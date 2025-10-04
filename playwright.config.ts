// playwright.config.ts

// Thử load tsconfig-paths, nếu không có thì bỏ qua
try {
  require('tsconfig-paths/register');
} catch {
  console.warn('⚠️  tsconfig-paths chưa được cài, alias @pages/* @utils/* sẽ không hoạt động');
}

import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: 'src/tests',
  timeout: 60_000,
  use: {
    headless: false,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
