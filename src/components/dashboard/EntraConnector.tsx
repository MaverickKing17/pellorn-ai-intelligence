import { useState } from 'react';
import { toast } from 'sonner';
import {
  Users, Users2, ShieldCheck, AppWindow, Server, UserCheck, RefreshCw,
  AlertTriangle, Activity, Clock, ArrowRight, FileText, Flag, GitBranch,
  Cloud, KeyRound,
} from 'lucide-react';

const kpis = [
  { label: 'Connected Tenant', value: 'Northstar Financial', icon: Cloud, tone: 'text-accent-teal' },
  { label: 'Connector Status', value: 'Simulated Connected', icon: Activity, tone: 'text-accent-emerald' },
  { label: 'Users Synced', value: '438', icon: Users, tone: 'text-accent-teal' },
  { label: 'Groups Synced', value: '82', icon: Users2, tone: 'text-accent-teal' },
  { label: 'Privileged Roles', value: '17', icon: KeyRound, tone: 'text-accent-amber' },
  { label: 'Enterprise Apps', value: '41', icon: AppWindow, tone: 'text-accent-blue' },
  { label: 'Last Sync', value: '3 min ago', icon: Clock, tone: 'text-text-secondary' },
  { label: 'Identity Risk Signals', value: '14', icon: AlertTriangle, tone: 'text-accent-red' },
];

const syncEntities = [
  { type: 'Users', icon: Users, count: 438, last: '3 min ago', health: 'Good', status: 'Active', pct: 98 },
  { type: 'Groups', icon: Users2, count: 82, last: '3 min ago', health: 'Good', status: 'Active', pct: 96 },
  { type: 'Privileged Roles', icon: KeyRound, count: 17, last: '4 min ago', health: 'Attention', status: 'Review Needed', pct: 71 },
  { type: 'Applications', icon: AppWindow, count: 41, last: '5 min ago', health: 'Good', status: 'Active', pct: 94 },
  { type: 'Service Principals', icon: Server, count: 63, last: '5 min ago', health: 'Good', status: 'Active', pct: 92 },
  { type: 'Agent Owners', icon: UserCheck, count: 28, last: '6 min ago', health: 'Attention', status: 'Gaps Detected', pct: 76 },
];

const risks = [
  { signal: 'MFA Disabled', identity: 'risk.officer@northstar-demo.com', role: 'Risk Officer', severity: 'High', agent: 'ClaimsCopilot', action: 'Require MFA before approval workflow access', status: 'Open' },
  { signal: 'Privileged Role Activation', identity: 'compliance.lead@northstar-demo.com', role: 'Compliance Lead', severity: 'Medium', agent: 'UnderwriterGPT', action: 'Review PIM activation and agent certification access', status: 'Investigating' },
  { signal: 'Inactive Owner Account', identity: 'hr.systems@northstar-demo.com', role: 'Agent Owner', severity: 'High', agent: 'PayrollAgent', action: 'Reassign ownership', status: 'Open' },
  { signal: 'Unreviewed App Consent', identity: 'ai.ops@northstar-demo.com', role: 'AI Operations', severity: 'Medium', agent: 'SupportAI', action: 'Review application permissions', status: 'Pending Review' },
];

const ownership = [
  { agent: 'PayrollAgent', owner: 'HR Systems Lead', dept: 'HR / Operations', group: 'HR-AI-Agent-Owners', role: 'Data Processor', cert: 'Suspended', trust: 42, review: 'Required' },
  { agent: 'ClaimsCopilot', owner: 'Claims Operations Lead', dept: 'Insurance', group: 'Claims-AI-Governance', role: 'Compliance Reviewer', cert: 'Conditional', trust: 84, review: 'Due in 14 days' },
  { agent: 'UnderwriterGPT', owner: 'VP Credit Risk', dept: 'Lending', group: 'Lending-AI-Agents', role: 'Risk Approver', cert: 'Certified', trust: 97, review: 'Complete' },
  { agent: 'SupportAI', owner: 'Customer Experience Lead', dept: 'Retail Banking', group: 'Support-AI-Agent-Owners', role: 'Agent Operator', cert: 'Restricted', trust: 63, review: 'Required' },
];

const correlations = [
  { label: 'Human Owner Permissions', value: '438 mapped', icon: UserCheck, tone: 'text-accent-teal' },
  { label: 'Agent Tool Permissions', value: '126 scopes', icon: ShieldCheck, tone: 'text-accent-blue' },
  { label: 'Privileged Role Exposure', value: '17 elevated', icon: KeyRound, tone: 'text-accent-amber' },
  { label: 'Application Access', value: '41 enterprise apps', icon: AppWindow, tone: 'text-accent-teal' },
  { label: 'Access Review Status', value: '6 overdue', icon: AlertTriangle, tone: 'text-accent-red' },
];

const sevTone = (s: string) =>
  s === 'High' ? 'bg-accent-red/10 text-accent-red border-accent-red/30'
  : s === 'Medium' ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/30'
  : 'bg-accent-teal/10 text-accent-teal border-accent-teal/30';

const certTone = (s: string) =>
  s === 'Certified' ? 'text-accent-emerald'
  : s === 'Conditional' ? 'text-accent-amber'
  : s === 'Restricted' ? 'text-accent-red'
  : 'text-accent-red';

const healthTone = (h: string) =>
  h === 'Good' ? 'text-accent-emerald' : h === 'Attention' ? 'text-accent-amber' : 'text-accent-red';

export default function EntraConnector() {
  const [syncing, setSyncing] = useState(false);

  const runSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Simulated Entra sync completed.', { description: 'Mock tenant data refreshed.' });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-foreground">Entra Connector</h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-accent-amber/10 text-accent-amber border border-accent-amber/30 px-2 py-0.5 rounded-full">
              Preview Mode — Mock Tenant Data
            </span>
          </div>
          <p className="text-sm text-text-secondary max-w-2xl">
            Map enterprise identities, owners, groups, privileged roles, and application access to autonomous AI agents.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={runSync} disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-accent-teal/10 border border-accent-teal/30 text-accent-teal hover:bg-accent-teal/20 transition-colors disabled:opacity-60">
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Run Simulated Sync
          </button>
          <button onClick={() => toast('Mapping view opened (preview).')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-card border border-border text-foreground hover:bg-card/80">
            <GitBranch className="w-3.5 h-3.5" /> View Mapping
          </button>
          <button onClick={() => toast.warning('Ownership gap flagged for review.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-card border border-border text-foreground hover:bg-card/80">
            <Flag className="w-3.5 h-3.5" /> Flag Ownership Gap
          </button>
          <button onClick={() => toast.success('Access review package generated using mock tenant data.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-card border border-border text-foreground hover:bg-card/80">
            <FileText className="w-3.5 h-3.5" /> Generate Access Review
          </button>
          <button onClick={() => toast.success('Governance case created in preview mode.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90">
            Create Governance Case
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${k.tone}`} />
              </div>
              <div className="text-base font-semibold text-foreground truncate" title={String(k.value)}>{k.value}</div>
              <div className="text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Sync overview */}
      <section className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Identity Sync Overview</h2>
            <p className="text-xs text-text-secondary">Mock connector status across Entra ID entity types.</p>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-text-secondary">Simulated Connector Status</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {syncEntities.map((e) => {
            const Icon = e.icon;
            return (
              <div key={e.type} className="rounded-md border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-accent-teal" />
                    <span className="text-sm font-medium text-foreground">{e.type}</span>
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${healthTone(e.health)}`}>{e.health}</span>
                </div>
                <div className="text-xl font-semibold text-foreground">{e.count.toLocaleString()}<span className="text-xs text-text-secondary font-normal"> synced</span></div>
                <div className="h-1.5 rounded-full bg-border/60 mt-2 overflow-hidden">
                  <div className={`h-full ${e.health === 'Good' ? 'bg-accent-emerald' : 'bg-accent-amber'}`} style={{ width: `${e.pct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-text-secondary">
                  <span>Last sync: {e.last}</span>
                  <span>{e.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Identity Risk Feed */}
      <section className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Identity Risk Feed</h2>
          <p className="text-xs text-text-secondary">Demo signals correlated to AI agent ownership.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-text-secondary border-b border-border">
                <th className="text-left font-medium px-4 py-2">Risk Signal</th>
                <th className="text-left font-medium px-4 py-2">Identity</th>
                <th className="text-left font-medium px-4 py-2">Role</th>
                <th className="text-left font-medium px-4 py-2">Severity</th>
                <th className="text-left font-medium px-4 py-2">Linked Agent</th>
                <th className="text-left font-medium px-4 py-2">Recommended Action</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="border-b border-border/60 hover:bg-background/40">
                  <td className="px-4 py-2.5 text-foreground">{r.signal}</td>
                  <td className="px-4 py-2.5 text-text-secondary font-mono text-xs">{r.identity}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{r.role}</td>
                  <td className="px-4 py-2.5"><span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${sevTone(r.severity)}`}>{r.severity}</span></td>
                  <td className="px-4 py-2.5 text-foreground">{r.agent}</td>
                  <td className="px-4 py-2.5 text-text-secondary max-w-sm">{r.action}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Agent Ownership Mapping */}
      <section className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Agent Ownership Mapping</h2>
          <p className="text-xs text-text-secondary">Human owners, Entra groups, privileged roles, and certification status.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-text-secondary border-b border-border">
                <th className="text-left font-medium px-4 py-2">Agent</th>
                <th className="text-left font-medium px-4 py-2">Human Owner</th>
                <th className="text-left font-medium px-4 py-2">Department</th>
                <th className="text-left font-medium px-4 py-2">Entra Group</th>
                <th className="text-left font-medium px-4 py-2">Privileged Role</th>
                <th className="text-left font-medium px-4 py-2">Certification</th>
                <th className="text-left font-medium px-4 py-2">Trust Score</th>
                <th className="text-left font-medium px-4 py-2">Access Review</th>
              </tr>
            </thead>
            <tbody>
              {ownership.map((o) => (
                <tr key={o.agent} className="border-b border-border/60 hover:bg-background/40">
                  <td className="px-4 py-2.5 text-foreground font-medium">{o.agent}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{o.owner}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{o.dept}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-accent-teal">{o.group}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{o.role}</td>
                  <td className={`px-4 py-2.5 font-medium ${certTone(o.cert)}`}>{o.cert}</td>
                  <td className="px-4 py-2.5">
                    <span className={`font-semibold ${o.trust >= 90 ? 'text-accent-emerald' : o.trust >= 70 ? 'text-accent-amber' : 'text-accent-red'}`}>{o.trust}</span>
                  </td>
                  <td className="px-4 py-2.5 text-text-secondary">{o.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Permission Correlation */}
      <section className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Permission Correlation</h2>
          <p className="text-xs text-text-secondary">How Pellorn correlates Entra roles and groups with AI agent permissions.</p>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {correlations.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-md border border-border bg-background/40 p-3">
                <Icon className={`w-4 h-4 ${c.tone} mb-2`} />
                <div className="text-sm font-semibold text-foreground">{c.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">{c.label}</div>
              </div>
            );
          })}
        </div>

        {/* Relationship map */}
        <div className="border-t border-border p-4">
          <div className="text-xs uppercase tracking-wider text-text-secondary mb-3">Relationship Map — Example</div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['VP Credit Risk', 'Lending-AI-Agents', 'UnderwriterGPT', 'Credit Decision API / Customer Risk DB', 'Certified'].map((node, i, arr) => (
              <div key={node} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-md border ${
                  i === 0 ? 'border-accent-teal/40 bg-accent-teal/10 text-accent-teal'
                  : i === arr.length - 1 ? 'border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald'
                  : 'border-border bg-background/40 text-foreground'
                } font-medium`}>{node}</div>
                {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
