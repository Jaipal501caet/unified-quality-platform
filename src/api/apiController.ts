import { APIRequestContext, expect } from '@playwright/test';

export class ApiController {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async checkHealth() {
    const baseUrl = process.env.BASE_URL || 'https://parabank.parasoft.com/parabank';
    const response = await this.request.get(`${baseUrl}/index.htm`);
    expect(response.status()).toBe(200);
  }

  /**
   * Registers a new user. 
   * Includes "Self-Healing" logic: If API returns 500, it checks if the user was created anyway.
   */
  async registerUser(userData: any) {
    console.log(`[API] Registering user: ${userData.username}...`);

    try {
        // 1. Warm up session
        await this.request.get('https://parabank.parasoft.com/parabank/index.htm');

        // 2. Attempt Registration
        // Note: We removed the manual 'Content-Type' header. Playwright handles it automatically with 'form'.
        const response = await this.request.post('https://parabank.parasoft.com/parabank/register.htm', {
            form: {
                'customer.firstName': userData.firstName,
                'customer.lastName': userData.lastName,
                'customer.address.street': userData.street,
                'customer.address.city': userData.city,
                'customer.address.state': userData.state,
                'customer.address.zipCode': userData.zipCode,
                'customer.phoneNumber': userData.phoneNumber,
                'customer.ssn': userData.ssn,
                'customer.username': userData.username,
                'customer.password': userData.password,
                'repeatedPassword': userData.password
            }
        });

        // 3. Robust Handling
        if (response.status() === 200) {
            console.log(`✅ [API] Registration Successful for ${userData.username}`);
            return;
        } 
        
        // If we get 500, DO NOT fail yet. Check if the user exists.
        if (response.status() === 500) {
            console.warn(`⚠️ [API] Got 500 Error. Verifying if user '${userData.username}' was created anyway...`);
            
            const verifyLogin = await this.request.post('https://parabank.parasoft.com/parabank/login.htm', {
                form: {
                    username: userData.username,
                    password: userData.password
                }
            });

            // If login redirects (302) or returns 200 with "Log Out" text, it worked.
            if (verifyLogin.url().includes('overview.htm') || (await verifyLogin.text()).includes('Log Out')) {
                console.log(`✅ [API] SELF-HEALING: User was created despite 500 Error! Proceeding.`);
                return; 
            }
        }

        // If we really failed
        throw new Error(`Registration failed with status ${response.status()}`);

    } catch (error) {
        console.error(`❌ [API] Critical Failure for ${userData.username}:`, error);
        throw error;
    }
  }
}