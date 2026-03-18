import { Globe, Lock, MapPin, Server, Activity, Wifi } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-14 left-0 bottom-0 w-60 bg-card border-r border-border z-40 overflow-y-auto transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Tenant Context */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-text-secondary mb-2">Tenant Context</h3>
            <div className="bg-surface-raised border border-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-accent-blue" />
                <span className="text-sm font-semibold text-foreground">Global Enterprise</span>
              </div>
              <p className="text-[11px] text-text-secondary">Currently monitoring 14 active AI agents for this tenant</p>
            </div>
          </section>

          {/* Management Actions */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-text-secondary mb-2">Management Actions</h3>
            <div className="bg-accent-amber/10 border border-accent-amber/20 rounded-xl p-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent-amber" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-amber">Admin Privileges Required</span>
            </div>
          </section>

          {/* Data Residency */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-text-secondary mb-2">Data Residency</h3>
            <div className="bg-surface-raised border border-border rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Region Config</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-teal">Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-text-secondary" />
                <span className="text-[11px] text-text-secondary">Primary Region</span>
                <span className="text-[11px] font-semibold text-accent-amber ml-auto">Canada Central</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-text-secondary" />
                <span className="text-[11px] text-text-secondary">Failover Zone</span>
                <span className="text-[11px] font-semibold text-foreground ml-auto">Canada East</span>
              </div>
              <p className="text-[10px] text-text-muted-custom leading-relaxed">
                All PII processing and immutable audit trails are strictly confined to Canadian sovereign infrastructure.
              </p>
            </div>
          </section>

          {/* System Status */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-text-secondary mb-2">System Status</h3>
            <div className="space-y-2">
              <StatusItem icon={<Server className="w-3 h-3" />} label="Lakera Guard" status="ACTIVE" color="teal" />
              <StatusItem icon={<Activity className="w-3 h-3" />} label="Firestore DB" status="STABLE" color="blue" />
              <StatusItem icon={<Wifi className="w-3 h-3" />} label="Agent Monitor" status="ONLINE" color="teal" />
            </div>
            <div className="flex gap-1 mt-3">
              {[65, 80, 45, 90, 70, 55, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-accent-teal/20 rounded-sm overflow-hidden h-6 flex items-end">
                  <div className="w-full bg-accent-teal rounded-sm" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

function StatusItem({ icon, label, status, color }: { icon: React.ReactNode; label: string; status: string; color: string }) {
  const colorClasses = color === 'teal' ? 'text-accent-teal' : 'text-accent-blue';
  return (
    <div className="flex items-center gap-2">
      <span className={`animate-pulse-glow ${colorClasses}`}>●</span>
      <span className="text-xs text-foreground">{label}</span>
      <span className={`text-[10px] font-semibold uppercase tracking-wider ml-auto ${colorClasses}`}>{status}</span>
    </div>
  );
}
