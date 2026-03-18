import { useState, useEffect, useCallback } from 'react';

const LOG_TEMPLATES = [
  { tag: 'CHECK', message: 'Checking for bias in risk weights...', color: 'amber' },
  { tag: 'OK', message: 'Bias check passed. Logic verified.', color: 'teal' },
  { tag: 'MONITOR', message: 'Data residency confirmed (Region: CA-Central)', color: 'blue' },
  { tag: 'MONITOR', message: 'Intercepting Agent Call: /api/v1/fraud/detect', color: 'blue' },
  { tag: 'OK', message: 'No adversarial patterns found.', color: 'teal' },
  { tag: 'CHECK', message: 'Validating PII redaction layer...', color: 'amber' },
  { tag: 'OK', message: 'Data residency confirmed (Region: CA-Central)', color: 'teal' },
  { tag: 'MONITOR', message: 'Intercepting Agent Call: /api/v1/underwriting/score', color: 'blue' },
  { tag: 'OK', message: 'Token budget within threshold.', color: 'teal' },
  { tag: 'CHECK', message: 'Scanning for prompt injection vectors...', color: 'amber' },
  { tag: 'OK', message: 'OSFI E-21 compliance verified.', color: 'teal' },
  { tag: 'MONITOR', message: 'Agent session heartbeat received.', color: 'blue' },
];

export interface LogEntry {
  id: number;
  timestamp: string;
  tag: string;
  message: string;
  color: string;
}

export function useSimulation() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logCounter, setLogCounter] = useState(0);

  const generateTimestamp = useCallback(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    // Initial logs
    const initial: LogEntry[] = LOG_TEMPLATES.slice(0, 8).map((t, i) => ({
      id: i,
      timestamp: generateTimestamp(),
      ...t,
    }));
    setLogs(initial);
    setLogCounter(8);

    const interval = setInterval(() => {
      setLogCounter(prev => {
        const template = LOG_TEMPLATES[prev % LOG_TEMPLATES.length];
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
  }, [generateTimestamp]);

  const logCounts = {
    MONITOR: logs.filter(l => l.tag === 'MONITOR').length,
    CHECK: logs.filter(l => l.tag === 'CHECK').length,
    OK: logs.filter(l => l.tag === 'OK').length,
  };

  return { logs, logCounts };
}

export function useGuardrails() {
  const [guardrails] = useState([
    { name: 'Lakera Guard (Prompt Injection)', latency: 12, status: 'PASSED' as const },
    { name: 'PII Entity Recognition (Presidio)', latency: 8, status: 'PASSED' as const },
    { name: 'Financial Compliance (OSFI E-21)', latency: 22, status: 'PASSED' as const },
    { name: 'Toxicity & Bias Filter', latency: 19, status: 'PASSED' as const },
  ]);

  return guardrails;
}
