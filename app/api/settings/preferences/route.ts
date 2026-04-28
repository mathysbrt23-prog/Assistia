import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  defaultTone: z.enum(["professionnel", "court", "chaleureux", "ferme", "commercial"]),
  defaultLanguage: z.enum(["fr", "en", "es"]),
  dataRetentionDays: z.union([z.literal(30), z.literal(90), z.literal(180), z.literal(365)])
});

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const body = schema.parse(await request.json());

    await supabase
      .from("users_profiles")
      .update({
        default_tone: body.defaultTone,
        default_language: body.defaultLanguage,
        data_retention_days: body.dataRetentionDays,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    return NextResponse.json({ message: "Préférences sauvegardées." });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Préférences invalides." }, { status: 400 });
    }
    return NextResponse.json({ error: "Impossible de sauvegarder les préférences." }, { status: 500 });
  }
}
