import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PORT ?? 4321)

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    // Astro 7.4 はエージェントの環境を検知すると preview を裏に回して終了する。--ignore-lock なら前面のまま動く
    command: `pnpm preview --port ${port} --ignore-lock`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: false,
  },
})
