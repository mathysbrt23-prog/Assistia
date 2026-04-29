"use client";

import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { plans } from "@/lib/plans";
import { Button } from "@/components/ui/button";

export function PricingCards() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: string) {
    if (plan === "free") {
      window.location.href = "/tool";
      return;
    }
    setLoadingPlan(plan);
    setError(null);

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });

    const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (!response.ok || !payload?.url) {
      setError(payload?.error || "Impossible de lancer le paiement.");
      setLoadingPlan(null);
      return;
    }

    window.location.href = payload.url;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <article
          className="flex h-full flex-col rounded-lg border border-line bg-white p-6 shadow-sm"
          key={plan.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-zinc-600">{plan.description}</p>
            </div>
            {plan.id === "pro" ? (
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-moss">
                Populaire
              </span>
            ) : null}
          </div>
          <div className="mt-6 flex items-baseline gap-1 text-ink">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-sm text-zinc-500">/mois</span>
          </div>
          <ul className="mt-6 grid gap-3 text-sm text-zinc-700">
            {plan.features.map((feature) => (
              <li className="flex gap-2" key={feature}>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-7 w-full"
            onClick={() => startCheckout(plan.id)}
            disabled={loadingPlan !== null}
            variant={plan.id === "pro" ? "primary" : "secondary"}
          >
            {loadingPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {plan.id === "free" ? "Commencer" : `Choisir ${plan.name}`}
          </Button>
          {plan.id === "free" ? (
            <Link className="mt-3 text-center text-sm font-semibold text-moss" href="/tool">
              Tester l’outil gratuitement
            </Link>
          ) : null}
        </article>
      ))}
      {error ? (
        <p className="md:col-span-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
