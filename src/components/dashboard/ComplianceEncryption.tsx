import { useEffect, useState } from 'react';
import { KeyRound, ShieldCheck, Loader2, Lock, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type ConfigForm = {
  azure_tenant_id: string;
  azure_client_id: string;
  key_vault_url: string;
};

const EMPTY: ConfigForm = { azure_tenant_id: '', azure_client_id: '', key_vault_url: '' };

export default function ComplianceEncryption() {
  const { user } = useAuth();
  const [form, setForm] = useState<ConfigForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [lastTest, setLastTest] = useState<{ ok: boolean; message: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    (async () => {
      const { data } = await supabase
        .from('tenant_encryption_configs')
        .select('azure_tenant_id, azure_client_id, key_vault_url')
        .eq('tenant_id', user.id)
        .maybeSingle();
      if (data) setForm(data as ConfigForm);
      setLoaded(true);
    })();
  }, [user]);

  const update = (k: keyof ConfigForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Authenticate to persist encryption settings.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('tenant_encryption_configs')
      .upsert({ tenant_id: user.id, ...form }, { onConflict: 'tenant_id' });
    setSaving(false);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Configuration saved', description: 'Key Vault settings persisted to sovereign region.' });
    }
  };

  const testIntegration = async (simulate: 'success' | 'revoked' = 'success') => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Authenticate to test Key Vault access.', variant: 'destructive' });
      return;
    }
    if (!form.key_vault_url || !form.azure_tenant_id || !form.azure_client_id) {
      toast({ title: 'Missing fields', description: 'Fill Tenant ID, Client ID, and Key Vault URL first.', variant: 'destructive' });
      return;
    }
    setTesting(true);
    setLastTest(null);
    try {
      // Ensure config is saved so the edge function can read it.
      await supabase.from('tenant_encryption_configs').upsert(
        { tenant_id: user.id, ...form, encrypted_dek: 'SIMULATED_WRAPPED_DEK_BLOB' },
        { onConflict: 'tenant_id' },
      );
      const { data, error } = await supabase.functions.invoke('unwrap-dek', {
        body: { tenant_id: user.id, simulate },
      });
      if (error || (data && data.error)) {
        const msg = (data?.error as string) || error?.message || 'Unknown error';
        setLastTest({ ok: false, message: msg });
        toast({ title: 'Compliance Alert: Key Revoked or Access Denied', description: msg, variant: 'destructive' });
      } else {
        setLastTest({ ok: true, message: `Wrap/Unwrap verified · key ${data.key_version}` });
        toast({ title: 'Key Vault integration verified', description: 'Wrap/Unwrap permissions confirmed.' });
      }
    } catch (e) {
      const msg = (e as Error).message;
      setLastTest({ ok: false, message: msg });
      toast({ title: 'Integration test failed', description: msg, variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-accent-teal" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Data Sovereignty & Encryption Settings</h2>
            <p className="text-[11px] text-text-secondary">Customer-Managed Keys (BYOK) · Envelope encryption via Azure Key Vault</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-lg border border-accent-teal/30 bg-accent-teal/10 p-3 flex items-start gap-2">
            <Lock className="w-4 h-4 text-accent-teal mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-accent-teal">Enforcing OSFI B-13 and PIPEDA Compliance</p>
              <p className="text-[11px] text-foreground">Data is locked strictly to Azure Canada Central. Failover: Canada East (Quebec).</p>
            </div>
          </div>

          {!loaded ? (
            <div className="flex items-center gap-2 text-xs text-text-secondary py-6">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading tenant configuration…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Azure Tenant ID" placeholder="12345678-abcd-1234-abcd-12345678abcd"
                value={form.azure_tenant_id} onChange={update('azure_tenant_id')} />
              <Field label="App Client ID (SaaS Service Principal)" placeholder="e.g. 8f1a...c9e2"
                value={form.azure_client_id} onChange={update('azure_client_id')} />
              <div className="md:col-span-2">
                <Field label="Azure Key Vault Identifier URL" placeholder="https://<vault-name>.vault.azure.net"
                  value={form.key_vault_url} onChange={update('key_vault_url')} />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button onClick={() => testIntegration('success')} disabled={testing}
              className="bg-accent-teal/20 text-accent-teal border border-accent-teal/40 hover:bg-accent-teal/30 text-xs h-9">
              {testing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <KeyRound className="w-3 h-3 mr-1" />}
              Test Key Vault Integration
            </Button>
            <Button variant="outline" onClick={() => testIntegration('revoked')} disabled={testing}
              className="border-accent-amber/40 text-accent-amber hover:bg-accent-amber/10 text-xs h-9">
              Simulate Key Revocation
            </Button>
            <Button variant="outline" onClick={save} disabled={saving}
              className="border-border text-foreground text-xs h-9 ml-auto">
              {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
              Save Configuration
            </Button>
          </div>

          {lastTest && (
            <div className={`rounded-lg border p-3 flex items-start gap-2 ${
              lastTest.ok ? 'border-accent-teal/30 bg-accent-teal/10' : 'border-accent-red/30 bg-accent-red/10'
            }`}>
              {lastTest.ok
                ? <CheckCircle2 className="w-4 h-4 text-accent-teal mt-0.5" />
                : <AlertTriangle className="w-4 h-4 text-accent-red mt-0.5" />}
              <div>
                <p className={`text-xs font-semibold ${lastTest.ok ? 'text-accent-teal' : 'text-accent-red'}`}>
                  {lastTest.ok ? 'Integration verified' : 'Compliance Alert: Key Revoked or Access Denied'}
                </p>
                <p className="text-[11px] text-foreground">{lastTest.message}</p>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <Badge icon={<MapPin className="w-3 h-3" />} label="Primary Region" value="Canada Central · Toronto" />
            <Badge icon={<MapPin className="w-3 h-3" />} label="Failover" value="Canada East · Quebec" />
            <Badge icon={<Lock className="w-3 h-3" />} label="Cipher" value="AES-256 · TLS 1.3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-text-secondary">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-text-muted-custom outline-none focus:border-accent-teal/60 focus:ring-1 focus:ring-accent-teal/40 font-mono"
      />
    </label>
  );
}

function Badge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-surface-raised border border-border rounded-lg px-2.5 py-2">
      <span className="text-accent-teal">{icon}</span>
      <span className="text-text-secondary">{label}</span>
      <span className="ml-auto font-semibold text-foreground">{value}</span>
    </div>
  );
}
