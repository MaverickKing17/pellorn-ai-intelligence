import { toast } from 'sonner';
import {
  Plug, ShieldCheck, FileSearch, Cloud, Workflow, Github, KeyRound,
  Activity, Database, Layers, FileText, Send, Download, ArrowRight,
} from 'lucide-react';

type Status = 'Preview' | 'Simulated Connected' | 'Planned' | 'Design Partner Ready' | 'Requires Tenant';

interface Connector {
  name: string;
  status: Status;
  useCase: string;
  signals: string;
  action: string;
}

const categories: { title: string; icon: typeof Plug; connectors: Connector[] }[] = [
  {
    title: 'Identity',
    icon: KeyRound,
    connectors: [
      { name: 'Microsoft Entra ID', status: 'Simulated Connected', useCase: 'Identity sync, agent ownership, privileged role mapping, access reviews', signals: 'Users, Groups, Roles, Applications, Service Principals', action: 'Configure' },
      { name: 'Okta', status: 'Planned', useCase: 'Workforce identity and ownership mapping', signals: 'Users, Groups, Apps', action: 'View Roadmap' },
    ],
  },
  {
    title: 'Security Operations',
    icon: ShieldCheck,
    connectors: [
      { name: 'Microsoft Sentinel', status: 'Design Partner Ready', useCase: 'AI incident correlation and SOC case creation', signals: 'Incidents, Alerts, KQL Detections, Playbooks', action: 'Request Pilot' },
      { name: 'Defender XDR', status: 'Planned', useCase: 'Threat signal enrichment and endpoint/user risk correlation', signals: 'Alerts, Incidents, Device Risk, User Risk', action: 'View Roadmap' },
    ],
  },
  {
    title: 'Compliance & Data Governance',
    icon: FileSearch,
    connectors: [
      { name: 'Microsoft Purview', status: 'Design Partner Ready', useCase: 'Data classification, sensitivity labels, DLP events, compliance evidence', signals: 'Labels, DLP Events, Data Maps, Policies', action: 'Request Pilot' },
      { name: 'ServiceNow GRC', status: 'Planned', useCase: 'Governance case sync and enterprise risk workflows', signals: 'Cases, Controls, Risk Registers, Approvals', action: 'View Roadmap' },
    ],
  },
  {
    title: 'Cloud Security',
    icon: Cloud,
    connectors: [
      { name: 'Azure Key Vault', status: 'Preview', useCase: 'Secret lifecycle, certificate validation, agent credential controls', signals: 'Secrets, Certificates, Rotation Events', action: 'Configure' },
      { name: 'Azure OpenAI', status: 'Planned', useCase: 'Prompt governance and AI workload telemetry', signals: 'Deployments, Prompts, Usage Metadata, Policy Events', action: 'View Roadmap' },
    ],
  },
  {
    title: 'Workflow / ITSM',
    icon: Workflow,
    connectors: [
      { name: 'Jira Service Management', status: 'Planned', useCase: 'AI governance case tracking and remediation tasks', signals: 'Tickets, Tasks, Approvals, SLAs', action: 'View Roadmap' },
    ],
  },
  {
    title: 'Developer Platforms',
    icon: Github,
    connectors: [
      { name: 'GitHub', status: 'Planned', useCase: 'Agent code review, policy-as-code, workflow evidence', signals: 'Repositories, Pull Requests, Actions, Secrets', action: 'View Roadmap' },
    ],
  },
];

const statusTone: Record<Status, string> = {
  'Simulated Connected': 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30',
  'Preview': 'bg-accent-teal/10 text-accent-teal border-accent-teal/30',
  'Design Partner Ready': 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  'Planned': 'bg-card text-text-secondary border-border',
  'Requires Tenant': 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
};

const flow = [
  'Enterprise Systems', 'Pellorn Connectors', 'Signal Normalization',
  'Agent Governance Graph', 'Trust Score Engine', 'Evidence Vault',
  'Case Management', 'Board Reporting',
];

const matrix = [
  { c: 'Entra ID', id: 'Yes', risk: 'Medium', comp: 'Low', ev: 'Medium', wf: 'High' },
  { c: 'Sentinel', id: 'Low', risk: 'High', comp: 'Medium', ev: 'High', wf: 'High' },
  { c: 'Purview', id: 'Low', risk: 'Medium', comp: 'High', ev: 'High', wf: 'Medium' },
  { c: 'Defender XDR', id: 'Medium', risk: 'High', comp: 'Medium', ev: 'Medium', wf: 'High' },
  { c: 'ServiceNow', id: 'Low', risk: 'Medium', comp: 'High', ev: 'High', wf: 'High' },
];

const cellTone = (v: string) =>
  v === 'High' || v === 'Yes' ? 'text-accent-emerald'
  : v === 'Medium' ? 'text-accent-amber'
  : 'text-text-secondary';

const readiness = [
  { label: 'Identity Layer', score: 85 },
  { label: 'Security Operations', score: 68 },
  { label: 'Compliance Layer', score: 74 },
  { label: 'Workflow Layer', score: 62 },
  { label: 'Evidence Layer', score: 79 },
];

const actionToast = (label: string, connector: string) => {
  if (label === 'Configure') toast('Connector configuration opened (preview mode).', { description: connector });
  else if (label === 'Request Pilot') toast.success(`Pilot request recorded for ${connector}.`, { description: 'Design partner intake queued.' });
  else toast(`${connector} roadmap opened.`, { description: 'Demo integration architecture.' });
};

export default function IntegrationCenter() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-foreground">Integration Center</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent-blue/10 text-accent-blue border border-accent-blue/30 px-2 py-0.5 rounded-full">
              Demo Integration Architecture
            </span>
          </div>
          <p className="text-sm text-text-secondary max-w-2xl">
            Connect AI governance workflows across identity, security, compliance, audit, ticketing, and cloud platforms.
          </p>
        </div>
      </div>

      {/* Connector categories */}
      <div className="space-y-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <section key={cat.title}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-accent-teal" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{cat.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {cat.connectors.map((c) => (
                  <div key={c.name} className="rounded-lg border border-border bg-card p-4 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{c.name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5">{cat.title}</div>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border whitespace-nowrap ${statusTone[c.status]}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2 leading-relaxed">{c.useCase}</p>
                    <div className="text-[11px] text-text-secondary mb-3">
                      <span className="uppercase tracking-wider mr-1">Signals:</span>
                      <span className="text-foreground/80">{c.signals}</span>
                    </div>
                    <button
                      onClick={() => actionToast(c.action, c.name)}
                      className="mt-auto self-start flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-background/40 border border-border text-foreground hover:bg-card/80"
                    >
                      {c.action} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Architecture */}
      <section className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-teal" />
          <h2 className="text-sm font-semibold text-foreground">Integration Architecture</h2>
        </div>
        <div className="p-4 flex flex-wrap items-center gap-2">
          {flow.map((node, i) => (
            <div key={node} className="flex items-center gap-2">
              <div className={`px-3 py-2 rounded-md border text-xs font-medium ${
                i === 0 ? 'border-accent-teal/40 bg-accent-teal/10 text-accent-teal'
                : i === flow.length - 1 ? 'border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald'
                : 'border-border bg-background/40 text-foreground'
              }`}>{node}</div>
              {i < flow.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />}
            </div>
          ))}
        </div>
      </section>

      {/* Data Signal Matrix */}
      <section className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Database className="w-4 h-4 text-accent-teal" />
          <h2 className="text-sm font-semibold text-foreground">Data Signal Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-text-secondary border-b border-border">
                <th className="text-left font-medium px-4 py-2">Connector</th>
                <th className="text-left font-medium px-4 py-2">Identity</th>
                <th className="text-left font-medium px-4 py-2">Risk</th>
                <th className="text-left font-medium px-4 py-2">Compliance</th>
                <th className="text-left font-medium px-4 py-2">Evidence</th>
                <th className="text-left font-medium px-4 py-2">Workflow</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.c} className="border-b border-border/60 hover:bg-background/40">
                  <td className="px-4 py-2.5 text-foreground font-medium">{row.c}</td>
                  <td className={`px-4 py-2.5 ${cellTone(row.id)}`}>{row.id}</td>
                  <td className={`px-4 py-2.5 ${cellTone(row.risk)}`}>{row.risk}</td>
                  <td className={`px-4 py-2.5 ${cellTone(row.comp)}`}>{row.comp}</td>
                  <td className={`px-4 py-2.5 ${cellTone(row.ev)}`}>{row.ev}</td>
                  <td className={`px-4 py-2.5 ${cellTone(row.wf)}`}>{row.wf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Readiness */}
      <section className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-teal" />
          <h2 className="text-sm font-semibold text-foreground">Integration Readiness Score</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:border-r md:border-border">
            <div className="text-[10px] uppercase tracking-wider text-text-secondary">Overall Readiness</div>
            <div className="text-5xl font-semibold text-accent-teal mt-1">72<span className="text-xl text-text-secondary">/100</span></div>
            <div className="text-xs text-text-secondary mt-1">Preview metric — demo data</div>
          </div>
          <div className="md:col-span-2 space-y-3">
            {readiness.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{r.label}</span>
                  <span className="text-text-secondary">{r.score}</span>
                </div>
                <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                  <div className={`h-full ${r.score >= 80 ? 'bg-accent-emerald' : r.score >= 65 ? 'bg-accent-teal' : 'bg-accent-amber'}`} style={{ width: `${r.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-lg border border-accent-teal/30 bg-gradient-to-br from-accent-teal/5 to-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Plug className="w-4 h-4 text-accent-teal" />
              <h2 className="text-base font-semibold text-foreground">Design Partner Integration Program</h2>
            </div>
            <p className="text-sm text-text-secondary">
              Pellorn is preparing Microsoft-native and enterprise governance integrations for regulated organizations.
              This preview shows planned connector architecture using demo data.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => toast.success('Design partner review requested.', { description: 'Preview action — no live submission.' })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="w-3.5 h-3.5" /> Request Design Partner Review
            </button>
            <button onClick={() => toast('Integration brief generated (mock).')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-card border border-border text-foreground hover:bg-card/80">
              <FileText className="w-3.5 h-3.5" /> Generate Integration Brief
            </button>
            <button onClick={() => toast('Architecture PDF export queued (mock).')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-card border border-border text-foreground hover:bg-card/80">
              <Download className="w-3.5 h-3.5" /> Export Architecture PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
