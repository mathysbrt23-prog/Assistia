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
  const isSignup = mode === "signup";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const supabase = createSupabaseBrowserClient();

    const response = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (response.error) {
      setError(response.error.message);
      setLoading(false);
      return;
    }

    router.push(searchParams.get("next") || "/dashboard");
    router.refresh();
  }

  async function continueWithGoogle() {
    setGoogleLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
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
            ? "Commence avec email/password, puis connecte Google depuis le dashboard."
            : "Retrouve ton dashboard WhatsAgent et tes intégrations."}
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
