import { Search } from 'lucide-react';
import InterceptionGateway from './InterceptionGateway';
import GuardrailExecution from './GuardrailExecution';
import AgentBehaviorStream from './AgentBehaviorStream';

export default function RedTeamSandbox() {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">Global Sandbox Search</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-accent-teal rounded-full animate-pulse-glow" />
            Sandbox Active
          </span>
        </div>
        <div className="bg-surface-raised border border-border rounded-lg flex items-center px-3 gap-2">
          <Search className="w-4 h-4 text-text-muted-custom" />
          <input
            type="text"
            placeholder="Search sandbox logs, guardrails, and telemetry..."
            className="w-full bg-transparent text-xs text-foreground placeholder:text-text-muted-custom outline-none py-2.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InterceptionGateway />
        <GuardrailExecution />
      </div>
      <AgentBehaviorStream />
    </div>
  );
}
