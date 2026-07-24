import { defineConfig, devices } from '@playwright/test';

// End-to-end critical-path suite. Intentionally small — only the
// flows whose breakage would go unnoticed until a user complains
// (homepage render, jobs board filter interaction, article render,
// the two subscribe forms). Every test runs against a real Next.js
// server (auto-started below in dev, or against a provided URL in
// CI). Forms are exercised end-to-end but network calls to Beehiiv /
// Resend / Supabase are intercepted so tests are hermetic.
//
// Run locally:  yarn test:e2e
// Run headed:   yarn test:e2e --headed
// Debug UI:     yarn test:e2e --ui
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    // PLAYWRIGHT_BASE_URL lets CI point tests at a Vercel preview URL.
    // Locally we default to the dev server auto-started below.
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  // Skip the auto-server if we're pointing at an external URL (CI
  // against a Vercel preview). Locally, fall back to spinning up the
  // dev server so `yarn test:e2e` "just works".
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'yarn dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000
      }
});
