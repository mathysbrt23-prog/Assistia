import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { encryptSecret } from "@/lib/crypto";
import { createGoogleOAuthClient, scopeIncludes } from "@/lib/google/oauth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireApiUser();
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const expectedState = cookieStore.get("google_oauth_state")?.value;

    if (!code || !state || !expectedState || state !== expectedState) {
      return NextResponse.redirect(absoluteUrl("/dashboard?google=invalid_state"));
    }

    const oauth = createGoogleOAuthClient();
    const { tokens } = await oauth.getToken(code);
    const admin = createSupabaseAdminClient();
    const { data: existing } = await admin
      .from("google_connections")
      .select("refresh_token_ciphertext")
      .eq("user_id", user.id)
      .maybeSingle();

    const scope = tokens.scope || "";
    const refreshTokenCiphertext = tokens.refresh_token
      ? encryptSecret(tokens.refresh_token)
      : existing?.refresh_token_ciphertext || null;

    await admin.from("google_connections").upsert(
      {
        user_id: user.id,
        google_email: tokens.id_token ? null : user.email,
        access_token_ciphertext: tokens.access_token ? encryptSecret(tokens.access_token) : null,
        refresh_token_ciphertext: refreshTokenCiphertext,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        scopes: scope,
        gmail_connected: scopeIncludes(scope, "https://www.googleapis.com/auth/gmail.readonly"),
        calendar_connected:
          scopeIncludes(scope, "https://www.googleapis.com/auth/calendar.readonly") ||
          scopeIncludes(scope, "https://www.googleapis.com/auth/calendar.events"),
        last_connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );

    cookieStore.delete("google_oauth_state");
    return NextResponse.redirect(absoluteUrl("/dashboard?google=connected"));
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    return NextResponse.redirect(absoluteUrl("/dashboard?google=error"));
  }
}
