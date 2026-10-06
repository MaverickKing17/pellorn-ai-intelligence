import { useState } from 'react';
import { LifeBuoy, Download, ShieldOff, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';

const STEPS = [
  { label: 'Freeze all AI agent tool-calls (284 agents)', detail: 'Circuit breakers engaged · sessions sealed' },
  { label: 'Snapshot immutable audit trail (Canada Central)', detail: 'SHA-256 hash chain finalised' },
  { label: 'Bundle encrypted evidence vault (AES-256)', detail: 'Keys wrapped via Azure Key Vault HSM' },
  { label: 'Generate portable JSON/PDF exit package', detail: 'OSFI B-10 continuity artefact prepared' },
  { label: 'Trigger tenant data purge (7-day soft window)', detail: 'PIPEDA §4.5.3 retention override' },
];

export default function ExitStrategyButton() {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  const run = async () => {
    setRunning(true);
    setDone(false);
    setStep(-1);
    for (let i = 0; i < STEPS.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 650));
      setStep(i);
    }
    // Mock encrypted export file
    const payload = {
      protocol: 'OSFI B-10 Continuity Plan',
      tenant: 'Global Enterprise',
      generated_at: new Date().toISOString(),
      region: 'Azure Canada Central (Toronto)',
      encryption: 'AES-256-GCM · keys isolated CA-Central',
      agents_frozen: 284,
      audit_hash: 'sha256:9f2c…c7a1',
      signature: 'ed25519:BASTION-EXIT-2026',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bastion-osfi-b10-exit-${Date.now()}.enc.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDone(true);
    setRunning(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setStep(-1); setDone(false); } }}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-accent-amber/15 text-accent-amber border border-accent-amber/40 hover:bg-accent-amber/25 text-[11px] uppercase tracking-wider font-semibold h-7 px-3"
        >
          <LifeBuoy className="w-3 h-3 mr-1" />
          OSFI B-10 Exit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <LifeBuoy className="w-4 h-4 text-accent-amber" /> Execute OSFI B-10 Continuity Plan
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-xs">
            Simulated Exit Strategy protocol mandated for federally regulated financial institutions.
            Packages an encrypted export and triggers a mock tenant purge.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-2 my-2">
          {STEPS.map((s, i) => {
            const active = step === i && running;
            const complete = step >= i && (!running || step > i);
            return (
              <li key={s.label} className="flex items-start gap-3 bg-surface-raised border border-border rounded-lg p-2.5">
                <div className="mt-0.5">
                  {active ? <Loader2 className="w-4 h-4 text-accent-amber animate-spin" />
                    : complete ? <CheckCircle2 className="w-4 h-4 text-accent-teal" />
                    : <Lock className="w-4 h-4 text-text-secondary" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-[11px] text-text-secondary">{s.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {done && (
          <div className="rounded-lg border border-accent-teal/40 bg-accent-teal/10 px-3 py-2 text-[11px] text-accent-teal flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Encrypted continuity package downloaded · tenant purge scheduled T+7d.
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="border-border text-text-secondary h-8 text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={run}
            disabled={running}
            className="bg-accent-red hover:bg-accent-red/80 text-foreground h-8 text-xs"
          >
            {running ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <ShieldOff className="w-3 h-3 mr-1" />}
            {running ? 'Executing…' : done ? 'Re-run Protocol' : 'Execute Protocol'}
            {!running && <Download className="w-3 h-3 ml-1" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
