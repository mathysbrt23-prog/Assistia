import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  source: z.string().max(80).optional(),
  extensionVersion: z.string().max(40).optional(),
  location: z.string().url().max(500).optional()
});

export async function POST(request: Request) {
  try {
    if (!request.headers.get("authorization")) {
      return unauthorizedResponse("Clé extension manquante.");
    }

    const { supabase, user, extensionId } = await requireApiUser(request);
    const body = schema.parse(await request.json().catch(() => ({})));

    if (extensionId) {
      await supabase
        .from("extension_installations")
        .update({
          extension_version: body.extensionVersion || undefined,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            last_source: body.source || null,
            last_location: body.location || null
          }
        })
        .eq("id", extensionId);
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse("Clé extension invalide ou manquante.");
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Ping extension invalide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Impossible de vérifier l’extension." }, { status: 500 });
  }
}
