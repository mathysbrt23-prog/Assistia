import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CreditCard,
  Layers3,
  LockKeyhole,
  Mail,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from "lucide-react";

const sections = [
  {
    eyebrow: "01",
    title: "Vision",
    body: [
      "Assistia veut devenir l’assistant personnel conversationnel des professionnels qui vivent déjà dans WhatsApp.",
      "Le produit place une couche d’assistance au-dessus de Gmail, Google Calendar et WhatsApp : l’utilisateur écrit une demande, Assistia lit les informations autorisées, résume, prépare l’action et demande confirmation quand l’action est sensible.",
      "Le timing est favorable : les usages professionnels sur WhatsApp sont déjà massifs, les APIs nécessaires sont matures, et les modèles IA rendent possible une interface naturelle."
    ],
    icon: Sparkles
  },
  {
    eyebrow: "02",
    title: "Problème",
    body: [
      "Les professionnels travaillent avec Gmail, Calendar, Slack, Outlook, WhatsApp et plusieurs dashboards. L’information utile est dispersée.",
      "Trouver les mails importants, vérifier l’après-midi, déplacer une réunion ou préparer une réponse client demande plusieurs changements de contexte.",
      "C’est un problème business : perte de temps, retard dans les réponses client, charge mentale et faible capacité d’exécution pour les petites équipes sans assistant humain."
    ],
    icon: Target
  },
  {
    eyebrow: "03",
    title: "Solution",
    body: [
      "Assistia permet de piloter des actions quotidiennes directement depuis WhatsApp : consulter son agenda, résumer ses emails, préparer une réponse ou proposer un déplacement de rendez-vous.",
      "WhatsApp est l’avantage clé : pas de nouvelle application à apprendre, un usage mobile naturel, une interface immédiate et déjà présente dans la journée de travail.",
      "Assistia ne remplace pas Gmail ou Calendar. Il réduit la friction d’accès et d’action."
    ],
    icon: MessageCircle
  },
  {
    eyebrow: "04",
    title: "Produit",
    body: [
      "Le MVP couvre une chaîne complète : landing, authentification, dashboard, connexion Google, abonnement Stripe, association WhatsApp, agent IA, confirmations et logs.",
      "Fonctions réelles : résumé des emails du jour, emails non lus, emails importants, recherche par expéditeur ou sujet, événements du jour, événements de l’après-midi, recherche d’événement et déplacement Calendar confirmé.",
      "Exemple : “Décale mon rendez-vous avec Paul à demain 15h”. Assistia cherche l’événement, prépare la modification et demande : “Confirmer ? Réponds OUI pour valider.”"
    ],
    icon: Bot
  },
  {
    eyebrow: "05",
    title: "Démo utilisateur",
    body: [
      "Le matin, l’utilisateur écrit : “Envoie-moi mon planning de la journée”. Assistia répond avec les réunions prévues et les emails importants.",
      "Ensuite, l’utilisateur demande : “Tu as reçu le mail de Léo ?”. Assistia recherche dans Gmail et répond que Léo confirme son intérêt et mentionne un investissement de 10 000 €.",
      "L’utilisateur demande une réponse. Assistia prépare un brouillon, sans l’envoyer automatiquement. Pour une modification Calendar, Assistia attend une confirmation explicite."
    ],
    icon: CalendarDays
  },
  {
    eyebrow: "06",
    title: "Marché",
    body: [
      "Cible initiale : freelances, entrepreneurs, dirigeants de petites structures, commerciaux, consultants et profils mobiles qui utilisent déjà WhatsApp comme canal de travail.",
      "Cas d’usage principaux : résumé de la journée, priorisation des emails, préparation de réponses client, vérification du calendrier et déplacement de rendez-vous.",
      "Le marché de départ est volontairement direct : professionnels qui veulent gagner du temps sans adopter une suite enterprise lourde."
    ],
    icon: Users
  },
  {
    eyebrow: "07",
    title: "Business model",
    body: [
      "Assistia est monétisable par abonnement SaaS. La logique repose sur un plan gratuit pour tester, puis des plans payants selon le volume de messages et les besoins avancés.",
      "Le projet intègre déjà Stripe Checkout, Stripe Billing Portal, webhooks de synchronisation, blocage de l’agent si l’abonnement n’est pas actif et quotas mensuels par plan.",
      "Une grille commerciale cohérente pour Assistia : Découverte à 0 €/mois, Pro à 9 €/mois, Business à 29 €/mois."
    ],
    icon: CreditCard
  },
  {
    eyebrow: "08",
    title: "Différenciation",
    body: [
      "Assistia ne demande pas d’utiliser une app de plus. L’usage quotidien se fait dans WhatsApp.",
      "Le dashboard sert à configurer, connecter et auditer, mais la valeur est délivrée dans la conversation.",
      "Le produit est conversationnel, centralisé et contrôlé : l’utilisateur formule une intention naturelle, Assistia choisit l’outil adapté, et les actions sensibles demandent validation."
    ],
    icon: Layers3
  },
  {
    eyebrow: "09",
    title: "Traction",
    body: [
      "Le projet dispose d’un MVP fonctionnel : landing, auth, dashboard, Supabase, Stripe, Google OAuth, Gmail, Calendar, WhatsApp webhook, agent IA, confirmations et RLS.",
      "Si aucune donnée utilisateur n’est encore disponible, les premières métriques à suivre sont : inscriptions, connexions Google, numéros WhatsApp associés, demandes par utilisateur actif, taux de succès, taux de confirmation et conversion payante.",
      "Le signal fort à prouver est la fréquence : l’utilisateur doit naturellement envoyer plusieurs demandes WhatsApp par semaine."
    ],
    icon: Rocket
  },
  {
    eyebrow: "10",
    title: "Roadmap",
    body: [
      "Court terme : stabiliser l’onboarding, aligner les plans Stripe avec l’offre commerciale, suivre les quotas, améliorer la classification d’intention et ajouter des analytics produit.",
      "Produit : création d’événements Calendar avec confirmation, envoi d’emails après confirmation, synthèse quotidienne proactive et templates de réponse.",
      "Expansion : intégrations CRM, mode équipe, règles de sécurité avancées, multi-comptes Google et connecteurs Slack ou Outlook."
    ],
    icon: ArrowRight
  },
  {
    eyebrow: "11",
    title: "Tech stack",
    body: [
      "Next.js pour l’application web, Tailwind pour l’interface, Supabase Auth et Database pour les utilisateurs et données, avec RLS pour l’isolation.",
      "Stripe gère les abonnements. Google OAuth connecte Gmail et Calendar. WhatsApp Business Cloud API reçoit et envoie les messages.",
      "OpenAI comprend les demandes et génère les résumés ou brouillons. Le projet est compatible Vercel."
    ],
    icon: LockKeyhole
  },
  {
    eyebrow: "12",
    title: "Vision long terme",
    body: [
      "Assistia commence par emails et calendrier depuis WhatsApp, mais la vision est plus large : devenir un OS personnel conversationnel.",
      "L’utilisateur ne devrait pas ouvrir cinq applications pour savoir quoi faire, retrouver une information ou préparer une action.",
      "Assistia peut devenir la couche d’exécution personnelle au-dessus des outils professionnels existants : légère, mobile, conversationnelle et contrôlée."
    ],
    icon: ShieldCheck
  }
];

const productCapabilities = [
  ["Gmail", "Résumé des emails du jour, emails importants, recherche et brouillons de réponse.", Mail],
  ["Calendar", "Agenda du jour, après-midi, recherche d’événement et déplacement confirmé.", CalendarDays],
  ["WhatsApp", "Réception des demandes, réponses automatiques et historique des messages.", MessageCircle],
  ["Sécurité", "Confirmations explicites, logs d’action, RLS Supabase et tokens chiffrés.", ShieldCheck]
];

export default function PitchPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link className="flex items-center gap-2 text-sm font-semibold" href="/">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-black">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </span>
            Assistia
          </Link>
          <Link
            className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            href="/"
          >
            Retour landing
          </Link>
        </div>
      </header>

      <section className="border-b border-white/10 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#25D366]">
            Pitch investisseur
          </p>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-normal sm:text-7xl">
                L’assistant personnel dans WhatsApp.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
                Assistia aide les professionnels à gérer emails, rendez-vous et actions courantes
                depuis une conversation WhatsApp, avec confirmation avant toute action sensible.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-semibold text-white">Résumé</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                MVP fonctionnel avec Next.js, Supabase, Stripe, Google OAuth, Gmail, Calendar,
                WhatsApp Business Cloud API et OpenAI. Le produit est prêt à mesurer l’usage réel :
                activation, fréquence, succès des demandes et conversion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {productCapabilities.map(([title, text, Icon]) => (
            <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5" key={String(title)}>
              <Icon className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
              <h2 className="mt-5 text-lg font-semibold">{String(title)}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{String(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-5">
          {sections.map((section) => (
            <article
              className="grid gap-6 rounded-lg border border-white/10 bg-white/[0.025] p-6 md:grid-cols-[220px_1fr]"
              key={section.title}
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-black">
                    <section.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-[#25D366]">{section.eyebrow}</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">{section.title}</h2>
                <div className="mt-5 grid gap-4 text-base leading-7 text-zinc-400">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
