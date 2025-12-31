import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// --- CONFIGURATION: 50 USERS ---
export const options = {
  // Define the load stages
  stages: [
    { duration: '10s', target: 10 }, // Ramp up to 10 users quickly
    { duration: '30s', target: 50 }, // Stay at 50 users (Load Test)
    { duration: '10s', target: 0 },  // Ramp down to 0
  ],
  // Define thresholds (Pass/Fail criteria)
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be faster than 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

export default function () {
  // 1. DEFINE THE REQUEST
  // We hit the backend directly (bypassing the browser UI for speed)
  const url = 'https://parabank.parasoft.com/parabank/login.htm';
  
  // K6 handles cookies automatically, just like a browser
  const payload = { 
    username: 'john', 
    password: 'demo' 
  };
  
  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // 2. EXECUTE
  const res = http.post(url, payload, params);

  // 3. VERIFY
  // Did we get a 302 Redirect (Success) or 200 OK?
  // (Parabank redirects to /overview.htm on success)
  check(res, {
    'is status 302 (Login Success)': (r) => r.status === 302 || r.status === 200,
  });

  // 4. THINK TIME
  // Simulate a user waiting 1 second before doing the next thing
  sleep(1);
}

// --- REPORTING ---
// Generate a nice HTML summary report
export function handleSummary(data) {
  return {
    "test-results/performance-report.html": htmlReport(data),
  };
}
