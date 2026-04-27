import { PricingCards } from "@/components/landing/pricing-cards";
import { ButtonLink } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-fog px-5 py-12 text-ink">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <ButtonLink href="/" variant="ghost">
            WhatsAgent
          </ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            Connexion
          </ButtonLink>
        </div>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase text-moss">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Choisis ton volume de messages WhatsApp.
          </h1>
          <p className="mt-4 text-zinc-700">
            Tous les plans incluent l’accès au dashboard, Supabase Auth, les connexions Google et
            les confirmations avant action sensible.
          </p>
        </div>
        <div className="mt-10">
          <PricingCards />
        </div>
      </div>
    </main>
  );
}
