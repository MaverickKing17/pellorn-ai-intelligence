import {
  ShieldCheck, Users, Scale, DollarSign, AlertTriangle, Activity,
  Sparkles, TrendingUp, ArrowUpRight, Clock, Building2, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/* ---------------- KPI HERO ---------------- */
function KpiCard({
  label, value, status, statusTone = 'teal', sub, icon: Icon, accent = 'teal',
}: {
  label: string;
  value: string;
  status?: string;
  statusTone?: 'teal' | 'amber' | 'red' | 'blue';
  sub?: string;
  icon: any;
  accent?: 'teal' | 'amber' | 'red' | 'blue';
}) {
  const accentClass = {
    teal: 'text-accent-teal',
    amber: 'text-accent-amber',
    red: 'text-accent-red',
    blue: 'text-accent-blue',
  }[accent];
  const toneClass = {
    teal: 'bg-accent-teal/10 text-accent-teal border-accent-teal/30',
    amber: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
    red: 'bg-accent-red/10 text-accent-red border-accent-red/30',
    blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  }[statusTone];
  return (
    <div className="bg-card border border-border rounded-xl p-4 relative overflow-hidden group hover:border-accent-teal/40 transition-colors">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.06] ${accentClass.replace('text-', 'bg-')}`} />
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">{label}</span>
        <Icon className={`w-4 h-4 ${accentClass}`} />
      </div>
      <p className="text-3xl font-bold text-foreground tabular-nums leading-none">{value}</p>
      <div className="flex items-center justify-between mt-3">
        {status && (
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${toneClass}`}>
            {status}
          </span>
        )}
        {sub && <span className="text-[10px] text-text-secondary font-mono ml-auto">{sub}</span>}
      </div>
    </div>
  );
}

/* ---------------- RISK HEAT MAP ---------------- */
const heatRows = [
  { dept: 'Wealth Management', agents: 38, risks: ['L', 'L', 'L', 'M', 'L'] },
  { dept: 'Retail Banking', agents: 72, risks: ['M', 'M', 'L', 'M', 'L'] },
  { dept: 'Lending', agents: 54, risks: ['H', 'M', 'H', 'M', 'L'] },
  { dept: 'Insurance / Claims', agents: 41, risks: ['M', 'L', 'M', 'L', 'M'] },
  { dept: 'Customer Support', agents: 47, risks: ['M', 'H', 'M', 'L', 'M'] },
  { dept: 'Operations / HR', agents: 32, risks: ['L', 'L', 'M', 'L', 'L'] },
];
const heatCats = ['Prompt', 'PII', 'Tool Use', 'Identity', 'Compliance'];
const cellTone = (r: string) =>
  r === 'H' ? 'bg-accent-red/30 text-accent-red border-accent-red/40'
  : r === 'M' ? 'bg-accent-amber/25 text-accent-amber border-accent-amber/40'
  : 'bg-accent-teal/15 text-accent-teal border-accent-teal/30';

function RiskHeatMap() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">AI Risk Heat Map</h3>
          <p className="text-[10px] text-text-secondary uppercase tracking-widest">Departments × Risk Categories</p>
        </div>
        <span className="text-[10px] font-mono text-text-secondary">Live · Updated 11 sec ago</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-[10px] uppercase tracking-wider text-text-secondary pb-2 font-semibold">Business Unit</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-text-secondary pb-2 font-semibold">Agents</th>
              {heatCats.map(c => (
                <th key={c} className="text-center text-[10px] uppercase tracking-wider text-text-secondary pb-2 font-semibold">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatRows.map(r => (
              <tr key={r.dept} className="border-t border-border/60">
                <td className="py-2.5 text-foreground text-xs">{r.dept}</td>
                <td className="py-2.5 font-mono text-text-secondary">{r.agents}</td>
                {r.risks.map((cell, i) => (
                  <td key={i} className="py-2.5 px-1">
                    <div className={`h-7 rounded border flex items-center justify-center text-[10px] font-bold font-mono ${cellTone(cell)}`}>
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <span className="text-[10px] uppercase tracking-widest text-text-secondary">Legend</span>
        <span className="flex items-center gap-1.5 text-[10px] text-text-secondary"><span className="w-3 h-3 rounded bg-accent-teal/30 border border-accent-teal/40" /> Low</span>
        <span className="flex items-center gap-1.5 text-[10px] text-text-secondary"><span className="w-3 h-3 rounded bg-accent-amber/30 border border-accent-amber/40" /> Medium</span>
        <span className="flex items-center gap-1.5 text-[10px] text-text-secondary"><span className="w-3 h-3 rounded bg-accent-red/30 border border-accent-red/40" /> High</span>
      </div>
    </div>
  );
}

/* ---------------- INCIDENT TIMELINE ---------------- */
const timeline = [
  { time: '10:43:02', label: 'Prompt Injection Attempt', detail: 'PayrollAgent · payload pattern match', tone: 'amber' },
  { time: '10:43:04', label: 'PII Access Attempt', detail: 'Attempt to read SIN field · ca.pii.sin.v2', tone: 'red' },
  { time: '10:43:05', label: 'Risk Score Increased', detail: '67 → 42 · drift threshold exceeded', tone: 'amber' },
  { time: '10:43:06', label: 'Circuit Breaker Triggered', detail: 'Tool calls suspended · audit log sealed', tone: 'red' },
  { time: '10:43:07', label: 'Agent Quarantined', detail: 'PayrollAgent moved to RESTRICTED', tone: 'red' },
  { time: '10:43:09', label: 'Outcome: Data Loss Prevented', detail: 'Est. exposure avoided $1.2M CAD', tone: 'teal' },
];
function tonePill(t: string) {
  return t === 'red' ? 'bg-accent-red/15 text-accent-red border-accent-red/40'
    : t === 'amber' ? 'bg-accent-amber/15 text-accent-amber border-accent-amber/40'
    : 'bg-accent-teal/15 text-accent-teal border-accent-teal/40';
}
function toneDot(t: string) {
  return t === 'red' ? 'bg-accent-red ring-accent-red/30'
    : t === 'amber' ? 'bg-accent-amber ring-accent-amber/30'
    : 'bg-accent-teal ring-accent-teal/30';
}
function IncidentTimeline() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Agent Incident Timeline</h3>
          <p className="text-[10px] text-text-secondary uppercase tracking-widest">Investigation · INC-2026-0431 · PayrollAgent</p>
        </div>
        <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${tonePill('teal')}`}>Contained</span>
      </div>
      <ol className="relative ml-3 border-l border-border space-y-3">
        {timeline.map((t, i) => (
          <li key={i} className="pl-4 relative">
            <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ring-4 ${toneDot(t.tone)}`} />
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] text-text-secondary tabular-nums">{t.time}</span>
              <span className="text-xs text-foreground font-semibold">{t.label}</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">{t.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- ORG CHART ---------------- */
const orgUnits = [
  {
    bu: 'Retail Banking', count: 72, color: 'accent-blue',
    agents: ['Customer Support AI', 'Fraud AI', 'KYC AI', 'Lending AI'],
  },
  {
    bu: 'Wealth Management', count: 38, color: 'accent-teal',
    agents: ['Portfolio Advisor', 'Tax Optimizer', 'Client Reporting'],
  },
  {
    bu: 'Lending', count: 54, color: 'accent-amber',
    agents: ['UnderwriterGPT', 'Risk Scoring', 'Doc Verification', 'Collections'],
  },
  {
    bu: 'Insurance', count: 41, color: 'accent-purple',
    agents: ['ClaimsCopilot', 'Underwriting AI', 'Fraud Detection'],
  },
];

function OrgChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-foreground">Corporate AI Workforce</h3>
          <p className="text-[10px] text-text-secondary uppercase tracking-widest">Autonomous Agents Reporting Structure</p>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="bg-surface-raised border border-accent-teal/40 px-4 py-2 rounded-lg shadow-[0_0_24px_-8px_hsl(var(--accent-teal)/0.6)]">
          <p className="text-[9px] uppercase tracking-widest text-accent-teal">Office of the CIO / CRO</p>
          <p className="text-xs font-bold text-foreground text-center">AI Governance Authority</p>
        </div>
        <div className="w-px h-5 bg-border" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {orgUnits.map(u => (
          <div key={u.bu} className="bg-surface-raised border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">{u.bu}</span>
              <span className="text-[10px] font-mono text-foreground">{u.count}</span>
            </div>
            <ul className="space-y-1">
              {u.agents.map(a => (
                <li key={a} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                  <ChevronRight className="w-3 h-3 text-accent-teal" /> {a}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- NARRATIVE ---------------- */
function NarrativeEngine() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-purple bg-accent-purple/10 border border-accent-purple/30 px-2 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3" /> Executive Narrative Engine
        </span>
        <span className="text-[10px] font-mono text-text-secondary">Generated · 10:44 EST</span>
      </div>
      <p className="text-xs text-foreground/90 leading-relaxed mb-3">
        In the past 30 days Bastion governed <span className="font-semibold text-accent-teal">284 autonomous agents</span> across six business units. <span className="font-semibold text-accent-amber">Seven agents</span> exhibited elevated behavioral drift; three potential PII exposure incidents were intercepted before data transmission. Estimated regulatory liability avoided: <span className="font-semibold text-foreground">$2.8M CAD</span>.
      </p>
      <p className="text-[11px] text-text-secondary leading-relaxed">
        Identity assurance remains at 99.4% (cryptographic agent certificates rotated on schedule). Policy compliance against OSFI E-21, PIPEDA and AIDA (Bill C-27) is rated <span className="text-accent-teal font-semibold">AA</span>. No material exposure detected for the upcoming board cycle.
      </p>
    </div>
  );
}

/* ---------------- LAYOUT ---------------- */
export default function GovernanceCommandCenter() {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">AI Governance Command Center</h2>
          <p className="text-xs text-text-secondary">Real-Time Oversight of Autonomous Enterprise Agents</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Region: CA-Central</span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 border border-accent-teal/30 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse-glow" /> Live Telemetry
          </span>
        </div>
      </div>

      {!user && (
        <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-accent-amber" />
            <p className="text-xs text-foreground">Sign in to bind governance actions to your account & industry profile.</p>
          </div>
          <Button asChild size="sm" className="bg-accent-teal hover:bg-accent-teal-lt text-foreground text-xs h-7">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      )}

      {/* 6 KPI HERO */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="AI Governance Score" value="92/100" status="Excellent" statusTone="teal" sub="↑ +3 vs Q3" icon={ShieldCheck} accent="teal" />
        <KpiCard label="Agents Under Mgmt" value="284" status="6 BUs" statusTone="blue" sub="+42 this month" icon={Users} accent="blue" />
        <KpiCard label="Regulatory Exposure" value="$3.4M" status="Low" statusTone="teal" sub="if unmitigated" icon={Scale} accent="amber" />
        <KpiCard label="Financial Loss Prevented" value="$28.7M" status="12 mo" statusTone="teal" sub="↑ +18% YoY" icon={DollarSign} accent="teal" />
        <KpiCard label="High-Risk Agents" value="7" status="Investigate" statusTone="red" sub="quarantine ready" icon={AlertTriangle} accent="red" />
        <KpiCard label="Active Interventions" value="134" status="Today" statusTone="blue" sub="↑ +12 since 09:00" icon={Activity} accent="blue" />
      </div>

      {/* Heat Map + Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RiskHeatMap /></div>
        <NarrativeEngine />
      </div>

      {/* Org Chart + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><OrgChart /></div>
        <IncidentTimeline />
      </div>

      {/* CTA Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <CtaCard icon={Users} title="Agent Registry" desc="Inspect every autonomous agent, its identity, trust score and certification." />
        <CtaCard icon={TrendingUp} title="Executive Exposure" desc="Quantified regulatory, privacy and operational liability — board ready." />
        <CtaCard icon={Building2} title="Digital Twin Mode" desc="Simulate the AI workforce 30 / 90 / 365 days forward." />
      </div>
    </div>
  );
}

function CtaCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 hover:border-accent-teal/40 transition-colors group cursor-pointer">
      <div className="w-9 h-9 rounded-lg bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent-teal" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-accent-teal transition-colors" />
        </div>
        <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
