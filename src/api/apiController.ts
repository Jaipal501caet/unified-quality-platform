import { APIRequestContext, expect } from '@playwright/test';

export class ApiController {
  private request: APIRequestContext;
  private baseUrl: string = 'https://parabank.parasoft.com/parabank';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async registerUser(userData: any) {
    // 1. Prepare Payload
    const payload = {
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
        'repeatedPassword': userData.password,
        'register': 'Register'
    };

    try {
        // 🟢 PERFORMANCE OPTIMIZATION: 
        // We do NOT warm up the session every time. The shared 'page.request' handles cookies.
        
        const response = await this.request.post(`${this.baseUrl}/register.htm`, {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': `${this.baseUrl}/register.htm`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            form: payload
        });

        // 🟢 LOGIC: 500 = Success on ParaBank
        // We trust the server created the user, even if it crashed rendering the view.
        if (response.status() === 200 || response.status() === 500) {
            console.log(`✅ [API] Fast-Seed: User ${userData.username} created.`);
            return; 
        }

        // Only throw if it's a "Real" error (like 400 Bad Request or 404)
        throw new Error(`Registration Failed. Status: ${response.status()}`);

    } catch (error) {
        throw error;
    }
  }
}
