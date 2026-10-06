import { useMemo, useState } from 'react';
import {
  Archive, FileSignature, Inbox, Package, ShieldCheck, Search,
  Download, FileText, X, Hash, Clock, User, Link2, FileDown, Stamp,
} from 'lucide-react';

type Status = 'Sealed' | 'Pending Review' | 'Approved' | 'Needs Evidence' | 'Exported' | 'Expired';
type Framework = 'OSFI E-21' | 'PIPEDA' | 'AIDA' | 'SOC 2';

interface Evidence {
  id: string;
  type: string;
  agent: string;
  framework: Framework;
  owner: string;
  status: Status;
  created: string;
  retention: string;
  hash: string;
  incident?: string;
  policy?: string;
}

const items: Evidence[] = [
  { id: 'EV-10284', type: 'Certification Approval', agent: 'UnderwriterGPT', framework: 'OSFI E-21', owner: 'VP Credit Risk', status: 'Sealed', created: '2026-06-07 09:12', retention: '7 yrs', hash: 'a3f1…9c2e', policy: 'POL-AI-021' },
  { id: 'EV-10283', type: 'Trust Score Change', agent: 'PayrollAgent', framework: 'PIPEDA', owner: 'Privacy Officer', status: 'Sealed', created: '2026-06-07 08:44', retention: '7 yrs', hash: '88be…21fa', incident: 'INC-4521' },
  { id: 'EV-10282', type: 'PII Redaction Event', agent: 'SupportAI', framework: 'PIPEDA', owner: 'Privacy Officer', status: 'Approved', created: '2026-06-07 08:31', retention: '5 yrs', hash: '7c14…02d9' },
  { id: 'EV-10281', type: 'Prompt Injection Block', agent: 'ClaimsCopilot', framework: 'SOC 2', owner: 'Security Analyst', status: 'Sealed', created: '2026-06-07 07:58', retention: '3 yrs', hash: 'd9a2…11b7', incident: 'INC-4519' },
  { id: 'EV-10280', type: 'Circuit Breaker Event', agent: 'AppraisalAI', framework: 'AIDA', owner: 'AI Governance Office', status: 'Pending Review', created: '2026-06-06 22:14', retention: '7 yrs', hash: '5418…aa03' },
  { id: 'EV-10279', type: 'Board Report Export', agent: '—', framework: 'OSFI E-21', owner: 'Chief Risk Officer', status: 'Exported', created: '2026-06-06 17:02', retention: '10 yrs', hash: 'ff21…6789' },
  { id: 'EV-10278', type: 'Risk Officer Sign-Off', agent: 'TreasuryBot', framework: 'OSFI E-21', owner: 'CRO', status: 'Approved', created: '2026-06-06 14:45', retention: '7 yrs', hash: '2289…ddee' },
  { id: 'EV-10277', type: 'Compliance Mapping', agent: 'KYCReviewer', framework: 'AIDA', owner: 'Compliance Lead', status: 'Needs Evidence', created: '2026-06-06 11:18', retention: '7 yrs', hash: '0044…aabb' },
  { id: 'EV-10276', type: 'Policy Decision', agent: 'TenantScreenAI', framework: 'PIPEDA', owner: 'Privacy Officer', status: 'Sealed', created: '2026-06-05 19:30', retention: '5 yrs', hash: 'cc77…3201' },
  { id: 'EV-10275', type: 'Incident Timeline', agent: 'PayrollAgent', framework: 'PIPEDA', owner: 'Privacy Officer', status: 'Expired', created: '2025-12-01 08:00', retention: '6 mo', hash: '9999…1111' },
];

const kpis = [
  { label: 'Total Evidence', value: '1,284', icon: Archive, color: 'text-accent-teal' },
  { label: 'Signed Approvals', value: 214, icon: FileSignature, color: 'text-accent-blue' },
  { label: 'Open Requests', value: 18, icon: Inbox, color: 'text-accent-amber' },
  { label: 'Audit-Ready Packs', value: 7, icon: Package, color: 'text-accent-purple' },
  { label: 'Evidence Integrity', value: '100%', icon: ShieldCheck, color: 'text-accent-teal' },
];

const statusColor: Record<Status, string> = {
  Sealed: 'border-accent-teal/30 text-accent-teal bg-accent-teal/10',
  Approved: 'border-accent-blue/30 text-accent-blue bg-accent-blue/10',
  'Pending Review': 'border-accent-amber/30 text-accent-amber bg-accent-amber/10',
  'Needs Evidence': 'border-accent-red/30 text-accent-red bg-accent-red/10',
  Exported: 'border-accent-purple/30 text-accent-purple bg-accent-purple/10',
  Expired: 'border-border text-text-muted bg-background/40',
};

const packs = [
  { name: 'OSFI E-21 Evidence Pack', items: 412, status: 'Ready' },
  { name: 'PIPEDA Data Handling Pack', items: 287, status: 'Ready' },
  { name: 'AIDA High-Impact AI System Pack', items: 164, status: 'Assembling' },
  { name: 'SOC 2 AI Controls Pack', items: 198, status: 'Ready' },
];

export default function EvidenceVault() {
  const [framework, setFramework] = useState<'All' | Framework>('All');
  const [status, setStatus] = useState<'All' | Status>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Evidence | null>(null);

  const filtered = useMemo(() => items.filter(i =>
    (framework === 'All' || i.framework === framework) &&
    (status === 'All' || i.status === status) &&
    (search === '' || `${i.id} ${i.type} ${i.agent} ${i.owner}`.toLowerCase().includes(search.toLowerCase()))
  ), [framework, status, search]);

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Governance Evidence Vault</h1>
          <p className="text-xs text-text-secondary mt-1">
            Regulator-ready evidence packages with cryptographic integrity seals.
            <span className="ml-2 text-[11px] uppercase tracking-wider text-accent-amber/80">Demo Telemetry</span>
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
        {/* Table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h2 className="text-sm font-semibold text-foreground">Evidence Records</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search evidence…"
                  className="bg-background/50 border border-border rounded-md text-xs pl-7 pr-2 py-1.5 text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent-teal/40"
                />
              </div>
              <select value={framework} onChange={e => setFramework(e.target.value as any)} className="bg-background/50 border border-border rounded-md text-xs px-2 py-1.5 text-foreground">
                <option>All</option><option>OSFI E-21</option><option>PIPEDA</option><option>AIDA</option><option>SOC 2</option>
              </select>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className="bg-background/50 border border-border rounded-md text-xs px-2 py-1.5 text-foreground">
                <option>All</option><option>Sealed</option><option>Approved</option><option>Pending Review</option><option>Needs Evidence</option><option>Exported</option><option>Expired</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-text-secondary border-b border-border">
                  <th className="py-2 pr-2">ID</th>
                  <th className="py-2 pr-2">Type</th>
                  <th className="py-2 pr-2">Agent</th>
                  <th className="py-2 pr-2">Framework</th>
                  <th className="py-2 pr-2">Owner</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Created</th>
                  <th className="py-2 pr-2">Retention</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} onClick={() => setSelected(e)} className="border-b border-border/60 hover:bg-background/40 cursor-pointer">
                    <td className="py-2 pr-2 font-mono-code text-text-secondary">{e.id}</td>
                    <td className="py-2 pr-2 text-foreground">{e.type}</td>
                    <td className="py-2 pr-2 text-text-secondary">{e.agent}</td>
                    <td className="py-2 pr-2 text-text-secondary">{e.framework}</td>
                    <td className="py-2 pr-2 text-text-secondary">{e.owner}</td>
                    <td className="py-2 pr-2">
                      <span className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${statusColor[e.status]}`}>{e.status}</span>
                    </td>
                    <td className="py-2 pr-2 font-mono-code text-text-muted">{e.created}</td>
                    <td className="py-2 pr-2 text-text-secondary">{e.retention}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-6 text-center text-text-muted">No evidence matches your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Package Builder */}
        <div className="bg-card border border-border rounded-lg p-3">
          <h2 className="text-sm font-semibold text-foreground mb-2">Audit Package Builder</h2>
          <p className="text-[11px] text-text-secondary mb-3">Assemble regulator-ready evidence packs for external audit, board, or supervisory review.</p>
          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-wider text-text-secondary">Framework</label>
            <select className="w-full bg-background/50 border border-border rounded-md text-xs px-2 py-1.5 text-foreground">
              <option>OSFI E-21</option><option>PIPEDA</option><option>AIDA (Bill C-27)</option><option>SOC 2</option>
            </select>
            <label className="block text-[11px] uppercase tracking-wider text-text-secondary mt-2">Date Range</label>
            <select className="w-full bg-background/50 border border-border rounded-md text-xs px-2 py-1.5 text-foreground">
              <option>Last 30 days</option><option>Last 90 days</option><option>YTD</option><option>Custom…</option>
            </select>
            <label className="block text-[11px] uppercase tracking-wider text-text-secondary mt-2">Business Unit</label>
            <select className="w-full bg-background/50 border border-border rounded-md text-xs px-2 py-1.5 text-foreground">
              <option>All</option><option>Lending</option><option>Insurance</option><option>Real Estate</option><option>HR / Ops</option>
            </select>
            <button className="w-full mt-3 text-xs font-semibold px-3 py-2 rounded-md bg-accent-teal/20 border border-accent-teal/40 text-accent-teal hover:bg-accent-teal/30 transition-colors">
              Generate Regulator-Ready Evidence Pack
            </button>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider text-text-secondary">Recently Generated</div>
            {packs.map(p => (
              <div key={p.name} className="flex items-center justify-between bg-background/40 border border-border rounded-md px-2 py-1.5">
                <div>
                  <div className="text-xs text-foreground">{p.name}</div>
                  <div className="text-[11px] text-text-muted">{p.items} evidence items</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${p.status === 'Ready' ? 'border-accent-teal/30 text-accent-teal bg-accent-teal/10' : 'border-accent-amber/30 text-accent-amber bg-accent-amber/10'}`}>{p.status}</span>
                  <button className="text-text-secondary hover:text-foreground"><Download className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-card border-l border-border w-full max-w-xl h-full overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-text-secondary">Evidence Record</p>
                <h3 className="text-lg font-bold text-foreground font-mono-code">{selected.id}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-text-secondary hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-accent-blue" /><span className="text-text-secondary">Type:</span> <span className="text-foreground">{selected.type}</span></div>
              <div className="flex items-center gap-2"><Link2 className="w-3.5 h-3.5 text-accent-teal" /><span className="text-text-secondary">Linked Agent:</span> <span className="text-foreground">{selected.agent}</span></div>
              {selected.policy && <div className="flex items-center gap-2"><Link2 className="w-3.5 h-3.5 text-accent-purple" /><span className="text-text-secondary">Linked Policy:</span> <span className="text-foreground">{selected.policy}</span></div>}
              {selected.incident && <div className="flex items-center gap-2"><Link2 className="w-3.5 h-3.5 text-accent-amber" /><span className="text-text-secondary">Linked Incident:</span> <span className="text-foreground">{selected.incident}</span></div>}
              <div className="flex items-center gap-2"><Hash className="w-3.5 h-3.5 text-text-secondary" /><span className="text-text-secondary">Integrity Seal:</span> <span className="font-mono-code text-foreground">sha256:{selected.hash}</span></div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-text-secondary" /><span className="text-text-secondary">Timestamp:</span> <span className="font-mono-code text-foreground">{selected.created}</span></div>
              <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-text-secondary" /><span className="text-text-secondary">Reviewer:</span> <span className="text-foreground">{selected.owner}</span></div>
              <div className="flex items-center gap-2"><Archive className="w-3.5 h-3.5 text-text-secondary" /><span className="text-text-secondary">Retention:</span> <span className="text-foreground">{selected.retention}</span></div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-2">Export History</h4>
              <ul className="text-[11px] text-text-secondary space-y-1">
                <li className="flex justify-between border-b border-border/60 pb-1"><span>2026-06-05 · Board Pack v3</span><span className="font-mono-code text-text-muted">CRO</span></li>
                <li className="flex justify-between border-b border-border/60 pb-1"><span>2026-05-22 · External Audit Bundle</span><span className="font-mono-code text-text-muted">KPMG</span></li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button className="text-xs font-semibold px-3 py-2 rounded-md bg-accent-teal/15 border border-accent-teal/40 text-accent-teal hover:bg-accent-teal/25 flex items-center justify-center gap-1.5"><Package className="w-3.5 h-3.5" /> Generate Audit Package</button>
              <button className="text-xs font-semibold px-3 py-2 rounded-md bg-card border border-border text-text-secondary hover:bg-popover flex items-center justify-center gap-1.5"><FileDown className="w-3.5 h-3.5" /> Export PDF</button>
              <button className="text-xs font-semibold px-3 py-2 rounded-md bg-card border border-border text-text-secondary hover:bg-popover flex items-center justify-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export CSV</button>
              <button className="text-xs font-semibold px-3 py-2 rounded-md bg-accent-blue/15 border border-accent-blue/40 text-accent-blue hover:bg-accent-blue/25 flex items-center justify-center gap-1.5"><FileSignature className="w-3.5 h-3.5" /> Request Sign-Off</button>
              <button className="col-span-2 text-xs font-semibold px-3 py-2 rounded-md bg-accent-purple/15 border border-accent-purple/40 text-accent-purple hover:bg-accent-purple/25 flex items-center justify-center gap-1.5"><Stamp className="w-3.5 h-3.5" /> Mark as Sealed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
