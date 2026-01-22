#!/bin/bash
set -e 

# --- CONFIGURATION ---
# This ensures the script stops immediately if any command fails
# creating a "Fail Fast" pipeline.

echo "🚀 [Architect] Starting Unified Pipeline..."

echo "🚀 [Architect] Starting Unified Pipeline..."

# 1. SETUP: Create Results Directory
# 🟢 FIX: Create folder AND force full permissions so the Container User can write to it
mkdir -p test-results
chmod 777 test-results  # <--- ADD THIS LINE

# ... rest of script ...

# 2. INFRASTRUCTURE: Start Database
echo "📦 [Infra] Starting Database..."
docker compose up -d db

# 3. PHASE 1: Playwright (Functional)
echo "🧪 [Phase 1] Running Playwright E2E..."
# TRICK: We use '//bin/bash' so it works on Windows Git Bash AND Linux CI
# TRICK: We run 'npm install' inside to ensure dependencies exist
docker compose run --rm e2e //bin/bash -c "npm install && npx playwright test tests/e2e/hybrid_login.spec.ts"

# 4. PHASE 2: K6 (Performance)
echo "🔥 [Phase 2] Running K6 Load Test..."
# TRICK: We use '//src/...' to prevent Windows path conversion
docker compose run --rm k6 run //src/tests/performance/register_load_test.js

# 5. TEARDOWN
echo "🧹 [Cleanup] Stopping Containers..."
docker compose down

echo "✅ PIPELINE SUCCESS: All Systems Green."