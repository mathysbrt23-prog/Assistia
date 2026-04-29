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
    <main className="grid min-h-screen place-items-center bg-fog px-5 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="rounded-lg border border-line bg-white p-6 shadow-sm">Chargement…</div>}>
          <AuthForm mode="signup" />
        </Suspense>
        <p className="mt-5 text-center text-sm text-zinc-600">
          Déjà inscrit ?{" "}
          <Link className="font-semibold text-moss" href={loginHref}>
            Connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
