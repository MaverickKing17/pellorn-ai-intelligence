import {
  ShieldAlert, ShieldCheck, AlertTriangle, FolderKey, Lock, Key, RefreshCw,
  Shield, Users, Activity, Scale, CheckCircle2, AlertOctagon, ArrowRight,
} from 'lucide-react';

function IntegrationBadge() {
  return (
    <span className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
      [Integration Preview]
    </span>
  );
}

function CardShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative bg-[#0d1527] border border-slate-800 rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_10px_30px_-10px_rgba(0,0,0,0.6)] ${className}`}>
      <IntegrationBadge />
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pr-32">
      <Icon className="w-4 h-4 text-accent-teal" />
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-200">{title}</h3>
    </div>
  );
}

/* ---------- 1. Microsoft Purview ---------- */
function PurviewCard() {
  const bars = [60, 35, 78, 42, 90, 55, 70, 48, 82, 38, 66, 74, 52, 88, 45];
  const categories = [
    { label: 'Restricted', color: 'bg-red-400' },
    { label: 'Confidential', color: 'bg-amber-400' },
    { label: 'Public', color: 'bg-emerald-400' },
    { label: 'Blocked', color: 'bg-slate-500' },
  ];
  return (
    <CardShell>
      <CardHeader icon={ShieldAlert} title="Microsoft Purview — Data Protection" />

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Purview Labels / AI Traffic</span>
          <span className="text-[10px] font-mono text-emerald-400">live</span>
        </div>
        <div className="flex items-end gap-1 h-12">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-accent-teal/60 to-accent-teal/20" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          {categories.map(c => (
            <div key={c.label} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${c.color}`} />
              <span className="text-[10px] font-mono text-slate-400">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Row icon={ShieldCheck} iconClass="text-emerald-400" tone="emerald">
          <div className="flex-1">
            <p className="text-xs text-slate-200">Purview Sensitivity Label Detected</p>
            <p className="text-[10px] font-mono text-emerald-300/80">Confidential / Highly Restricted</p>
          </div>
        </Row>
        <Row icon={AlertTriangle} iconClass="text-red-400" tone="red">
          <div className="flex-1">
            <p className="text-xs text-slate-200">PII Policy Check — SIN Detected</p>
            <p className="text-[10px] font-mono text-red-300/80">policy: ca.pii.sin.v2</p>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">● BLOCKED</span>
        </Row>
        <Row icon={FolderKey} iconClass="text-amber-400">
          <div className="flex-1">
            <p className="text-xs text-slate-200">Purview Classification</p>
            <p className="text-[10px] font-mono text-slate-400">Financial Records (110 matches)</p>
          </div>
        </Row>
        <Row icon={Lock} iconClass="text-accent-blue">
          <div className="flex-1">
            <p className="text-xs text-slate-200">PII Redacted before transit</p>
            <p className="text-[10px] font-mono text-slate-400">→ azure.openai/canada-central</p>
          </div>
        </Row>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Active Policies Audited</p>
          <p className="font-mono text-lg text-slate-100">03</p>
        </div>
        <p className="text-[10px] font-mono text-amber-400">⚠ Breach Prevention: 12 incidents / wk</p>
      </div>
    </CardShell>
  );
}

/* ---------- 2. Azure Key Vault ---------- */
function KeyVaultCard() {
  const rotation = [40, 55, 35, 70, 50, 80, 60, 75, 45, 90, 65, 72];
  return (
    <CardShell>
      <CardHeader icon={Key} title="Azure Key Vault Integration" />

      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_-2px_rgba(16,185,129,0.5)]">
          Status: [ CONNECTED · Canada Central ]
        </span>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-2 py-1.5">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">Key Rotation</p>
          <div className="flex items-end gap-0.5 h-6">
            {rotation.map((h, i) => (
              <div key={i} className="w-1 rounded-sm bg-emerald-400/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Vault URI</p>
        <p className="font-mono text-xs text-accent-teal break-all">vault-bastion-pilot-rbc.vault.azure.net</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-3 space-y-2 mb-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Monitored Secrets</p>
        <SecretRow name="VITE_LAKERA_API_KEY" meta="Rotated 4 days ago" />
        <SecretRow name="ENTRA_CLIENT_SECRET" meta="Active" />
      </div>

      <div className="space-y-2">
        <Row icon={RefreshCw} iconClass="text-emerald-400" tone="emerald">
          <div className="flex-1">
            <p className="text-xs text-slate-200">Auto-Rotation</p>
            <p className="text-[10px] font-mono text-emerald-300/80">enabled: yes</p>
          </div>
        </Row>
        <Row icon={Shield} iconClass="text-accent-blue">
          <div className="flex-1">
            <p className="text-xs text-slate-200">Hardware HSM Level</p>
            <p className="text-[10px] font-mono text-slate-400">FIPS 140-2 L3 Validated · Active</p>
          </div>
        </Row>
        <Row icon={Users} iconClass="text-amber-400">
          <div className="flex-1">
            <p className="text-xs text-slate-200">RBAC Enforcement</p>
            <p className="text-[10px] font-mono text-slate-400">via Entra ID · Active</p>
          </div>
        </Row>
      </div>
    </CardShell>
  );
}

function SecretRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Lock className="w-3 h-3 text-slate-500 shrink-0" />
        <p className="font-mono text-[11px] text-slate-200 truncate">{name}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">[ ENCRYPTED ]</span>
        <span className="font-mono text-[9px] text-slate-500">{meta}</span>
      </div>
    </div>
  );
}

/* ---------- 3. Defender for Cloud ---------- */
function DefenderCard() {
  const feed = [
    { sev: 'High', incident: 'LLM Jailbreak', source: 'Agent01', time: '1m', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
    { sev: 'Medium', incident: 'Data Drift', source: 'Model04', time: '5m', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { sev: 'Low', incident: 'Key Vault Audit', source: 'System', time: '1h', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  ];
  return (
    <CardShell>
      <CardHeader icon={Activity} title="Microsoft Defender for Cloud" />

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Sentinel Telemetry</p>
          <p className="text-xs text-slate-200 mt-0.5">AI Workload Monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] text-emerald-400">[ ACTIVE ]</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-[70px_1fr_90px_60px] gap-2 px-3 py-2 border-b border-slate-800">
          {['Severity', 'Incident', 'Source', 'Time'].map(c => (
            <span key={c} className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{c}</span>
          ))}
        </div>
        {feed.map((r, i) => (
          <div key={i} className="grid grid-cols-[70px_1fr_90px_60px] gap-2 px-3 py-2.5 border-b border-slate-800/50 last:border-b-0 items-center">
            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border w-fit ${r.color}`}>{r.sev}</span>
            <span className="text-xs text-slate-200">{r.incident}</span>
            <span className="font-mono text-[10px] text-slate-400">{r.source}</span>
            <span className="font-mono text-[10px] text-slate-500">{r.time}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Row icon={CheckCircle2} iconClass="text-emerald-400" tone="emerald">
          <div className="flex-1">
            <p className="text-xs text-slate-200">Key Vault Access Log Audited</p>
            <p className="text-[10px] font-mono text-emerald-300/80">passed</p>
          </div>
        </Row>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">Jailbreaks</p>
            <p className="font-mono text-lg text-red-400">12</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">Hallucinations</p>
            <p className="font-mono text-lg text-amber-400">01</p>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ---------- 4. OSFI Compliance ---------- */
function ComplianceCard() {
  const pct = 91;
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <CardShell>
      <CardHeader icon={Scale} title="OSFI E-21 / Compliance Mapping" />

      <div className="flex items-center gap-5 mb-4">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={r} stroke="rgb(30 41 59)" strokeWidth="8" fill="none" />
            <circle
              cx="50" cy="50" r={r}
              stroke="url(#grad)" strokeWidth="8" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-2xl text-slate-100">{pct}%</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-500">Compliance</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Risk Rating</p>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            LOW – MEDIUM
          </span>
          <p className="text-[10px] font-mono text-slate-500 mt-3">Next audit window: 14 days</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <Row icon={CheckCircle2} iconClass="text-emerald-400" tone="emerald">
          <div className="flex-1">
            <p className="text-xs text-slate-200">OSFI E-21 (Sec 4.2) — Model Risk Mgmt</p>
            <p className="text-[10px] font-mono text-emerald-300/80">98% · Ready to certify</p>
          </div>
        </Row>
        <Row icon={AlertOctagon} iconClass="text-amber-400" tone="amber">
          <div className="flex-1">
            <p className="text-xs text-slate-200">PIPEDA — Data Handling</p>
            <p className="text-[10px] font-mono text-amber-300/80">85% · 1 Data Minimization Warning</p>
          </div>
        </Row>
        <Row icon={CheckCircle2} iconClass="text-emerald-400" tone="emerald">
          <div className="flex-1">
            <p className="text-xs text-slate-200">AIDA (Bill C-27) — Audit Trails</p>
            <p className="text-[10px] font-mono text-emerald-300/80">Audit-Ready Logs (OK)</p>
          </div>
        </Row>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-wider text-slate-500">Upcoming Task</p>
          <p className="text-xs text-slate-200 truncate">Review data minimization policy — Agentic Model Alpha</p>
        </div>
        <button className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-teal/15 hover:bg-accent-teal/25 text-accent-teal border border-accent-teal/40 text-[11px] font-semibold uppercase tracking-wider transition shadow-[0_0_20px_-8px_rgba(45,212,191,0.6)]">
          Start Review <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </CardShell>
  );
}

/* ---------- Shared Row ---------- */
function Row({
  icon: Icon, iconClass = '', tone, children,
}: {
  icon: any; iconClass?: string; tone?: 'emerald' | 'red' | 'amber'; children: React.ReactNode;
}) {
  const toneClass =
    tone === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20'
    : tone === 'red' ? 'bg-red-500/5 border-red-500/20'
    : tone === 'amber' ? 'bg-amber-500/5 border-amber-500/20'
    : 'bg-slate-900/40 border-slate-800';
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${toneClass}`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 ${iconClass}`} />
      {children}
    </div>
  );
}

/* ---------- Layout ---------- */
export default function AzureWorkspace() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <PurviewCard />
      <KeyVaultCard />
      <DefenderCard />
      <ComplianceCard />
    </div>
  );
}
