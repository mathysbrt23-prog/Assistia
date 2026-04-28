import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, hashExtensionToken, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";

export const runtime = "nodejs";

const schema = z.object({
  browser: z.string().max(40).optional().default("chrome"),
  extensionVersion: z.string().max(40).optional().default("local"),
  label: z.string().max(80).optional().default("Chrome local")
});

function createExtensionToken() {
  return `asstia_${randomBytes(32).toString("base64url")}`;
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const body = schema.parse(await request.json().catch(() => ({})));
    const token = createExtensionToken();
    const tokenHash = hashExtensionToken(token);
    const tokenPrefix = token.slice(0, 14);

    const { data, error } = await supabase
      .from("extension_installations")
      .insert({
        user_id: user.id,
        browser: body.browser,
        extension_version: body.extensionVersion,
        label: body.label,
        token_prefix: tokenPrefix,
        install_token_hash: tokenHash,
        last_seen_at: new Date().toISOString(),
        metadata: {
          created_from: "dashboard"
        }
      })
      .select("id,token_prefix,last_seen_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Impossible de créer la clé extension." }, { status: 500 });
    }

    return NextResponse.json({
      token,
      appUrl: absoluteUrl("/").replace(/\/$/, ""),
      installation: data
    });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Impossible de créer la clé extension." }, { status: 500 });
  }
}
