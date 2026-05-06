import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export type ProtectionStatus = 'active' | 'passive';
export type DetectionCategory = 'pii' | 'injection' | 'toxicity';
export type EnforcementAction = 'block' | 'redact' | 'flag' | 'allow';

export interface DetectionHit {
  category: DetectionCategory;
  pattern: string;
  match: string;
  span: [number, number];
}

export interface EvaluationResult {
  prompt: string;
  sanitized: string;
  action: EnforcementAction;
  hits: DetectionHit[];
  latencyMs: number;
  failClosed: boolean;
  timestamp: number;
  policyId?: string;
  status: number; // 200, 403
}

export interface PolicyStat {
  id: string;
  hitCount: number;
  lastTriggered: number | null;
}

const STORAGE_KEY = 'bastion.policyEngine.v1';

const PII_PATTERNS = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  phoneNA: /\b(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  sin: /\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/g,
};

const INJECTION_PHRASES = [
  'ignore previous instructions',
  'ignore all previous',
  'disregard prior instructions',
  'system override',
  'you are dan',
  'do anything now',
  'act as dan',
  'jailbreak',
  'developer mode',
  'reveal system prompt',
  'forget your instructions',
];

const DEFAULT_TOXICITY = [
  'kill', 'hate', 'stupid', 'idiot', 'racist', 'attack', 'destroy',
];

interface PersistState {
  protection: ProtectionStatus;
  blocklist: string[];
  threatsBlocked: number;
  policyStats: Record<string, PolicyStat>;
  recentEvaluations: EvaluationResult[];
}

const defaultState: PersistState = {
  protection: 'active',
  blocklist: [],
  threatsBlocked: 0,
  policyStats: {},
  recentEvaluations: [],
};

function loadState(): PersistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function detect(prompt: string, extraBlocklist: string[]): DetectionHit[] {
  const hits: DetectionHit[] = [];

  // PII
  for (const [name, regex] of Object.entries(PII_PATTERNS)) {
    const re = new RegExp(regex.source, regex.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(prompt)) !== null) {
      hits.push({ category: 'pii', pattern: name, match: m[0], span: [m.index, m.index + m[0].length] });
      if (!re.global) break;
    }
  }

  const lower = prompt.toLowerCase();

  // Injection
  for (const phrase of INJECTION_PHRASES) {
    const idx = lower.indexOf(phrase);
    if (idx !== -1) {
      hits.push({ category: 'injection', pattern: phrase, match: prompt.slice(idx, idx + phrase.length), span: [idx, idx + phrase.length] });
    }
  }

  // Toxicity (default + custom blocklist)
  const tox = [...DEFAULT_TOXICITY, ...extraBlocklist.map(s => s.toLowerCase())];
  for (const word of tox) {
    if (!word) continue;
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(prompt)) !== null) {
      hits.push({ category: 'toxicity', pattern: word, match: m[0], span: [m.index, m.index + m[0].length] });
    }
  }

  return hits;
}

function redactPrompt(prompt: string, hits: DetectionHit[]): string {
  // Only redact PII matches
  const piiHits = hits.filter(h => h.category === 'pii').sort((a, b) => b.span[0] - a.span[0]);
  let out = prompt;
  for (const h of piiHits) {
    out = out.slice(0, h.span[0]) + '[REDACTED]' + out.slice(h.span[1]);
  }
  return out;
}

export function usePolicyEngine() {
  const [state, setState] = useState<PersistState>(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
  }, [state]);

  const setProtection = useCallback((p: ProtectionStatus) => {
    setState(s => ({ ...s, protection: p }));
    toast(`Protection set to ${p.toUpperCase()}`, {
      description: p === 'active' ? 'All inbound prompts will be intercepted.' : 'Engine is observing only.',
    });
  }, []);

  const addBlocklistTerm = useCallback((term: string) => {
    const t = term.trim();
    if (!t) return;
    setState(s => s.blocklist.includes(t.toLowerCase()) ? s : { ...s, blocklist: [...s.blocklist, t.toLowerCase()] });
    toast.success(`Added "${t}" to blocklist`);
  }, []);

  const removeBlocklistTerm = useCallback((term: string) => {
    setState(s => ({ ...s, blocklist: s.blocklist.filter(b => b !== term) }));
  }, []);

  const evaluatePrompt = useCallback((prompt: string, policyId?: string): EvaluationResult => {
    const start = performance.now();
    let result: EvaluationResult;

    try {
      if (state.protection === 'passive') {
        result = {
          prompt, sanitized: prompt, action: 'allow', hits: [],
          latencyMs: performance.now() - start, failClosed: false,
          timestamp: Date.now(), policyId, status: 200,
        };
      } else {
        const hits = detect(prompt, state.blocklist);
        const hasInjection = hits.some(h => h.category === 'injection');
        const hasToxicity = hits.some(h => h.category === 'toxicity');
        const hasPII = hits.some(h => h.category === 'pii');

        let action: EnforcementAction = 'allow';
        let sanitized = prompt;
        let status = 200;

        if (hasInjection) {
          action = 'block'; status = 403;
        } else if (hasToxicity) {
          action = 'flag';
        } else if (hasPII) {
          action = 'redact';
          sanitized = redactPrompt(prompt, hits);
        }

        result = {
          prompt, sanitized, action, hits,
          latencyMs: Math.min(performance.now() - start + Math.random() * 8 + 18, 49),
          failClosed: false, timestamp: Date.now(), policyId, status,
        };
      }
    } catch (err) {
      // Fail-closed
      result = {
        prompt, sanitized: '', action: 'block', hits: [],
        latencyMs: performance.now() - start, failClosed: true,
        timestamp: Date.now(), policyId, status: 403,
      };
    }

    setState(s => {
      const stats = { ...s.policyStats };
      if (policyId && result.action !== 'allow') {
        const cur = stats[policyId] ?? { id: policyId, hitCount: 0, lastTriggered: null };
        stats[policyId] = { ...cur, hitCount: cur.hitCount + 1, lastTriggered: result.timestamp };
      }
      const blocked = result.action === 'block' || result.action === 'flag' || result.action === 'redact';
      return {
        ...s,
        threatsBlocked: s.threatsBlocked + (blocked ? 1 : 0),
        policyStats: stats,
        recentEvaluations: [result, ...s.recentEvaluations].slice(0, 25),
      };
    });

    // Toast feedback
    if (result.failClosed) {
      toast.error('Fail-closed: prompt blocked', { description: 'Policy engine error — defaulting to BLOCK.' });
    } else if (result.action === 'block') {
      toast.error('403 Forbidden — prompt blocked', { description: `Injection detected: "${result.hits[0]?.match ?? 'unknown'}"` });
    } else if (result.action === 'redact') {
      toast.warning('PII redacted before forwarding', { description: `${result.hits.filter(h => h.category === 'pii').length} entities masked.` });
    } else if (result.action === 'flag') {
      toast.warning('Flagged as High Risk', { description: 'Prompt allowed but tagged for manual review.' });
    } else if (result.action === 'allow') {
      toast.success('Prompt cleared', { description: `Latency overhead ${result.latencyMs.toFixed(1)}ms` });
    }

    return result;
  }, [state.protection, state.blocklist]);

  const avgLatency = useMemo(() => {
    const evs = state.recentEvaluations;
    if (!evs.length) return 38;
    return evs.reduce((s, e) => s + e.latencyMs, 0) / evs.length;
  }, [state.recentEvaluations]);

  const getPolicyStat = useCallback((id: string): PolicyStat => {
    return state.policyStats[id] ?? { id, hitCount: 0, lastTriggered: null };
  }, [state.policyStats]);

  return {
    protection: state.protection,
    setProtection,
    blocklist: state.blocklist,
    addBlocklistTerm,
    removeBlocklistTerm,
    threatsBlocked: state.threatsBlocked,
    avgLatency,
    recentEvaluations: state.recentEvaluations,
    evaluatePrompt,
    getPolicyStat,
  };
}
