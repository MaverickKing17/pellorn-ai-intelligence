import { useState } from 'react';
import { Sparkles, TrendingUp, Users, Scale, DollarSign, AlertTriangle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const horizons = [30, 90, 180, 365] as const;
type Horizon = typeof horizons[number];

const projections: Record<Horizon, {
  agents: number; compliance: number; cost: number; risk: number;
  narrative: string;
}> = {
  30:  { agents: 312, compliance: 93, cost: 1.2, risk: 0.8, narrative: '30-day outlook: linear agent growth, no compliance regressions, minimal additional risk.' },
  90:  { agents: 408, compliance: 91, cost: 3.6, risk: 1.7, narrative: '90 days: Lending and Insurance scale fastest. One additional FTE recommended in agent ops.' },
  180: { agents: 562, compliance: 89, cost: 7.4, risk: 3.1, narrative: '6 months: AIDA enforcement begins. Forecast 2 additional high-impact-system filings; capital buffer holds.' },
  365: { agents: 884, compliance: 87, cost: 16.1, risk: 6.4, narrative: '12 months: Autonomous workforce exceeds human headcount in three BUs. Governance org should add 4 FTEs and a dedicated AI legal counsel.' },
};

export default function DigitalTwin() {
  const [h, setH] = useState<Horizon>(90);
  const p = projections[h];
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-purple bg-accent-purple/10 border border-accent-purple/30 px-2 py-0.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" /> Future-Ready Module
          </span>
          <h2 className="text-lg font-bold text-foreground">Enterprise AI Workforce Simulator</h2>
          <p className="text-xs text-text-secondary">Digital Twin Mode — forecast agent growth, compliance posture, cost and risk forward in time.</p>
        </div>
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
          {horizons.map(x => (
            <button
              key={x}
              onClick={() => setH(x)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tabular-nums transition-colors ${
                h === x ? 'bg-accent-teal/15 text-accent-teal border border-accent-teal/40' : 'text-text-secondary hover:text-foreground'
              }`}
            >
              {x}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <TwinCard icon={Users} label="Projected Agents" value={p.agents.toString()} sub={`+${p.agents - 284} vs today`} tone="blue" />
        <TwinCard icon={Scale} label="Compliance Posture" value={`${p.compliance}%`} sub={p.compliance >= 90 ? 'Within tolerance' : 'Action recommended'} tone={p.compliance >= 90 ? 'teal' : 'amber'} />
        <TwinCard icon={DollarSign} label="Incremental Cost" value={`$${p.cost.toFixed(1)}M`} sub="Governance + tooling" tone="amber" />
        <TwinCard icon={AlertTriangle} label="Projected Residual Risk" value={`$${p.risk.toFixed(1)}M`} sub="After mitigation" tone={p.risk > 5 ? 'red' : 'teal'} />
      </div>

      {/* Simulation panel */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Simulation Scenario</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest">Baseline · Current control posture maintained</p>
          </div>
          <Button size="sm" className="bg-accent-teal hover:bg-accent-teal-lt text-foreground text-xs h-8">
            <Play className="w-3 h-3 mr-1" /> Run Counterfactual
          </Button>
        </div>

        {/* Forecast bars */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {horizons.map(x => {
            const v = projections[x];
            const isActive = x === h;
            return (
              <div key={x} className={`rounded-lg border p-3 transition-colors ${isActive ? 'border-accent-teal/50 bg-accent-teal/5' : 'border-border bg-surface-raised/40'}`}>
                <p className="text-[10px] uppercase tracking-widest text-text-secondary">{x} days</p>
                <p className="text-lg font-bold text-foreground tabular-nums mt-1">{v.agents}</p>
                <div className="h-1 bg-border rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-accent-teal to-accent-blue" style={{ width: `${Math.min(100, (v.agents / 900) * 100)}%` }} />
                </div>
                <p className="text-[10px] font-mono text-text-secondary mt-1">${v.cost.toFixed(1)}M cost</p>
              </div>
            );
          })}
        </div>

        <div className="bg-surface-raised/60 border border-border rounded-lg p-4 flex items-start gap-3">
          <TrendingUp className="w-4 h-4 text-accent-purple mt-0.5 shrink-0" />
          <p className="text-xs text-foreground/90 leading-relaxed">{p.narrative}</p>
        </div>
      </div>
    </div>
  );
}

function TwinCard({ icon: Icon, label, value, sub, tone }: { icon: any; label: string; value: string; sub: string; tone: 'teal'|'amber'|'red'|'blue' }) {
  const toneClass = {
    teal: 'text-accent-teal', amber: 'text-accent-amber', red: 'text-accent-red', blue: 'text-accent-blue',
  }[tone];
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">{label}</span>
        <Icon className={`w-4 h-4 ${toneClass}`} />
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      <p className={`text-[10px] font-mono mt-1 ${toneClass}`}>{sub}</p>
    </div>
  );
}
