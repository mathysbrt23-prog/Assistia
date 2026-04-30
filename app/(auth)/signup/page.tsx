import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default async function SignupPage({
  searchParams
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const next = (await searchParams)?.next;
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] px-5 py-8 text-white sm:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(3,3,3,0)_42%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_100%,80px_80px,80px_80px]"
      />
      <div className="relative z-10 grid min-h-[calc(100vh-4rem)] place-items-center">
        <section className="w-full max-w-md">
          <Suspense fallback={<div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-8 text-white">Chargement…</div>}>
          <AuthForm mode="signup" />
        </Suspense>
        <p className="mt-5 text-center text-sm text-zinc-500">
          Déjà inscrit ?{" "}
          <Link className="font-semibold text-white hover:text-zinc-300" href={loginHref}>
            Connexion
          </Link>
        </p>
        </section>
      </div>
    </main>
  );
}
