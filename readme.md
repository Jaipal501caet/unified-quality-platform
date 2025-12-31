# Unified Quality Platform (UQP) 🚀
> A Hybrid, AI-Powered, Dockerized Automation Framework.

[![Playwright](https://img.shields.io/badge/Playwright-Test-green)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-blue)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Pipeline-Passing-success)]()

## 💡 Executive Summary
This project represents a shift from traditional "siloed" automation to a **Unified Quality Architecture**. It orchestrates tests across Web, API, Database, and Performance layers in a single pipeline.

Designed to solve the "Three Pillars of Flakiness":
1.  **Environment:** Solved via **Docker Compose** (Ephemeral DB).
2.  **Data:** Solved via **AI Generation** (Dynamic Data).
3.  **Synchronization:** Solved via **Hybrid Execution** (API Setup + UI Verification).

---

## 🏗️ Architecture
The framework operates on a 5-Layer model:

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **1. Brain** | **AI / LLM** | Generates unique, edge-case test data to prevent collisions. |
| **2. Logic** | **API** | Handles fast precondition setup (User Creation) in milliseconds. |
| **3. UI** | **Playwright** | Validates the User Experience (Login, Dashboard) on Chrome/WebKit. |
| **4. Truth** | **PostgreSQL** | Connects to Docker DB to verify data persistence (DAO Pattern). |
| **5. Stress** | **K6** | Reuses functional logic to simulate 50+ concurrent users. |

### Logical Flow
```mermaid
graph LR
A[AI Generator] -->|Data| B(API Layer)
B -->|Seed Backend| C{Docker DB}
D[UI Automation] -->|Login| E(Web App)
D -->|Verify| C
F[K6 Load Test] -->|Stress| E

### 3. Verify Your Full File List
Ensure your project looks exactly like this before pushing.
robust-automation-framework/
│
├── .github/
│   └── workflows/
│       └── daily_automation.yml   # [CI/CD] GitHub Actions pipeline to run daily at 8 AM
│
├── src/                           # [SOURCE CODE] Reusable Logic Layers
│   ├── ai/
│   │   └── aiManager.ts           # [AI Layer] Generates dynamic data (Users/Passwords)
│   ├── api/
│   │   └── apiController.ts       # [API Layer] Setup & Health checks (Fast)
│   ├── db/
│   │   └── dbController.ts        # [DB Layer] Direct SQL verification (The "Truth")
│   ├── mobile/
│   │   └── mobileController.ts    # [Mobile Layer] Appium wrapper for Android/iOS
│   └── utils/
│       └── DatabaseManager.ts     # [Utility] Connection pooling logic
│
├── tests/                         # [TEST SUITES] Where execution happens
│   ├── e2e/
│   │   └── hybrid_login.spec.ts   # [Functional] The Master Test (AI -> API -> UI -> DB)
│   └── performance/
│       └── login_load_test.js     # [Load] K6 Script for Stress Testing (50 Users)
│
├── .env                           # [CONFIG] Secrets (DB Passwords, Base URLs)
├── docker-compose.yml             # [INFRA] Spins up Postgres DB container
├── package.json                   # [DEPS] Lists Playwright, K6, Postgres, Monocart
├── playwright.config.ts           # [CONFIG] Monocart Reporter & Parallel settings
├── run-suite.sh                   # [EXECUTION] One-click script (Up -> Test -> Down)
└── README.md                      # [DOCS] The "Interview Guide" for this project

Folder/File,Status,Purpose in the Framework
docker-compose.yml,✅ Active,The Foundation. Creates a clean SQL database environment in seconds.
src/ai/aiManager.ts,✅ Active,"The Generator. Solves the ""Hardcoded Data"" problem. Creates unique users."
src/db/dbController.ts,✅ Active,The Verifier. Connects to Docker DB to prove data persistence.
hybrid_login.spec.ts,✅ Active,The Logic. Orchestrates the flow: AI creates data → API pushes it → UI tests it → DB checks it.
tests/performance/,✅ Active,The Stress Test. Uses K6 to simulate 50 concurrent users crashing the server.
playwright.config.ts,✅ Active,The Reporter. Configured to output a single HTML file (Monocart) for emails.
run-suite.sh,✅ Active,The Automation. A single command to manage the entire lifecycle.