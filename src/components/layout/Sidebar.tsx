import { useState } from 'react';
import { Globe, Lock, MapPin, Server, Activity, Wifi, Settings2, KeyRound, ShieldCheck } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [pipeda, setPipeda] = useState(true);
  const [aida, setAida] = useState(true);
  const [crossBorder, setCrossBorder] = useState(false);

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
            <h3 className="text-[11px] uppercase tracking-widest text-text-secondary mb-2">Tenant Context</h3>
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
            <h3 className="text-[11px] uppercase tracking-widest text-text-secondary mb-2">Management Actions</h3>
            <div className="bg-accent-amber/10 border border-accent-amber/20 rounded-xl p-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent-amber" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-amber">Admin Privileges Required</span>
            </div>
          </section>

          {/* Data Residency */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] uppercase tracking-widest text-text-secondary">Data Residency</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-accent-teal hover:text-accent-teal-lt border border-accent-teal/30 hover:border-accent-teal/60 bg-accent-teal/10 rounded-md px-1.5 py-0.5 transition-colors"
                    aria-label="Configure governance presets"
                  >
                    <Settings2 className="w-3 h-3" /> Configure
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                      <ShieldCheck className="w-4 h-4 text-accent-teal" /> Governance Framework Presets
                    </DialogTitle>
                    <DialogDescription className="text-text-secondary text-xs">
                      Toggle statutory frameworks enforced across the tenant. Changes apply to policy engine on next sync.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 mt-2">
                    <PresetRow
                      title="PIPEDA Compliance"
                      subtitle="Personal Information Protection & Electronic Documents Act"
                      checked={pipeda} onChange={setPipeda}
                    />
                    <PresetRow
                      title="AIDA (Bill C-27)"
                      subtitle="Federal Artificial Intelligence & Data Act"
                      checked={aida} onChange={setAida}
                    />
                    <PresetRow
                      title="Cross-Border Data Residency Safeguard"
                      subtitle="Blocks payloads leaving Canadian sovereign zones"
                      checked={crossBorder} onChange={setCrossBorder}
                    />
                  </div>
                  <div className="mt-3 rounded-lg border border-accent-teal/30 bg-accent-teal/10 p-3 space-y-1.5">
                    <p className="text-[11px] uppercase tracking-widest text-accent-teal font-semibold">Sovereign Pinning</p>
                    <p className="text-[11px] text-foreground">
                      All PII processing & immutable audit trails pinned to{' '}
                      <span className="font-semibold text-accent-teal">Azure Canada Central (Toronto)</span>{' '}
                      with failover to <span className="font-semibold text-accent-teal">Canada East (Quebec)</span>.
                    </p>
                    <p className="text-[11px] text-text-secondary">Satisfies PIPEDA §4.1 data-sovereignty & OSFI B-13 residency clauses.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-surface-raised border border-border rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Region Config</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-teal">Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-text-secondary" />
                <span className="text-[11px] text-text-secondary">Primary</span>
                <span className="text-[11px] font-semibold text-accent-amber ml-auto">Canada Central · Toronto</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-text-secondary" />
                <span className="text-[11px] text-text-secondary">Failover</span>
                <span className="text-[11px] font-semibold text-foreground ml-auto">Canada East · Quebec</span>
              </div>
              <p className="text-[11px] text-text-muted-custom leading-relaxed">
                All PII processing and immutable audit trails are strictly confined to Canadian sovereign infrastructure.
              </p>
              <div className="border-t border-border pt-2 space-y-1.5">
                <SovereignBadge icon={<Lock className="w-3 h-3" />} text="TLS 1.3 Enforced (UI transport)" />
                <SovereignBadge icon={<KeyRound className="w-3 h-3" />} text="AES-256 · Keys Isolated CA-Central" />
              </div>
            </div>
          </section>

          {/* System Status */}
          <section>
            <h3 className="text-[11px] uppercase tracking-widest text-text-secondary mb-2">System Status</h3>
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

function PresetRow({ title, subtitle, checked, onChange }: { title: string; subtitle: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between bg-surface-raised border border-border rounded-lg p-2.5">
      <div className="pr-3">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-text-secondary">{subtitle}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SovereignBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-accent-teal">
      <span className="text-accent-teal">{icon}</span>
      <span className="font-semibold tracking-wide">{text}</span>
    </div>
  );
}

function StatusItem({ icon, label, status, color }: { icon: React.ReactNode; label: string; status: string; color: string }) {
  const colorClasses = color === 'teal' ? 'text-accent-teal' : 'text-accent-blue';
  return (
    <div className="flex items-center gap-2">
      <span className={`animate-pulse-glow ${colorClasses}`}>●</span>
      <span className="text-xs text-foreground">{label}</span>
      <span className={`text-[11px] font-semibold uppercase tracking-wider ml-auto ${colorClasses}`}>{status}</span>
    </div>
  );
}
