#!/bin/bash
echo "🚀 [Architect] Starting Infrastructure..."

# 1. Start Docker in Detached mode (Background)
docker-compose up -d db

# 2. Wait for DB to be healthy (Optional but safer)
echo "⏳ Waiting for Database..."
sleep 5 

# 3. Run the Unified Test Suite
echo "🧪 Running Tests..."
# We use 'call' or just the command depending on shell. 
# Using '|| true' ensures the script continues even if tests fail (so we can shutdown Docker)
npx playwright test tests/e2e/hybrid_login.spec.ts --reporter=html || true

# 4. Tear Down Infrastructure
echo "🧹 Cleaning up..."
docker-compose down

echo "✅ Execution Complete. Report generated."
