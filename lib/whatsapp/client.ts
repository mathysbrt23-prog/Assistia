export async function sendWhatsAppText(to: string, body: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION || "v20.0";

  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp Business Cloud API non configurée.");
  }

  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      text: {
        body
      },
      to,
      type: "text"
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Erreur d'envoi WhatsApp.");
  }

  return payload;
}
