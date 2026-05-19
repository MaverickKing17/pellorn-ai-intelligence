import { Shield, AlertTriangle, Scale } from 'lucide-react';
import { useIndustry } from '@/context/IndustryContext';

export default function RightSidebar() {
  const { config, industry } = useIndustry();
  const iconMap = {
    alert: <AlertTriangle className="w-4 h-4 text-accent-red" />,
    scale: <Scale className="w-4 h-4 text-accent-blue" />,
    shield: <Shield className="w-4 h-4 text-accent-purple" />,
  } as const;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-[10px] uppercase tracking-widest text-accent-amber font-semibold mb-4">Why This Matters for ROI</h3>
        <div className="space-y-4">
          {config.roi.map((r, i) => (
            <ROIItem key={i} icon={iconMap[r.iconKey]} title={r.title} desc={r.desc} />
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse-glow" />
            <span className="text-accent-red">Global Threat Intel</span>
          </h3>
          <span className="text-[10px] text-text-muted-custom">
            {industry === 'real_estate' ? 'GTA Brokerage Net' : 'Amazon AWS'}
          </span>
        </div>
        <div className="space-y-3">
          {config.threats.map((t, i) => (
            <ThreatItem key={i} title={t.title} desc={t.desc} severity={t.severity} />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-text-secondary">Active Honeypots:</span>
          <span className="text-xs font-bold text-accent-blue">1,312</span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden ml-2">
            <div className="h-full w-3/4 bg-accent-blue rounded-full" />
          </div>
        </div>
      </div>

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
