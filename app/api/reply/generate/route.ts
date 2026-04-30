import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { getOpenAI, getOpenAIModel } from "@/lib/openai";
import {
  getEffectivePlan,
  isActiveSubscriptionStatus,
  nextQuotaResetIso,
  rollingQuotaWindowStartIso
} from "@/lib/plans";
import { compactText } from "@/lib/utils";

export const runtime = "nodejs";

const schema = z.object({
  mode: z.enum(["generate", "rewrite"]).default("generate"),
  source: z.enum(["gmail", "whatsapp_web", "linkedin", "outlook_web", "manual"]).default("manual"),
  context: z.string().max(6000).optional().default(""),
  instruction: z.string().min(2).max(1800),
  draft: z.string().max(3000).optional().default(""),
  tone: z.enum(["professionnel", "court", "chaleureux", "ferme", "commercial"]).optional(),
  language: z.enum(["fr", "en", "es"]).optional()
});

function buildPrompt(input: z.infer<typeof schema>, tone: string, language: string) {
  const languageLabel = language === "en" ? "anglais" : language === "es" ? "espagnol" : "français";
  const sourceLabel = {
    gmail: "Gmail",
    whatsapp_web: "WhatsApp Web",
    linkedin: "LinkedIn",
    outlook_web: "Outlook Web",
    manual: "un champ texte"
  }[input.source];

  return [
    `Langue de sortie : ${languageLabel}.`,
    `Ton demandé : ${tone}.`,
    `Contexte : ${sourceLabel}.`,
    input.context ? `Message ou contexte visible :\n${input.context}` : null,
    input.draft ? `Brouillon actuel :\n${input.draft}` : null,
    `Instruction utilisateur :\n${input.instruction}`,
    "",
    input.mode === "rewrite"
      ? "Reformule le brouillon ou l'intention en réponse professionnelle prête à envoyer."
      : "Génère une réponse professionnelle prête à envoyer.",
    "Contraintes : réponse naturelle, concrète, pas de formule excessive, pas de markdown, pas de commentaire autour du texte."
  ]
    .filter(Boolean)
    .join("\n\n");
}

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function buildFallbackReply(input: z.infer<typeof schema>, tone: string) {
  const context = compactText(input.context || "votre message", 220);
  const instruction = compactText(input.instruction, 220);
  const opener = tone === "court" ? "Bonjour," : "Bonjour,\n\nMerci pour votre message.";
  const body =
    tone === "ferme"
      ? "Je comprends votre point, mais je souhaite garder un cadre clair pour avancer efficacement."
      : tone === "chaleureux"
        ? "Je comprends tout à fait votre retour et je serais ravi d’échanger pour trouver la meilleure façon d’avancer."
        : "Je comprends votre point et je pense que nous pouvons clarifier les prochaines étapes simplement.";

  return [
    opener,
    "",
    body,
    "",
    `Sur la base de votre demande : “${instruction}”, je vous propose que nous échangions afin d’ajuster la suite en fonction du contexte suivant : “${context}”.`,
    "",
    "Bien à vous,"
  ].join("\n");
}

async function createReply(body: z.infer<typeof schema>, tone: string, language: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      reply: buildFallbackReply(body, tone),
      model: "local-demo"
    };
  }

  const completion = await getOpenAI().chat.completions.create({
    model: getOpenAIModel(),
    messages: [
      {
        role: "system",
        content:
          "Tu es Assistia Reply. Tu aides à écrire des réponses professionnelles, naturelles et utiles. Tu ne prétends jamais avoir envoyé un message. Tu produis uniquement le texte du brouillon."
      },
      {
        role: "user",
        content: buildPrompt(body, tone, language)
      }
    ],
    temperature: 0.45,
    max_tokens: 450
  });

  return {
    reply: completion.choices[0]?.message?.content?.trim() || "",
    model: getOpenAIModel()
  };
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const supabaseConfigured = hasSupabaseConfig();

    if (!supabaseConfigured) {
      const tone = body.tone || "professionnel";
      const language = body.language || "fr";
      const { reply, model } = await createReply(body, tone, language);

      if (!reply) {
        return NextResponse.json({ error: "Aucune réponse générée." }, { status: 502 });
      }

      return NextResponse.json({
        id: "local-demo",
        reply,
        usage: {
          used: 1,
          limit: 3,
          remaining: 2,
          resetAt: nextQuotaResetIso(),
          window: "24h"
        },
        metadata: {
          model,
          mode: "local-demo"
        }
      });
    }

    const { supabase, user, authMethod, extensionId } = await requireApiUser(request);
    const quotaWindowStart = rollingQuotaWindowStartIso();

    const [{ data: profile }, { data: subscription }, usageResult, oldestUsageResult] = await Promise.all([
      supabase
        .from("users_profiles")
        .select("default_tone,default_language")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("subscriptions")
        .select("plan,status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("reply_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", quotaWindowStart),
      supabase
        .from("reply_requests")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", quotaWindowStart)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()
    ]);

    const active = isActiveSubscriptionStatus(subscription?.status as string | null | undefined);
    const plan = getEffectivePlan(subscription?.plan as string | null | undefined, active);
    const used = usageResult.count || 0;
    const resetAt = nextQuotaResetIso(oldestUsageResult.data?.created_at as string | null | undefined);

    if (used >= plan.dailyReplies) {
      return NextResponse.json(
        {
          error: `Quota atteint : ${plan.dailyReplies} réponses disponibles sur 24h avec le plan ${plan.name}.`,
          usage: {
            used,
            limit: plan.dailyReplies,
            remaining: 0,
            resetAt,
            window: "24h"
          }
        },
        { status: 402 }
      );
    }

    const tone = body.tone || String(profile?.default_tone || "professionnel");
    const language = body.language || String(profile?.default_language || "fr");

    const { reply, model } = await createReply(body, tone, language);
    if (!reply) {
      return NextResponse.json({ error: "Aucune réponse générée." }, { status: 502 });
    }

    const { data: requestRow } = await supabase
      .from("reply_requests")
      .insert({
        user_id: user.id,
        source: body.source,
        mode: body.mode,
        tone,
        language,
        context_preview: compactText(body.context || body.draft || "", 500),
        instruction: body.instruction,
        generated_reply: reply,
        status: "completed",
        metadata: {
          auth_method: authMethod,
          extension_id: extensionId || null,
          plan: plan.id,
          model
        }
      })
      .select("id")
      .single();

    await supabase.from("usage_events").insert({
      user_id: user.id,
      event_type: "reply_generated",
      quantity: 1,
      metadata: {
        request_id: requestRow?.id || null,
        source: body.source,
        mode: body.mode,
        tone,
        language
      }
    });

    return NextResponse.json({
      id: requestRow?.id || null,
      reply,
      usage: {
        used: used + 1,
        limit: plan.dailyReplies,
        remaining: Math.max(0, plan.dailyReplies - used - 1),
        resetAt,
        window: "24h"
      }
    });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Impossible de générer la réponse." }, { status: 500 });
  }
}
