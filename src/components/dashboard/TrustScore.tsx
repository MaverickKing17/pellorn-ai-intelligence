import { ShieldCheck, Fingerprint, Scale, MessageSquareWarning, Database, Award } from 'lucide-react';

const FORMULA = [
  { label: 'Behavior Consistency', weight: 30, score: 94, icon: ShieldCheck, desc: 'Deviation from baseline call rate, tool mix, and time-of-day patterns.' },
  { label: 'Identity Integrity', weight: 25, score: 99, icon: Fingerprint, desc: 'Certificate validity, rotation cadence, and signed-tool attestation.' },
  { label: 'Compliance Alignment', weight: 20, score: 91, icon: Scale, desc: 'Policy hits across OSFI E-21, PIPEDA, AIDA (Bill C-27), SOC 2.' },
  { label: 'Prompt Safety', weight: 15, score: 88, icon: MessageSquareWarning, desc: 'Injection, jailbreak, and adversarial token detection rate.' },
  { label: 'Data Handling', weight: 10, score: 96, icon: Database, desc: 'PII redaction success, residency, encryption-in-transit posture.' },
];

const tiers = [
  { label: '85 – 100 · Trusted', tone: 'bg-accent-teal/15 text-accent-teal border-accent-teal/40' },
  { label: '60 – 84 · Monitor', tone: 'bg-accent-amber/15 text-accent-amber border-accent-amber/40' },
  { label: '0 – 59 · Restricted', tone: 'bg-accent-red/15 text-accent-red border-accent-red/40' },
];

const composite = Math.round(
  FORMULA.reduce((s, f) => s + (f.score * f.weight) / 100, 0)
);

export default function TrustScore() {
  const r = 70;
  const c = 2 * Math.PI * r;
  const dash = (composite / 100) * c;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          Agent Trust Score<sup className="text-accent-teal text-xs">™</sup>
        </h2>
        <p className="text-xs text-text-secondary">A unified 0–100 score combining behavior, identity, compliance, prompt safety and data handling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Composite */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
              <circle cx="90" cy="90" r={r} stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
              <circle
                cx="90" cy="90" r={r}
                stroke="url(#trustGrad)" strokeWidth="10" fill="none" strokeLinecap="round"
                strokeDasharray={`${dash} ${c}`}
              />
              <defs>
                <linearGradient id="trustGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent-teal))" />
                  <stop offset="100%" stopColor="hsl(var(--accent-blue))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-bold text-foreground tabular-nums">{composite}</p>
              <p className="text-[11px] uppercase tracking-widest text-text-secondary">Fleet Composite</p>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/30">
            <Award className="w-3.5 h-3.5 text-accent-teal" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-teal">Trusted Fleet</span>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-foreground mb-4">Trust Score Formula</h3>
          <div className="space-y-3">
            {FORMULA.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="grid grid-cols-[28px_1fr_60px_1fr_50px] gap-3 items-center">
                  <Icon className="w-4 h-4 text-accent-teal" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{f.label}</p>
                    <p className="text-[11px] text-text-secondary truncate">{f.desc}</p>
                  </div>
                  <span className="text-[11px] font-mono text-accent-amber bg-accent-amber/10 border border-accent-amber/30 rounded px-1.5 py-0.5 text-center">{f.weight}%</span>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent-teal to-accent-blue rounded-full" style={{ width: `${f.score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-foreground tabular-nums text-right">{f.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tier legend */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">Tier Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tiers.map(t => (
            <div key={t.label} className={`border rounded-lg px-3 py-3 ${t.tone}`}>
              <p className="text-xs font-bold uppercase tracking-wider">{t.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-secondary mt-4 leading-relaxed">
          Trust Scores recompute every 30 seconds from live telemetry. Agents that fall below 60 are automatically downgraded to <span className="text-accent-red font-semibold">Restricted</span> certification and their tool privileges are revoked pending review.
        </p>
      </div>
    </div>
  );
}
