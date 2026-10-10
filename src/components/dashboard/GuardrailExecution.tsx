
import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  LoaderCircle,
  Shield,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TENANT_ID = '2e2c7012-62ad-4cd1-8f4a-706380c3dc8e';

const tools = [
  {
    name: 'export_sensitive_record',
    label: 'Export Sensitive Record',
  },
  {
    name: 'lookup_customer_record',
    label: 'Customer Record Lookup',
  },
  {
    name: 'prepare_payment_instruction',
    label: 'Payment Instruction',
  },
];

type Result = {
  status: 'allow' | 'deny' | 'error';
  reason?: string;
  requestId?: string;
  message?: string;
};

export default function GuardrailExecution() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [busyTool, setBusyTool] = useState<string | null>(null);

  async function runCheck(toolName: string) {
    setBusyTool(toolName);

    setResults((previous) => {
      const next = { ...previous };
      delete next[toolName];
      return next;
    });

    try {
      const { data, error } = await supabase.functions.invoke(
        'pellorn-governance-gateway',
        {
          body: {
            tenant_id: TENANT_ID,
            tool_name: toolName,
          },
        },
      );

      if (error) {
        setResults((previous) => ({
          ...previous,
          [toolName]: {
            status: 'error',
            message: error.message || 'Gateway request failed',
          },
        }));
        return;
      }

      if (data?.decision === 'allow' || data?.decision === 'deny') {
        setResults((previous) => ({
          ...previous,
          [toolName]: {
            status: data.decision,
            reason: data.reason_code,
            requestId: data.request_id,
          },
        }));
      } else {
        setResults((previous) => ({
          ...previous,
          [toolName]: {
            status: 'error',
            message: data?.error || 'Unexpected gateway response',
          },
        }));
      }
    } catch (error) {
      setResults((previous) => ({
        ...previous,
        [toolName]: {
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Unexpected request failure',
        },
      }));
    } finally {
      setBusyTool(null);
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-foreground">
          Live Guardrail Execution
        </h3>

        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Backend checks
        </span>
      </div>

      <p className="text-xs text-text-secondary mb-4">
        Each check sends a request to the authenticated governance gateway.
        No underlying tool is executed.
      </p>

      <div className="space-y-3">
        {tools.map((tool) => {
          const result = results[tool.name];
          const checking = busyTool === tool.name;

          return (
            <div
              key={tool.name}
              className="flex flex-col gap-2 border-b border-border pb-3 last:border-0"
            >
              <div className="flex items-center gap-2">
                {checking ? (
                  <LoaderCircle className="w-4 h-4 animate-spin text-text-secondary" />
                ) : result?.status === 'allow' ? (
                  <CheckCircle className="w-4 h-4 text-accent-teal" />
                ) : result?.status === 'deny' ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : result?.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <Shield className="w-4 h-4 text-text-secondary" />
                )}

                <span className="text-xs text-foreground flex-1">
                  {tool.label}
                </span>

                <button
                  type="button"
                  onClick={() => runCheck(tool.name)}
                  disabled={busyTool !== null}
                  className="text-[11px] font-semibold px-2 py-1 rounded border border-border hover:bg-muted disabled:opacity-50"
                >
                  {checking ? 'Checking…' : 'Run live check'}
                </button>
              </div>

              <div className="ml-6 text-[11px] font-mono">
                {!result && (
                  <span className="text-text-secondary">NOT TESTED</span>
                )}

                {result?.status === 'allow' && (
                  <span className="text-accent-teal">
                    ALLOWED · {result.reason}
                  </span>
                )}

                {result?.status === 'deny' && (
                  <span className="text-destructive">
                    DENIED · {result.reason}
                  </span>
                )}

                {result?.status === 'error' && (
                  <span className="text-destructive">
                    REQUEST ERROR · {result.message}
                  </span>
                )}

                {result?.requestId && (
                  <div className="mt-1 break-all text-text-secondary">
                    Request ID: {result.requestId}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
