import { APIRequestContext, expect } from '@playwright/test';

export class ApiController {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // Example: Check if the application is up
  async checkHealth() {
    const response = await this.request.get(`${process.env.BASE_URL}/index.htm`);
    expect(response.status()).toBe(200);
    console.log('API Health Check Passed');
  }

  // Example: Create a new user (Simulated for this demo)
  async createUser(username: string) {
    // In a real app, you would POST to /register endpoint here
    console.log(`[API] Creating user: ${username} via API...`);
    // Simulating a successful API call
    return { status: 200, id: 12345, username: username };
  }
}
