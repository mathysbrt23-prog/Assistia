import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const next = (await searchParams)?.next;
  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] px-5 py-8 text-white sm:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(3,3,3,0)_42%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_100%,80px_80px,80px_80px]"
      />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Assistia Reply</p>
          <h1 className="mt-5 max-w-2xl text-6xl font-semibold leading-none tracking-tight text-white">
            Reprends exactement où tu t’étais arrêté.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            Connecte-toi, retrouve ton extension et continue à générer des brouillons propres directement dans Gmail.
          </p>
          <div className="mt-8 grid max-w-md gap-3 text-sm text-zinc-300">
            {["Usage et quotas synchronisés", "Préférences de ton conservées", "Brouillons toujours validés par toi"].map((item) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <Suspense fallback={<div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-8 text-white">Chargement…</div>}>
          <AuthForm mode="login" />
        </Suspense>
        <p className="mt-5 text-center text-sm text-zinc-500">
          Pas encore de compte ?{" "}
          <Link className="font-semibold text-white hover:text-zinc-300" href={signupHref}>
            S’inscrire
          </Link>
        </p>
        </section>
      </div>
    </main>
  );
}
