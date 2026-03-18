import { Shield, CheckCircle } from 'lucide-react';
import { useGuardrails } from '@/hooks/useSimulation';

export default function GuardrailExecution() {
  const guardrails = useGuardrails();

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Live Guardrail Execution</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full">
          Real Time Monitoring
        </span>
      </div>

      <div className="space-y-3">
        {guardrails.map((g, i) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-accent-teal flex-shrink-0" />
            <span className="text-xs text-foreground flex-1">{g.name}</span>
            <span className="text-[11px] text-text-secondary font-mono">{g.latency}ms</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full">
              {g.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
