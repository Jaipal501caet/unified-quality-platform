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

        // 3. Success Handling
        if (response.status() === 200) {
            console.log(`✅ [API] Registration Successful for ${userData.username}`);
            return;
        } 
        
        // 4. Self-Healing Logic (Handle 500 Errors)
        if (response.status() === 500) {
            console.warn(`⚠️ [API] Got 500 Error. Verifying if user '${userData.username}' was created anyway...`);
            
            // Debug: Print the 500 error body just in case verification fails later
            const errorBody = await response.text();
            console.log(`   [Debug] 500 Error Body was: ${errorBody.substring(0, 200)}...`); 

            const verifyLogin = await this.request.post('https://parabank.parasoft.com/parabank/login.htm', {
                form: {
                    username: userData.username,
                    password: userData.password
                }
            });

            // If login succeeds, we consider registration a success
            if (verifyLogin.url().includes('overview.htm') || (await verifyLogin.text()).includes('Log Out')) {
                console.log(`✅ [API] SELF-HEALING: User was created despite 500 Error! Proceeding.`);
                return; 
            }
            
            console.error(`❌ [API] Self-healing failed. User '${userData.username}' was NOT created.`);
        }

        // 5. Failure Handling (If we reached here, something is wrong)
        // If status is NOT 200 and NOT a "healed" 500, we must crash and report details.
        
        const errorBody = await response.text(); 
        console.error(`❌ [API Debug] Status: ${response.status()}`);
        console.error(`❌ [API Debug] Response Body: ${errorBody}`);
        console.error(`❌ [API Debug] Sent Payload:`, JSON.stringify(userData, null, 2));

        throw new Error(`Registration failed with status ${response.status()} - ${errorBody}`);

    } catch (error) {
        console.error(`❌ [API] Critical Failure for ${userData.username}:`, error);
        throw error;
    }
  }
}
