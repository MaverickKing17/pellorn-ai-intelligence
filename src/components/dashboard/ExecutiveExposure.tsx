import { Scale, ShieldAlert, Gavel, Wrench, TrendingDown, Award, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const exposures = [
  { label: 'Potential Regulatory Liability', value: '$8.2M', icon: Gavel, tone: 'amber', desc: 'OSFI E-21 + AIDA gross exposure if controls fail.' },
  { label: 'Potential Privacy Exposure', value: '$2.4M', icon: ShieldAlert, tone: 'red', desc: 'PIPEDA Tier-3 incident — class action modeling.' },
  { label: 'Potential AI Act Exposure', value: '$1.8M', icon: Scale, tone: 'amber', desc: 'AIDA (Bill C-27) high-impact system penalties.' },
  { label: 'Potential Operational Risk', value: '$5.7M', icon: Wrench, tone: 'blue', desc: 'Productivity & restoration costs from agent outage.' },
];

const tone = (t: string) =>
  t === 'red' ? 'border-accent-red/40 bg-accent-red/5 text-accent-red'
  : t === 'amber' ? 'border-accent-amber/40 bg-accent-amber/5 text-accent-amber'
  : t === 'teal' ? 'border-accent-teal/40 bg-accent-teal/5 text-accent-teal'
  : 'border-accent-blue/40 bg-accent-blue/5 text-accent-blue';

export default function ExecutiveExposure() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-blue" /> Executive Exposure Dashboard
          </h2>
          <p className="text-xs text-text-secondary">Board Report 2.0 · Quantified liability if current AI risks materialize.</p>
        </div>
        <Button variant="outline" size="sm" className="border-border text-foreground text-xs h-8">
          <Download className="w-3 h-3 mr-1" /> Export Board Pack
        </Button>
      </div>

      {/* Exposure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {exposures.map(e => {
          const Icon = e.icon;
          return (
            <div key={e.label} className={`bg-card border rounded-xl p-5 ${tone(e.tone)}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">{e.label}</span>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-3xl font-bold text-foreground tabular-nums leading-none">{e.value}</p>
              <p className="text-[11px] text-text-secondary mt-3 leading-relaxed">{e.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-[10px] uppercase tracking-widest text-text-secondary">AI Governance Rating</p>
          <p className="text-6xl font-bold text-accent-teal tabular-nums mt-2">AA</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 border border-accent-teal/30 px-2 py-0.5 rounded-full">
            <Award className="w-3 h-3" /> Investment Grade
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-[10px] uppercase tracking-widest text-text-secondary">Enterprise Trust Rating</p>
          <p className="text-6xl font-bold text-foreground tabular-nums mt-2">91<span className="text-2xl text-text-secondary">%</span></p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-blue bg-accent-blue/10 border border-accent-blue/30 px-2 py-0.5 rounded-full">
            ↑ +4 pts vs Q3
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-3">If risks were not mitigated…</p>
          <div className="space-y-2">
            <Row label="Gross Theoretical Exposure" value="$18.1M" />
            <Row label="Modeled Mitigation" value="−$14.7M" pos />
            <div className="h-px bg-border my-2" />
            <Row label="Residual Exposure" value="$3.4M" emphasize />
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-accent-teal" />
          <h3 className="text-sm font-bold text-foreground">What this means for the Board</h3>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Bastion's continuous governance reduces an estimated <span className="text-foreground font-semibold">$14.7M CAD</span> of theoretical AI-related liability across regulatory, privacy, AIDA and operational categories. Residual exposure of <span className="text-foreground font-semibold">$3.4M</span> sits well within board-approved risk appetite and is fully reflected in this quarter's risk capital model. No additional capital reserve is recommended.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, pos, emphasize }: { label: string; value: string; pos?: boolean; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className={`font-mono tabular-nums ${emphasize ? 'text-foreground text-base font-bold' : pos ? 'text-accent-teal text-sm' : 'text-foreground text-sm'}`}>{value}</span>
    </div>
  );
}
