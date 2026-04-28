import { redirect } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Chrome,
  CreditCard,
  History,
  KeyRound,
  MessageSquareText,
  PenLine,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import {
  ReplyPreferencesForm,
  SignOutButton,
  StripePlanButtons
} from "@/components/dashboard/dashboard-actions";
import { getEffectivePlan, getPlan, isActiveSubscriptionStatus } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { compactText, formatDateTime } from "@/lib/utils";

type DashboardRow = Record<string, string | number | boolean | null | undefined>;

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : null;
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
        ok ? "bg-mint text-moss" : "bg-amber/20 text-[#7a5200]"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

function Panel({
  children,
  title,
  icon: Icon
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ElementType;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-mint text-moss">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("users_profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null
  });

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [
    profileResult,
    subscriptionResult,
    usageResult,
    recentRepliesResult,
    extensionResult,
    logsResult
  ] = await Promise.all([
    supabase.from("users_profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("reply_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString()),
    supabase
      .from("reply_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("extension_installations")
      .select("*")
      .eq("user_id", user.id)
      .order("last_seen_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("usage_events")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  const profile = profileResult.data as DashboardRow | null;
  const subscription = subscriptionResult.data as DashboardRow | null;
  const recentReplies = (recentRepliesResult.data || []) as DashboardRow[];
  const usageEvents = (logsResult.data || []) as DashboardRow[];
  const extension = extensionResult.data as DashboardRow | null;
  const subscriptionPlan = asString(subscription?.plan);
  const subscriptionStatus = asString(subscription?.status);
  const hasActiveSubscription = isActiveSubscriptionStatus(subscriptionStatus);
  const plan = getEffectivePlan(subscriptionPlan, hasActiveSubscription);
  const paidPlan = getPlan(subscriptionPlan);
  const usageCount = usageResult.count || 0;
  const remaining = Math.max(0, plan.monthlyReplies - usageCount);

  return (
    <main className="min-h-screen bg-fog text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-moss">Assistia Reply</p>
            <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid content-start gap-5">
          <Panel icon={KeyRound} title="Abonnement">
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-600">Plan actuel</p>
                  <p className="text-xl font-bold">{hasActiveSubscription ? paidPlan?.name || plan.name : "Free"}</p>
                </div>
                <StatusPill ok={hasActiveSubscription} label={hasActiveSubscription ? "Payant actif" : "Gratuit"} />
              </div>
              {asString(subscription?.current_period_end) ? (
                <p className="text-sm text-zinc-600">
                  Renouvellement : {formatDateTime(asString(subscription?.current_period_end))}
                </p>
              ) : null}
              <StripePlanButtons currentPlan={subscriptionPlan} />
            </div>
          </Panel>

          <Panel icon={Sparkles} title="Préférences de réponse">
            <ReplyPreferencesForm
              dataRetentionDays={asNumber(profile?.data_retention_days)}
              defaultLanguage={asString(profile?.default_language)}
              defaultTone={asString(profile?.default_tone)}
            />
          </Panel>
        </div>

        <div className="grid gap-5">
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <MessageSquareText className="h-6 w-6 text-moss" />
              <p className="mt-4 text-sm text-zinc-600">Réponses ce mois-ci</p>
              <p className="mt-1 text-2xl font-bold">
                {usageCount} / {plan.monthlyReplies}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <CreditCard className="h-6 w-6 text-moss" />
              <p className="mt-4 text-sm text-zinc-600">Réponses restantes</p>
              <p className="mt-1 text-2xl font-bold">{remaining}</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <Chrome className="h-6 w-6 text-moss" />
              <p className="mt-4 text-sm text-zinc-600">Extension Chrome</p>
              <StatusPill ok={Boolean(extension)} label={extension ? "Vue récemment" : "À installer"} />
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel icon={Chrome} title="Installer l’extension">
              <div className="grid gap-3 text-sm leading-6 text-zinc-600">
                <p>
                  Le MVP d’Assistia Reply démarre comme une extension Chrome qui ajoute un bouton
                  Assistia dans Gmail, puis WhatsApp Web.
                </p>
                <ol className="grid gap-2">
                  <li>1. Installer l’extension locale depuis le dossier `extension/`.</li>
                  <li>2. Se connecter avec ce compte Assistia.</li>
                  <li>3. Générer ou reformuler un brouillon sans auto-send.</li>
                </ol>
                {extension?.last_seen_at ? (
                  <p>Dernière activité extension : {formatDateTime(asString(extension.last_seen_at))}</p>
                ) : null}
              </div>
            </Panel>

            <Panel icon={ShieldCheck} title="Sécurité">
              <div className="grid gap-3 text-sm leading-6 text-zinc-600">
                <p>Assistia ne doit jamais envoyer un message à ta place.</p>
                <p>
                  Les historiques stockent un aperçu court et les métadonnées utiles. Le contenu
                  complet des conversations n’a pas vocation à être conservé.
                </p>
              </div>
            </Panel>
          </div>

          <Panel icon={History} title="Historique des réponses">
            <div className="grid gap-3">
              {recentReplies.length ? (
                recentReplies.map((reply, index) => (
                  <div className="rounded-md border border-line bg-fog p-3 text-sm" key={asString(reply.id) || index}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-bold">{asString(reply.mode) === "rewrite" ? "Reformulation" : "Génération"}</span>
                      <span className="text-xs text-zinc-500">{formatDateTime(asString(reply.created_at))}</span>
                    </div>
                    <p className="mt-2 text-zinc-700">{compactText(asString(reply.instruction) || "", 180)}</p>
                    <p className="mt-2 rounded bg-white px-3 py-2 text-zinc-700">
                      {compactText(asString(reply.generated_reply) || "", 240)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-600">Aucune réponse générée pour le moment.</p>
              )}
            </div>
          </Panel>

          <Panel icon={PenLine} title="Activité">
            <div className="grid gap-3">
              {usageEvents.length ? (
                usageEvents.map((event, index) => (
                  <div className="rounded-md border border-line bg-fog p-3 text-sm" key={asString(event.id) || index}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold">{asString(event.event_type)}</span>
                      <span className="text-xs text-zinc-500">{formatDateTime(asString(event.created_at))}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-600">Aucune activité enregistrée.</p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}
