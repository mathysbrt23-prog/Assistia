import { google, type gmail_v1 } from "googleapis";
import { compactText } from "@/lib/utils";
import { getGoogleAuthClientForUser } from "@/lib/google/client";
import { getOpenAI, getOpenAIModel } from "@/lib/openai";

export type GmailEmail = {
  id: string;
  threadId?: string | null;
  from: string;
  subject: string;
  date: string;
  snippet: string;
};

function gmailDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function getHeader(headers: Array<{ name?: string | null; value?: string | null }> = [], name: string) {
  return headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value || "";
}

function normalizeEmail(message: gmail_v1.Schema$Message): GmailEmail {
  const headers = message.payload?.headers || [];
  return {
    id: message.id || "",
    threadId: message.threadId,
    from: getHeader(headers, "From") || "Expéditeur inconnu",
    subject: getHeader(headers, "Subject") || "(Sans objet)",
    date: getHeader(headers, "Date") || "",
    snippet: message.snippet || ""
  };
}

async function listEmails(userId: string, q: string, maxResults = 10) {
  const auth = await getGoogleAuthClientForUser(userId);
  const gmail = google.gmail({ version: "v1", auth });
  const list = await gmail.users.messages.list({
    maxResults,
    q,
    userId: "me"
  });

  const messages = list.data.messages || [];
  const details = await Promise.all(
    messages.map((message) =>
      gmail.users.messages.get({
        format: "metadata",
        id: message.id || "",
        metadataHeaders: ["From", "Subject", "Date"],
        userId: "me"
      })
    )
  );

  return details.map((detail) => normalizeEmail(detail.data));
}

async function summarizeEmails(emails: GmailEmail[], instruction: string) {
  if (!emails.length) return "Aucun email trouvé pour cette demande.";

  const source = emails
    .map(
      (email, index) =>
        `${index + 1}. De: ${email.from}\nSujet: ${email.subject}\nExtrait: ${email.snippet}`
    )
    .join("\n\n");

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: getOpenAIModel(),
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Tu es l'assistant WhatsAgent. Réponds en français, brièvement, avec les points importants et les prochaines actions utiles."
        },
        {
          role: "user",
          content: `${instruction}\n\nEmails:\n${source}`
        }
      ]
    });
    return completion.choices[0]?.message?.content?.trim() || "Résumé indisponible.";
  } catch {
    return emails
      .slice(0, 5)
      .map((email) => `• ${email.subject} — ${compactText(email.snippet, 120)}`)
      .join("\n");
  }
}

export async function getTodayEmails(userId: string) {
  return listEmails(userId, `in:inbox after:${gmailDate()}`, 15);
}

export async function getUnreadEmails(userId: string) {
  return listEmails(userId, "in:inbox is:unread newer_than:14d", 15);
}

export async function summarizeTodayEmails(userId: string) {
  const emails = await getTodayEmails(userId);
  return summarizeEmails(emails, "Résume les emails reçus aujourd'hui.");
}

export async function summarizeImportantEmails(userId: string) {
  const emails = await listEmails(userId, "in:inbox is:important newer_than:14d", 10);
  return summarizeEmails(emails, "Résume les emails importants et indique ce qui mérite une réponse.");
}

export async function searchEmails(
  userId: string,
  filters: { from?: string | null; subject?: string | null; query?: string | null; maxResults?: number }
) {
  const queryParts = ["in:inbox"];
  if (filters.from) queryParts.push(`from:${filters.from}`);
  if (filters.subject) queryParts.push(`subject:(${filters.subject})`);
  if (filters.query) queryParts.push(filters.query);
  return listEmails(userId, queryParts.join(" "), filters.maxResults || 10);
}

export async function draftEmailReply(
  email: GmailEmail,
  instruction = "Prépare une réponse professionnelle et concise."
) {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: getOpenAIModel(),
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Tu rédiges des brouillons d'emails en français. N'ajoute pas de promesse d'envoi, seulement le brouillon."
        },
        {
          role: "user",
          content: `Instruction: ${instruction}\n\nEmail source:\nDe: ${email.from}\nSujet: ${email.subject}\nExtrait: ${email.snippet}`
        }
      ]
    });
    return completion.choices[0]?.message?.content?.trim() || "Brouillon indisponible.";
  } catch {
    return `Bonjour,\n\nMerci pour ton message. Je reviens vers toi rapidement avec une réponse complète.\n\nBonne journée`;
  }
}
