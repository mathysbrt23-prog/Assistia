import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-fog px-5 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="rounded-lg border border-line bg-white p-6 shadow-sm">Chargement…</div>}>
          <AuthForm mode="login" />
        </Suspense>
        <p className="mt-5 text-center text-sm text-zinc-600">
          Pas encore de compte ?{" "}
          <Link className="font-semibold text-moss" href="/signup">
            S’inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
