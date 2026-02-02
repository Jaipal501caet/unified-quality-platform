import { test, expect } from '@playwright/test';
import { ApiController } from '../../src/api/apiController';
import { AiManager } from '../../src/ai/aiManager';

test.describe('Hybrid Scale Test', () => {
    // 60s is safer for public servers, though 30s might work now.
    test.setTimeout(60000); 

    let ai: AiManager;

    test.beforeEach(async () => {
        ai = new AiManager();
    });

    test('Create 5 Users via API, Login with the Last User', async ({ page }) => {
        console.log('--- PRE-CONDITION: Initializing Browser Session ---');
        await page.goto('https://parabank.parasoft.com/parabank/register.htm');

        const api = new ApiController(page.request);
        let lastUser; 

        console.log('\n--- PHASE 1: API DATA SEEDING (5 Users) ---');

        for (let i = 1; i <= 5; i++) {
            const userData = await ai.generateUserProfile('standard');
            await api.registerUser(userData);
            lastUser = userData;
        }

        console.log(`\n--- PHASE 2: UI VALIDATION (User: ${lastUser.username}) ---`);
        
        // 🟢 FIX: Force Logout first! 
        // The API registration left us logged in as User #5.
        // We must log out to see the Login Form again.
        console.log('[UI] Clearing previous session (Logout)...');
        await page.goto('https://parabank.parasoft.com/parabank/logout.htm');
        
        // NOW we can go to the login page and expect the input fields
        await page.goto('https://parabank.parasoft.com/parabank/index.htm');
        
        await page.fill('input[name="username"]', lastUser.username);
        await page.fill('input[name="password"]', lastUser.password);
        await page.click('input[value="Log In"]');

		// 🟢 FIX: Wait for the URL to change first (Best Practice)
		// This ensures the navigation actually happened before we check for text.
		await page.waitForURL('**/overview.htm', { timeout: 20000 });

		// 🟢 FIX: Increase timeout for the text check (5s -> 15s)
		// This handles the slow "Welcome" message rendering on the demo server.
		await expect(page.locator('.smallText')).toContainText(`Welcome`, { timeout: 15000 });
        
        await page.getByRole('link', { name: 'Log Out' }).click();
        
        console.log('--- TEST COMPLETE: Hybrid Flow Successful ---');
    });
});
