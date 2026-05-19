import { useState, useEffect, useCallback } from 'react';
import { useIndustry } from '@/context/IndustryContext';

export interface LogEntry {
  id: number;
  timestamp: string;
  tag: string;
  message: string;
  color: string;
}

export function useSimulation() {
  const { config } = useIndustry();
  const templates = config.logs;
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logCounter, setLogCounter] = useState(0);

  const generateTimestamp = useCallback(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const initial: LogEntry[] = templates.slice(0, 8).map((t, i) => ({
      id: i,
      timestamp: generateTimestamp(),
      ...t,
    }));
    setLogs(initial);
    setLogCounter(8);

    const interval = setInterval(() => {
      setLogCounter(prev => {
        const template = templates[prev % templates.length];
        const newLog: LogEntry = {
          id: prev,
          timestamp: generateTimestamp(),
          ...template,
        };
        setLogs(prevLogs => [...prevLogs.slice(-20), newLog]);
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [generateTimestamp, templates]);

  const logCounts = {
    MONITOR: logs.filter(l => l.tag === 'MONITOR').length,
    CHECK: logs.filter(l => l.tag === 'CHECK').length,
    OK: logs.filter(l => l.tag === 'OK').length,
  };

  return { logs, logCounts };
}

export function useGuardrails() {
  const { config } = useIndustry();
  return config.guardrails.map(g => ({ ...g, status: 'PASSED' as const }));
}
