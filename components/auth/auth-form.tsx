"use client";

import { Loader2, Mail, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const isSignup = mode === "signup";

  function safeNextPath() {
    const next = searchParams.get("next") || "/dashboard";
    if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
    return next;
  }

  function callbackUrl() {
    const url = new URL("/auth/callback", window.location.origin);
    url.searchParams.set("next", safeNextPath());
    return url.toString();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      setError("Supabase n’est pas encore configuré. Ajoute les variables d’environnement pour activer les comptes réels.");
      setLoading(false);
      return;
    }

    const response = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl()
          }
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (response.error) {
      setError(response.error.message);
      setLoading(false);
      return;
    }

    if (isSignup && !response.data.session) {
      setInfo("Compte créé. Vérifie ton email pour confirmer l’inscription, puis tu seras redirigé vers l’outil.");
      setLoading(false);
      return;
    }

    router.push(safeNextPath());
    router.refresh();
  }

  async function continueWithGoogle() {
    setGoogleLoading(true);
    setError(null);
    setInfo(null);
    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      setError("Supabase n’est pas encore configuré. Ajoute les variables d’environnement pour activer les comptes réels.");
      setGoogleLoading(false);
      return;
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl()
      }
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-mint text-moss">
          <Shield className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-ink">
          {isSignup ? "Créer un compte" : "Se connecter"}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isSignup
            ? "Crée ton compte pour installer Assistia Reply et connecter l’extension."
            : "Retrouve ton dashboard Assistia Reply, ton usage et tes préférences."}
        </p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <Field label="Email" name="email" placeholder="toi@entreprise.com" required type="email" />
        <Field
          label="Mot de passe"
          minLength={8}
          name="password"
          placeholder="8 caractères minimum"
          required
          type="password"
        />
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {info}
          </p>
        ) : null}
        <Button disabled={loading} type="submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {isSignup ? "S’inscrire" : "Connexion"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase text-zinc-400">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button disabled={googleLoading} onClick={continueWithGoogle} variant="secondary" className="w-full">
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Continuer avec Google
      </Button>
    </div>
  );
}
