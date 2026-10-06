import { useState } from 'react';
import {
  Workflow, Clock, CheckCircle2, AlertTriangle, Timer, X,
  Zap, GitBranch, ShieldAlert, FileSignature, Bell, Play, Pause, Edit, Eye, Archive,
} from 'lucide-react';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
interface Rule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  owner: string;
  severity: Severity;
  status: 'Active' | 'Paused' | 'Draft';
  lastRun: string;
  agents: string[];
  approval: string;
  evidence: string;
  notify: string[];
  sla: string;
}

const rules: Rule[] = [
  { id: 'WF-101', name: 'High-Risk Trust Score Drop', trigger: 'Trust Score < 70', action: 'Restrict agent + notify Risk Officer + create evidence', owner: 'AI Governance Office', severity: 'High', status: 'Active', lastRun: '4 min ago', agents: ['SupportAI', 'AppraisalAI'], approval: 'Risk Officer (required)', evidence: 'Trust Score Change + Policy Decision', notify: ['CRO', 'Risk Officer', 'Agent Owner'], sla: '60 min' },
  { id: 'WF-102', name: 'PII Access Anomaly', trigger: 'Unauthorized PII access attempt', action: 'Block tool call + seal evidence + require compliance review', owner: 'Privacy Officer', severity: 'Critical', status: 'Active', lastRun: '1 min ago', agents: ['PayrollAgent', 'TenantScreenAI'], approval: 'Privacy Officer + CCO', evidence: 'PII Redaction + Incident Timeline', notify: ['Privacy Officer', 'CCO', 'SOC'], sla: '15 min' },
  { id: 'WF-103', name: 'Expired Certification', trigger: 'Certification age > 90 days', action: 'Move agent to Conditional + request recertification', owner: 'Compliance Lead', severity: 'Medium', status: 'Active', lastRun: '38 min ago', agents: ['TreasuryBot'], approval: 'Compliance Lead', evidence: 'Certification Approval', notify: ['Agent Owner', 'Compliance Lead'], sla: '7 days' },
  { id: 'WF-104', name: 'Prompt Injection Blocked', trigger: 'Injection attempt detected', action: 'Log incident + update trust score + notify SOC', owner: 'Security Analyst', severity: 'High', status: 'Active', lastRun: '12 sec ago', agents: ['ClaimsCopilot', 'SupportAI'], approval: 'None (auto)', evidence: 'Prompt Injection Block', notify: ['SOC', 'Agent Owner'], sla: '5 min' },
  { id: 'WF-105', name: 'Quarterly Board Report', trigger: 'Schedule: every 90 days', action: 'Compile board pack + request CRO sign-off', owner: 'CRO Office', severity: 'Low', status: 'Active', lastRun: '11 days ago', agents: ['All'], approval: 'CRO', evidence: 'Board Report Export', notify: ['Board', 'CRO', 'CCO'], sla: '14 days' },
  { id: 'WF-106', name: 'Model Drift Threshold', trigger: 'Behavioral deviation > 0.5', action: 'Open incident + flag for retraining', owner: 'ML Engineering', severity: 'Medium', status: 'Paused', lastRun: '2 days ago', agents: ['AppraisalAI'], approval: 'ML Lead', evidence: 'Compliance Mapping', notify: ['ML Lead', 'Agent Owner'], sla: '24 hr' },
];

const kpis = [
  { label: 'Active Workflows', value: 31, icon: Workflow, color: 'text-accent-teal' },
  { label: 'Pending Approvals', value: 14, icon: Clock, color: 'text-accent-amber' },
  { label: 'Auto-Resolved', value: 247, icon: CheckCircle2, color: 'text-accent-teal' },
  { label: 'Escalated to Risk', value: 8, icon: AlertTriangle, color: 'text-accent-red' },
  { label: 'Avg Resolution', value: '42 min', icon: Timer, color: 'text-text-secondary' },
];

const sevColor: Record<Severity, string> = {
  Low: 'border-accent-teal/30 text-accent-teal bg-accent-teal/10',
  Medium: 'border-accent-blue/30 text-accent-blue bg-accent-blue/10',
  High: 'border-accent-amber/30 text-accent-amber bg-accent-amber/10',
  Critical: 'border-accent-red/30 text-accent-red bg-accent-red/10',
};

const flowBlocks = [
  { kind: 'Trigger', label: 'Trust Score < 70', icon: Zap, color: 'border-accent-amber/40 text-accent-amber bg-accent-amber/10' },
  { kind: 'Condition', label: 'Agent risk tier ≥ High', icon: GitBranch, color: 'border-accent-blue/40 text-accent-blue bg-accent-blue/10' },
  { kind: 'Action', label: 'Restrict agent permissions', icon: ShieldAlert, color: 'border-accent-red/40 text-accent-red bg-accent-red/10' },
  { kind: 'Evidence', label: 'Create sealed evidence record', icon: Archive, color: 'border-accent-purple/40 text-accent-purple bg-accent-purple/10' },
  { kind: 'Approval', label: 'Risk Officer sign-off', icon: FileSignature, color: 'border-accent-blue/40 text-accent-blue bg-accent-blue/10' },
  { kind: 'Notification', label: 'Notify CRO + Agent Owner', icon: Bell, color: 'border-accent-teal/40 text-accent-teal bg-accent-teal/10' },
];

export default function GovernanceWorkflows() {
  const [selected, setSelected] = useState<Rule | null>(rules[0]);
  const [simResult, setSimResult] = useState<string | null>(null);

  const runSim = () => {
    if (!selected) return;
    setSimResult(`Simulation: ${selected.name} would have fired 23 times in the last 30 days, restricting 4 agents and sealing 23 evidence records. Estimated avg resolution: ${selected.sla}.`);
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Governance Workflows</h1>
          <p className="text-xs text-text-secondary mt-1">
            Board-ready governance workflows with automated approvals, escalations, and evidence generation.
            <span className="ml-2 text-[11px] uppercase tracking-wider text-accent-amber/80">Simulation Data</span>
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-text-secondary">{k.label}</span>
                <Icon className={`w-3.5 h-3.5 ${k.color}`} />
              </div>
              <div className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rules table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Workflow Rules</h2>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary">Continuous AI Control Assurance</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-text-secondary border-b border-border">
                  <th className="py-2 pr-2">Rule</th>
                  <th className="py-2 pr-2">Trigger</th>
                  <th className="py-2 pr-2">Owner</th>
                  <th className="py-2 pr-2">Severity</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Last Run</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(r => (
                  <tr key={r.id} onClick={() => { setSelected(r); setSimResult(null); }}
                    className={`border-b border-border/60 hover:bg-background/40 cursor-pointer ${selected?.id === r.id ? 'bg-background/40' : ''}`}>
                    <td className="py-2 pr-2 text-foreground font-semibold">{r.name}</td>
                    <td className="py-2 pr-2 text-text-secondary">{r.trigger}</td>
                    <td className="py-2 pr-2 text-text-secondary">{r.owner}</td>
                    <td className="py-2 pr-2"><span className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${sevColor[r.severity]}`}>{r.severity}</span></td>
                    <td className="py-2 pr-2">
                      <span className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                        r.status === 'Active' ? 'border-accent-teal/30 text-accent-teal bg-accent-teal/10'
                        : r.status === 'Paused' ? 'border-accent-amber/30 text-accent-amber bg-accent-amber/10'
                        : 'border-border text-text-muted bg-background/40'
                      }`}>{r.status}</span>
                    </td>
                    <td className="py-2 pr-2 font-mono-code text-text-muted">{r.lastRun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual builder */}
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Visual Workflow Builder</h2>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary">Preview</span>
          </div>
          <div className="space-y-2">
            {flowBlocks.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i}>
                  <div className={`flex items-center gap-2 border rounded-md px-3 py-2 ${b.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <div className="flex-1">
                      <div className="text-[10.5px] uppercase tracking-wider opacity-70">{b.kind}</div>
                      <div className="text-xs font-semibold">{b.label}</div>
                    </div>
                  </div>
                  {i < flowBlocks.length - 1 && (
                    <div className="flex justify-center text-text-muted text-xs leading-none py-0.5">↓</div>
                  )}
                </div>
              );
            })}
          </div>
          <button className="w-full mt-3 text-xs font-semibold px-3 py-2 rounded-md bg-card border border-border text-text-secondary hover:bg-popover">
            + Add Workflow Block
          </button>
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-secondary font-mono-code">{selected.id}</p>
              <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
              <p className="text-xs text-text-secondary mt-0.5">Owned by {selected.owner} · SLA {selected.sla}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={runSim} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-accent-blue/15 border border-accent-blue/40 text-accent-blue hover:bg-accent-blue/25 flex items-center gap-1.5"><Play className="w-3.5 h-3.5" /> Run Simulation</button>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-accent-teal/15 border border-accent-teal/40 text-accent-teal hover:bg-accent-teal/25 flex items-center gap-1.5"><Play className="w-3.5 h-3.5" /> Activate</button>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border text-text-secondary hover:bg-popover flex items-center gap-1.5"><Pause className="w-3.5 h-3.5" /> Pause</button>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border text-text-secondary hover:bg-popover flex items-center gap-1.5"><Edit className="w-3.5 h-3.5" /> Edit Rule</button>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border text-text-secondary hover:bg-popover flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> View Evidence</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            <div className="bg-background/40 border border-border rounded-md p-3">
              <div className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Trigger Logic</div>
              <div className="text-xs text-foreground">{selected.trigger}</div>
            </div>
            <div className="bg-background/40 border border-border rounded-md p-3">
              <div className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Affected Agents</div>
              <div className="flex flex-wrap gap-1">
                {selected.agents.map(a => <span key={a} className="text-[11px] font-mono-code text-text-secondary bg-background/60 border border-border px-1.5 py-0.5 rounded">{a}</span>)}
              </div>
            </div>
            <div className="bg-background/40 border border-border rounded-md p-3">
              <div className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Automated Actions</div>
              <div className="text-xs text-foreground">{selected.action}</div>
            </div>
            <div className="bg-background/40 border border-border rounded-md p-3">
              <div className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Approval Requirements</div>
              <div className="text-xs text-foreground">{selected.approval}</div>
            </div>
            <div className="bg-background/40 border border-border rounded-md p-3">
              <div className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Evidence Generated</div>
              <div className="text-xs text-foreground">{selected.evidence}</div>
            </div>
            <div className="bg-background/40 border border-border rounded-md p-3">
              <div className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Notification Recipients</div>
              <div className="flex flex-wrap gap-1">
                {selected.notify.map(n => <span key={n} className="text-[11px] text-text-secondary bg-background/60 border border-border px-1.5 py-0.5 rounded">{n}</span>)}
              </div>
            </div>
          </div>

          {simResult && (
            <div className="mt-3 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs rounded-md p-3 flex items-start justify-between gap-3">
              <span>{simResult}</span>
              <button onClick={() => setSimResult(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
