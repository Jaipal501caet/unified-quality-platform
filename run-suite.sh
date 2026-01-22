#!/bin/bash
# -------------------------------------------------------------------------
# Unified Quality Platform - Orchestration Script
# -------------------------------------------------------------------------

echo "🚀 [Architect] Starting Infrastructure..."

# 1. Start Docker in Detached mode (Background)
# This spins up the PostgreSQL container defined in your docker-compose.yml
docker-compose up -d db

# 2. Wait for DB to be healthy
echo "⏳ Waiting 5s for Database to stabilize..."
sleep 5

# 3. Ensure the unified results directory exists
mkdir -p test-results

# 4. Phase 1: Run Playwright E2E Tests (Functional)
echo "🧪 [Phase 1] Running Playwright E2E Tests..."
# '|| true' ensures we proceed to performance tests and cleanup even if UI tests fail
npx playwright test tests/e2e/hybrid_login.spec.ts ||

# 5. Phase 2: Run K6 Performance Tests (Stress)
echo "🔥 [Phase 2] Running K6 Performance Tests in Docker..."
# MSYS_NO_PATHCONV=1 is required for Git Bash on Windows to handle the /src mount correctly
MSYS_NO_PATHCONV=1 docker run --rm -i -v "$(pwd):/src" \
  grafana/k6 run /src/tests/performance/login_load_test.js ||

# 6. Tear Down Infrastructure
echo "🧹 [Cleanup] Tearing down Infrastructure..."
docker-compose down

echo "------------------------------------------------------------"
echo "✅ Execution Complete."
echo "📂 Reports generated in: ./test-results/"
echo "   - E2E Dashboard: e2e-report.html"
echo "   - Performance Report: performance-report.html"
echo "------------------------------------------------------------"
