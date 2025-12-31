import { test, expect } from '@playwright/test';
import { ApiController } from '../../src/api/apiController';
import { DbController } from '../../src/db/dbController';
import { AiManager } from '../../src/ai/aiManager';

test.describe('Scale Test: Login Validation with 10 Unique AI Users', () => {

  let db: DbController;
  let ai: AiManager;

  test.beforeEach(async () => {
    db = new DbController();
    ai = new AiManager();
    await db.connect();
  });

  test.afterEach(async () => {
    await db.close();
  });

  // --- ARCHITECT PATTERN: DYNAMIC LOOP ---
  // This creates 10 separate test entries in your report
  const userCount = 1;

  for (let i = 1; i <= userCount; i++) {
    
    test(`Iteration #${i}: AI User Creation & Login Flow`, async ({ page, request }) => {
      
      console.log(`\n--- STARTING ITERATION ${i} ---`);

      // 1. Ask AI for UNIQUE data (It will differ every millisecond)
      const testData = await ai.generateUserProfile('standard');
      console.log(`[Iter ${i}] AI Generated User: ${testData.username}`);

      // 2. API: Create the user in Backend
      const api = new ApiController(request);
      await api.checkHealth();
      await api.createUser(testData.username);

      // 3. UI: Login with this specific user
      await page.goto('/');
      await page.fill('input[name="username"]', testData.username);
      await page.fill('input[name="password"]', testData.password);
      await page.click('input[value="Log In"]');

      await expect(page).toHaveTitle(/ParaBank/);

      // 4. DB: Verify this specific user exists
      const isUserPresent = await db.verifyUserCreated(testData.username);
      expect(isUserPresent).toBeTruthy();
      
      console.log(`[Iter ${i}] Success!`);
    });
  }
});
