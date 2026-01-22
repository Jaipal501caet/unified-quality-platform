import { test } from '@playwright/test';

export class AiManager {
  
  async generateUserProfile(scenario: 'standard' | 'high_risk' | 'edge_case') {
    console.log(`🧠 [AI] Generating Data for Scenario: ${scenario}...`);

    // Create a unique ID based on time + random number
    const uniqueId = Date.now().toString().slice(-6) + Math.floor(Math.random() * 999);
    
    // Standard User with UNIQUE SSN
    return {
        firstName: 'Auto',
        lastName: `Mation${uniqueId}`,
        username: `auto_user_${uniqueId}`,
        password: "password123",
        // 🟢 CRITICAL FIX: Unique SSN prevents 500 Errors
        ssn: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${uniqueId.slice(-4)}`,
        street: `${Math.floor(Math.random() * 999)} Automation Rd`,
        city: 'Gurugram',
        state: 'HR',
        zipCode: '122001',
        phoneNumber: `555-${uniqueId.slice(-4)}`
    };
  }

  /**
   * Uses AI to analyze a failure message (Simulated).
   */
  async analyzeFailure(errorMessage: string) {
      console.log(`🧠 [AI] Analyzing error: "${errorMessage}"`);
      // Simulating LLM response
      if (errorMessage.includes("Timeout")) {
          return "Suggestion: Network lag detected. Increase default timeout in playwright.config.ts";
      }
      return "Suggestion: Check if the element selector ID has changed.";
  }
}