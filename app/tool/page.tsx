import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ExtensionConnectCard } from "@/components/tool/extension-connect-card";
import { ReplyTool } from "@/components/tool/reply-tool";
import { ButtonLink } from "@/components/ui/button";
import { SignOutButton } from "@/components/dashboard/dashboard-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const localExtensionPath = "/Users/mathys/Desktop/Codex/extension";

function AssistiaLogo() {
  return (
    <Image
      alt="Assistia"
      className="h-10 w-10 bg-black object-contain"
      height={80}
      priority
      src="/assistia-logo.png"
      width={80}
    />
  );
}

export default async function ToolPage() {
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const chromeExtensionUrl = process.env.NEXT_PUBLIC_CHROME_EXTENSION_URL || "";
  const chromeExtensionId = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID || "";
  let user = null;

  if (hasSupabaseConfig) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: currentUser }
    } = await supabase.auth.getUser();
    user = currentUser;

    if (!user) redirect("/signup?next=/tool");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-white">
      <section className="relative border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,211,102,0.13),rgba(3,3,3,0)_42%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_100%,80px_80px,80px_80px]"
        />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <Link className="flex items-center gap-3" href="/">
            <AssistiaLogo />
            <span className="font-semibold text-white">Assistia</span>
          </Link>
          <div className="flex items-center gap-2">
            <ButtonLink href="/" variant="ghost" className="hidden text-white hover:bg-white/[0.08] sm:inline-flex">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Landing
            </ButtonLink>
            {user ? (
              <>
                <ButtonLink href="/dashboard" variant="secondary">
                  Dashboard
                </ButtonLink>
                <SignOutButton className="text-white hover:bg-white/[0.08]" />
              </>
            ) : hasSupabaseConfig ? (
              <ButtonLink href="/signup?next=/tool" variant="secondary">
                Créer un compte
              </ButtonLink>
            ) : null}
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#25D366]">
                Assistia Reply
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
                Teste l’outil, puis installe l’extension.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                Le parcours client doit rester court : un compte, une extension Chrome, une connexion
                automatique, puis Assistia directement dans Gmail.
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
              {[
                "Créer un compte gratuit",
                chromeExtensionUrl ? "Ajouter depuis le Chrome Web Store" : "Installer la bêta locale",
                chromeExtensionId ? "Connecter automatiquement l’extension" : "Générer une clé extension",
                "Ouvrir Gmail et générer un brouillon"
              ].map((item) => (
                <div className="flex items-center gap-3 rounded-2xl bg-black/30 p-3 text-sm text-zinc-300" key={item}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ReplyTool />
        <ExtensionConnectCard
          chromeExtensionId={chromeExtensionId}
          chromeExtensionUrl={chromeExtensionUrl}
          hasSupabaseConfig={hasSupabaseConfig}
          isAuthenticated={Boolean(user)}
          localExtensionPath={localExtensionPath}
        />
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Important pour la conversion</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Pour une installation en un clic côté client, il faudra publier l’extension sur le
                Chrome Web Store et renseigner son URL + son ID dans les variables d’environnement.
                Le fallback local reste utile pour tester avant publication.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
                <Link className="hover:text-white" href="/privacy">
                  Confidentialité
                </Link>
                <Link className="hover:text-white" href="/terms">
                  Conditions
                </Link>
              </div>
            </div>
            <ButtonLink href="/dashboard" variant="secondary">
              Voir le dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
