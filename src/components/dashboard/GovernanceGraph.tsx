import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Network, Users, Building2, Bot, Database, Award, BadgeCheck, Archive, Briefcase,
  AlertTriangle, Search, Filter, Sparkles, Clock, Shield, Activity, GitBranch,
  FileText, Workflow, Eye, ArrowUpRight, X, KeyRound, ShieldAlert, Layers,
  ScanLine, Zap, Calendar, ChevronRight, FileSignature, Cpu, Scale,
} from 'lucide-react';

type NodeKind =
  | 'human' | 'department' | 'group' | 'agent' | 'app' | 'data'
  | 'trust' | 'cert' | 'evidence' | 'case' | 'risk' | 'regulation';

interface GNode {
  id: string;
  label: string;
  sub?: string;
  kind: NodeKind;
  x: number;
  y: number;
  meta?: string;
}

interface GEdge {
  from: string;
  to: string;
  label?: string;
  tone?: 'default' | 'risk' | 'compliance' | 'trust';
}

const kindStyle: Record<NodeKind, { icon: typeof Users; fill: string; ring: string; text: string; label: string }> = {
  human:       { icon: Users,       fill: 'hsl(190 95% 50% / 0.15)', ring: 'hsl(190 95% 55%)',  text: 'text-accent-teal',   label: 'Human Owner' },
  department:  { icon: Building2,   fill: 'hsl(217 91% 60% / 0.15)', ring: 'hsl(217 91% 65%)',  text: 'text-blue-300',      label: 'Department' },
  group:       { icon: KeyRound,    fill: 'hsl(217 91% 60% / 0.12)', ring: 'hsl(217 91% 70%)',  text: 'text-blue-200',      label: 'Entra Group' },
  agent:       { icon: Bot,         fill: 'hsl(152 70% 45% / 0.18)', ring: 'hsl(152 70% 50%)',  text: 'text-emerald-300',   label: 'AI Agent' },
  app:         { icon: Cpu,         fill: 'hsl(220 15% 60% / 0.15)', ring: 'hsl(220 15% 70%)',  text: 'text-text-secondary', label: 'Application' },
  data:        { icon: Database,    fill: 'hsl(220 15% 50% / 0.18)', ring: 'hsl(220 15% 65%)',  text: 'text-text-secondary', label: 'Data Source' },
  trust:       { icon: Award,       fill: 'hsl(175 75% 45% / 0.18)', ring: 'hsl(175 75% 50%)',  text: 'text-teal-300',      label: 'Trust Score' },
  cert:        { icon: BadgeCheck,  fill: 'hsl(175 75% 45% / 0.15)', ring: 'hsl(175 75% 55%)',  text: 'text-teal-200',      label: 'Certification' },
  evidence:    { icon: Archive,     fill: 'hsl(270 70% 60% / 0.18)', ring: 'hsl(270 70% 65%)',  text: 'text-purple-300',    label: 'Evidence' },
  case:        { icon: Briefcase,   fill: 'hsl(38 92% 55% / 0.18)',  ring: 'hsl(38 92% 60%)',   text: 'text-accent-amber',  label: 'Case' },
  risk:        { icon: AlertTriangle, fill: 'hsl(0 75% 55% / 0.18)', ring: 'hsl(0 75% 60%)',    text: 'text-accent-red',    label: 'Risk Signal' },
  regulation:  { icon: Scale,       fill: 'hsl(280 60% 55% / 0.18)', ring: 'hsl(280 60% 60%)',  text: 'text-purple-200',    label: 'Regulation' },
};

const kpis = [
  { label: 'Governed Entities', value: '1,248', icon: Network, color: 'text-accent-teal' },
  { label: 'AI Agents', value: '284', icon: Bot, color: 'text-emerald-300' },
  { label: 'Human Owners', value: '438', icon: Users, color: 'text-accent-teal' },
  { label: 'Connected Applications', value: '41', icon: Cpu, color: 'text-text-secondary' },
  { label: 'Governance Relationships', value: '8,921', icon: GitBranch, color: 'text-blue-300' },
  { label: 'High Risk Relationships', value: '27', icon: AlertTriangle, color: 'text-accent-red' },
  { label: 'Open Governance Cases', value: '47', icon: Briefcase, color: 'text-accent-amber' },
  { label: 'Graph Coverage', value: '92%', icon: ScanLine, color: 'text-teal-300' },
];

const views = [
  { id: 'identity',    label: 'Identity View',    icon: KeyRound,   desc: 'Humans · Groups · Roles · Agents' },
  { id: 'risk',        label: 'Risk View',        icon: AlertTriangle, desc: 'Agents · Trust · Cases · Risk' },
  { id: 'compliance',  label: 'Compliance View',  icon: ShieldAlert,desc: 'Agents · Evidence · Certs · Regs' },
  { id: 'executive',   label: 'Executive View',   icon: Briefcase,  desc: 'BU · Exposure · Trust · Cases' },
  { id: 'application', label: 'Application View', icon: Cpu,        desc: 'Agents · Apps · Data Sources' },
  { id: 'board',       label: 'Board View',       icon: FileText,   desc: 'High-Risk · Cases · Reg · Trends' },
];

// Centered around 600,360. Designed for an 1200x680 viewBox.
const baseNodes: GNode[] = [
  // Identity chain
  { id: 'h-vp',    label: 'VP Credit Risk',      sub: 'J. Mercer',         kind: 'human',      x: 90,  y: 90,  meta: 'Owner · Privileged' },
  { id: 'd-lend',  label: 'Lending Department',  sub: '142 staff',         kind: 'department', x: 260, y: 90 },
  { id: 'g-lend',  label: 'Lending-AI-Agents',   sub: 'Entra Group',       kind: 'group',      x: 430, y: 90 },
  { id: 'a-und',   label: 'UnderwriterGPT',      sub: 'Production · v3.4', kind: 'agent',      x: 620, y: 200, meta: 'Certified · Trust 97' },

  // Apps + data
  { id: 'ap-cred', label: 'Credit Decision API', sub: 'Internal',          kind: 'app',        x: 850, y: 110 },
  { id: 'ap-cb',   label: 'Bureau Connector',    sub: 'Equifax / TU',      kind: 'app',        x: 850, y: 200 },
  { id: 'ds-cust', label: 'Customer Risk DB',    sub: 'Restricted',        kind: 'data',       x: 1060, y: 110 },
  { id: 'ds-bur',  label: 'Bureau Cache',        sub: 'Encrypted',         kind: 'data',       x: 1060, y: 200 },

  // Governance artifacts for UnderwriterGPT
  { id: 't-und',   label: 'Trust Score 97',      sub: 'Identity · Behavior', kind: 'trust',    x: 620, y: 360 },
  { id: 'c-und',   label: 'Certified',           sub: 'OSFI E-21',         kind: 'cert',       x: 470, y: 360 },
  { id: 'e-und',   label: 'Evidence Package',    sub: '12 artifacts',      kind: 'evidence',   x: 770, y: 360 },
  { id: 'r-osfi',  label: 'OSFI E-21',           sub: 'Regulator',         kind: 'regulation', x: 320, y: 360 },

  // At-risk path — PayrollAgent
  { id: 'h-hr',    label: 'HR Systems Lead',     sub: 'M. Chen',           kind: 'human',      x: 90,  y: 500 },
  { id: 'd-hr',    label: 'HR Department',       sub: '78 staff',          kind: 'department', x: 260, y: 500 },
  { id: 'a-pay',   label: 'PayrollAgent',        sub: 'Quarantined',       kind: 'agent',      x: 470, y: 550, meta: 'Trust 42' },
  { id: 'ds-pay',  label: 'Payroll Database',    sub: 'PII · Restricted',  kind: 'data',       x: 700, y: 600 },
  { id: 't-pay',   label: 'Trust Score 42',      sub: 'Degraded',          kind: 'trust',      x: 700, y: 500 },
  { id: 'rk-pi',   label: 'Prompt Injection',    sub: '09:14 UTC',         kind: 'risk',       x: 900, y: 530 },
  { id: 'cs-114',  label: 'Case AI-2026-114',    sub: 'Investigating',     kind: 'case',       x: 1080, y: 560 },
  { id: 'c-sus',   label: 'Cert Suspended',      sub: 'Pending review',    kind: 'cert',       x: 470, y: 650 },
];

const baseEdges: GEdge[] = [
  // Underwriter chain
  { from: 'h-vp',   to: 'd-lend',  label: 'belongs to' },
  { from: 'd-lend', to: 'g-lend',  label: 'owns group' },
  { from: 'g-lend', to: 'a-und',   label: 'governs', tone: 'trust' },
  { from: 'a-und',  to: 'ap-cred', label: 'invokes' },
  { from: 'a-und',  to: 'ap-cb' },
  { from: 'ap-cred',to: 'ds-cust', label: 'reads' },
  { from: 'ap-cb',  to: 'ds-bur' },
  { from: 'a-und',  to: 't-und',   tone: 'trust' },
  { from: 'a-und',  to: 'c-und',   tone: 'compliance' },
  { from: 'a-und',  to: 'e-und',   tone: 'compliance' },
  { from: 'c-und',  to: 'r-osfi',  label: 'satisfies', tone: 'compliance' },

  // Payroll degraded chain
  { from: 'h-hr',  to: 'd-hr' },
  { from: 'd-hr',  to: 'a-pay' },
  { from: 'a-pay', to: 'ds-pay',  label: 'accesses', tone: 'risk' },
  { from: 'a-pay', to: 't-pay',   tone: 'risk' },
  { from: 'a-pay', to: 'c-sus',   tone: 'risk' },
  { from: 'a-pay', to: 'rk-pi',   tone: 'risk' },
  { from: 'rk-pi', to: 'cs-114',  label: 'opened', tone: 'risk' },
];

const viewFilters: Record<string, NodeKind[]> = {
  identity:    ['human', 'department', 'group', 'agent'],
  risk:        ['agent', 'trust', 'case', 'risk'],
  compliance:  ['agent', 'evidence', 'cert', 'regulation'],
  executive:   ['department', 'agent', 'trust', 'case'],
  application: ['agent', 'app', 'data'],
  board:       ['agent', 'case', 'regulation', 'trust', 'risk'],
};

const trustContributors = [
  { label: 'Identity Health',       weight: 25, tone: 'bg-accent-teal' },
  { label: 'Behavior Consistency',  weight: 25, tone: 'bg-emerald-400' },
  { label: 'Prompt Safety',         weight: 20, tone: 'bg-blue-400' },
  { label: 'Compliance Posture',    weight: 15, tone: 'bg-purple-400' },
  { label: 'Evidence Integrity',    weight: 15, tone: 'bg-teal-300' },
];

const simulations = [
  { id: 'trust', q: 'Trust Score drops below 70?', impact: '14 agents flagged · 3 cases auto-opened · Board notification triggered' },
  { id: 'owner', q: 'Owner account disabled?', impact: '7 agents orphaned · Access review launched · 2 certifications paused' },
  { id: 'cert',  q: 'Agent certification expires?', impact: 'Production gate blocks · Evidence sealed · Recertification workflow' },
  { id: 'pi',    q: 'Prompt injection occurs?', impact: 'Circuit breaker · Agent quarantined · PIPEDA notification path armed' },
];

const insights = [
  '27 high-risk governance relationships identified across 9 business units.',
  '4 agent certifications expired within the last 30 days — 2 awaiting recertification.',
  '3 privileged ownership paths exceeded policy thresholds; auto-escalated to CRO.',
  'Estimated regulatory exposure reduced by 14% following Q2 remediation cycle.',
];

const toastAction = (msg: string) => toast.success(msg, { description: 'Mock action · enterprise demo' });

export default function GovernanceGraph() {
  const [view, setView] = useState<string>('identity');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>('a-und');
  const [timeline, setTimeline] = useState<'30' | '90' | '180'>('30');

  const visibleKinds = viewFilters[view];

  const filteredNodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseNodes.filter(n => {
      if (!visibleKinds.includes(n.kind)) return false;
      if (!q) return true;
      return n.label.toLowerCase().includes(q) || (n.sub ?? '').toLowerCase().includes(q);
    });
  }, [view, query, visibleKinds]);

  const visibleIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = baseEdges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to));

  const selectedNode = baseNodes.find(n => n.id === selected) ?? null;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-5 h-5 text-accent-teal" />
            <h1 className="text-xl font-semibold text-foreground">AI Governance Graph</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
              Preview · Relationship Engine
            </span>
          </div>
          <p className="text-sm text-text-secondary max-w-3xl">
            Visualize ownership, access, trust, risk, compliance, and governance relationships across autonomous enterprise agents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toastAction('Executive brief generated')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:border-accent-teal/40">
            <Sparkles className="w-3.5 h-3.5 text-accent-teal" /> Generate Executive Brief
          </button>
          <button onClick={() => toastAction('Graph report queued for export')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:border-accent-teal/40">
            <FileText className="w-3.5 h-3.5" /> Export Graph Report
          </button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-wider text-text-secondary">{k.label}</span>
                <Icon className={`w-3.5 h-3.5 ${k.color}`} />
              </div>
              <div className="text-lg font-semibold text-foreground">{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* CONTROLS */}
      <div className="bg-card border border-border rounded-lg p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-text-secondary" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search agent · owner · department · case · application · data source"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-text-secondary border-b border-border focus:border-accent-teal outline-none py-1"
            />
          </div>
          <div className="flex items-center gap-1 bg-background border border-border rounded-md p-0.5">
            {(['30','90','180'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeline(t)}
                className={`px-2.5 py-1 text-[11px] rounded ${timeline===t ? 'bg-card text-foreground border border-border' : 'text-text-secondary hover:text-foreground'}`}
              >
                {t}d
              </button>
            ))}
            <span className="px-2 text-[10px] text-text-secondary flex items-center gap-1"><Calendar className="w-3 h-3" /> Timeline</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {views.map(v => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                title={v.desc}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                  active ? 'bg-accent-teal/10 border-accent-teal/40 text-accent-teal' : 'bg-background border-border text-text-secondary hover:text-foreground hover:border-border/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRAPH + SIDE PANEL */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        {/* Graph */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-teal" />
              <h3 className="text-sm font-medium">Relationship Canvas</h3>
              <span className="text-[10px] text-text-secondary">{filteredNodes.length} nodes · {filteredEdges.length} edges</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-text-secondary">
              <Legend tone="trust" label="trust" />
              <Legend tone="compliance" label="compliance" />
              <Legend tone="risk" label="risk" />
            </div>
          </div>
          <div className="relative bg-[radial-gradient(circle_at_30%_20%,hsl(190_95%_50%/0.05),transparent_60%),radial-gradient(circle_at_80%_80%,hsl(270_70%_60%/0.05),transparent_60%)]">
            <svg viewBox="0 0 1200 720" className="w-full h-[640px]">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(220 15% 50%)" />
                </marker>
                <marker id="arr-risk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(0 75% 60%)" />
                </marker>
                <marker id="arr-trust" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(175 75% 50%)" />
                </marker>
                <marker id="arr-comp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(270 70% 65%)" />
                </marker>
              </defs>

              {/* Edges */}
              {filteredEdges.map((e, i) => {
                const a = baseNodes.find(n => n.id === e.from)!;
                const b = baseNodes.find(n => n.id === e.to)!;
                const stroke =
                  e.tone === 'risk' ? 'hsl(0 75% 60%)' :
                  e.tone === 'trust' ? 'hsl(175 75% 50%)' :
                  e.tone === 'compliance' ? 'hsl(270 70% 65%)' :
                  'hsl(220 15% 45%)';
                const marker =
                  e.tone === 'risk' ? 'url(#arr-risk)' :
                  e.tone === 'trust' ? 'url(#arr-trust)' :
                  e.tone === 'compliance' ? 'url(#arr-comp)' :
                  'url(#arr)';
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const dim = selected && !(selected === a.id || selected === b.id) ? 0.35 : 1;
                return (
                  <g key={i} style={{ opacity: dim }}>
                    <line
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={stroke} strokeWidth={e.tone === 'risk' ? 1.6 : 1.2}
                      strokeDasharray={e.tone === 'risk' ? '4 3' : undefined}
                      markerEnd={marker}
                    />
                    {e.label && (
                      <text x={mx} y={my - 4} textAnchor="middle" fontSize="9" fill="hsl(220 10% 65%)">
                        {e.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(n => {
                const s = kindStyle[n.kind];
                const active = selected === n.id;
                return (
                  <g key={n.id} transform={`translate(${n.x}, ${n.y})`} className="cursor-pointer" onClick={() => setSelected(n.id)}>
                    <circle r={active ? 26 : 22} fill={s.fill} stroke={s.ring} strokeWidth={active ? 2 : 1.2} />
                    {active && <circle r={32} fill="none" stroke={s.ring} strokeOpacity={0.4} strokeWidth={1} />}
                    <foreignObject x={-10} y={-10} width={20} height={20}>
                      <div className={`flex items-center justify-center ${s.text}`}>
                        <s.icon className="w-4 h-4" />
                      </div>
                    </foreignObject>
                    <text y={42} textAnchor="middle" fontSize="11" fill="hsl(220 10% 88%)" fontWeight={500}>
                      {n.label}
                    </text>
                    {n.sub && (
                      <text y={55} textAnchor="middle" fontSize="9" fill="hsl(220 10% 60%)">
                        {n.sub}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          {selectedNode ? (
            <div className="bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${kindStyle[selectedNode.kind].text}`} style={{ borderColor: kindStyle[selectedNode.kind].ring }}>
                    {kindStyle[selectedNode.kind].label}
                  </span>
                  <h3 className="text-sm font-medium">{selectedNode.label}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-text-secondary hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {selectedNode.kind === 'agent' && selectedNode.id === 'a-und' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Stat k="Owner" v="VP Credit Risk" />
                    <Stat k="Department" v="Lending" />
                    <Stat k="Trust Score" v="97" tone="text-emerald-300" />
                    <Stat k="Certification" v="Certified" tone="text-teal-300" />
                    <Stat k="Applications" v="4" />
                    <Stat k="Data Sources" v="7" />
                    <Stat k="Evidence Packages" v="12" />
                    <Stat k="Open Cases" v="0" tone="text-emerald-300" />
                    <Stat k="Compliance" v="Compliant" tone="text-emerald-300" />
                    <Stat k="Last Review" v="12 days ago" />
                  </div>
                ) : selectedNode.kind === 'agent' && selectedNode.id === 'a-pay' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Stat k="Owner" v="HR Systems Lead" />
                    <Stat k="Department" v="HR" />
                    <Stat k="Trust Score" v="42" tone="text-accent-red" />
                    <Stat k="Certification" v="Suspended" tone="text-accent-red" />
                    <Stat k="Status" v="Quarantined" tone="text-accent-amber" />
                    <Stat k="Open Cases" v="1 (Critical)" tone="text-accent-red" />
                    <Stat k="Regulation" v="PIPEDA" />
                    <Stat k="Last Review" v="2 hr ago" />
                  </div>
                ) : (
                  <div className="text-xs text-text-secondary">
                    {selectedNode.meta ?? `${kindStyle[selectedNode.kind].label} node selected. Click an AI Agent to see full governance context.`}
                  </div>
                )}

                <div className="pt-2 border-t border-border space-y-1.5">
                  <ActionBtn icon={Briefcase} label="Create Governance Case" onClick={() => toastAction('Case draft created')} />
                  <ActionBtn icon={Archive}   label="Generate Evidence Package" onClick={() => toastAction('Evidence package generated · SHA-256 sealed')} />
                  <ActionBtn icon={KeyRound}  label="Launch Access Review" onClick={() => toastAction('Access review launched to Entra')} />
                  <ActionBtn icon={BadgeCheck} label="Open Certification Workflow" onClick={() => toastAction('Certification workflow opened')} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-4 text-xs text-text-secondary">
              Select a node on the graph to inspect ownership, trust, and compliance context.
            </div>
          )}

          {/* Executive insights */}
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Sparkles className="w-4 h-4 text-accent-teal" />
              <h3 className="text-sm font-medium">Executive Insights</h3>
              <span className="ml-auto text-[10px] text-text-secondary">Last {timeline} days</span>
            </div>
            <ul className="p-4 space-y-2 text-xs text-text-secondary">
              {insights.map(i => (
                <li key={i} className="flex gap-2">
                  <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-accent-teal shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RISK PATH + WHAT-IF + TRUST + REGULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Path Analysis */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <Zap className="w-4 h-4 text-accent-red" />
            <h3 className="text-sm font-medium">Risk Path Analysis</h3>
            <span className="ml-auto text-[10px] text-text-secondary">How risk propagates through relationships</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <PathChip tone="risk" icon={KeyRound} label="Compromised Identity" />
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              <PathChip tone="amber" icon={Bot} label="PayrollAgent" />
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              <PathChip tone="default" icon={Cpu} label="Payroll API" />
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              <PathChip tone="default" icon={Database} label="Payroll DB (PII)" />
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              <PathChip tone="risk" icon={Scale} label="PIPEDA Exposure" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <RiskCell k="Risk Source"      v="Stolen credentials · MFA disabled" tone="text-accent-red" />
              <RiskCell k="Affected Assets"  v="1 agent · 3 systems · 1 PII store" />
              <RiskCell k="Potential Impact" v="PII disclosure · Regulatory fine $0.4–1.2M" tone="text-accent-amber" />
              <RiskCell k="Recommended"      v="Quarantine agent · Force MFA · Open case" tone="text-accent-teal" />
            </div>
          </div>
        </div>

        {/* What-If Simulation */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <Activity className="w-4 h-4 text-accent-amber" />
            <h3 className="text-sm font-medium">Governance Impact Simulation</h3>
            <span className="ml-auto text-[10px] text-text-secondary">"What If?"</span>
          </div>
          <div className="p-4 space-y-2">
            {simulations.map(s => (
              <button
                key={s.id}
                onClick={() => toastAction(`Simulation run: ${s.q}`)}
                className="w-full text-left flex items-start gap-2 p-2.5 rounded-md border border-border hover:border-accent-teal/40 hover:bg-background transition-colors"
              >
                <Zap className="w-3.5 h-3.5 mt-0.5 text-accent-amber shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-foreground font-medium">{s.q}</div>
                  <div className="text-[11px] text-text-secondary mt-0.5">{s.impact}</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            ))}
          </div>
        </div>

        {/* Trust Score Dependency */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <Award className="w-4 h-4 text-teal-300" />
            <h3 className="text-sm font-medium">Trust Score Dependency</h3>
            <span className="ml-auto text-[10px] text-text-secondary">UnderwriterGPT · 97</span>
          </div>
          <div className="p-4 space-y-2">
            {trustContributors.map(c => (
              <div key={c.label}>
                <div className="flex justify-between text-[11px] text-text-secondary mb-1">
                  <span>{c.label}</span>
                  <span className="text-foreground">{c.weight}%</span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <div className={`h-full ${c.tone}`} style={{ width: `${c.weight * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Exposure */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <Scale className="w-4 h-4 text-purple-300" />
            <h3 className="text-sm font-medium">Regulatory Exposure Graph</h3>
            <span className="ml-auto text-[10px] text-text-secondary">Agents → Regulations → Evidence</span>
          </div>
          <div className="p-4 space-y-2 text-xs">
            {[
              { agent: 'ClaimsCopilot',   reg: 'PIPEDA',    ev: 'EV-9244 · sealed',  case: 'AI-2026-115', tone: 'text-accent-amber' },
              { agent: 'UnderwriterGPT',  reg: 'OSFI E-21', ev: 'EV-9112 · sealed',  case: '—',           tone: 'text-emerald-300' },
              { agent: 'PayrollAgent',    reg: 'PIPEDA',    ev: 'EV-9247 · sealed',  case: 'AI-2026-114', tone: 'text-accent-red' },
              { agent: 'TreasuryBot',     reg: 'SOC 2',     ev: 'EV-9301 · sealed',  case: 'AI-2026-118', tone: 'text-accent-red' },
              { agent: 'KYCAgent',        reg: 'AIDA',      ev: 'EV-9388 · sealed',  case: '—',           tone: 'text-emerald-300' },
            ].map(r => (
              <div key={r.agent} className="grid grid-cols-[1.2fr_0.8fr_1.2fr_0.8fr] gap-2 items-center py-1.5 border-b border-border/50 last:border-0">
                <span className="text-foreground flex items-center gap-1.5"><Bot className="w-3 h-3 text-emerald-300" />{r.agent}</span>
                <span className={r.tone}>{r.reg}</span>
                <span className="text-text-secondary flex items-center gap-1.5"><Archive className="w-3 h-3 text-purple-300" />{r.ev}</span>
                <span className="text-text-secondary">{r.case}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ tone, label }: { tone: 'trust' | 'compliance' | 'risk'; label: string }) {
  const color = tone === 'risk' ? 'bg-accent-red' : tone === 'trust' ? 'bg-teal-400' : 'bg-purple-400';
  return (
    <span className="flex items-center gap-1">
      <span className={`w-2 h-0.5 ${color} rounded-full`} /> {label}
    </span>
  );
}

function Stat({ k, v, tone = 'text-foreground' }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-text-secondary">{k}</span>
      <span className={`text-xs font-medium ${tone}`}>{v}</span>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick }: { icon: typeof Users; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md border border-border bg-background hover:border-accent-teal/40 hover:text-accent-teal transition-colors">
      <Icon className="w-3.5 h-3.5" /> {label}
      <ArrowUpRight className="w-3 h-3 ml-auto" />
    </button>
  );
}

function PathChip({ icon: Icon, label, tone }: { icon: typeof Users; label: string; tone: 'risk' | 'amber' | 'default' }) {
  const cls =
    tone === 'risk' ? 'border-accent-red/40 text-accent-red bg-accent-red/10' :
    tone === 'amber' ? 'border-accent-amber/40 text-accent-amber bg-accent-amber/10' :
    'border-border text-text-secondary bg-background';
  return (
    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${cls}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

function RiskCell({ k, v, tone = 'text-foreground' }: { k: string; v: string; tone?: string }) {
  return (
    <div className="p-2.5 rounded-md border border-border bg-background">
      <div className="text-[10px] uppercase tracking-wider text-text-secondary">{k}</div>
      <div className={`text-xs mt-0.5 ${tone}`}>{v}</div>
    </div>
  );
}
