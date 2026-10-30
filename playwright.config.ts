import { defineConfig } from '@playwright/test';

// Browser tests run against the built site: `npm run build` first (CI does).
export default defineConfig({
  testDir: 'e2e',
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4399',
    url: 'http://127.0.0.1:4399/',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://127.0.0.1:4399' },
});
