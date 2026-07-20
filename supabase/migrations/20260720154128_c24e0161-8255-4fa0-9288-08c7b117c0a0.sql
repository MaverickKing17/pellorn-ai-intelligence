
CREATE TABLE public.tenant_encryption_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  azure_tenant_id TEXT NOT NULL,
  azure_client_id TEXT NOT NULL,
  key_vault_url TEXT NOT NULL,
  encrypted_dek TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (tenant_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_encryption_configs TO authenticated;
GRANT ALL ON public.tenant_encryption_configs TO service_role;

ALTER TABLE public.tenant_encryption_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant admins manage their own encryption config"
ON public.tenant_encryption_configs
FOR ALL
TO authenticated
USING (auth.uid() = tenant_id)
WITH CHECK (auth.uid() = tenant_id);

CREATE TRIGGER trg_tenant_encryption_configs_updated_at
BEFORE UPDATE ON public.tenant_encryption_configs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
