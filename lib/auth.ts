import { NextResponse } from "next/server";
import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class ApiAuthError extends Error {
  status = 401;
}

type ApiUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

type ApiAuthContext = {
  supabase: SupabaseClient;
  user: ApiUser;
  authMethod: "cookie" | "extension";
  extensionId?: string;
};

export function hashExtensionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getBearerToken(request?: Request) {
  const authorization = request?.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length).trim();
}

export async function getUserOrNull() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { supabase, user };
}

async function requireExtensionUser(token: string): Promise<ApiAuthContext> {
  const supabase = createSupabaseAdminClient();
  const tokenHash = hashExtensionToken(token);
  const { data, error } = await supabase
    .from("extension_installations")
    .select("id,user_id")
    .eq("install_token_hash", tokenHash)
    .is("revoked_at", null)
    .maybeSingle();

  if (error || !data?.user_id) {
    throw new ApiAuthError("Clé extension invalide.");
  }

  await supabase
    .from("extension_installations")
    .update({ last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    supabase,
    user: { id: data.user_id },
    authMethod: "extension",
    extensionId: data.id
  };
}

export async function requireApiUser(request?: Request): Promise<ApiAuthContext> {
  const bearerToken = getBearerToken(request);
  if (bearerToken) {
    return requireExtensionUser(bearerToken);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ApiAuthError("Utilisateur non authentifié.");
  }

  return { supabase, user, authMethod: "cookie" };
}

export function unauthorizedResponse(message = "Connexion requise.") {
  return NextResponse.json({ error: message }, { status: 401 });
}
