import type { CalendarMoveProposal } from "@/lib/google/calendar";
import { getOpenAI, getOpenAIModel } from "@/lib/openai";
import { getPlan, isActiveSubscriptionStatus } from "@/lib/plans";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { compactText } from "@/lib/utils";
import { agentTools } from "./tools";

type IntentName =
  | "today_calendar"
  | "afternoon_calendar"
  | "summarize_today_emails"
  | "important_emails"
  | "move_calendar"
  | "draft_email_reply"
  | "daily_briefing"
  | "unknown";

type AgentIntent = {
  intent: IntentName;
  eventQuery?: string | null;
  targetStartIso?: string | null;
  emailFrom?: string | null;
  emailSubject?: string | null;
  emailQuery?: string | null;
  replyInstruction?: string | null;
};

type AgentInput = {
  userId: string;
  phoneNumber: string;
  text: string;
};

type PendingConfirmation = {
  id: string;
  action_type: string;
  payload: unknown;
  summary: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function normalizeOui(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

async function getProfile(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users_profiles")
    .select("timezone,require_confirmations")
    .eq("id", userId)
    .maybeSingle();

  return {
    requireConfirmations: data?.require_confirmations ?? true,
    timezone: data?.timezone || "Europe/Paris"
  };
}

async function checkSubscriptionAndQuota(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!isActiveSubscriptionStatus(subscription?.status)) {
    return {
      ok: false,
      reason:
        "Ton abonnement WhatsAgent n’est pas actif. Connecte-toi au dashboard pour choisir un plan Stripe."
    };
  }

  const plan = getPlan(subscription?.plan);
  if (!plan) {
    return {
      ok: false,
      reason: "Ton plan WhatsAgent n’est pas reconnu. Mets à jour ton abonnement depuis le dashboard."
    };
  }

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const { count } = await supabase
    .from("whatsapp_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  if ((count || 0) >= plan.monthlyMessages) {
    return {
      ok: false,
      reason: `Tu as atteint la limite de ${plan.monthlyMessages} messages WhatsApp de ton plan ${plan.name}.`
    };
  }

  return { ok: true, plan };
}

async function createAgentRequest(userId: string, input: string) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("agent_requests")
    .insert({
      channel: "whatsapp",
      input,
      status: "processing",
      user_id: userId
    })
    .select("id")
    .single();

  return data?.id as string | undefined;
}

async function updateAgentRequest(
  requestId: string | undefined,
  updates: Record<string, unknown>
) {
  if (!requestId) return;
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("agent_requests")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", requestId);
}

function heuristicIntent(text: string): AgentIntent {
  const lower = text.toLowerCase();
  if (lower.includes("après-midi") || lower.includes("cet aprem")) {
    return { intent: "afternoon_calendar" };
  }
  if (lower.includes("planning") || lower.includes("journée")) {
    return { intent: "daily_briefing" };
  }
  if (lower.includes("quoi aujourd") || lower.includes("agenda")) {
    return { intent: "today_calendar" };
  }
  if (lower.includes("important") && lower.includes("mail")) {
    return { intent: "important_emails" };
  }
  if (lower.includes("résume") && lower.includes("mail")) {
    return { intent: "summarize_today_emails" };
  }
  if ((lower.includes("décale") || lower.includes("deplace")) && lower.includes("rendez")) {
    return { intent: "move_calendar", eventQuery: text };
  }
  if (lower.includes("réponse") || lower.includes("repond")) {
    return { intent: "draft_email_reply", emailQuery: text };
  }
  return { intent: "unknown" };
}

async function classifyIntent(text: string, timezone: string): Promise<AgentIntent> {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: getOpenAIModel(),
      response_format: { type: "json_object" },
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `Tu classes les demandes WhatsApp pour WhatsAgent.
Réponds uniquement en JSON valide.
Intentions possibles: today_calendar, afternoon_calendar, summarize_today_emails, important_emails, move_calendar, draft_email_reply, daily_briefing, unknown.
Pour move_calendar, extrais eventQuery et targetStartIso. Convertis les dates relatives en ISO 8601 avec fuseau.
Pour draft_email_reply, extrais emailFrom, emailSubject, emailQuery et replyInstruction si disponibles.
Date courante: ${new Date().toISOString()}
Fuseau utilisateur: ${timezone}`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content) as Partial<AgentIntent>;
    return {
      ...parsed,
      intent: parsed.intent || "unknown"
    } as AgentIntent;
  } catch {
    return heuristicIntent(text);
  }
}

async function getPendingConfirmation(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("pending_confirmations")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

async function cancelPendingConfirmation(userId: string, confirmationId: string) {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("pending_confirmations")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", confirmationId)
    .eq("user_id", userId);
  return "Action annulée. Rien n’a été modifié.";
}

async function executePendingConfirmation(userId: string, confirmation: PendingConfirmation) {
  const supabase = createSupabaseAdminClient();

  if (confirmation.action_type === "calendar_move") {
    const proposal = confirmation.payload as CalendarMoveProposal;
    const event = await agentTools.confirmCalendarMove(userId, proposal);
    const summary = `Rendez-vous "${event.summary}" déplacé au ${formatDate(event.startIso)}.`;

    await supabase
      .from("pending_confirmations")
      .update({
        confirmed_at: new Date().toISOString(),
        status: "confirmed",
        updated_at: new Date().toISOString()
      })
      .eq("id", confirmation.id);

    await supabase.from("action_logs").insert({
      action_type: "calendar_move",
      metadata: { event, proposal },
      status: "success",
      summary,
      user_id: userId
    });

    return `Confirmé. ${summary}`;
  }

  await supabase
    .from("pending_confirmations")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", confirmation.id);

  return "Cette confirmation n’est plus exécutable. Aucune action n’a été réalisée.";
}

async function createCalendarMoveConfirmation(userId: string, proposal: CalendarMoveProposal) {
  const supabase = createSupabaseAdminClient();
  const summary = `Déplacer "${proposal.eventSummary}" du ${formatDate(
    proposal.oldStartIso
  )} au ${formatDate(proposal.newStartIso)}.`;

  await supabase.from("pending_confirmations").insert({
    action_type: "calendar_move",
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    payload: proposal,
    status: "pending",
    summary,
    user_id: userId
  });

  return `${summary}\n\nConfirmer ? Réponds OUI pour valider.`;
}

async function handleIntent(userId: string, intent: AgentIntent, timezone: string) {
  switch (intent.intent) {
    case "today_calendar": {
      const events = await agentTools.getTodayCalendarEvents(userId, timezone);
      return `Voici ton agenda aujourd’hui :\n${agentTools.formatCalendarEvents(events)}`;
    }
    case "afternoon_calendar": {
      const events = await agentTools.getAfternoonCalendarEvents(userId, timezone);
      return events.length
        ? `Oui, tu as ces rendez-vous cet après-midi :\n${agentTools.formatCalendarEvents(events)}`
        : "Tu n’as aucun rendez-vous cet après-midi.";
    }
    case "summarize_today_emails":
      return await agentTools.summarizeTodayEmails(userId);
    case "important_emails":
      return await agentTools.summarizeImportantEmails(userId);
    case "daily_briefing": {
      const [events, emailSummary] = await Promise.all([
        agentTools.getTodayCalendarEvents(userId, timezone),
        agentTools.summarizeTodayEmails(userId)
      ]);
      return `Synthèse de ta journée :\n\nAgenda:\n${agentTools.formatCalendarEvents(
        events
      )}\n\nEmails:\n${emailSummary}`;
    }
    case "draft_email_reply": {
      if (!intent.emailFrom && !intent.emailSubject && !intent.emailQuery) {
        return "Dis-moi quel email viser : expéditeur, sujet ou quelques mots du contenu.";
      }
      const emails = await agentTools.searchEmails(userId, {
        from: intent.emailFrom,
        maxResults: 3,
        query: intent.emailQuery,
        subject: intent.emailSubject
      });
      const email = emails[0];
      if (!email) return "Je n’ai pas trouvé d’email correspondant.";
      const draft = await agentTools.draftEmailReply(email, intent.replyInstruction || undefined);
      return `Brouillon préparé pour "${email.subject}" de ${email.from} :\n\n${draft}\n\nJe ne l’ai pas envoyé.`;
    }
    case "move_calendar": {
      if (!intent.eventQuery || !intent.targetStartIso) {
        return "Je peux le faire, mais il me manque le nom du rendez-vous ou le nouvel horaire.";
      }
      const event = await agentTools.findCalendarEvent(userId, intent.eventQuery, timezone);
      if (!event) return `Je n’ai pas trouvé de rendez-vous correspondant à "${intent.eventQuery}".`;
      const proposal = agentTools.proposeCalendarMove(event, intent.targetStartIso);
      return await createCalendarMoveConfirmation(userId, proposal);
    }
    default:
      return "Je peux consulter ton agenda, résumer tes emails, préparer une réponse ou proposer de décaler un rendez-vous.";
  }
}

export async function processWhatsAppMessage({ userId, text }: AgentInput): Promise<string> {
  const requestId = await createAgentRequest(userId, text);

  try {
    const normalized = normalizeOui(text);
    const pending = await getPendingConfirmation(userId);
    if (pending) {
      let reply: string;
      if (normalized === "oui") {
        reply = await executePendingConfirmation(userId, pending);
      } else if (["non", "annule", "annuler", "cancel"].includes(normalized)) {
        reply = await cancelPendingConfirmation(userId, pending.id);
      } else {
        reply = `${pending.summary}\n\nConfirmer ? Réponds OUI pour valider, ou NON pour annuler.`;
      }

      await updateAgentRequest(requestId, {
        intent: "confirmation",
        output: reply,
        status: "completed"
      });
      return reply;
    }

    const access = await checkSubscriptionAndQuota(userId);
    if (!access.ok) {
      const reason = access.reason || "Ton accès WhatsAgent est bloqué.";
      await updateAgentRequest(requestId, {
        intent: "subscription_blocked",
        output: reason,
        status: "blocked"
      });
      return reason;
    }

    const profile = await getProfile(userId);
    const intent = await classifyIntent(text, profile.timezone);
    const reply = await handleIntent(userId, intent, profile.timezone);

    await updateAgentRequest(requestId, {
      intent: intent.intent,
      output: compactText(reply, 2000),
      status: "completed"
    });

    return reply;
  } catch (error) {
    const message =
      error instanceof Error
        ? `Je n’ai pas pu traiter ta demande : ${error.message}`
        : "Je n’ai pas pu traiter ta demande.";
    await updateAgentRequest(requestId, {
      output: message,
      status: "error"
    });
    return message;
  }
}
