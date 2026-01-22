import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// --- CONFIGURATION ---
export const options = {
  // 🚀 Load Profile:
  // We simulate a realistic "Ramp Up" -> "Peak Load" -> "Ramp Down"
  stages: [
    { duration: '5s', target: 5 },   // Warm up to 5 users
    { duration: '10s', target: 5 },  // Maintain load
    { duration: '5s', target: 0 },   // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete within 2s
    http_req_failed: ['rate<0.01'],    // Error rate must be under 1%
  },
};

export default function () {
  const BASE_URL = 'https://parabank.parasoft.com/parabank';
  
  // 1. DYNAMIC DATA GENERATION
  // We generate a unique user for every single iteration.
  // This guarantees we never hit "User Already Exists" errors.
  const randomId = Math.floor(Math.random() * 1000000);
  const username = `auto_user_${randomId}`;
  const password = 'password123';

  // 2. WARMUP (Critical Step)
  // Visit the page first to establish the JSESSIONID cookie.
  // Without this, the server will reject the POST request (Status 500).
  const visitRes = http.get(`${BASE_URL}/register.htm`);
  
  check(visitRes, { 
    'Register Page Loaded': (r) => r.status === 200 
  });

  sleep(1); // Think time (simulate human typing)

  // 3. REGISTER ACTION
  // Parabank automatically logs you in upon successful registration.
  const payload = {
    'customer.firstName': 'K6',
    'customer.lastName': 'Performance',
    'customer.address.street': '123 Load Test Blvd',
    'customer.address.city': 'Cloud',
    'customer.address.state': 'NY',
    'customer.address.zipCode': '90210',
    'customer.phoneNumber': '555-555-5555',
    'customer.ssn': randomId,
    'customer.username': username,
    'customer.password': password,
    'repeatedPassword': password,
  };

  const registerRes = http.post(`${BASE_URL}/register.htm`, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  // 4. VALIDATION
  // Success means either a Redirect (302) or the Welcome Page (200)
  const isSuccess = check(registerRes, {
    'Registration Successful': (r) => r.status === 200 || r.status === 302,
    'Welcome Message Present': (r) => r.body && r.body.includes('Your account was created successfully'),
  });

  // 5. DEBUGGING (Fail Fast)
  if (!isSuccess) {
    console.error(`❌ Failed: ${username} | Status: ${registerRes.status}`);
    // Print a snippet of the error to help debug
    if (registerRes.status === 500) {
      console.error(`   Server Error: ${registerRes.body ? registerRes.body.substring(0, 100) : 'No Body'}`);
    }
  }

  sleep(1);
}

// --- REPORTING ---
export function handleSummary(data) {
  return {
    // 🟢 FIX: Use absolute path '/src/' to guarantee the folder is found
    "/src/test-results/performance-report.html": htmlReport(data),
    
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}