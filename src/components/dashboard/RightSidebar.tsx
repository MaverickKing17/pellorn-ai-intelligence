import { Shield, AlertTriangle, Scale, Radar } from 'lucide-react';

export default function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* ROI Card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-[10px] uppercase tracking-widest text-accent-amber font-semibold mb-4">Why This Matters for ROI</h3>
        <div className="space-y-4">
          <ROIItem
            icon={<AlertTriangle className="w-4 h-4 text-accent-red" />}
            title="Avoid Fines"
            desc="Real-time PII blocking prevents PIPEDA violations up to $100K per occurrence."
          />
          <ROIItem
            icon={<Scale className="w-4 h-4 text-accent-blue" />}
            title="Regulatory Capital"
            desc="OSFI E-21 compliance lowers operational risk capital charges."
          />
          <ROIItem
            icon={<Shield className="w-4 h-4 text-accent-purple" />}
            title="Liability Mitigation"
            desc="Intercepts biased underwriting logic, prevents class action lawsuits."
          />
        </div>
      </div>

      {/* Global Threat Intel */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse-glow" />
            <span className="text-accent-red">Global Threat Intel</span>
          </h3>
          <span className="text-[10px] text-text-muted-custom">Amazon AWS</span>
        </div>
        <div className="space-y-3">
          <ThreatItem title="System Prompt Leak" desc="Rogue Customer Support AI" severity="CRITICAL" />
          <ThreatItem title="PII Extraction" desc="Rogue Customer Support AI" severity="HIGH" />
          <ThreatItem title="Jailbreak Attempt" desc="Rogue Wealth Mgmt Bot" severity="HIGH" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-text-secondary">Active Honeypots:</span>
          <span className="text-xs font-bold text-accent-blue">1,312</span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden ml-2">
            <div className="h-full w-3/4 bg-accent-blue rounded-full" />
          </div>
        </div>
      </div>

      {/* Compliance Score */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold mb-3">Compliance Score Impact</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-accent-teal">94.2</span>
          <span className="text-xs text-accent-teal">+2.1% this week</span>
        </div>
        <div className="flex gap-1">
          {[60, 65, 70, 68, 75, 80, 85, 92].map((h, i) => (
            <div key={i} className="flex-1 h-10 flex items-end">
              <div className="w-full bg-accent-teal/30 rounded-sm" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ROIItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        <p className="text-[11px] text-text-secondary leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ThreatItem({ title, desc, severity }: { title: string; desc: string; severity: 'CRITICAL' | 'HIGH' }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-text-secondary">{desc}</p>
      </div>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          severity === 'CRITICAL'
            ? 'bg-accent-red/10 text-accent-red border border-accent-red/30'
            : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/30'
        }`}
      >
        {severity}
      </span>
    </div>
  );
}
