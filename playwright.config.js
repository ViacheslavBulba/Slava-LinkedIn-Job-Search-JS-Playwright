const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 480 * 60 * 1000, // total timeout for test run
  reporter: [['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    viewport: null,
    headless: false,
    actionTimeout: 5000,
    launchOptions: {
      args: ["--start-maximized"],
    },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
    },
  ],
});