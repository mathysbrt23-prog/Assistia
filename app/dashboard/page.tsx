import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCircle2,
  History,
  KeyRound,
  Mail,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import {
  GoogleConnectButton,
  SecuritySettingsForm,
  SignOutButton,
  StripePlanButtons,
  WhatsAppConnectForm
} from "@/components/dashboard/dashboard-actions";
import { getPlan, isActiveSubscriptionStatus } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

type DashboardRow = Record<string, string | number | boolean | null | undefined>;

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
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

  const [
    profileResult,
    subscriptionResult,
    googleResult,
    whatsappResult,
    messagesResult,
    requestsResult,
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
    supabase.from("google_connections").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("whatsapp_connections").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("agent_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("action_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  const profile = profileResult.data as DashboardRow | null;
  const subscription = subscriptionResult.data as DashboardRow | null;
  const googleConnection = googleResult.data as DashboardRow | null;
  const whatsappConnection = whatsappResult.data as DashboardRow | null;
  const messages = (messagesResult.data || []) as DashboardRow[];
  const requests = (requestsResult.data || []) as DashboardRow[];
  const logs = (logsResult.data || []) as DashboardRow[];
  const subscriptionPlan = asString(subscription?.plan);
  const subscriptionStatus = asString(subscription?.status);
  const plan = getPlan(subscriptionPlan);
  const hasActiveSubscription = isActiveSubscriptionStatus(subscriptionStatus);
  const googleGmailConnected = asBoolean(googleConnection?.gmail_connected);
  const googleCalendarConnected = asBoolean(googleConnection?.calendar_connected);
  const whatsappStatus = asString(whatsappConnection?.status);

  return (
    <main className="min-h-screen bg-fog text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-moss">WhatsAgent</p>
            <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid content-start gap-5">
          <Panel icon={KeyRound} title="Abonnement Stripe">
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-600">Statut</p>
                  <p className="text-xl font-bold">{plan?.name || "Aucun plan"}</p>
                </div>
                <StatusPill
                  ok={hasActiveSubscription}
                  label={hasActiveSubscription ? "Actif" : "Accès agent bloqué"}
                />
              </div>
              {asString(subscription?.current_period_end) ? (
                <p className="text-sm text-zinc-600">
                  Renouvellement : {formatDateTime(asString(subscription?.current_period_end))}
                </p>
              ) : null}
              <StripePlanButtons currentPlan={subscriptionPlan} />
            </div>
          </Panel>

          <Panel icon={ShieldCheck} title="Réglages de sécurité">
            <SecuritySettingsForm
              dataRetentionDays={asNumber(profile?.data_retention_days)}
              requireConfirmations={asBoolean(profile?.require_confirmations)}
            />
          </Panel>
        </div>

        <div className="grid gap-5">
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <Mail className="h-6 w-6 text-moss" />
              <p className="mt-4 text-sm text-zinc-600">Gmail</p>
              <StatusPill ok={googleGmailConnected} label={googleGmailConnected ? "Connecté" : "À connecter"} />
            </div>
            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <CalendarDays className="h-6 w-6 text-moss" />
              <p className="mt-4 text-sm text-zinc-600">Calendar</p>
              <StatusPill ok={googleCalendarConnected} label={googleCalendarConnected ? "Connecté" : "À connecter"} />
            </div>
            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <MessageCircle className="h-6 w-6 text-moss" />
              <p className="mt-4 text-sm text-zinc-600">WhatsApp</p>
              <StatusPill ok={whatsappStatus === "active"} label={whatsappStatus === "active" ? "Connecté" : "À configurer"} />
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel icon={CalendarDays} title="Google OAuth">
              <div className="grid gap-3 text-sm text-zinc-600">
                <p>
                  Scopes : lecture Gmail, lecture Calendar et modification Calendar uniquement
                  après confirmation.
                </p>
                <GoogleConnectButton />
                {asString(googleConnection?.last_connected_at) ? (
                  <p>Dernière connexion : {formatDateTime(asString(googleConnection?.last_connected_at))}</p>
                ) : null}
              </div>
            </Panel>

            <Panel icon={MessageCircle} title="WhatsApp Business">
              <div className="grid gap-4">
                <WhatsAppConnectForm initialPhone={asString(whatsappConnection?.phone_number)} />
                <p className="text-sm text-zinc-600">
                  Configure ensuite le webhook Meta sur{" "}
                  <code className="rounded bg-fog px-1 py-0.5">/api/whatsapp/webhook</code>.
                </p>
              </div>
            </Panel>
          </div>

          <Panel icon={History} title="Historique WhatsApp">
            <div className="grid gap-3">
              {messages.length ? (
                messages.map((message, index) => (
                  <div className="rounded-md border border-line bg-fog p-3 text-sm" key={asString(message.id) || index}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold">{asString(message.direction) === "incoming" ? "Entrant" : "Sortant"}</span>
                      <span className="text-xs text-zinc-500">{formatDateTime(asString(message.created_at))}</span>
                    </div>
                    <p className="mt-2 text-zinc-700">{asString(message.body)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-600">Aucun message pour le moment.</p>
              )}
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel icon={Bot} title="Demandes agent">
              <div className="grid gap-3">
                {requests.length ? (
                  requests.map((request, index) => (
                    <div className="rounded-md border border-line bg-fog p-3 text-sm" key={asString(request.id) || index}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold">{asString(request.intent) || "Analyse"}</span>
                        <span className="text-xs text-zinc-500">{asString(request.status)}</span>
                      </div>
                      <p className="mt-2 text-zinc-700">{asString(request.input)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-600">Aucune demande agent.</p>
                )}
              </div>
            </Panel>

            <Panel icon={ShieldCheck} title="Logs d’actions">
              <div className="grid gap-3">
                {logs.length ? (
                  logs.map((log, index) => (
                    <div className="rounded-md border border-line bg-fog p-3 text-sm" key={asString(log.id) || index}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold">{asString(log.action_type)}</span>
                        <span className="text-xs text-zinc-500">{formatDateTime(asString(log.created_at))}</span>
                      </div>
                      <p className="mt-2 text-zinc-700">{asString(log.summary)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-600">Aucun log sensible.</p>
                )}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}
