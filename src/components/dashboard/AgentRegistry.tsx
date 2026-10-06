import { useState } from 'react';
import {
  ShieldCheck, Fingerprint, Key, Wrench, Database, Activity,
  ChevronDown, ChevronRight, Search, Award, Filter, Download,
} from 'lucide-react';

type Status = 'Trusted' | 'Monitor' | 'Elevated' | 'Restricted';
type Cert = 'Certified' | 'Conditional' | 'Restricted' | 'Suspended';

interface Agent {
  id: string;
  name: string;
  dept: string;
  trust: number;
  status: Status;
  cert: Cert;
  lastAudit: string;
  identity: { certificate: string; issuer: string; roles: string[]; tools: string[]; data: string[] };
  behavior: { normal: string; current: string; trend: string; deviation: number; prompts: number; toolCalls: number };
}

const agents: Agent[] = [
  {
    id: 'agt-001', name: 'UnderwriterGPT', dept: 'Lending', trust: 97, status: 'Trusted', cert: 'Certified', lastAudit: '4 min ago',
    identity: {
      certificate: 'CN=underwriter.bastion.ca · SHA-256:9F:3A:…:E1',
      issuer: 'Pellorn Internal CA · Entra ID',
      roles: ['lending.underwrite.read', 'risk.model.score'],
      tools: ['credit-bureau.read', 'osfi.policy.query', 'collateral.valuation'],
      data: ['Customer Tier 2', 'Loan Book (read)', 'Risk Models'],
    },
    behavior: { normal: '320 calls/hr · 4 tools', current: '298 calls/hr · 4 tools', trend: 'stable', deviation: 0.04, prompts: 1842, toolCalls: 6231 },
  },
  {
    id: 'agt-002', name: 'ClaimsCopilot', dept: 'Insurance', trust: 84, status: 'Monitor', cert: 'Certified', lastAudit: '2 min ago',
    identity: {
      certificate: 'CN=claims.bastion.ca · SHA-256:21:8B:…:7C',
      issuer: 'Pellorn Internal CA · Entra ID',
      roles: ['claims.review', 'claims.summarize'],
      tools: ['claims-db.read', 'medical-records.read', 'fraud.score'],
      data: ['Customer Tier 2', 'Claims History', 'Medical (redacted)'],
    },
    behavior: { normal: '140 calls/hr · 3 tools', current: '212 calls/hr · 4 tools', trend: 'rising', deviation: 0.31, prompts: 941, toolCalls: 3120 },
  },
  {
    id: 'agt-003', name: 'SupportAI', dept: 'Retail Banking', trust: 63, status: 'Elevated', cert: 'Conditional', lastAudit: '1 min ago',
    identity: {
      certificate: 'CN=support.bastion.ca · SHA-256:55:11:…:9A',
      issuer: 'Pellorn Internal CA · Entra ID',
      roles: ['support.chat', 'kb.read'],
      tools: ['customer.lookup', 'ticket.create', 'kb.search'],
      data: ['Customer Tier 1', 'Knowledge Base'],
    },
    behavior: { normal: '820 calls/hr · 3 tools', current: '1190 calls/hr · 5 tools', trend: 'elevated', deviation: 0.62, prompts: 5482, toolCalls: 14021 },
  },
  {
    id: 'agt-004', name: 'PayrollAgent', dept: 'HR / Ops', trust: 42, status: 'Restricted', cert: 'Suspended', lastAudit: '5 sec ago',
    identity: {
      certificate: 'CN=payroll.bastion.ca · SHA-256:F0:22:…:31',
      issuer: 'Pellorn Internal CA · Entra ID',
      roles: ['payroll.read', 'payroll.process'],
      tools: ['hrms.read', 'bank.transfer (suspended)'],
      data: ['Employee PII (frozen)', 'Payroll Ledger (read-only)'],
    },
    behavior: { normal: '40 calls/hr · 2 tools', current: '0 calls/hr · 0 tools', trend: 'quarantined', deviation: 0.94, prompts: 18, toolCalls: 0 },
  },
  {
    id: 'agt-005', name: 'PortfolioAdvisor', dept: 'Wealth Mgmt', trust: 91, status: 'Trusted', cert: 'Certified', lastAudit: '8 min ago',
    identity: {
      certificate: 'CN=advisor.bastion.ca · SHA-256:7D:9C:…:44',
      issuer: 'Pellorn Internal CA · Entra ID',
      roles: ['portfolio.read', 'portfolio.rebalance'],
      tools: ['market.data', 'portfolio.api', 'tax.calc'],
      data: ['Client Tier 3', 'Portfolio Positions', 'Market Data'],
    },
    behavior: { normal: '210 calls/hr · 3 tools', current: '198 calls/hr · 3 tools', trend: 'stable', deviation: 0.06, prompts: 1284, toolCalls: 4012 },
  },
];

const statusTone: Record<Status, string> = {
  Trusted: 'bg-accent-teal/15 text-accent-teal border-accent-teal/40',
  Monitor: 'bg-accent-blue/15 text-accent-blue border-accent-blue/40',
  Elevated: 'bg-accent-amber/15 text-accent-amber border-accent-amber/40',
  Restricted: 'bg-accent-red/15 text-accent-red border-accent-red/40',
};
const certTone: Record<Cert, string> = {
  Certified: 'bg-accent-teal/10 text-accent-teal border-accent-teal/30',
  Conditional: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
  Restricted: 'bg-accent-red/10 text-accent-red border-accent-red/30',
  Suspended: 'bg-accent-red/20 text-accent-red border-accent-red/50',
};

function trustColor(n: number) {
  if (n >= 85) return 'text-accent-teal';
  if (n >= 60) return 'text-accent-amber';
  return 'text-accent-red';
}
function trustBar(n: number) {
  if (n >= 85) return 'bg-accent-teal';
  if (n >= 60) return 'bg-accent-amber';
  return 'bg-accent-red';
}

export default function AgentRegistry() {
  const [open, setOpen] = useState<string | null>('agt-004');
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Agent Registry</h2>
          <p className="text-xs text-text-secondary">Every autonomous agent in the enterprise — identity, behavior, trust and certification.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-card border border-border rounded-lg flex items-center px-3 gap-2 h-9 w-72">
            <Search className="w-3.5 h-3.5 text-text-muted-custom" />
            <input className="bg-transparent text-xs outline-none w-full text-foreground placeholder:text-text-muted-custom" placeholder="Search agents, roles, certificates…" />
          </div>
          <button className="h-9 px-3 rounded-lg border border-border text-xs text-text-secondary hover:text-foreground inline-flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="h-9 px-3 rounded-lg border border-border text-xs text-text-secondary hover:text-foreground inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[32px_1.4fr_1fr_1.2fr_120px_120px_110px] gap-3 px-4 py-3 border-b border-border bg-surface-raised">
          {['', 'Agent', 'Department', 'Trust Score', 'Status', 'Certification', 'Last Audit'].map(h => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">{h}</span>
          ))}
        </div>
        {agents.map(a => {
          const isOpen = open === a.id;
          return (
            <div key={a.id} className="border-b border-border/60 last:border-b-0">
              <button
                onClick={() => setOpen(isOpen ? null : a.id)}
                className="w-full grid grid-cols-[32px_1.4fr_1fr_1.2fr_120px_120px_110px] gap-3 px-4 py-3 items-center text-left hover:bg-surface-raised/60 transition-colors"
              >
                {isOpen ? <ChevronDown className="w-4 h-4 text-accent-teal" /> : <ChevronRight className="w-4 h-4 text-text-secondary" />}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center shrink-0">
                    <Fingerprint className="w-3.5 h-3.5 text-accent-teal" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{a.name}</p>
                    <p className="text-[10px] font-mono text-text-secondary truncate">{a.id}</p>
                  </div>
                </div>
                <span className="text-xs text-text-secondary">{a.dept}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`font-mono text-base font-bold ${trustColor(a.trust)} tabular-nums w-8`}>{a.trust}</span>
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full ${trustBar(a.trust)} rounded-full`} style={{ width: `${a.trust}%` }} />
                  </div>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border w-fit ${statusTone[a.status]}`}>{a.status}</span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border w-fit ${certTone[a.cert]}`}>{a.cert}</span>
                <span className="text-[10px] font-mono text-text-secondary">{a.lastAudit}</span>
              </button>

              {isOpen && (
                <div className="bg-surface-raised/40 border-t border-border px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up">
                  {/* Identity */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-4 h-4 text-accent-teal" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Agent Identity</h4>
                    </div>
                    <DetailRow icon={Key} label="Cryptographic Certificate" value={a.identity.certificate} mono />
                    <DetailRow icon={Award} label="Issuer" value={a.identity.issuer} />
                    <DetailRow icon={ShieldCheck} label="Assigned Roles" value={a.identity.roles.join(' · ')} mono />
                    <DetailRow icon={Wrench} label="Tool Permissions" value={a.identity.tools.join(' · ')} mono />
                    <DetailRow icon={Database} label="Data Access Rights" value={a.identity.data.join(' · ')} />
                  </div>
                  {/* Behavior */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-accent-amber" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Behavior Profile</h4>
                    </div>
                    <DetailRow label="Normal Activity" value={a.behavior.normal} mono />
                    <DetailRow label="Current Activity" value={a.behavior.current} mono />
                    <DetailRow label="Risk Trend" value={a.behavior.trend.toUpperCase()} />
                    <DetailRow label="Deviation Score" value={`${(a.behavior.deviation * 100).toFixed(0)}%`} mono />
                    <DetailRow label="Prompt History" value={`${a.behavior.prompts.toLocaleString()} prompts (24h)`} mono />
                    <DetailRow label="Tool History" value={`${a.behavior.toolCalls.toLocaleString()} tool calls (24h)`} mono />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, mono }: { icon?: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-border/40 last:border-b-0">
      {Icon && <Icon className="w-3 h-3 text-text-secondary mt-1 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-text-secondary">{label}</p>
        <p className={`text-xs text-foreground ${mono ? 'font-mono' : ''} break-all`}>{value}</p>
      </div>
    </div>
  );
}
