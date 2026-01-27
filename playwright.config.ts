import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Vite 기본 포트인 5173을 베이스로 설정합니다.
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },

  projects: [
    /* 데스크톱 크롬 브라우저 */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* 모바일 Safari (iPhone) */
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },

    /* 모바일 Chrome (Android) */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  // 테스트 실행 전 로컬 서버(Vite)를 자동으로 띄워주는 설정
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
