#!/bin/bash
set -e 

# --- CONFIGURATION ---
# "Fail Fast" pipeline: Stops immediately if any command fails.

echo "🚀 [Architect] Starting Unified Pipeline..."

# 1. SETUP: Create Results Directory
echo "📂 [Setup] Cleaning previous results..."
rm -rf test-results
mkdir -p test-results
chmod 777 test-results

# 2. INFRASTRUCTURE: Build Containers
# We use --build to ensure code changes (Self-Healing logic) are baked in.
echo "🐳 [Infra] Building Docker Containers..."
docker compose build e2e k6

# 3. PHASE 1: Playwright (Hybrid Functional Test)
echo "🧪 [Phase 1] Running Playwright Hybrid Suite..."
# Runs the API Data Seeding -> UI Validation flow
docker compose run --rm e2e //bin/bash -c "npm install && npx playwright test tests/e2e/hybrid_login.spec.ts"

# 4. PHASE 2: K6 (Performance Test)
echo "🔥 [Phase 2] Running K6 Load Test..."
docker compose run --rm k6 run //src/tests/performance/register_load_test.js

# 5. TEARDOWN
echo "🧹 [Cleanup] Stopping Containers..."
docker compose down

echo "✅ PIPELINE SUCCESS: All Systems Green."