import { test } from '@playwright/test';

export class AiManager {
  
  async generateUserProfile(scenario: 'standard' | 'high_risk' | 'edge_case') {
    console.log(`🧠 [AI] Generating Data for Scenario: ${scenario}...`);

    // FIX: Use a simple 6-digit random ID
    const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
    
    return {
        firstName: 'Auto',
        lastName: `Mation${uniqueId}`,
        username: `user${uniqueId}`, // Simple username
        password: "password123",
        
        // FIX: Standard US SSN (XXX-XX-XXXX)
        ssn: `${Math.floor(Math.random() * 899) + 100}-${Math.floor(Math.random() * 89) + 10}-${uniqueId.slice(-4)}`,
        
        street: "123 Automation Rd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210", 
        
        // 🟢 CRITICAL FIX: 10-Digit Phone Number (was 7 digits, causing crash)
        phoneNumber: `310-555-${uniqueId.slice(-4)}`
    };
  }

  async analyzeFailure(errorMessage: string) {
      // ... keep existing logic ...
      return "Suggestion: Check logs.";
  }
}
