import { ArrowRight, Chrome, MessageSquareText, PenLine } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const steps = [
  {
    icon: Chrome,
    title: "Installe l’extension",
    text: "Assistia Reply démarre dans Chrome, directement dans Gmail puis WhatsApp Web."
  },
  {
    icon: MessageSquareText,
    title: "Écris ton intention",
    text: "Sélectionne un message ou note ce que tu veux répondre en quelques mots."
  },
  {
    icon: PenLine,
    title: "Insère le brouillon",
    text: "Assistia reformule, tu relis, puis tu envoies toi-même depuis l’app d’origine."
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
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Active Assistia Reply en 3 étapes.</h1>
          <p className="mt-4 text-zinc-700">
            Le MVP ne remplace pas Gmail ou WhatsApp Web. Il ajoute simplement le bon brouillon au
            bon endroit, sans envoi automatique.
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
            Ouvrir le dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
