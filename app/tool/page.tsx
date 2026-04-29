import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Chrome, KeyRound, ShieldCheck } from "lucide-react";
import { ExtensionTokenGenerator, SignOutButton } from "@/components/dashboard/dashboard-actions";
import { ReplyTool } from "@/components/tool/reply-tool";
import { ButtonLink } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ToolPage() {
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
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
    <main className="min-h-screen bg-fog text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link className="text-sm font-bold uppercase text-moss" href="/">
              Assistia Reply
            </Link>
            <h1 className="mt-1 text-3xl font-bold">Ton outil de réponse</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Teste une réponse ici, puis connecte l’extension pour l’utiliser directement dans Gmail.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user ? (
              <>
                <ButtonLink href="/dashboard" variant="secondary">
                  Dashboard
                </ButtonLink>
                <SignOutButton />
              </>
            ) : (
              <ButtonLink href="/signup?next=/tool" variant="secondary">
                Créer un compte
              </ButtonLink>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ReplyTool />

        <aside className="grid content-start gap-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-mint text-moss">
                <Chrome className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink">Ajouter l’extension</h2>
                <p className="text-sm text-zinc-600">Pour utiliser Assistia dans Gmail.</p>
              </div>
            </div>

            <ol className="grid gap-3 text-sm leading-6 text-zinc-700">
              <li>1. Ouvre Chrome et va sur <span className="font-mono text-ink">chrome://extensions</span>.</li>
              <li>2. Active le mode développeur.</li>
              <li>3. Clique sur “Charger l’extension non empaquetée”.</li>
              <li>4. Sélectionne le dossier <span className="font-mono text-ink">/Users/mathys/Desktop/Codex/extension</span>.</li>
              <li>5. Génère une clé ci-dessous et colle-la dans le popup Assistia.</li>
            </ol>

            <div className="mt-5 rounded-md border border-line bg-fog p-4 text-sm leading-6 text-zinc-600">
              Dès que l’extension est chargée, ouvre un mail Gmail : un bouton Assistia apparaîtra
              sur la page pour générer puis insérer ton brouillon.
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-mint text-moss">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-ink">Clé extension</h2>
            </div>
            {user ? (
              <ExtensionTokenGenerator />
            ) : (
              <div className="rounded-md border border-line bg-fog p-4 text-sm leading-6 text-zinc-600">
                Le mode local permet de tester la génération dans l’outil web. Pour créer une clé
                extension réelle, configure Supabase puis crée un compte Assistia.
              </div>
            )}
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-moss" aria-hidden="true" />
              <h2 className="text-lg font-bold text-ink">Important</h2>
            </div>
            <p className="text-sm leading-6 text-zinc-600">
              Assistia prépare et insère un brouillon. L’envoi reste toujours manuel.
            </p>
            <ButtonLink className="mt-4" href="/onboarding" variant="ghost">
              Voir le guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </section>
        </aside>
      </div>
    </main>
  );
}
