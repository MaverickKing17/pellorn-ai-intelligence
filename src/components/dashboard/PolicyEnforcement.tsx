import { useState } from 'react';
import {
  Shield, Zap, FileLock, Users, AlertTriangle, CheckCircle2, XCircle,
  Play, Plus, Filter, Download, ChevronRight, Activity, Lock, Ban,
  KeyRound, ShieldAlert, Bell, GitBranch, Layers, Eye, Server,
  FileText, Workflow, AlertOctagon, TrendingUp, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type PolicyType = 'identity' | 'ai' | 'data' | 'compliance';
type Severity = 'critical' | 'high' | 'medium' | 'low';

interface Policy {
  id: string;
  name: string;
  type: PolicyType;
  precedence: number;
  trigger: string;
  action: string;
  status: 'active' | 'simulation' | 'disabled';
  hits24h: number;
  lastFired: string;
  compliance: string[];
}

interface EnforcementLog {
  id: string;
  time: string;
  policy: string;
  trigger: string;
  action: string;
  outcome: 'enforced' | 'blocked' | 'mfa' | 'simulated';
  severity: Severity;
  confidence: number;
  trace: string[];
}

interface TopRisk {
  id: string;
  title: string;
  severity: Severity;
  signal: string;
  recommendation: string;
  policy: string;
}

const POLICIES: Policy[] = [
  { id: 'P-001', name: 'High-Risk User → Session Revocation', type: 'identity', precedence: 1, trigger: 'Entra ID risk = HIGH', action: 'Revoke tokens + Force MFA', status: 'active', hits24h: 14, lastFired: '2m ago', compliance: ['OSFI E-21', 'PIPEDA'] },
  { id: 'P-002', name: 'PII Extraction Block', type: 'data', precedence: 1, trigger: 'PII entities ≥ 3 in output', action: 'Block prompt + Mask output', status: 'active', hits24h: 47, lastFired: '12s ago', compliance: ['PIPEDA', 'AIDA'] },
  { id: 'P-003', name: 'Prompt Injection Defense', type: 'ai', precedence: 1, trigger: 'Lakera score > 0.85', action: 'Terminate session + Alert SOC', status: 'active', hits24h: 23, lastFired: '1m ago', compliance: ['AIDA'] },
  { id: 'P-004', name: 'Behavioral Drift Circuit Breaker', type: 'ai', precedence: 2, trigger: 'Drift > 3σ for 5min', action: 'Throttle agent + Disable tool', status: 'simulation', hits24h: 6, lastFired: '8m ago', compliance: ['OSFI E-21'] },
  { id: 'P-005', name: 'Impossible Travel Lockout', type: 'identity', precedence: 1, trigger: 'Geo-velocity > 800 km/h', action: 'Disable user + Sentinel incident', status: 'active', hits24h: 3, lastFired: '34m ago', compliance: ['OSFI E-21'] },
  { id: 'P-006', name: 'Underwriting Bias Guardrail', type: 'compliance', precedence: 2, trigger: 'Demographic parity < 0.8', action: 'Block decision + Notify Risk Officer', status: 'active', hits24h: 2, lastFired: '1h ago', compliance: ['OSFI E-21', 'AIDA'] },
];

const LOGS: EnforcementLog[] = [
  { id: 'EVT-9821', time: '14:32:11', policy: 'P-002', trigger: 'PII Extraction', action: 'Prompt blocked, output masked', outcome: 'blocked', severity: 'high', confidence: 0.97, trace: ['Gateway received prompt', 'Presidio detected 7 SIN entities', 'Policy P-002 matched (precedence 1)', 'Action: BLOCK + REDACT', 'Sentinel incident #INC-44219 created'] },
  { id: 'EVT-9820', time: '14:31:48', policy: 'P-003', trigger: 'Prompt Injection', action: 'Session terminated', outcome: 'enforced', severity: 'critical', confidence: 0.92, trace: ['Lakera Guard score: 0.91', 'User: claire.chen@bank.ca', 'Policy P-003 matched', 'Action: TERMINATE_SESSION', 'Slack alert sent to #soc-critical'] },
  { id: 'EVT-9819', time: '14:30:02', policy: 'P-001', trigger: 'High-risk sign-in', action: 'MFA re-authentication forced', outcome: 'mfa', severity: 'high', confidence: 0.88, trace: ['Entra ID risk: HIGH', 'Conditional Access applied', 'MFA challenge issued', 'User completed MFA'] },
  { id: 'EVT-9818', time: '14:28:55', policy: 'P-004', trigger: 'Behavioral drift', action: 'Throttle simulated', outcome: 'simulated', severity: 'medium', confidence: 0.74, trace: ['Drift score: 3.4σ', 'Simulation mode active', 'No production action taken', 'Logged for review'] },
  { id: 'EVT-9817', time: '14:26:30', policy: 'P-005', trigger: 'Impossible travel', action: 'User disabled', outcome: 'enforced', severity: 'critical', confidence: 0.99, trace: ['Sign-in from Toronto → Singapore in 4min', 'Geo-velocity: 2,400 km/h', 'Service principal disabled', 'SOAR playbook PB-IDC-01 triggered'] },
];

const TOP_RISKS: TopRisk[] = [
  { id: 'R1', title: 'High-risk user attempting PII extraction', severity: 'critical', signal: '3 attempts in last 5min · claire.chen@bank.ca', recommendation: 'Revoke session + escalate to Risk Officer', policy: 'P-001 + P-002' },
  { id: 'R2', title: 'AI agent showing abnormal behavioral drift', severity: 'high', signal: 'Underwriting agent · drift 3.4σ above baseline', recommendation: 'Enable circuit breaker (P-004 simulation → active)', policy: 'P-004' },
  { id: 'R3', title: 'API abuse — fraud-detect endpoint', severity: 'medium', signal: '12,400 req/min from svc-fraud-01', recommendation: 'Throttle service principal · open Sentinel incident', policy: 'P-003' },
];

const SCENARIOS = [
  {
    title: 'High-risk user attempts PII extraction',
    flow: [
      { label: 'Trigger', value: 'Entra ID risk=HIGH + Presidio detects 7 SIN entities' },
      { label: 'Policy', value: 'P-001 (precedence 1) + P-002 (precedence 1)' },
      { label: 'Action', value: 'Revoke tokens · Block prompt · Mask output · Force MFA' },
      { label: 'Audit', value: 'WORM log EVT-9821 · mapped to PIPEDA §4.7 · Sentinel #INC-44219' },
    ],
  },
  {
    title: 'AI agent shows abnormal behavioral drift',
    flow: [
      { label: 'Trigger', value: 'Drift detector: 3.4σ above baseline for 6min' },
      { label: 'Policy', value: 'P-004 (Behavioral Drift Circuit Breaker)' },
      { label: 'Action', value: 'Throttle agent to 10% capacity · Disable risky tool · Notify owner' },
      { label: 'Audit', value: 'Decision trace stored · OSFI E-21 control mapped · rollback available' },
    ],
  },
  {
    title: 'API abuse triggers circuit breaker',
    flow: [
      { label: 'Trigger', value: 'Rate spike: 12.4k req/min on /api/v1/fraud/detect' },
      { label: 'Policy', value: 'P-003 + custom rate-limit policy' },
      { label: 'Action', value: 'Open circuit breaker · Disable service principal · SOAR playbook' },
      { label: 'Audit', value: 'Full chain logged · Slack + Teams alerts · evidence ZIP exported' },
    ],
  },
];

const typeMeta: Record<PolicyType, { label: string; icon: typeof Shield; color: string }> = {
  identity: { label: 'Identity', icon: KeyRound, color: 'text-accent-blue bg-accent-blue/10' },
  ai: { label: 'AI Behavior', icon: Activity, color: 'text-accent-purple bg-accent-purple/10' },
  data: { label: 'Data / PII', icon: FileLock, color: 'text-accent-teal bg-accent-teal/10' },
  compliance: { label: 'Compliance', icon: Shield, color: 'text-accent-amber bg-accent-amber/10' },
};

const sevMeta: Record<Severity, string> = {
  critical: 'text-accent-red bg-accent-red/10 border-accent-red/30',
  high: 'text-accent-amber bg-accent-amber/10 border-accent-amber/30',
  medium: 'text-accent-blue bg-accent-blue/10 border-accent-blue/30',
  low: 'text-accent-teal bg-accent-teal/10 border-accent-teal/30',
};

const outcomeMeta = {
  enforced: { icon: CheckCircle2, color: 'text-accent-teal' },
  blocked: { icon: Ban, color: 'text-accent-red' },
  mfa: { icon: KeyRound, color: 'text-accent-amber' },
  simulated: { icon: Eye, color: 'text-accent-blue' },
};

export default function PolicyEnforcement() {
  const [filter, setFilter] = useState<'all' | PolicyType>('all');
  const [selectedLog, setSelectedLog] = useState<EnforcementLog>(LOGS[0]);
  const [simulationMode, setSimulationMode] = useState(false);

  const filteredPolicies = filter === 'all' ? POLICIES : POLICIES.filter(p => p.type === filter);

  const stats = [
    { label: 'Active Policies', value: POLICIES.filter(p => p.status === 'active').length, icon: Shield, accent: 'text-accent-teal' },
    { label: 'Enforcements (24h)', value: POLICIES.reduce((s, p) => s + p.hits24h, 0), icon: Zap, accent: 'text-accent-amber' },
    { label: 'Critical Risks Open', value: 2, icon: AlertOctagon, accent: 'text-accent-red' },
    { label: 'Avg Decision Latency', value: '38ms', icon: Clock, accent: 'text-accent-blue' },
  ];

  return (
    <div className="space-y-4">
      {/* Header / Summary */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-accent-teal" />
              <h2 className="text-base font-bold text-foreground">Policy Enforcement Engine</h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-accent-teal rounded-full animate-pulse-glow" />
                Live
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-2xl">
              Real-time policy enforcement across Entra ID, Sentinel, and the Bastion AI Gateway.
              Every decision is logged immutably and mapped to OSFI E-21, PIPEDA, and AIDA controls.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSimulationMode(s => !s)}
              className={`text-xs h-8 border-border ${simulationMode ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary'}`}
            >
              <Eye className="w-3 h-3 mr-1" />
              Simulation Mode {simulationMode ? 'ON' : 'OFF'}
            </Button>
            <Button size="sm" variant="outline" className="border-border text-text-secondary text-xs h-8">
              <Download className="w-3 h-3 mr-1" /> Export Audit Package
            </Button>
            <Button size="sm" className="bg-accent-teal hover:bg-accent-teal-lt text-foreground text-xs h-8">
              <Plus className="w-3 h-3 mr-1" /> New Policy
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-surface-raised border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted-custom font-semibold">{s.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${s.accent}`} />
                </div>
                <div className="text-xl font-bold text-foreground">{s.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Risks & Recommended Actions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-red" />
            <h3 className="text-sm font-bold text-foreground">Top Risks & Recommended Actions</h3>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary">Decision Intelligence</span>
        </div>
        <div className="space-y-2">
          {TOP_RISKS.map(r => (
            <div key={r.id} className="flex items-start gap-3 p-3 bg-surface-raised border border-border rounded-lg hover:border-accent-teal/40 transition-colors">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${sevMeta[r.severity]}`}>
                {r.severity}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground mb-0.5">{r.title}</div>
                <div className="text-[11px] text-text-secondary mb-1">{r.signal}</div>
                <div className="text-[11px] text-accent-teal flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> {r.recommendation}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-text-muted-custom font-mono">{r.policy}</span>
                <Button size="sm" className="bg-accent-teal hover:bg-accent-teal-lt text-foreground text-[10px] h-6 px-2">
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Policy Catalog */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-teal" />
              <h3 className="text-sm font-bold text-foreground">Policy Catalog</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {(['all', 'identity', 'ai', 'data', 'compliance'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border transition-colors ${
                    filter === f
                      ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/40'
                      : 'border-border text-text-secondary hover:text-foreground'
                  }`}
                >
                  {f === 'all' ? 'All' : typeMeta[f].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredPolicies.map(p => {
              const meta = typeMeta[p.type];
              const Icon = meta.icon;
              return (
                <div key={p.id} className="bg-surface-raised border border-border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded ${meta.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono text-text-muted-custom">{p.id}</span>
                        <span className="text-xs font-semibold text-foreground">{p.name}</span>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-background border border-border text-text-secondary">
                          PRECEDENCE {p.precedence}
                        </span>
                        {p.status === 'simulation' && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-blue/10 text-accent-blue">
                            Simulation
                          </span>
                        )}
                        {p.status === 'active' && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-teal/10 text-accent-teal">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[11px]">
                        <div>
                          <span className="text-text-muted-custom">IF </span>
                          <span className="text-text-secondary">{p.trigger}</span>
                        </div>
                        <div>
                          <span className="text-text-muted-custom">THEN </span>
                          <span className="text-foreground">{p.action}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted-custom">
                        <span>Hits 24h: <span className="text-foreground font-semibold">{p.hits24h}</span></span>
                        <span>Last: {p.lastFired}</span>
                        <div className="flex gap-1">
                          {p.compliance.map(c => (
                            <span key={c} className="px-1.5 py-0.5 rounded bg-background border border-border text-text-secondary">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Playbook Builder */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-accent-purple" />
              <h3 className="text-sm font-bold text-foreground">Playbook Builder</h3>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-text-secondary">No-code</span>
          </div>

          <div className="space-y-2 mb-4">
            {[
              { label: 'TRIGGER', value: 'Entra ID risk = HIGH', icon: Zap, color: 'text-accent-amber bg-accent-amber/10' },
              { label: 'CONDITION', value: 'User has access to PII data', icon: GitBranch, color: 'text-accent-blue bg-accent-blue/10' },
              { label: 'ACTION', value: 'Revoke tokens + Force MFA', icon: Lock, color: 'text-accent-teal bg-accent-teal/10' },
              { label: 'NOTIFY', value: 'Slack #soc-critical + Sentinel incident', icon: Bell, color: 'text-accent-purple bg-accent-purple/10' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i}>
                  <div className="bg-surface-raised border border-border rounded-lg p-2.5 flex items-center gap-2">
                    <div className={`p-1.5 rounded ${step.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] uppercase tracking-wider text-text-muted-custom font-semibold">{step.label}</div>
                      <div className="text-xs text-foreground truncate">{step.value}</div>
                    </div>
                  </div>
                  {i < 3 && <div className="flex justify-center my-1"><ChevronRight className="w-3 h-3 text-text-muted-custom rotate-90" /></div>}
                </div>
              );
            })}
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="text-[10px] uppercase tracking-wider text-text-muted-custom font-semibold mb-1">Prebuilt Templates</div>
            {['PII Breach Response', 'Identity Compromise', 'AI Jailbreak Attempt'].map(t => (
              <button key={t} className="w-full text-left text-[11px] text-text-secondary hover:text-foreground bg-surface-raised border border-border rounded px-2.5 py-1.5 hover:border-accent-teal/40 transition-colors flex items-center justify-between">
                {t} <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 border-border text-text-secondary text-[11px] h-8">
              Test (Sim)
            </Button>
            <Button size="sm" className="flex-1 bg-accent-teal hover:bg-accent-teal-lt text-foreground text-[11px] h-8">
              <Play className="w-3 h-3 mr-1" /> Deploy
            </Button>
          </div>
        </div>
      </div>

      {/* Enforcement Log + Decision Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent-blue" />
              <h3 className="text-sm font-bold text-foreground">Enforcement Log</h3>
              <span className="text-[10px] uppercase tracking-wider text-text-muted-custom">WORM · Immutable</span>
            </div>
            <Button size="sm" variant="outline" className="border-border text-text-secondary text-xs h-7">
              <Filter className="w-3 h-3 mr-1" /> Filter
            </Button>
          </div>

          <div className="space-y-1.5">
            {LOGS.map(log => {
              const Out = outcomeMeta[log.outcome];
              const Icon = Out.icon;
              const isSelected = selectedLog.id === log.id;
              return (
                <button
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`w-full text-left bg-surface-raised border rounded-lg p-2.5 transition-colors ${
                    isSelected ? 'border-accent-teal/50' : 'border-border hover:border-accent-teal/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${Out.color} flex-shrink-0`} />
                    <span className="text-[10px] font-mono text-text-muted-custom">{log.time}</span>
                    <span className="text-[10px] font-mono text-text-secondary">{log.id}</span>
                    <span className="text-[10px] font-mono text-accent-purple">{log.policy}</span>
                    <span className="text-xs text-foreground flex-1 truncate">{log.action}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${sevMeta[log.severity]}`}>
                      {log.severity}
                    </span>
                    <span className="text-[10px] text-text-secondary font-mono">{Math.round(log.confidence * 100)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decision Trace */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-accent-teal" />
              <h3 className="text-sm font-bold text-foreground">Decision Trace</h3>
            </div>
            <span className="text-[10px] font-mono text-text-muted-custom">{selectedLog.id}</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border">
              <span className="text-text-muted-custom">Policy</span>
              <span className="text-accent-purple font-mono">{selectedLog.policy}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border">
              <span className="text-text-muted-custom">Confidence</span>
              <span className="text-foreground font-semibold">{Math.round(selectedLog.confidence * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border">
              <span className="text-text-muted-custom">Trigger</span>
              <span className="text-foreground">{selectedLog.trigger}</span>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-wider text-text-muted-custom font-semibold mb-2">Chain of Events</div>
          <div className="space-y-1.5">
            {selectedLog.trace.map((step, i) => (
              <div key={i} className="flex gap-2 text-[11px]">
                <span className="text-accent-teal font-mono flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-text-secondary">{step}</span>
              </div>
            ))}
          </div>

          <Button size="sm" variant="outline" className="w-full mt-4 border-border text-text-secondary text-[11px] h-8">
            <Download className="w-3 h-3 mr-1" /> Download Evidence ZIP
          </Button>
        </div>
      </div>

      {/* Architecture & Multi-Tenant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-accent-blue" />
            <h3 className="text-sm font-bold text-foreground">System Architecture</h3>
          </div>
          <div className="space-y-2">
            {[
              { layer: 'Signal Sources', items: ['Entra ID (Graph API)', 'AI Gateway (interception)', 'Sentinel SIEM', 'API telemetry'] },
              { layer: 'Decision Plane', items: ['Policy Evaluator (AWS Lambda)', 'Risk Scoring (real-time + batch)', 'Conflict Resolver (precedence)'] },
              { layer: 'Enforcement Plane', items: ['Identity actions (Conditional Access)', 'AI guardrails (block/mask/throttle)', 'SOAR playbooks (Sentinel)'] },
              { layer: 'Audit Plane', items: ['WORM log (S3 Object Lock)', 'Compliance mapper', 'Evidence packager'] },
            ].map(l => (
              <div key={l.layer} className="bg-surface-raised border border-border rounded-lg p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-accent-teal font-semibold mb-1.5">{l.layer}</div>
                <div className="flex flex-wrap gap-1">
                  {l.items.map(i => (
                    <span key={i} className="text-[10px] text-text-secondary bg-background border border-border px-2 py-0.5 rounded">{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-accent-purple" />
            <h3 className="text-sm font-bold text-foreground">Multi-Tenant & RBAC</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { role: 'Security Analyst', perms: 'Read · Investigate · Acknowledge' },
              { role: 'Risk Officer', perms: 'Approve policies · View audit' },
              { role: 'Privacy Officer', perms: 'PIPEDA controls · Data subject reqs' },
              { role: 'Admin', perms: 'Tenant config · RBAC · Keys' },
            ].map(r => (
              <div key={r.role} className="bg-surface-raised border border-border rounded-lg p-2.5">
                <div className="text-xs font-semibold text-foreground mb-0.5">{r.role}</div>
                <div className="text-[10px] text-text-secondary">{r.perms}</div>
              </div>
            ))}
          </div>
          <div className="bg-surface-raised border border-border rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wider text-text-muted-custom font-semibold mb-2">Tenant Isolation</div>
            <div className="space-y-1.5 text-[11px]">
              {[
                'Per-tenant KMS keys (envelope encryption)',
                'Logical DB partitioning + row-level security',
                'Delegated policy management per business unit',
                'Tenant-scoped audit exports',
              ].map(i => (
                <div key={i} className="flex items-center gap-2 text-text-secondary">
                  <CheckCircle2 className="w-3 h-3 text-accent-teal flex-shrink-0" /> {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Example Scenarios */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-accent-amber" />
          <h3 className="text-sm font-bold text-foreground">Example Scenarios — Trigger → Policy → Action → Audit</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SCENARIOS.map((s, i) => (
            <div key={i} className="bg-surface-raised border border-border rounded-lg p-3">
              <div className="text-xs font-bold text-foreground mb-3">{s.title}</div>
              <div className="space-y-2">
                {s.flow.map(step => (
                  <div key={step.label}>
                    <div className="text-[9px] uppercase tracking-wider text-accent-teal font-semibold mb-0.5">{step.label}</div>
                    <div className="text-[11px] text-text-secondary leading-snug">{step.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
