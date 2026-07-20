// Envelope encryption simulation for tenant CMK/BYOK unwrap flow.
// Simulates calling the tenant's Azure Key Vault to unwrap a Data Encryption Key (DEK).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface UnwrapRequest {
  tenant_id: string;
  // Optional: simulate a revoked key path for demos.
  simulate?: "success" | "revoked" | "forbidden";
}

async function simulateKeyVaultUnwrap(keyVaultUrl: string, encryptedDek: string, simulate?: string) {
  // In production this would call Azure Key Vault's /keys/{name}/unwrapKey endpoint
  // using an OAuth token acquired via the tenant's App Client ID.
  if (simulate === "revoked" || simulate === "forbidden") {
    const err: Error & { status?: number } = new Error("403 Forbidden — key access denied by tenant policy");
    err.status = 403;
    throw err;
  }
  if (!keyVaultUrl.startsWith("https://") || !encryptedDek) {
    const err: Error & { status?: number } = new Error("Invalid Key Vault URL or missing DEK blob");
    err.status = 400;
    throw err;
  }
  // Simulated 128-bit plaintext DEK.
  return { plaintext_dek: "SIMULATED_DEK_" + crypto.randomUUID(), key_version: "v1" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tenant_id, simulate }: UnwrapRequest = await req.json();
    if (!tenant_id) {
      return new Response(JSON.stringify({ error: "tenant_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: config, error: dbErr } = await supabase
      .from("tenant_encryption_configs")
      .select("key_vault_url, encrypted_dek, azure_client_id")
      .eq("tenant_id", tenant_id)
      .maybeSingle();

    if (dbErr) throw dbErr;
    if (!config) {
      return new Response(
        JSON.stringify({ error: "No encryption config found for tenant" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    try {
      const unwrapped = await simulateKeyVaultUnwrap(
        config.key_vault_url,
        config.encrypted_dek ?? "",
        simulate,
      );
      return new Response(
        JSON.stringify({ status: "ok", key_vault_url: config.key_vault_url, ...unwrapped }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 403) {
        return new Response(
          JSON.stringify({
            error: "Access Denied: Enterprise encryption key is unavailable or has been revoked by the client.",
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: err.message ?? "Unwrap failed" }),
        { status: err.status ?? 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message ?? "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
