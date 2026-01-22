import { test, expect } from '@playwright/test';
import { ApiController } from '../../src/api/apiController';
import { AiManager } from '../../src/ai/aiManager';

test.describe('Hybrid Scale Test: API Data Seeding -> UI Validation', () => {

  let ai: AiManager;

  test.beforeEach(async () => {
    ai = new AiManager();
  });

  test('Create 5 Users via API, Login with the Last User', async ({ page, request }) => {
    const api = new ApiController(request);
    let lastUser; 

    // --- PHASE 1: API DATA SEEDING ---
    console.log('\n--- PHASE 1: API DATA SEEDING (5 Users) ---');

    for (let i = 1; i <= 5; i++) {
      // 1. Generate unique data
      const userData = await ai.generateUserProfile('standard');
      
      // 2. Register via API (Real backend call)
      await api.registerUser(userData);
      
      console.log(`[API] User #${i} Created: ${userData.username}`);
      
      // 3. Keep track of the last user for the UI test
      lastUser = userData;
    }

    // --- PHASE 2: UI VALIDATION ---
    console.log(`\n--- PHASE 2: UI VALIDATION (User: ${lastUser.username}) ---`);

    await page.goto('https://parabank.parasoft.com/parabank/index.htm');

    // Login with the user we just created via API
    await page.fill('input[name="username"]', lastUser.username);
    await page.fill('input[name="password"]', lastUser.password);
    await page.click('input[value="Log In"]');

    // Verify Login
    await expect(page).toHaveTitle(/ParaBank/);
    await expect(page.locator('.smallText')).toContainText(`Welcome`);

    // Logout
    await page.getByRole('link', { name: 'Log Out' }).click();
    await expect(page.locator('input[value="Log In"]')).toBeVisible();
    
    console.log('--- TEST COMPLETE: Hybrid Flow Successful ---');
  });
});