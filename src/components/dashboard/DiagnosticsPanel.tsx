import { useMemo, useState } from 'react';
import { Activity, CheckCircle2, XCircle, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type EnvCheck = {
  key: string;
  required: boolean;
  present: boolean;
  fallback: string;
  effective: string;
  description: string;
};

const SAFE_DEFAULTS: Record<string, string> = {
  VITE_SUPABASE_URL: '(unset — using mock client)',
  VITE_SUPABASE_ANON_KEY: '(unset — anonymous read-only)',
  VITE_AUTH_MODE: 'guest',
  VITE_API_BASE_URL: '/',
  VITE_APP_ENV: 'development',
};

const REQUIRED_KEYS = new Set(['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']);

function mask(value: string) {
  if (!value || value.startsWith('(')) return value;
  if (value.length <= 8) return '••••';
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export default function DiagnosticsPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { mode, env, checks } = useMemo(() => {
    const env = (import.meta as any).env ?? {};
    const checks: EnvCheck[] = Object.keys(SAFE_DEFAULTS).map(key => {
      const raw = env[key];
      const present = typeof raw === 'string' && raw.length > 0;
      return {
        key,
        required: REQUIRED_KEYS.has(key),
        present,
        fallback: SAFE_DEFAULTS[key],
        effective: present ? String(raw) : SAFE_DEFAULTS[key],
        description: descriptionFor(key),
      };
    });

    const supaPresent = checks.find(c => c.key === 'VITE_SUPABASE_URL')?.present;
    const declared = env.VITE_AUTH_MODE as string | undefined;
    const mode = declared || (supaPresent ? 'supabase' : 'guest');

    return { mode, env, checks };
  }, [refreshKey]);

  const missingRequired = checks.filter(c => c.required && !c.present);

  const copyReport = () => {
    const report = {
      authMode: mode,
      appEnv: env.VITE_APP_ENV ?? SAFE_DEFAULTS.VITE_APP_ENV,
      mode: env.MODE,
      prod: env.PROD,
      dev: env.DEV,
      checks: checks.map(c => ({ key: c.key, present: c.present, required: c.required })),
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    toast({ title: 'Diagnostics copied', description: 'Report copied to clipboard.' });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-teal" />
          <h3 className="text-sm font-semibold text-foreground">In-App Diagnostics</h3>
          <span className="text-[10px] uppercase tracking-widest text-text-secondary">
            Build · {String(env.MODE ?? 'unknown')}
          </span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setRefreshKey(k => k + 1)}>
            <RefreshCw className="w-3 h-3 mr-1" /> Refresh
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={copyReport}>
            <Copy className="w-3 h-3 mr-1" /> Copy Report
          </Button>
        </div>
      </div>

      {/* Auth mode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCell label="Auth Mode" value={mode} tone={mode === 'supabase' ? 'teal' : 'amber'} />
        <StatCell label="App Env" value={String(env.VITE_APP_ENV ?? SAFE_DEFAULTS.VITE_APP_ENV)} tone="blue" />
        <StatCell
          label="Required Vars"
          value={`${checks.filter(c => c.required && c.present).length}/${checks.filter(c => c.required).length} OK`}
          tone={missingRequired.length === 0 ? 'teal' : 'red'}
        />
      </div>

      {missingRequired.length > 0 && (
        <div className="rounded-lg border border-accent-amber/30 bg-accent-amber/10 p-3 text-xs text-accent-amber">
          Falling back to safe defaults for: {missingRequired.map(m => m.key).join(', ')}. App will run in degraded mode.
        </div>
      )}

      {/* Env table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/30 text-text-secondary">
            <tr>
              <th className="text-left font-semibold px-3 py-2">Variable</th>
              <th className="text-left font-semibold px-3 py-2">Status</th>
              <th className="text-left font-semibold px-3 py-2">Effective Value</th>
            </tr>
          </thead>
          <tbody>
            {checks.map(c => (
              <tr key={c.key} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-foreground">
                  {c.key}
                  {c.required && <span className="ml-1 text-accent-red">*</span>}
                </td>
                <td className="px-3 py-2">
                  {c.present ? (
                    <span className="inline-flex items-center gap-1 text-accent-teal">
                      <CheckCircle2 className="w-3 h-3" /> Set
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-accent-amber">
                      <XCircle className="w-3 h-3" /> Default
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-text-secondary">{mask(c.effective)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-text-muted-custom">
        Values are masked. * = required for full production behavior. Missing values use safe defaults so the UI never crashes.
      </p>
    </div>
  );
}

function StatCell({ label, value, tone }: { label: string; value: string; tone: 'teal' | 'amber' | 'red' | 'blue' }) {
  const toneClass = {
    teal: 'text-accent-teal border-accent-teal/30 bg-accent-teal/5',
    amber: 'text-accent-amber border-accent-amber/30 bg-accent-amber/5',
    red: 'text-accent-red border-accent-red/30 bg-accent-red/5',
    blue: 'text-accent-blue border-accent-blue/30 bg-accent-blue/5',
  }[tone];
  return (
    <div className={`rounded-lg border px-3 py-2 ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-widest opacity-80">{label}</div>
      <div className="text-sm font-bold mt-0.5 truncate">{value}</div>
    </div>
  );
}

function descriptionFor(key: string) {
  switch (key) {
    case 'VITE_SUPABASE_URL': return 'Backend URL for Lovable Cloud';
    case 'VITE_SUPABASE_ANON_KEY': return 'Public anon key for client SDK';
    case 'VITE_AUTH_MODE': return 'guest | supabase';
    case 'VITE_API_BASE_URL': return 'Base path for API calls';
    case 'VITE_APP_ENV': return 'development | staging | production';
    default: return '';
  }
}
