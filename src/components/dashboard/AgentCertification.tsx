import { useState } from 'react';
import {
  ShieldCheck, Clock, AlertTriangle, Ban, FileCheck2, Timer,
  X, Fingerprint, Key, Wrench, Database, CheckCircle2, Circle,
} from 'lucide-react';

type Stage =
  | 'Submitted' | 'Security Review' | 'Compliance Review' | 'Risk Approval'
  | 'Certified' | 'Restricted';

interface AgentCard {
  id: string;
  name: string;
  dept: string;
  owner: string;
  trust: number;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Certified' | 'Conditional' | 'Restricted' | 'Suspended' | 'In Review' | 'Submitted';
  lastReview: string;
  nextReview: string;
  frameworks: string[];
  stage: Stage;
  reason?: string;
}

const agents: AgentCard[] = [
  { id: 'agt-001', name: 'UnderwriterGPT', dept: 'Lending', owner: 'VP Credit Risk', trust: 97, risk: 'Low', status: 'Certified', lastReview: '2026-05-11', nextReview: '28d', frameworks: ['OSFI E-21', 'SOC 2'], stage: 'Certified' },
  { id: 'agt-002', name: 'ClaimsCopilot', dept: 'Insurance', owner: 'Claims Operations', trust: 84, risk: 'Medium', status: 'Conditional', lastReview: '2026-05-18', nextReview: '11d', frameworks: ['OSFI E-21', 'PIPEDA'], stage: 'Compliance Review', reason: 'Data minimization review required' },
  { id: 'agt-003', name: 'SupportAI', dept: 'Retail Banking', owner: 'Head of CX', trust: 63, risk: 'Medium', status: 'In Review', lastReview: '2026-06-01', nextReview: '—', frameworks: ['PIPEDA', 'SOC 2'], stage: 'Security Review' },
  { id: 'agt-004', name: 'PayrollAgent', dept: 'HR / Ops', owner: 'HR Systems Lead', trust: 42, risk: 'Critical', status: 'Suspended', lastReview: '2026-06-04', nextReview: 'Hold', frameworks: ['PIPEDA', 'AIDA'], stage: 'Restricted', reason: 'Payroll PII access anomaly' },
  { id: 'agt-005', name: 'TenantScreenAI', dept: 'Real Estate', owner: 'Director Leasing', trust: 78, risk: 'Medium', status: 'In Review', lastReview: '2026-05-28', nextReview: '—', frameworks: ['PIPEDA', 'AIDA'], stage: 'Risk Approval' },
  { id: 'agt-006', name: 'TreasuryBot', dept: 'Treasury', owner: 'VP Treasury', trust: 91, risk: 'High', status: 'Certified', lastReview: '2026-04-22', nextReview: '47d', frameworks: ['OSFI E-21', 'SOC 2'], stage: 'Certified' },
  { id: 'agt-007', name: 'KYCReviewer', dept: 'Compliance', owner: 'Chief Compliance Officer', trust: 88, risk: 'High', status: 'Submitted', lastReview: '2026-06-06', nextReview: '—', frameworks: ['OSFI E-21', 'PIPEDA', 'AIDA'], stage: 'Submitted' },
  { id: 'agt-008', name: 'MarketingGenAI', dept: 'Marketing', owner: 'CMO', trust: 71, risk: 'Low', status: 'Submitted', lastReview: '2026-06-07', nextReview: '—', frameworks: ['PIPEDA'], stage: 'Submitted' },
  { id: 'agt-009', name: 'AppraisalAI', dept: 'Real Estate', owner: 'Head Valuations', trust: 38, risk: 'Critical', status: 'Restricted', lastReview: '2026-05-30', nextReview: 'Hold', frameworks: ['AIDA', 'OSFI E-21'], stage: 'Restricted', reason: 'Model drift > threshold' },
];

const stages: Stage[] = ['Submitted', 'Security Review', 'Compliance Review', 'Risk Approval', 'Certified', 'Restricted'];

const kpis = [
  { label: 'Awaiting Review', value: 12, icon: Clock, color: 'text-accent-amber' },
  { label: 'Certified Agents', value: 184, icon: ShieldCheck, color: 'text-accent-teal' },
  { label: 'Conditional Agents', value: 27, icon: FileCheck2, color: 'text-accent-blue' },
  { label: 'Restricted Agents', value: 9, icon: AlertTriangle, color: 'text-accent-amber' },
  { label: 'Expired Certifications', value: 6, icon: Ban, color: 'text-accent-red' },
  { label: 'Avg Review Time', value: '2.4d', icon: Timer, color: 'text-text-secondary' },
];

const checklist = [
  'Identity verified',
  'Owner assigned',
  'Data access reviewed',
  'Tool permissions reviewed',
  'Prompt safety tested',
  'Behavioral baseline established',
  'Compliance mapping completed',
  'Risk officer approval completed',
];

function trustColor(n: number) {
  if (n >= 85) return 'text-accent-teal';
  if (n >= 65) return 'text-accent-blue';
  if (n >= 50) return 'text-accent-amber';
  return 'text-accent-red';
}

function riskBadge(r: AgentCard['risk']) {
  const map: Record<string, string> = {
    Low: 'border-accent-teal/30 text-accent-teal bg-accent-teal/10',
    Medium: 'border-accent-blue/30 text-accent-blue bg-accent-blue/10',
    High: 'border-accent-amber/30 text-accent-amber bg-accent-amber/10',
    Critical: 'border-accent-red/30 text-accent-red bg-accent-red/10',
  };
  return map[r];
}

export default function AgentCertification() {
  const [selected, setSelected] = useState<AgentCard | null>(null);
  const [decisions, setDecisions] = useState<{ ts: string; agent: string; action: string }[]>([]);

  const decide = (action: string) => {
    if (!selected) return;
    setDecisions(d => [{ ts: new Date().toLocaleTimeString(), agent: selected.name, action }, ...d].slice(0, 6));
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Agent Certification Workflow</h1>
          <p className="text-xs text-text-secondary mt-1">
            Evidence-backed agent certification across security, compliance, and risk lines of defense.
            <span className="ml-2 text-[10px] uppercase tracking-wider text-accent-amber/80">Simulation Data</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-secondary">
          <span className="px-2 py-0.5 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal">OSFI E-21</span>
          <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue">PIPEDA</span>
          <span className="px-2 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple">AIDA</span>
          <span className="px-2 py-0.5 rounded-full bg-card border border-border text-text-secondary">SOC 2</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-text-secondary">{k.label}</span>
                <Icon className={`w-3.5 h-3.5 ${k.color}`} />
              </div>
              <div className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Certification Pipeline</h2>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary">Drag-free demo board</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map(stage => {
            const cards = agents.filter(a => a.stage === stage);
            return (
              <div key={stage} className="bg-background/40 border border-border rounded-md p-2 min-h-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">{stage}</span>
                  <span className="text-[10px] font-mono-code text-text-muted">{cards.length}</span>
                </div>
                <div className="space-y-2">
                  {cards.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="w-full text-left bg-card hover:bg-popover border border-border rounded-md p-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground truncate">{a.name}</span>
                        <span className={`text-[10px] font-mono-code ${trustColor(a.trust)}`}>{a.trust}</span>
                      </div>
                      <div className="text-[10px] text-text-secondary mt-0.5 truncate">{a.dept} · {a.owner}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${riskBadge(a.risk)}`}>{a.risk}</span>
                        <span className="text-[9px] text-text-muted">Next: {a.nextReview}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {a.frameworks.map(f => (
                          <span key={f} className="text-[9px] font-mono-code text-text-secondary bg-background/60 px-1 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                      {a.reason && (
                        <div className="text-[10px] text-accent-amber mt-1.5 line-clamp-2">⚠ {a.reason}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Recent Certification Decisions</h2>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary">Audit Trail · Sealed Evidence</span>
        </div>
        {decisions.length === 0 ? (
          <p className="text-xs text-text-muted py-3">No decisions yet. Open an agent card to record a certification decision.</p>
        ) : (
          <ul className="space-y-1.5">
            {decisions.map((d, i) => (
              <li key={i} className="flex items-center justify-between text-xs border-b border-border/60 pb-1.5">
                <span className="font-mono-code text-text-secondary">{d.ts}</span>
                <span className="text-foreground">{d.agent}</span>
                <span className="text-accent-teal">{d.action}</span>
                <span className="text-[10px] text-text-muted">evidence sealed</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-card border-l border-border w-full max-w-xl h-full overflow-y-auto p-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">{selected.name}</h3>
                <p className="text-xs text-text-secondary">{selected.dept} · Owner: {selected.owner}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-text-secondary hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-background/50 border border-border rounded p-2">
                <div className="text-[10px] uppercase text-text-secondary">Trust Score</div>
                <div className={`text-xl font-bold ${trustColor(selected.trust)}`}>{selected.trust}</div>
              </div>
              <div className="bg-background/50 border border-border rounded p-2">
                <div className="text-[10px] uppercase text-text-secondary">Risk Tier</div>
                <div className="text-sm font-semibold text-foreground">{selected.risk}</div>
              </div>
              <div className="bg-background/50 border border-border rounded p-2">
                <div className="text-[10px] uppercase text-text-secondary">Status</div>
                <div className="text-sm font-semibold text-foreground">{selected.status}</div>
              </div>
            </div>

            {/* Identity */}
            <section className="mt-5">
              <h4 className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-2">Agent Identity</h4>
              <div className="bg-background/40 border border-border rounded p-3 space-y-1.5 text-xs">
                <div className="flex items-start gap-2"><Fingerprint className="w-3.5 h-3.5 text-accent-teal mt-0.5" /><span className="font-mono-code text-text-secondary text-[11px] break-all">CN={selected.id}.bastion.ca · SHA-256:7A:F1:…:C9</span></div>
                <div className="flex items-start gap-2"><Key className="w-3.5 h-3.5 text-accent-blue mt-0.5" /><span className="text-text-secondary">Issuer: Bastion Internal CA · Entra ID</span></div>
                <div className="flex items-start gap-2"><Wrench className="w-3.5 h-3.5 text-accent-amber mt-0.5" /><span className="text-text-secondary">Tools: data.read, policy.query, audit.write</span></div>
                <div className="flex items-start gap-2"><Database className="w-3.5 h-3.5 text-accent-purple mt-0.5" /><span className="text-text-secondary">Data: Customer Tier 2, Policy Library, Risk Models</span></div>
              </div>
            </section>

            {/* Checklist */}
            <section className="mt-4">
              <h4 className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-2">Review Checklist</h4>
              <ul className="grid grid-cols-2 gap-1.5">
                {checklist.map((c, i) => {
                  const done = i < 6;
                  return (
                    <li key={c} className="flex items-center gap-2 text-xs">
                      {done
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
                        : <Circle className="w-3.5 h-3.5 text-text-muted" />}
                      <span className={done ? 'text-foreground' : 'text-text-secondary'}>{c}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Decisions */}
            <section className="mt-5">
              <h4 className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-2">Certification Decision</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Approve Certification', 'bg-accent-teal/15 border-accent-teal/40 text-accent-teal hover:bg-accent-teal/25'],
                  ['Approve Conditional', 'bg-accent-blue/15 border-accent-blue/40 text-accent-blue hover:bg-accent-blue/25'],
                  ['Restrict Agent', 'bg-accent-amber/15 border-accent-amber/40 text-accent-amber hover:bg-accent-amber/25'],
                  ['Suspend Agent', 'bg-accent-red/15 border-accent-red/40 text-accent-red hover:bg-accent-red/25'],
                  ['Retire Agent', 'bg-card border-border text-text-secondary hover:bg-popover'],
                  ['Request Additional Review', 'bg-card border-border text-text-secondary hover:bg-popover'],
                ].map(([label, cls]) => (
                  <button
                    key={label}
                    onClick={() => decide(label)}
                    className={`text-xs font-semibold px-3 py-2 rounded-md border transition-colors ${cls}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-2">Each decision generates a sealed evidence record in the Governance Evidence Vault.</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
