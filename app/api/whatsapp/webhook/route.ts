import { NextResponse, type NextRequest } from "next/server";
import { processWhatsAppMessage } from "@/lib/agent/agent";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizePhoneNumber } from "@/lib/utils";
import { sendWhatsAppText } from "@/lib/whatsapp/client";
import { verifyWhatsAppSignature } from "@/lib/whatsapp/security";

export const runtime = "nodejs";

type WhatsAppMessage = {
  from?: string;
  id?: string;
  text?: { body?: string };
  timestamp?: string;
  type?: string;
};

type WhatsAppWebhookPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: WhatsAppMessage[];
      };
    }>;
  }>;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Webhook WhatsApp invalide." }, { status: 403 });
}

function extractMessages(payload: WhatsAppWebhookPayload) {
  const messages: WhatsAppMessage[] = [];
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      for (const message of change.value?.messages || []) {
        messages.push(message);
      }
    }
  }
  return messages;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWhatsAppSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature WhatsApp invalide." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  const messages = extractMessages(payload);
  const supabase = createSupabaseAdminClient();

  for (const message of messages) {
    if (message.type !== "text" || !message.from || !message.text?.body) continue;

    const phoneNumber = normalizePhoneNumber(message.from);
    const { data: connection } = await supabase
      .from("whatsapp_connections")
      .select("user_id,status")
      .eq("phone_number", phoneNumber)
      .eq("status", "active")
      .maybeSingle();

    if (!connection?.user_id) {
      await sendWhatsAppText(
        phoneNumber,
        "Ce numéro WhatsApp n’est pas encore connecté à un compte WhatsAgent."
      ).catch(() => null);
      continue;
    }

    await supabase.from("whatsapp_messages").insert({
      body: message.text.body,
      direction: "incoming",
      external_message_id: message.id,
      metadata: message,
      phone_number: phoneNumber,
      user_id: connection.user_id
    });

    const reply = await processWhatsAppMessage({
      phoneNumber,
      text: message.text.body,
      userId: connection.user_id
    });

    try {
      const sendResult = await sendWhatsAppText(phoneNumber, reply);
      await supabase.from("whatsapp_messages").insert({
        body: reply,
        direction: "outgoing",
        external_message_id: sendResult?.messages?.[0]?.id || null,
        metadata: sendResult,
        phone_number: phoneNumber,
        user_id: connection.user_id
      });
    } catch (error) {
      await supabase.from("action_logs").insert({
        action_type: "whatsapp_send",
        metadata: {
          error: error instanceof Error ? error.message : "Erreur inconnue",
          reply
        },
        status: "error",
        summary: "Échec d’envoi WhatsApp.",
        user_id: connection.user_id
      });
    }
  }

  return NextResponse.json({ received: true });
}
