"use client";

import { Check, Copy, CreditCard, KeyRound, Loader2, LogOut, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/field";
import { paidPlans } from "@/lib/plans";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

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
      <div className="grid gap-2 sm:grid-cols-2">
        {paidPlans.map((plan) => (
          <Button
            disabled={loadingPlan !== null}
            key={plan.id}
            onClick={() => checkout(plan.id)}
            variant={currentPlan === plan.id ? "primary" : "secondary"}
          >
            {loadingPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {currentPlan === plan.id ? "Plan actuel" : `${plan.name} - ${plan.price}/mois`}
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

export function ReplyPreferencesForm({
  defaultTone,
  defaultLanguage,
  dataRetentionDays
}: {
  defaultTone?: string | null;
  defaultLanguage?: string | null;
  dataRetentionDays?: number | null;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/settings/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultTone: String(formData.get("defaultTone") || "professionnel"),
        defaultLanguage: String(formData.get("defaultLanguage") || "fr"),
        dataRetentionDays: Number(formData.get("dataRetentionDays"))
      })
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    setStatus(payload?.message || payload?.error || "Préférences sauvegardées.");
    setLoading(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <SelectField defaultValue={defaultTone || "professionnel"} label="Ton par défaut" name="defaultTone">
        <option value="professionnel">Professionnel</option>
        <option value="court">Court</option>
        <option value="chaleureux">Chaleureux</option>
        <option value="ferme">Ferme</option>
        <option value="commercial">Commercial</option>
      </SelectField>
      <SelectField defaultValue={defaultLanguage || "fr"} label="Langue par défaut" name="defaultLanguage">
        <option value="fr">Français</option>
        <option value="en">Anglais</option>
        <option value="es">Espagnol</option>
      </SelectField>
      <SelectField
        defaultValue={String(dataRetentionDays || 30)}
        label="Rétention des historiques"
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

export function ExtensionTokenGenerator() {
  const [token, setToken] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createToken() {
    setLoading(true);
    setCopied(false);
    setError(null);
    const response = await fetch("/api/extension/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        browser: "chrome",
        extensionVersion: "0.3.5",
        label: "Chrome local"
      })
    });
    const payload = (await response.json().catch(() => null)) as {
      token?: string;
      appUrl?: string;
      error?: string;
    } | null;

    if (!response.ok || !payload?.token) {
      setError(payload?.error || "Impossible de créer la clé extension.");
      setLoading(false);
      return;
    }

    setToken(payload.token);
    setAppUrl(payload.appUrl || window.location.origin);
    setLoading(false);
  }

  async function copyToken() {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
  }

  return (
    <div className="grid gap-3 rounded-md border border-line bg-fog p-4">
      <div>
        <p className="text-sm font-bold text-ink">Connexion extension</p>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Génère une clé, puis colle-la dans le popup Assistia de Chrome. Elle ne sera affichée
          qu’une seule fois.
        </p>
      </div>

      <Button disabled={loading} onClick={createToken} type="button" variant="secondary">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        Générer une clé extension
      </Button>

      {token ? (
        <div className="grid gap-2">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Clé extension
            <textarea
              className="focus-ring min-h-20 rounded-md border border-line bg-white p-3 font-mono text-xs text-ink"
              readOnly
              value={token}
            />
          </label>
          <div className="grid gap-2 rounded-md bg-white p-3 text-xs leading-5 text-zinc-600">
            <p>
              URL app à mettre dans le popup : <span className="font-mono text-ink">{appUrl}</span>
            </p>
            <p>Ensuite ouvre Gmail, clique sur Assistia, écris ton intention et génère la réponse.</p>
          </div>
          <Button onClick={copyToken} type="button" variant="ghost">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Clé copiée" : "Copier la clé"}
          </Button>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button className={cn(className)} onClick={signOut} variant="ghost">
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Déconnexion
    </Button>
  );
}
