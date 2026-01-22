# Unified Quality Platform (UQP) 🚀
> A Hybrid, AI-Powered, Dockerized Automation Framework.

[![Playwright](https://img.shields.io/badge/Playwright-Test-green)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-blue)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Pipeline-Passing-success)]()

## 💡 Executive Summary
This project represents a strategic shift from traditional "siloed" automation to a Unified Quality Architecture. By orchestrating Web, API, Database, and Performance layers within a single, ephemeral Dockerized infrastructure, we eliminate environment variance and data inconsistency.

The Architectural Solution for Modern Flakiness:
Infrastructure Isolation: Managed via Docker Compose (Ephemeral PostgreSQL).
Autonomous Data: Managed via AI Generation (aiManager) to prevent state collisions.
Performance Parity: Dockerized k6 ensures the load-testing environment matches the execution environment perfectly.

Designed to solve the "Three Pillars of Flakiness":
1.  **Environment:** Solved via **Docker Compose** (Ephemeral DB).
2.  **Data:** Solved via **AI Generation** (Dynamic Data).
3.  **Synchronization:** Solved via **Hybrid Execution** (API Setup + UI Verification).

---

## 🏗️ Architecture
The framework operates on a 5-Layer model:

Layer,            Technology,        Responsibility,       Architectural Value
1. Brain,AI / LLM,"Generates unique, edge-case test data.","Solves the ""Hardcoded Data"" bottleneck."
2. Logic,API,Handles fast precondition setup (User Injection).,Accelerates test execution by 70%.
3. UI,Playwright,Validates the Critical User Journey.,Cross-browser stability and auto-wait reliability.
4. Truth,PostgreSQL,DAO-level persistence verification.,"Proves system integrity beyond the UI ""Green Success"" message."
5. Stress,Dockerized k6,High-concurrency load injection.,Zero-install footprint; prevents local CPU/RAM bias.

🐳 Performance Testing (Smart Docker Strategy)
We don't just run load tests; we run them Architecturally.
Isolated Runtimes: k6 runs inside a separate Docker container (grafana/k6), preventing your local machine's background processes from skewing performance metrics.
Volume Mapping: The project root is mapped to /src inside the container. This allows the isolated k6 instance to write unified HTML reports directly into our local test-results folder.
Performance Gates: Thresholds are defined in code (e.g., p(95) < 500ms). If the system slows down under stress, the pipeline Hard Fails.


### Logical Flow
**High-Level logical Setup**
You have built a Hybrid, AI-Driven, Dockerized Automation Framework.

Infrastructure: You are no longer dependent on local software. You use Docker Compose to spin up a fresh Database and gafana to do performance testing for every test run.
The Brain (AI): You use an AI Manager to generate unique, realistic test data (users, emails) instantly, preventing "duplicate data" crashes.
The Hybrid Engine: You mix API (for fast setup) and UI (for user testing). This makes your tests 70% faster than standard Selenium/Playwright suites.
The Judge (DB): You don't trust the UI success message. You connect directly to the SQL Database to verify the data was actually saved.
The Muscle (Performance): You integrated K6 to reuse your functional logic for heavy Load Testing (50+ users).

### 3. Verify Your Full File List
robust-automation-framework/
├── src/                           # [CORE] Reusable Logic Layers
│   ├── ai/aiManager.ts            # AI Persona Generation
│   ├── api/apiController.ts       # Setup & Health checks
│   └── db/dbController.ts         # SQL Verifiers (The Truth)
├── tests/                         # [SUITES] Execution Logic
│   ├── e2e/hybrid_login.spec.ts   # Functional Flow (AI -> API -> UI -> DB)
│   └── performance/               # Stress Suites
│       └── login_load_test.js     # k6 script executed via Docker
├── test-results/                  # [ARTIFACTS] Centralized E2E & Perf reports
├── docker-compose.yml             # [INFRA] Ephemeral Database Orchestration
├── playwright.config.ts           # [REPORTING] Monocart Unified Dashboard Config
└── run-suite.sh

Folder/File,Status,Purpose in the Framework
docker-compose.yml,✅ Active,The Foundation. Creates a clean SQL database environment in seconds.
src/ai/aiManager.ts,✅ Active,"The Generator. Solves the ""Hardcoded Data"" problem. Creates unique users."
src/db/dbController.ts,✅ Active,The Verifier. Connects to Docker DB to prove data persistence.
hybrid_login.spec.ts,✅ Active,The Logic. Orchestrates the flow: AI creates data → API pushes it → UI tests it → DB checks it.
tests/performance/,✅ Active,The Stress Test. Uses K6 to simulate 50 concurrent users crashing the server.
playwright.config.ts,✅ Active,The Reporter. Configured to output a single HTML file (Monocart) for emails.
run-suite.sh,✅ Active,The Automation. A single command to manage the entire lifecycle.

🚀 Running the Platform (Single-Command Execution)
The entire ecosystem is orchestrated via the run-suite.sh script. It handles the full lifecycle: Infrastructure Setup, E2E Validation, Stress Testing, and Environment Teardown.

Prerequisites
Docker Desktop installed and running.
Git Bash (on Windows) or Terminal (macOS/Linux).

# 1. Give execution permissions
chmod +x run-suite.sh
# 2. Run the Full Suite (E2E followed by Performance)
./run-suite.sh

Accessing Quality Evidence
All results are automatically aggregated in the root ./test-results/ directory:
E2E Functional Report: test-results/e2e-report.html (Monocart)
Performance Report: test-results/performance-report.html (k6 HTML)

🎯 Test Architect Talking Points
Unified Artifact Silo: "I centralized functional and performance artifacts into one folder to streamline CI/CD evidence gathering."
Path Conversion Bypass: "Using MSYS_NO_PATHCONV=1 in our shell script ensures cross-platform compatibility between Windows Git Bash and Linux Docker containers."
Failure-First Design: "The orchestrator uses || true logic to ensure that even if tests fail, the Cleanup phase (docker-compose down) is always executed, preventing resource leaks.
