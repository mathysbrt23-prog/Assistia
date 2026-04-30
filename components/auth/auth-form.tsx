"use client";

import Image from "next/image";
import { ArrowRight, Chrome, Loader2, Mail } from "lucide-react";
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
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const hasGoogleAuth = hasSupabaseConfig;
  const canContinueLocalInstall = !hasSupabaseConfig && process.env.NODE_ENV !== "production";

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
      setError(
        oauthError.message ||
          "Connexion Gmail indisponible. Vérifie que le provider Google est activé dans Supabase."
      );
      setGoogleLoading(false);
    }
  }

  if (!hasSupabaseConfig) {
    return (
      <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Image
              alt="Assistia"
              className="h-12 w-12 object-contain"
              height={80}
              priority
              src="/assistia-logo-round.png"
              width={80}
            />
            <div>
              <p className="text-sm font-semibold text-white">Assistia</p>
              <p className="text-xs text-zinc-500">Extension Gmail</p>
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white">
            {canContinueLocalInstall ? "Installer la bêta locale" : "Comptes en configuration"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {canContinueLocalInstall
              ? "Supabase n’est pas configuré sur cette version locale. Tu peux quand même installer l’extension et utiliser Assistia dans Gmail en mode bêta."
              : "La création de compte sera active dès que les variables Supabase seront configurées sur Vercel."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-zinc-300">
          {canContinueLocalInstall
            ? "Aucun compte réel ne sera créé en local. Pour la mise en production, l’inscription repassera automatiquement par Supabase."
            : "Il faut ajouter NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY."}
        </div>

        <Button
          className="mt-5 w-full rounded-full bg-white text-black hover:bg-zinc-200"
          onClick={() => router.push(canContinueLocalInstall ? safeNextPath() : "/")}
          type="button"
        >
          {canContinueLocalInstall ? <Chrome className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          {canContinueLocalInstall ? "Continuer l’installation" : "Retour à l’accueil"}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Image
            alt="Assistia"
            className="h-12 w-12 object-contain"
            height={80}
            priority
            src="/assistia-logo-round.png"
            width={80}
          />
          <div>
            <p className="text-sm font-semibold text-white">Assistia</p>
            <p className="text-xs text-zinc-500">Extension Gmail</p>
          </div>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {isSignup ? "Créer un compte" : "Se connecter"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {isSignup
            ? "Crée ton espace Assistia, installe l’extension et génère tes premières réponses dans Gmail."
            : "Retrouve ton espace Assistia, ton extension et tes préférences de réponse."}
        </p>
      </div>

      {hasGoogleAuth ? (
        <Button
          disabled={googleLoading}
          onClick={continueWithGoogle}
          variant="secondary"
          className="h-12 w-full rounded-full border-white/15 bg-white text-black hover:bg-zinc-200"
        >
          {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleMark />}
          {isSignup ? "S’inscrire avec Gmail" : "Continuer avec Gmail"}
        </Button>
      ) : null}

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-zinc-600">
        <span className="h-px flex-1 bg-white/10" />
        ou
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <Field
          className="h-12 rounded-2xl border-white/10 bg-black/30 px-4 text-white placeholder:text-zinc-600"
          label="Email"
          labelClassName="text-zinc-200"
          name="email"
          placeholder="toi@entreprise.com"
          required
          type="email"
        />
        <Field
          className="h-12 rounded-2xl border-white/10 bg-black/30 px-4 text-white placeholder:text-zinc-600"
          label="Mot de passe"
          labelClassName="text-zinc-200"
          minLength={8}
          name="password"
          placeholder="8 caractères minimum"
          required
          type="password"
        />
        {error ? (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-zinc-100">
            {info}
          </p>
        ) : null}
        <Button className="h-12 rounded-full bg-white text-black hover:bg-zinc-200" disabled={loading} type="submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {isSignup ? "S’inscrire" : "Connexion"}
        </Button>
      </form>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.37a4.59 4.59 0 0 1-1.99 3.01v2.5h3.22c1.89-1.74 3-4.3 3-7.5Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.6-2.43l-3.22-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.08v2.58A9.99 9.99 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.41 13.9a6.01 6.01 0 0 1 0-3.8V7.52H3.08a10.02 10.02 0 0 0 0 8.96l3.33-2.58Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86A9.58 9.58 0 0 0 12 2a9.99 9.99 0 0 0-8.92 5.52l3.33 2.58C7.2 7.74 9.4 5.98 12 5.98Z"
        fill="#EA4335"
      />
    </svg>
  );
}
