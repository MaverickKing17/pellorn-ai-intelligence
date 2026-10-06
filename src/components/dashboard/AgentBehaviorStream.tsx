import { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';

export default function AgentBehaviorStream() {
  const { logs, logCounts } = useSimulation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const tagColors: Record<string, string> = {
    CHECK: 'text-accent-amber',
    OK: 'text-accent-teal',
    MONITOR: 'text-accent-blue',
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-bold text-foreground">Agent Behavior Stream</h3>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-accent-teal rounded-full animate-pulse-glow" />
          Live Feed
        </span>
      </div>

      <div
        ref={scrollRef}
        className="bg-background border border-border rounded-lg p-3 h-48 overflow-y-auto font-mono text-[11px] space-y-1"
      >
        {logs.map(log => (
          <div key={log.id} className="animate-slide-up">
            <span className="text-text-muted-custom">[{log.timestamp}]</span>{' '}
            <span className={`font-semibold ${tagColors[log.tag] || 'text-foreground'}`}>[{log.tag}]</span>{' '}
            <span className="text-text-secondary">{log.message}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1 text-[11px] text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-accent-blue" /> MONITOR • {logCounts.MONITOR}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-accent-amber" /> CHECK • {logCounts.CHECK}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-accent-teal" /> OK • {logCounts.OK}
        </span>
      </div>
    </div>
  );
}
