"use client";

import { Check, Chrome, Copy, ExternalLink, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

type TokenPayload = {
  token?: string;
  appUrl?: string;
  error?: string;
};

type ChromeRuntime = {
  lastError?: { message?: string };
  sendMessage?: (
    extensionId: string,
    message: Record<string, unknown>,
    callback: (response?: { ok?: boolean; error?: string }) => void
  ) => void;
};

type WindowWithChrome = Window & {
  chrome?: {
    runtime?: ChromeRuntime;
  };
};

export function ExtensionConnectCard({
  isAuthenticated,
  hasSupabaseConfig,
  chromeExtensionUrl,
  chromeExtensionId,
  localExtensionPath
}: {
  isAuthenticated: boolean;
  hasSupabaseConfig: boolean;
  chromeExtensionUrl?: string;
  chromeExtensionId?: string;
  localExtensionPath: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "connected" | "manual">("idle");
  const [token, setToken] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pathCopied, setPathCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function createToken() {
    const response = await fetch("/api/extension/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        browser: "chrome",
        extensionVersion: "0.3.7",
        label: chromeExtensionUrl ? "Chrome Web Store" : "Chrome local"
      })
    });

    const payload = (await response.json().catch(() => null)) as TokenPayload | null;
    if (!response.ok || !payload?.token) {
      throw new Error(payload?.error || "Impossible de créer la clé extension.");
    }

    const nextAppUrl = payload.appUrl || window.location.origin;
    setToken(payload.token);
    setAppUrl(nextAppUrl);
    return { token: payload.token, appUrl: nextAppUrl };
  }

  async function connectAutomatically() {
    setCopied(false);
    setMessage(null);

    if (!hasSupabaseConfig) {
      setStatus("connected");
      setMessage("Mode bêta locale prêt. Aucune clé n’est nécessaire : ouvre Gmail, puis lance Assistia depuis l’extension.");
      return;
    }

    if (!isAuthenticated) {
      window.location.href = "/signup?next=/tool";
      return;
    }

    setStatus("loading");

    try {
      const credentials = await createToken();
      const runtime = (window as WindowWithChrome).chrome?.runtime;

      if (!chromeExtensionId || !runtime?.sendMessage) {
        setStatus("manual");
        setMessage("Installe l’extension, puis colle la clé ci-dessous dans le popup Assistia.");
        return;
      }

      runtime.sendMessage(
        chromeExtensionId,
        {
          type: "assistia.connect",
          appUrl: credentials.appUrl,
          token: credentials.token,
          extensionVersion: "0.3.7"
        },
        (response) => {
          if (runtime.lastError || !response?.ok) {
            setStatus("manual");
            setMessage(
              runtime.lastError?.message ||
                response?.error ||
                "Extension introuvable. Installe-la puis colle la clé ci-dessous."
            );
            return;
          }

          setStatus("connected");
          setMessage("Extension connectée. Tu peux maintenant ouvrir Gmail et utiliser Assistia.");
        }
      );
    } catch (error) {
      setStatus("manual");
      setMessage(error instanceof Error ? error.message : "Impossible de connecter l’extension.");
    }
  }

  async function copyToken() {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
  }

  async function copyLocalPath() {
    await navigator.clipboard.writeText(localExtensionPath);
    setPathCopied(true);
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.08] text-white">
          <Chrome className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Extension</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Installer et connecter Assistia</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Le parcours cible est simple : installer l’extension, créer le compte, connecter
            automatiquement. La clé manuelle reste seulement un plan B.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-black">
              1
            </span>
            <h3 className="font-semibold text-white">Ajouter l’extension</h3>
          </div>
          {chromeExtensionUrl ? (
            <ButtonLink className="w-full" href={chromeExtensionUrl} target="_blank" rel="noreferrer">
              <Chrome className="h-4 w-4" aria-hidden="true" />
              Ajouter à Chrome
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          ) : (
            <div className="grid gap-3">
              <p className="text-sm leading-6 text-zinc-400">
                Mode bêta locale : ouvre <span className="font-mono text-zinc-200">chrome://extensions</span>,
                active le mode développeur, puis charge ce dossier.
              </p>
              <div className="rounded-xl border border-white/10 bg-[#050505] p-3 font-mono text-xs leading-5 text-zinc-300">
                {localExtensionPath}
              </div>
              <Button onClick={copyLocalPath} type="button" variant="secondary">
                {pathCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {pathCopied ? "Chemin copié" : "Copier le chemin"}
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-black">
              2
            </span>
            <h3 className="font-semibold text-white">{hasSupabaseConfig ? "Créer ton compte" : "Mode bêta locale"}</h3>
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/[0.06] p-3 text-sm text-zinc-100">
              <Check className="h-4 w-4 text-white" aria-hidden="true" />
              Compte connecté.
            </div>
          ) : hasSupabaseConfig ? (
            <ButtonLink className="w-full" href="/signup?next=/tool">
              Créer un compte gratuit
            </ButtonLink>
          ) : (
            <div className="rounded-xl border border-white/15 bg-white/[0.06] p-3 text-sm leading-6 text-zinc-200">
              Aucun compte réel n’est nécessaire pour la bêta locale. L’extension utilisera
              <span className="font-mono text-white"> http://localhost:3000</span>.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-black">
              3
            </span>
            <h3 className="font-semibold text-white">Connecter l’extension</h3>
          </div>
          <Button
            disabled={status === "loading"}
            onClick={connectAutomatically}
            type="button"
            className="w-full bg-white text-black hover:bg-zinc-200"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {!hasSupabaseConfig
              ? "Activer le mode local"
              : chromeExtensionId
                ? "Connecter automatiquement"
                : "Générer la clé de connexion"}
          </Button>

          {message ? (
            <p
              className={`mt-3 rounded-xl border p-3 text-sm leading-6 ${
                status === "connected"
                  ? "border-white/20 bg-white/[0.06] text-zinc-100"
                  : "border-white/10 bg-[#050505] text-zinc-300"
              }`}
            >
              {message}
            </p>
          ) : null}

          {token && status !== "connected" ? (
            <div className="mt-3 grid gap-3">
              <label className="grid gap-2 text-sm font-medium text-zinc-200">
                Clé extension
                <textarea
                  className="focus-ring min-h-20 rounded-xl border border-white/10 bg-[#050505] p-3 font-mono text-xs leading-5 text-white"
                  readOnly
                  value={token}
                />
              </label>
              <Button onClick={copyToken} type="button" variant="secondary">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Clé copiée" : "Copier la clé"}
              </Button>
              <p className="text-xs leading-5 text-zinc-500">
                URL app : <span className="font-mono text-zinc-300">{appUrl}</span>
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-black">
              4
            </span>
            <h3 className="font-semibold text-white">Utiliser dans Gmail</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              href="https://mail.google.com"
              target="_blank"
              rel="noreferrer"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Ouvrir Gmail
            </Link>
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 text-xs leading-5 text-zinc-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
              Assistia prépare seulement un brouillon.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
