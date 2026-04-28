import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { getOpenAI, getOpenAIModel } from "@/lib/openai";
import { getEffectivePlan, isActiveSubscriptionStatus } from "@/lib/plans";
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

function monthStartIso() {
  const now = new Date();
  now.setUTCDate(1);
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
}

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

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const body = schema.parse(await request.json());

    const [{ data: profile }, { data: subscription }, usageResult] = await Promise.all([
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
        .gte("created_at", monthStartIso())
    ]);

    const active = isActiveSubscriptionStatus(subscription?.status as string | null | undefined);
    const plan = getEffectivePlan(subscription?.plan as string | null | undefined, active);
    const used = usageResult.count || 0;

    if (used >= plan.monthlyReplies) {
      return NextResponse.json(
        {
          error: `Limite atteinte : ${plan.monthlyReplies} réponses incluses dans le plan ${plan.name}.`
        },
        { status: 402 }
      );
    }

    const tone = body.tone || String(profile?.default_tone || "professionnel");
    const language = body.language || String(profile?.default_language || "fr");

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

    const reply = completion.choices[0]?.message?.content?.trim();
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
          plan: plan.id,
          model: getOpenAIModel()
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
        limit: plan.monthlyReplies,
        remaining: Math.max(0, plan.monthlyReplies - used - 1)
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
