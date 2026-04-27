import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  requireConfirmations: z.boolean(),
  dataRetentionDays: z.union([z.literal(30), z.literal(90), z.literal(180), z.literal(365)])
});

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const body = schema.parse(await request.json());

    await supabase
      .from("users_profiles")
      .update({
        require_confirmations: body.requireConfirmations,
        data_retention_days: body.dataRetentionDays,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    return NextResponse.json({ message: "Réglages sauvegardés." });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Réglages invalides." }, { status: 400 });
    }
    return NextResponse.json({ error: "Impossible de sauvegarder les réglages." }, { status: 500 });
  }
}
