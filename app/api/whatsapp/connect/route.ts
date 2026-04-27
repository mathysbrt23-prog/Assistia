import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { normalizePhoneNumber } from "@/lib/utils";

export const runtime = "nodejs";

const schema = z.object({
  phoneNumber: z.string().min(8).max(20)
});

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const body = schema.parse(await request.json());
    const phoneNumber = normalizePhoneNumber(body.phoneNumber);

    await supabase.from("whatsapp_connections").upsert(
      {
        user_id: user.id,
        phone_number: phoneNumber,
        status: "active",
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({ message: "Numéro WhatsApp connecté." });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Numéro WhatsApp invalide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Impossible de connecter WhatsApp." }, { status: 500 });
  }
}
