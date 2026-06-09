import { useState, useMemo } from 'react';
import {
  Briefcase, AlertTriangle, Search, Clock, CheckCircle2, Timer, FileText,
  ShieldAlert, Users, X, Activity, FileSignature, Scale, GitBranch, Database,
  Eye, Lock, Hash, ChevronRight, Sparkles, Building2, Network, ArrowUpRight,
} from 'lucide-react';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type Status = 'Open' | 'Investigating' | 'Escalated' | 'Pending Approval' | 'Closed';

interface CaseRow {
  id: string;
  title: string;
  severity: Severity;
  agent: string;
  owner: string;
  framework: string;
  status: Status;
  created: string;
  updated: string;
  trust: number;
  bu: string;
}

const cases: CaseRow[] = [
  { id: 'AI-2026-114', title: 'Prompt Injection Attempt', severity: 'Critical', agent: 'PayrollAgent', owner: 'Chief Risk Officer', framework: 'AIDA', status: 'Investigating', created: '2026-06-09 09:14', updated: '12 min ago', trust: 42, bu: 'Payroll' },
  { id: 'AI-2026-115', title: 'PII Exposure Event', severity: 'High', agent: 'ClaimsCopilot', owner: 'Privacy Officer', framework: 'PIPEDA', status: 'Pending Approval', created: '2026-06-09 08:47', updated: '38 min ago', trust: 61, bu: 'Insurance Claims' },
  { id: 'AI-2026-116', title: 'Trust Score Degradation', severity: 'Medium', agent: 'UnderwriterGPT', owner: 'AI Governance Lead', framework: 'OSFI E-21', status: 'Open', created: '2026-06-09 07:02', updated: '1 hr ago', trust: 68, bu: 'Underwriting' },
  { id: 'AI-2026-117', title: 'Certification Failure — Retraining Drift', severity: 'High', agent: 'AppraisalAI', owner: 'Compliance Lead', framework: 'OSFI E-21', status: 'Escalated', created: '2026-06-08 16:20', updated: '3 hr ago', trust: 54, bu: 'Real Estate' },
  { id: 'AI-2026-118', title: 'Unauthorized Tool Invocation', severity: 'Critical', agent: 'TreasuryBot', owner: 'CISO', framework: 'SOC 2', status: 'Investigating', created: '2026-06-08 14:11', updated: '5 hr ago', trust: 38, bu: 'Treasury' },
  { id: 'AI-2026-119', title: 'Behavioral Drift Above Threshold', severity: 'Medium', agent: 'SupportAI', owner: 'ML Engineering', framework: 'NIST AI RMF', status: 'Open', created: '2026-06-08 11:35', updated: '8 hr ago', trust: 71, bu: 'Customer Ops' },
  { id: 'AI-2026-120', title: 'Board-Requested Policy Review', severity: 'Low', agent: 'All', owner: 'CRO Office', framework: 'Board Mandate', status: 'Pending Approval', created: '2026-06-07 10:00', updated: '1 day ago', trust: 88, bu: 'Enterprise' },
  { id: 'AI-2026-121', title: 'Cross-Tenant Data Leakage Suspected', severity: 'Critical', agent: 'TenantScreenAI', owner: 'Privacy Officer', framework: 'PIPEDA', status: 'Escalated', created: '2026-06-07 09:12', updated: '1 day ago', trust: 33, bu: 'Real Estate' },
  { id: 'AI-2026-122', title: 'Quarterly Recertification Closed', severity: 'Low', agent: 'KYCAgent', owner: 'Compliance Lead', framework: 'OSFI E-21', status: 'Closed', created: '2026-06-05 14:00', updated: '4 days ago', trust: 94, bu: 'KYC' },
];

const kpis = [
  { label: 'Open Cases', value: 47, icon: Briefcase, color: 'text-accent-teal' },
  { label: 'Critical Cases', value: 8, icon: AlertTriangle, color: 'text-accent-red' },
  { label: 'Under Investigation', value: 19, icon: Search, color: 'text-accent-amber' },
  { label: 'Pending Approval', value: 6, icon: Clock, color: 'text-purple-400' },
  { label: 'Closed This Month', value: 134, icon: CheckCircle2, color: 'text-accent-teal' },
  { label: 'Avg Resolution', value: '2.8 d', icon: Timer, color: 'text-text-secondary' },
];

const sevTone: Record<Severity, string> = {
  Critical: 'bg-accent-red/15 text-accent-red border-accent-red/30',
  High: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  Medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  Low: 'bg-accent-teal/10 text-accent-teal border-accent-teal/30',
};

const statusTone: Record<Status, string> = {
  Open: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Investigating: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  Escalated: 'bg-accent-red/15 text-accent-red border-accent-red/30',
  'Pending Approval': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Closed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

const timeline = [
  { t: '09:14', e: 'Prompt injection detected', tone: 'text-accent-red' },
  { t: '09:15', e: 'PII extraction attempt blocked', tone: 'text-accent-amber' },
  { t: '09:17', e: 'Trust Score dropped below threshold (91 → 42)', tone: 'text-accent-amber' },
  { t: '09:18', e: 'Circuit Breaker policy activated', tone: 'text-accent-red' },
  { t: '09:22', e: 'Agent quarantined', tone: 'text-foreground' },
  { t: '09:30', e: 'Case AI-2026-114 created automatically', tone: 'text-text-secondary' },
  { t: '09:42', e: 'Risk Officer assigned (J. Mercer)', tone: 'text-text-secondary' },
  { t: '10:05', e: 'Evidence sealed: 7 artifacts (SHA-256)', tone: 'text-accent-teal' },
];

const evidence = [
  { id: 'EV-9241', type: 'Prompt Transcript', hash: '0x7af2…91bc', ts: '09:14:22', integrity: 'Sealed', retain: '7 yr' },
  { id: 'EV-9242', type: 'Security Log', hash: '0x14de…aa07', ts: '09:14:30', integrity: 'Sealed', retain: '7 yr' },
  { id: 'EV-9243', type: 'Trust Score Snapshot', hash: '0xc8f1…ee54', ts: '09:17:01', integrity: 'Sealed', retain: '3 yr' },
  { id: 'EV-9244', type: 'Policy Evaluation Result', hash: '0x223b…77a9', ts: '09:18:11', integrity: 'Sealed', retain: '7 yr' },
  { id: 'EV-9245', type: 'Certification Record', hash: '0x9d04…3210', ts: '09:30:00', integrity: 'Sealed', retain: '7 yr' },
  { id: 'EV-9246', type: 'Approval Record', hash: '0x4eaa…6612', ts: '09:42:18', integrity: 'Sealed', retain: '7 yr' },
  { id: 'EV-9247', type: 'Board Report Excerpt', hash: '0x71ce…84ff', ts: '10:05:44', integrity: 'Sealed', retain: '10 yr' },
];

const approvers = [
  { name: 'J. Mercer', role: 'Risk Officer', decision: 'Approved', ts: '09:48', sig: 'Verified', comments: 'Quarantine confirmed. Begin forensic review.' },
  { name: 'A. Okafor', role: 'Privacy Officer', decision: 'Approved', ts: '10:02', sig: 'Verified', comments: 'No confirmed PII exfiltration. PIPEDA notification not required.' },
  { name: 'S. Tanaka', role: 'Compliance Lead', decision: 'Pending', ts: '—', sig: 'Awaiting', comments: 'Reviewing OSFI E-21 control mapping.' },
  { name: 'AI Governance Office', role: 'Governance', decision: 'Pending', ts: '—', sig: 'Awaiting', comments: 'Recertification scope to be defined.' },
  { name: 'D. Howell', role: 'Board Representative', decision: 'Pending', ts: '—', sig: 'Awaiting', comments: '' },
];

const remediation = [
  { label: 'Restrict Agent', tone: 'amber' },
  { label: 'Suspend Agent', tone: 'red' },
  { label: 'Revoke Certification', tone: 'red' },
  { label: 'Lower Trust Score', tone: 'amber' },
  { label: 'Request Review', tone: 'teal' },
  { label: 'Require Re-Certification', tone: 'amber' },
  { label: 'Escalate To Board', tone: 'red' },
  { label: 'Close Case', tone: 'teal' },
];

const remTone: Record<string, string> = {
  amber: 'border-accent-amber/40 text-accent-amber hover:bg-accent-amber/10',
  red: 'border-accent-red/40 text-accent-red hover:bg-accent-red/10',
  teal: 'border-accent-teal/40 text-accent-teal hover:bg-accent-teal/10',
};

export default function CaseManagement() {
  const [selected, setSelected] = useState<CaseRow | null>(null);
  const [q, setQ] = useState('');
  const [sev, setSev] = useState<'All' | Severity>('All');
  const [st, setSt] = useState<'All' | Status>('All');

  const filtered = useMemo(() => cases.filter(c =>
    (sev === 'All' || c.severity === sev) &&
    (st === 'All' || c.status === st) &&
    (q === '' || (c.id + c.title + c.agent + c.owner + c.bu).toLowerCase().includes(q.toLowerCase()))
  ), [q, sev, st]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-secondary mb-1">
            <Scale className="w-3 h-3" /> Governance / Case Management
          </div>
          <h1 className="text-xl font-bold text-foreground">AI Governance Case Management</h1>
          <p className="text-xs text-text-secondary mt-1 max-w-3xl">
            Track investigations, evidence, approvals, remediation actions, and board-level governance decisions across autonomous AI agents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red font-semibold">8 Critical</span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 font-semibold">6 Escalated</span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-border bg-card text-text-secondary font-semibold">47 Open</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-text-secondary">{k.label}</span>
                <Icon className={`w-3.5 h-3.5 ${k.color}`} />
              </div>
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search case ID, agent, owner, business unit…"
            className="w-full bg-background border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-text-secondary focus:outline-none focus:border-accent-teal/50"
          />
        </div>
        <select value={sev} onChange={e => setSev(e.target.value as 'All' | Severity)} className="bg-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground">
          <option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
        </select>
        <select value={st} onChange={e => setSt(e.target.value as 'All' | Status)} className="bg-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground">
          <option>All</option><option>Open</option><option>Investigating</option><option>Escalated</option><option>Pending Approval</option><option>Closed</option>
        </select>
        <button className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-md border border-accent-teal/40 text-accent-teal hover:bg-accent-teal/10">
          + New Case
        </button>
      </div>

      {/* Case Queue */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-accent-teal" />
            <h2 className="text-sm font-semibold text-foreground">Case Queue</h2>
            <span className="text-[10px] uppercase tracking-wider text-text-secondary">{filtered.length} cases</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary">Auto-refresh · 30s</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-background/50 border-b border-border">
              <tr className="text-left text-text-secondary uppercase tracking-wider text-[10px]">
                <th className="px-4 py-2 font-medium">Case ID</th>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Severity</th>
                <th className="px-4 py-2 font-medium">Agent</th>
                <th className="px-4 py-2 font-medium">Owner</th>
                <th className="px-4 py-2 font-medium">Framework</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Updated</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)} className="border-b border-border last:border-0 hover:bg-background/40 cursor-pointer transition-colors">
                  <td className="px-4 py-2.5 font-mono text-accent-teal">{c.id}</td>
                  <td className="px-4 py-2.5 text-foreground">{c.title}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${sevTone[c.severity]}`}>{c.severity}</span>
                  </td>
                  <td className="px-4 py-2.5 text-text-secondary font-mono">{c.agent}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{c.owner}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{c.framework}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${statusTone[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-text-secondary">{c.updated}</td>
                  <td className="px-4 py-2.5 text-right">
                    <ChevronRight className="w-4 h-4 text-text-secondary inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[10px] text-text-secondary uppercase tracking-wider">
        Simulation data · All actions create immutable audit records sealed in the Evidence Vault
      </p>

      {selected && <CaseDrawer c={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function CaseDrawer({ c, onClose }: { c: CaseRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-full max-w-5xl bg-background border-l border-border overflow-y-auto">
        {/* Drawer header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-secondary mb-1">
              <Scale className="w-3 h-3" /> Investigation Record
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-accent-teal text-sm">{c.id}</span>
              <h2 className="text-lg font-bold text-foreground">{c.title}</h2>
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${sevTone[c.severity]}`}>{c.severity}</span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${statusTone[c.status]}`}>{c.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-card text-text-secondary"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Header facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: 'Assigned To', v: c.owner, i: Users },
              { l: 'Business Unit', v: c.bu, i: Building2 },
              { l: 'Affected Agent', v: c.agent, i: ShieldAlert },
              { l: 'Trust Score', v: c.trust, i: Activity, tone: c.trust < 50 ? 'text-accent-red' : c.trust < 75 ? 'text-accent-amber' : 'text-accent-teal' },
            ].map(f => {
              const Icon = f.i;
              return (
                <div key={f.l} className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary">{f.l}</span>
                    <Icon className="w-3.5 h-3.5 text-text-secondary" />
                  </div>
                  <div className={`text-sm font-semibold ${f.tone ?? 'text-foreground'}`}>{f.v}</div>
                </div>
              );
            })}
          </div>

          {/* Framework impact */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wider text-text-secondary mb-2">Framework Impact</div>
            <div className="flex flex-wrap gap-2">
              {['PIPEDA', 'OSFI E-21', 'SOC 2', 'AIDA (Bill C-27)'].map(f => (
                <span key={f} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-accent-amber/30 bg-accent-amber/10 text-accent-amber font-semibold">{f}</span>
              ))}
            </div>
          </div>

          {/* AI summary */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-teal" />
                <h3 className="text-sm font-semibold text-foreground">Executive Investigation Narrative</h3>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-accent-teal bg-accent-teal/10 border border-accent-teal/30 px-2 py-0.5 rounded-full">AI-Generated</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Bastion Audit detected a prompt injection attempt targeting <span className="text-foreground font-semibold">{c.agent}</span>. The attack attempted to extract employee payroll information. Policy Enforcement blocked the request and automatically reduced the agent Trust Score from 91 to {c.trust}. Circuit Breaker policy quarantined the agent and generated this governance case for human review.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { l: 'Risk Impact', v: 'High', tone: 'text-accent-red' },
                { l: 'Affected Systems', v: '3', tone: 'text-foreground' },
                { l: 'Regulatory Exposure', v: 'Contained', tone: 'text-accent-teal' },
                { l: 'Recommended', v: 'Re-Certify', tone: 'text-accent-amber' },
              ].map(x => (
                <div key={x.l} className="bg-background/50 border border-border rounded-md p-2">
                  <div className="text-[9px] uppercase tracking-wider text-text-secondary">{x.l}</div>
                  <div className={`text-sm font-bold ${x.tone}`}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-column: Timeline + Evidence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-accent-amber" />
                <h3 className="text-sm font-semibold text-foreground">Investigation Timeline</h3>
              </div>
              <div className="space-y-2.5">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="font-mono text-text-secondary w-12 shrink-0">{t.t}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-teal mt-1.5 shrink-0" />
                    <span className={t.tone}>{t.e}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-accent-teal" />
                <h3 className="text-sm font-semibold text-foreground">Evidence Panel</h3>
                <span className="text-[10px] uppercase tracking-wider text-text-secondary">{evidence.length} sealed artifacts</span>
              </div>
              <div className="space-y-1.5">
                {evidence.map(e => (
                  <div key={e.id} className="bg-background/40 border border-border rounded-md p-2 flex items-center gap-3">
                    <Hash className="w-3.5 h-3.5 text-accent-teal shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-accent-teal">{e.id}</span>
                        <span className="text-xs text-foreground truncate">{e.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-text-secondary font-mono mt-0.5">
                        <span>{e.hash}</span><span>{e.ts}</span><span>Retain {e.retain}</span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold">{e.integrity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remediation actions */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-accent-red" />
              <h3 className="text-sm font-semibold text-foreground">Remediation Actions</h3>
              <span className="text-[10px] uppercase tracking-wider text-text-secondary">All actions create immutable audit records</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {remediation.map(r => (
                <button key={r.label} className={`text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-md border bg-background ${remTone[r.tone]}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Approval workflow */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileSignature className="w-4 h-4 text-purple-300" />
              <h3 className="text-sm font-semibold text-foreground">Approval Workflow</h3>
              <span className="text-[10px] uppercase tracking-wider text-text-secondary">2 of 5 signed</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-left text-text-secondary uppercase tracking-wider text-[10px] border-b border-border">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Approver</th>
                    <th className="py-2 pr-3 font-medium">Role</th>
                    <th className="py-2 pr-3 font-medium">Decision</th>
                    <th className="py-2 pr-3 font-medium">Timestamp</th>
                    <th className="py-2 pr-3 font-medium">Signature</th>
                    <th className="py-2 pr-3 font-medium">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {approvers.map(a => (
                    <tr key={a.name} className="border-b border-border last:border-0">
                      <td className="py-2 pr-3 text-foreground">{a.name}</td>
                      <td className="py-2 pr-3 text-text-secondary">{a.role}</td>
                      <td className="py-2 pr-3">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                          a.decision === 'Approved' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : a.decision === 'Rejected' ? 'border-accent-red/30 bg-accent-red/10 text-accent-red'
                          : 'border-accent-amber/30 bg-accent-amber/10 text-accent-amber'
                        }`}>{a.decision}</span>
                      </td>
                      <td className="py-2 pr-3 text-text-secondary font-mono">{a.ts}</td>
                      <td className="py-2 pr-3 text-text-secondary">{a.sig}</td>
                      <td className="py-2 pr-3 text-text-secondary truncate max-w-[260px]">{a.comments || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Board Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-accent-teal" />
                <h3 className="text-sm font-semibold text-foreground">Board Impact Assessment</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'Board Impact', v: 'Low', tone: 'text-accent-teal' },
                  { l: 'Financial Exposure', v: '$0', tone: 'text-accent-teal' },
                  { l: 'Regulatory Exposure', v: 'None', tone: 'text-accent-teal' },
                  { l: 'Reputation Impact', v: 'Minimal', tone: 'text-accent-teal' },
                  { l: 'Operational Impact', v: 'Contained', tone: 'text-accent-teal' },
                  { l: 'Disclosure Required', v: 'No', tone: 'text-accent-teal' },
                ].map(x => (
                  <div key={x.l} className="bg-background/50 border border-border rounded-md p-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-text-secondary">{x.l}</div>
                    <div className={`text-sm font-bold ${x.tone}`}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Network className="w-4 h-4 text-accent-teal" />
                <h3 className="text-sm font-semibold text-foreground">AI Governance Graph</h3>
              </div>
              <div className="relative h-[260px] bg-background/40 border border-border rounded-md overflow-hidden">
                <svg viewBox="0 0 400 260" className="w-full h-full">
                  {[
                    { x: 80, y: 50 }, { x: 320, y: 50 }, { x: 50, y: 130 }, { x: 350, y: 130 },
                    { x: 80, y: 210 }, { x: 320, y: 210 }, { x: 200, y: 30 }, { x: 200, y: 230 },
                  ].map((p, i) => (
                    <line key={i} x1="200" y1="130" x2={p.x} y2={p.y} stroke="hsl(180 60% 45% / 0.3)" strokeWidth="1" strokeDasharray="3 3" />
                  ))}
                  <circle cx="200" cy="130" r="28" fill="hsl(180 60% 45% / 0.18)" stroke="hsl(180 60% 45%)" strokeWidth="1.5" />
                  <text x="200" y="128" textAnchor="middle" className="fill-foreground" fontSize="9" fontWeight="700">CASE</text>
                  <text x="200" y="140" textAnchor="middle" className="fill-foreground" fontSize="7">{c.id}</text>
                  {[
                    { x: 80, y: 50, l: 'Agent' }, { x: 320, y: 50, l: 'Policies' },
                    { x: 50, y: 130, l: 'Evidence' }, { x: 350, y: 130, l: 'Approvals' },
                    { x: 80, y: 210, l: 'Frameworks' }, { x: 320, y: 210, l: 'Risk Officer' },
                    { x: 200, y: 30, l: 'Business Unit' }, { x: 200, y: 230, l: 'Board Report' },
                  ].map((n, i) => (
                    <g key={i}>
                      <circle cx={n.x} cy={n.y} r="18" fill="hsl(220 30% 12%)" stroke="hsl(180 60% 45% / 0.5)" strokeWidth="1" />
                      <text x={n.x} y={n.y + 3} textAnchor="middle" className="fill-text-secondary" fontSize="7">{n.l}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Linked objects */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-4 h-4 text-accent-teal" />
              <h3 className="text-sm font-semibold text-foreground">Case Relationships</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { i: ShieldAlert, l: 'Linked Agent', v: c.agent },
                { i: CheckCircle2, l: 'Certification', v: 'CERT-7421' },
                { i: Activity, l: 'Trust Score History', v: '91 → 42' },
                { i: Database, l: 'Evidence Vault', v: '7 records' },
                { i: GitBranch, l: 'Workflow', v: 'WF-104' },
                { i: FileText, l: 'Board Report', v: 'BR-Q2-2026' },
                { i: ShieldAlert, l: 'Policy Decision', v: 'POL-0192' },
                { i: Database, l: 'Audit Package', v: 'PKG-2026-114' },
              ].map(r => {
                const Icon = r.i;
                return (
                  <button key={r.l} className="bg-background/50 border border-border rounded-md p-2.5 text-left hover:border-accent-teal/40 transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                      <Icon className="w-3.5 h-3.5 text-accent-teal" />
                      <ArrowUpRight className="w-3 h-3 text-text-secondary group-hover:text-accent-teal" />
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-text-secondary">{r.l}</div>
                    <div className="text-xs text-foreground font-mono truncate">{r.v}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
