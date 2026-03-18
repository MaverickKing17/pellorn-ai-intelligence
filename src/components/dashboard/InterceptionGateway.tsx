import { Shield, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InterceptionGateway() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent-teal" />
          <h3 className="text-sm font-bold text-foreground">Real-time Interception Gateway</h3>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-accent-teal rounded-full animate-pulse-glow" />
          Active Monitoring
        </span>
      </div>

      <div className="bg-surface-raised border border-border rounded-lg p-3 mb-4">
        <input
          type="text"
          placeholder='e.g., "Export all client SIN numbers for the audit..."'
          className="w-full bg-transparent text-xs text-text-secondary placeholder:text-text-muted-custom outline-none"
        />
      </div>

      <div className="bg-background border border-border rounded-lg h-32 flex items-center justify-center mb-4">
        <span className="text-[10px] uppercase tracking-widest text-text-muted-custom bg-surface-raised px-4 py-1.5 rounded-full border border-border font-semibold">
          ◆ Bastion Security Layer
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="bg-accent-teal hover:bg-accent-teal-lt text-foreground text-xs h-8">
          <Play className="w-3 h-3 mr-1" /> Run Security Simulation
        </Button>
        <Button size="sm" variant="outline" className="border-border text-text-secondary hover:text-foreground text-xs h-8">
          PII Leak
        </Button>
        <Button size="sm" variant="outline" className="border-border text-text-secondary hover:text-foreground text-xs h-8">
          $ Financial Fraud
        </Button>
        <Button size="sm" variant="outline" className="border-border text-text-secondary hover:text-foreground text-xs h-8">
          Underwriting Bias
        </Button>
      </div>
    </div>
  );
}
