

# Bastion Audit: Enterprise AI Security Gateway

**Bastion Audit** is an AI Security Posture Management (AI-SPM) and runtime governance layer designed specifically for the Canadian financial sector. It provides a "Sovereign Security" gateway between autonomous AI agents and the enterprise systems they control.

**[Live Demo (Vercel)](https://bastion-audit.vercel.app)** | **[Security Documentation](https://www.google.com/search?q=%23-security-stack)**

---

## 🛡️ Core Value Proposition

As Canadian financial institutions (FRFIs) deploy autonomous agents, they face unique regulatory and security risks. Bastion Audit acts as a semantic firewall to intercept adversarial attacks and ensure compliance with **OSFI Guideline E-21**.

* **Sub-10ms Interception:** Real-time guardrail execution across Lakera Guard and Presidio PII detection.
* **Behavioral Drift Detection:** 30-day baseline profiling per agent with automated circuit-breaker termination.
* **Zero Trust Identity:** Cryptographic identity per agent session using short-lived tokens.
* **Sovereign Data Residency:** Primary region pinned to **Canada Central** with automated PII scrubbing before data leaves the sovereign border.

---

## 🚀 Feature Breakdown

### 1. Red Team Sandbox (Simulation Mode)

A secure environment for manual adversarial simulation. Stress-test your agents against prompt injections and jailbreaks before production deployment.

* **Scenario Testing:** Underwriting bias, financial fraud, and PII leak simulations.
* **Guardrail Audit:** Real-time feedback on which security layers (Lakera, OSFI-E21, etc.) caught the violation.

### 2. Live Threat Feed

High-fidelity telemetry of all active AI agent sessions across the enterprise tenant.

* **Kill-Switch:** One-click manual or automated termination of suspicious agent sessions.
* **Behavioral Stream:** Real-time monitoring of Chain-of-Thought (CoT) to detect logic-based drift.

### 3. Vulnerability Audit & Compliance

Automated scoring against Canadian and international frameworks:

* **OSFI E-21:** Operational Risk Management for AI.
* **PIPEDA:** Automated PII redaction and audit logging.
* **AIDA (Bill C-27):** Preparing for upcoming Canadian AI regulations.

---

## ⚙️ The Security Stack

| Layer | Component | Function |
| --- | --- | --- |
| **Inline Shield** | **Lakera Guard** | Prompt injection & jailbreak prevention. |
| **Data Protection** | **Microsoft Presidio** | PII entity recognition and redaction. |
| **Identity (IAM)** | **Microsoft Entra ID** | Secure SSO and granular RBAC. |
| **SIEM Integration** | **Microsoft Sentinel** | Long-term log retention and threat correlation. |

---

## 🛠️ Technical Implementation

### Tech Stack

* **Frontend:** React 18 / TypeScript 5 / Vite
* **Styling:** Tailwind CSS / shadcn/ui
* **Visualizations:** Recharts / Lucide Icons
* **Deployment:** Vercel (Canada Central)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/MaverickKing17/bastion-audit.git

# Install dependencies
npm install

# Set up local environment
cp .env.example .env.local

# Launch development server
npm run dev

```

---

## 🗺️ Roadmap

* [x] **Phase 1:** Live Threat Feed & Lakera Guard Integration.
* [x] **Phase 2:** Red Team Sandbox & Behavioral Drift Baseline.
* [ ] **Phase 3:** Native Microsoft Sentinel & Splunk Connectors.
* [ ] **Phase 4:** Multi-tenant support for Tier 1 Canadian Banks.

---

## ⚖️ Governance & Legal

Built in Toronto, ON. Designed to protect Canadian financial infrastructure.

**Founder:** Dwayne Benjamin


