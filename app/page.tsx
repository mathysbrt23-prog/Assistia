import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  MailCheck,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PricingCards } from "@/components/landing/pricing-cards";

const features = [
  {
    icon: MailCheck,
    title: "Résumé Gmail",
    text: "Synthèse des emails du jour, mails importants et recherche par expéditeur ou sujet."
  },
  {
    icon: CalendarClock,
    title: "Agenda Google",
    text: "Planning du jour, rendez-vous de l’après-midi et proposition de déplacement."
  },
  {
    icon: MessageCircle,
    title: "WhatsApp natif",
    text: "Les demandes arrivent depuis WhatsApp et l’historique est centralisé dans le dashboard."
  },
  {
    icon: ShieldCheck,
    title: "Actions confirmées",
    text: "L’agent prépare les actions sensibles et attend un OUI explicite avant exécution."
  }
];

const useCases = [
  "J’ai quoi aujourd’hui ?",
  "Résume mes mails d’aujourd’hui",
  "Décale mon rendez-vous avec Paul à demain 15h",
  "Envoie-moi mon planning de la journée"
];

const faq = [
  {
    q: "WhatsAgent envoie-t-il des emails automatiquement ?",
    a: "Non. Il peut préparer une réponse, mais l’envoi nécessite une confirmation explicite."
  },
  {
    q: "Puis-je modifier un rendez-vous depuis WhatsApp ?",
    a: "Oui, l’agent prépare le déplacement et attend que tu répondes OUI avant de toucher à Google Calendar."
  },
  {
    q: "Comment WhatsApp est-il relié à mon compte ?",
    a: "Le dashboard associe ton numéro WhatsApp à ton utilisateur Supabase, puis le webhook Meta route les messages."
  },
  {
    q: "Est-ce prêt pour Vercel ?",
    a: "Oui. Les routes API, webhooks, variables d’environnement et instructions de déploiement sont incluses."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-fog text-ink">
      <nav className="fixed left-0 right-0 top-0 z-30 border-b border-white/60 bg-fog/88 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a className="flex items-center gap-2 font-bold" href="#">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-leaf text-ink">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            WhatsAgent
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-zinc-700 md:flex">
            <a href="#solution">Solution</a>
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <ButtonLink className="hidden md:inline-flex" href="/login" variant="ghost">
              Connexion
            </ButtonLink>
            <ButtonLink href="/signup">Commencer</ButtonLink>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-line bg-[#EEF8F0] pt-28">
        <div className="absolute inset-0 opacity-70" aria-hidden="true">
          <div className="absolute left-1/2 top-24 h-[560px] w-[900px] -translate-x-1/2 rounded-[40px] border border-white/80 bg-white/55 shadow-soft" />
          <div className="absolute left-[8%] top-40 hidden h-72 w-64 rounded-lg border border-line bg-white p-4 shadow-soft lg:block">
            <p className="text-xs font-bold uppercase text-moss">WhatsApp</p>
            <div className="mt-5 grid gap-3 text-sm">
              <span className="w-fit rounded-lg bg-mint px-3 py-2">J’ai quoi aujourd’hui ?</span>
              <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                3 rendez-vous, dont une réunion à 15h avec Paul.
              </span>
              <span className="w-fit rounded-lg bg-mint px-3 py-2">Décale à demain 15h</span>
            </div>
          </div>
          <div className="absolute right-[8%] top-44 hidden h-80 w-72 rounded-lg border border-line bg-white p-4 shadow-soft lg:block">
            <p className="text-xs font-bold uppercase text-moss">Journée</p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-md border border-line p-3">09:30 Standup équipe</div>
              <div className="rounded-md border border-line p-3">14:00 Revue client</div>
              <div className="rounded-md border border-leaf bg-mint p-3">15:00 Paul confirmé</div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[680px] max-w-5xl flex-col items-center justify-center px-5 pb-16 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-moss">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Gmail, Calendar et WhatsApp réunis dans un assistant
          </span>
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-ink md:text-7xl">
            Ton assistant personnel directement dans WhatsApp
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl">
            Résume tes emails, consulte ton agenda et décale tes réunions sans ouvrir 10
            applications.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#demo" variant="secondary">
              Voir la démo
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase text-coral">Le problème</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Trop d’apps ouvertes pour une réponse simple.
            </h2>
          </div>
          <div className="grid gap-4 text-zinc-700">
            <p>
              Entre Gmail, Google Calendar, Slack, les rappels et WhatsApp, une question simple
              demande souvent plusieurs changements de contexte.
            </p>
            <p>
              WhatsAgent réduit ce bruit : tu poses ta question là où tu es déjà, et l’agent va
              chercher les informations autorisées.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-fog py-20" id="solution">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-moss">La solution</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Un agent personnel avec des permissions claires.
            </h2>
            <p className="mt-5 text-zinc-700">
              Connecte Google, associe ton numéro WhatsApp et choisis un plan. L’agent peut lire ce
              dont il a besoin, préparer des actions, puis demander confirmation.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3" id="demo">
            {[
              ["1", "Demande", "Tu écris depuis WhatsApp."],
              ["2", "Analyse", "L’agent choisit Gmail ou Calendar."],
              ["3", "Confirmation", "Les actions sensibles attendent OUI."]
            ].map(([step, title, text]) => (
              <div className="rounded-lg border border-line bg-white p-5 shadow-sm" key={step}>
                <span className="grid h-9 w-9 place-items-center rounded-md bg-mint font-bold text-moss">
                  {step}
                </span>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20" id="features">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-moss">Fonctionnalités</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Tout ce qu’il faut pour piloter ta journée.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article className="rounded-lg border border-line bg-fog p-5" key={feature.title}>
                <feature.icon className="h-6 w-6 text-moss" aria-hidden="true" />
                <h3 className="mt-5 font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-fog py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase text-moss">Cas d’usage</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Des demandes naturelles, traitées comme un assistant humain.
            </h2>
          </div>
          <div className="grid gap-3">
            {useCases.map((useCase) => (
              <div className="flex items-center gap-3 rounded-lg border border-line bg-white p-4" key={useCase}>
                <CheckCircle2 className="h-5 w-5 text-leaf" aria-hidden="true" />
                <span className="font-medium">“{useCase}”</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="text-sm font-bold uppercase text-moss">Sécurité</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Contrôle avant action.</h2>
          </div>
          <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
            {[
              [LockKeyhole, "Tokens chiffrés", "Les jetons Google sont chiffrés côté serveur."],
              [Clock3, "Confirmations", "Les modifications Calendar attendent un OUI."],
              [Users, "RLS Supabase", "Les données sont isolées par utilisateur."]
            ].map(([Icon, title, text]) => (
              <article className="rounded-lg border border-line bg-fog p-5" key={String(title)}>
                <Icon className="h-6 w-6 text-moss" aria-hidden="true" />
                <h3 className="mt-4 font-bold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{String(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-fog py-20" id="pricing">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-moss">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Un plan adapté au volume de messages.
            </h2>
          </div>
          <div className="mt-10">
            <PricingCards />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20" id="faq">
        <div className="mx-auto max-w-4xl px-5">
          <p className="text-sm font-bold uppercase text-moss">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Questions fréquentes</h2>
          <div className="mt-8 divide-y divide-line rounded-lg border border-line">
            {faq.map((item) => (
              <details className="group bg-white p-5" key={item.q}>
                <summary className="cursor-pointer list-none font-bold">{item.q}</summary>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-ink py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold">WhatsAgent</p>
            <p className="mt-1 text-sm text-zinc-300">
              Assistant personnel WhatsApp pour Gmail et Google Calendar.
            </p>
          </div>
          <div className="flex gap-5 text-sm text-zinc-300">
            <a href="/login">Connexion</a>
            <a href="/signup">Inscription</a>
            <a href="#pricing">Pricing</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
