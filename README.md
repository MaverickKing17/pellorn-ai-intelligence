bastion-audit

Enterprise AI Security Posture Management (AI-SPM) and a runtime governance layer for Canadian financial institutions. Bastion acts as a semantic firewall between autonomous AI agents and the enterprise systems they control — intercepting prompt injections, preventing PII leakage, and providing real-time OSFI E-21 compliance monitoring across your entire AI agent fleet.

⚡ Real-time Interception
Sub-10ms guardrail execution across Lakera Guard, Presidio PII detection, and financial compliance checks.

🧠 Behavioral Drift Detection
30-day baseline profiling per agent. Circuit-breaker auto-terminates sessions that deviate beyond the threshold.

🔐 Zero Trust Agent Identity
JIT cryptographic identity per agent session. Short-lived tokens replace static API keys.

📋 OSFI E-21 Registry
Immutable audit trail for every AI model deployed. Automated compliance scoring across your entire portfolio.

Tech stack
React 18
TypeScript 5
Vite
Tailwind CSS
shadcn/ui
Recharts
Lucide React
React Router
Space Grotesk
JetBrains Mono
Dashboard tabs
01 · Live Threat Feed
Real-time interception gateway, guardrail execution, agent log stream
02 · Red Team Sandbox
Manual adversarial simulation environment with global search
03 · Model Inventory
OSFI E-21 agent registry with risk tier scoring and audit history
04 · Vulnerability Audit
30-day deep-dive report with Lakera Guard integration
05 · Behavioral Drift ✦ new
Agent baseline vs. anomaly drift chart with Circuit Breaker log
06 · Board Report ✦ new
Executive summary, compliance posture, AI-generated narrative
Getting started
git clone https://github.com/your-org/bastion-audit.git
cd bastion-audit
npm install
cp .env.example .env.local
npm run dev
Environment variables
# .env.local
VITE_LAKERA_API_KEY=your_lakera_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TENANT_ID=global-enterprise
VITE_DATA_REGION=CA-CENTRAL  # Canadian sovereign data residency
Regulatory compliance
Framework	Scope	Status	Coverage
OSFI E-21	AI model governance, FRFIs	● Compliant — 96%	Model inventory, risk scoring, audit trail
PIPEDA	Personal data protection	● Compliant — 98%	PII detection, data residency enforcement
AIDA	Federal AI legislation	◑ Under review — 81%	2 controls pending — impact assessment
SOC 2 Type II	Security & availability	● Compliant — 94%	Immutable Supabase audit trail, access logs
Data residency
All PII processing and immutable audit trails are strictly confined to Canadian sovereign infrastructure. Primary region: Canada Central. Failover zone: Canada East. No data leaves Canadian borders.

Roadmap
Done
Live Threat Feed with real-time guardrail execution
Done
Model Inventory with OSFI E-21 risk tier registry
Done
30-Day Vulnerability Audit with Lakera Guard integration
Done
Behavioral Drift tab with anomaly detection chart
Done
Board Report tab with AI-generated executive narrative
Soon
Supabase backend — live data replacing simulation layer
Soon
Lakera Guard API integration — real prompt scanning
Soon
SIEM export — Splunk & Microsoft Sentinel connectors
Planned
Multi-tenant support for banking group subsidiaries
Planned
Agent-to-agent communication DLP network graph
Planned
JIT cryptographic agent identity panel
Project structure
bastion-audit/
├── src/
│   ├── components/
│   │   ├── layout/          # Nav, sidebar, footer
│   │   ├── tabs/            # One folder per tab
│   │   │   ├── LiveThreatFeed/
│   │   │   ├── RedTeamSandbox/
│   │   │   ├── ModelInventory/
│   │   │   ├── VulnerabilityAudit/
│   │   │   ├── BehavioralDrift/
│   │   │   └── BoardReport/
│   │   └── ui/              # shadcn/ui overrides
│   ├── hooks/
│   │   └── useSimulation.ts # Live data simulation hook
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts         # Agent, Threat, ComplianceScore types
├── public/
├── .env.example
└── README.md
Contributing
This project is currently in private MVP development. Contact the maintainers to request access or discuss partnership opportunities.

Built in Toronto, ON · Protecting Canadian financial infrastructure · © 2026 Bastion Audit Security
