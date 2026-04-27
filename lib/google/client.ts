import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { createGoogleOAuthClient } from "@/lib/google/oauth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getGoogleAuthClientForUser(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: connection, error } = await supabase
    .from("google_connections")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !connection?.refresh_token_ciphertext) {
    throw new Error("Compte Google non connecté.");
  }

  const oauth = createGoogleOAuthClient();
  oauth.setCredentials({
    access_token: decryptSecret(connection.access_token_ciphertext),
    refresh_token: decryptSecret(connection.refresh_token_ciphertext),
    expiry_date: connection.expires_at ? new Date(connection.expires_at).getTime() : undefined
  });

  oauth.on("tokens", async (tokens) => {
    const updates: Record<string, string | null> = {
      updated_at: new Date().toISOString()
    };
    if (tokens.access_token) updates.access_token_ciphertext = encryptSecret(tokens.access_token);
    if (tokens.refresh_token) updates.refresh_token_ciphertext = encryptSecret(tokens.refresh_token);
    if (tokens.expiry_date) updates.expires_at = new Date(tokens.expiry_date).toISOString();

    await supabase.from("google_connections").update(updates).eq("user_id", userId);
  });

  return oauth;
}
