import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  
  // --- ARCHITECT UPDATE: MONOCART REPORTER ---
  reporter: [
    ['list'], // Keep console logs
    ['monocart-reporter', {  
        name: "Unified Automation Dashboard-E2E",
        outputFile: './test-results/e2e-report.html', // Single file output
        
        // Optional: Add custom columns (Owner, Jira ID, etc.)
        columns: [
            (testResult, testData) => testData.duration + 'ms',
        ]
    }]
  ],
  // -------------------------------------------

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
