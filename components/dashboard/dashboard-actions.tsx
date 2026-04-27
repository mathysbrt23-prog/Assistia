"use client";

import { CalendarPlus, CreditCard, Loader2, LogOut, MessageCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectField } from "@/components/ui/field";
import { plans } from "@/lib/plans";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function GoogleConnectButton() {
  return (
    <Button onClick={() => (window.location.href = "/api/google/connect")} variant="secondary">
      <CalendarPlus className="h-4 w-4" aria-hidden="true" />
      Connecter Google
    </Button>
  );
}

export function StripePlanButtons({ currentPlan }: { currentPlan?: string | null }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout(plan: string) {
    setLoadingPlan(plan);
    setError(null);
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });
    const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (!response.ok || !payload?.url) {
      setError(payload?.error || "Paiement indisponible.");
      setLoadingPlan(null);
      return;
    }
    window.location.href = payload.url;
  }

  async function openPortal() {
    setPortalLoading(true);
    setError(null);
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (!response.ok || !payload?.url) {
      setError(payload?.error || "Portail client indisponible.");
      setPortalLoading(false);
      return;
    }
    window.location.href = payload.url;
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {plans.map((plan) => (
          <Button
            disabled={loadingPlan !== null}
            key={plan.id}
            onClick={() => checkout(plan.id)}
            variant={currentPlan === plan.id ? "primary" : "secondary"}
          >
            {loadingPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {currentPlan === plan.id ? "Plan actuel" : plan.name}
          </Button>
        ))}
      </div>
      <Button disabled={portalLoading} onClick={openPortal} variant="ghost">
        {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Gérer l’abonnement
      </Button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export function WhatsAppConnectForm({ initialPhone }: { initialPhone?: string | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const phoneNumber = String(formData.get("phoneNumber") || "");
    const response = await fetch("/api/whatsapp/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber })
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    setStatus(payload?.message || payload?.error || "Mise à jour effectuée.");
    setLoading(false);
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <Field
        defaultValue={initialPhone || ""}
        help="Format recommandé : indicatif pays puis numéro, par exemple 33612345678."
        label="Numéro WhatsApp autorisé"
        name="phoneNumber"
        placeholder="33612345678"
        required
      />
      <Button disabled={loading} type="submit" variant="secondary">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
        Enregistrer le numéro
      </Button>
      {status ? <p className="text-sm text-zinc-600">{status}</p> : null}
    </form>
  );
}

export function SecuritySettingsForm({
  requireConfirmations,
  dataRetentionDays
}: {
  requireConfirmations?: boolean | null;
  dataRetentionDays?: number | null;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/settings/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requireConfirmations: formData.get("requireConfirmations") === "on",
        dataRetentionDays: Number(formData.get("dataRetentionDays"))
      })
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    setStatus(payload?.message || payload?.error || "Réglages sauvegardés.");
    setLoading(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <label className="flex items-start gap-3 text-sm text-zinc-700">
        <input
          className="mt-1 h-4 w-4 accent-leaf"
          defaultChecked={requireConfirmations ?? true}
          name="requireConfirmations"
          type="checkbox"
        />
        <span>
          <span className="block font-semibold text-ink">Confirmation obligatoire</span>
          Toutes les modifications Calendar et envois externes attendent un OUI explicite.
        </span>
      </label>
      <SelectField
        defaultValue={String(dataRetentionDays || 90)}
        label="Rétention des logs"
        name="dataRetentionDays"
      >
        <option value="30">30 jours</option>
        <option value="90">90 jours</option>
        <option value="180">180 jours</option>
        <option value="365">365 jours</option>
      </SelectField>
      <Button disabled={loading} type="submit" variant="secondary">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Sauvegarder
      </Button>
      {status ? <p className="text-sm text-zinc-600">{status}</p> : null}
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button onClick={signOut} variant="ghost">
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Déconnexion
    </Button>
  );
}
