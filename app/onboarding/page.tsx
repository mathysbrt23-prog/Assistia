import { ArrowRight, CalendarDays, CreditCard, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const steps = [
  {
    icon: CreditCard,
    title: "Choisis un plan",
    text: "Stripe active l’accès agent et fixe le volume mensuel de messages."
  },
  {
    icon: CalendarDays,
    title: "Connecte Google",
    text: "Autorise Gmail en lecture et Calendar avec modification confirmée."
  },
  {
    icon: MessageCircle,
    title: "Associe WhatsApp",
    text: "Ajoute ton numéro puis configure le webhook Meta Business."
  }
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-fog px-5 py-12 text-ink">
      <div className="mx-auto max-w-5xl">
        <ButtonLink href="/dashboard" variant="ghost">
          Retour dashboard
        </ButtonLink>
        <div className="mt-12 max-w-2xl">
          <p className="text-sm font-bold uppercase text-moss">Onboarding</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Active WhatsAgent en 3 étapes.</h1>
          <p className="mt-4 text-zinc-700">
            Une fois ces étapes terminées, tu peux envoyer “J’ai quoi aujourd’hui ?” depuis WhatsApp.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article className="rounded-lg border border-line bg-white p-6 shadow-sm" key={step.title}>
              <step.icon className="h-7 w-7 text-moss" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-bold">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/dashboard">
            Configurer maintenant
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
