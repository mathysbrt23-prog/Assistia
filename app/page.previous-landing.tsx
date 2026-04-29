"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Chrome,
  Mail,
  MessageCircle,
  MousePointer2,
  PenLine,
  ShieldCheck,
  Sparkles,
  Wand2
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 }
  }
};

const replySuggestions = [
  "Merci pour ton retour. Le budget est un peu au-dessus de ce que j’avais prévu, mais je suis intéressé pour avancer si on peut ajuster le périmètre.",
  "Je peux te proposer un échange demain à 15h pour clarifier les points clés et voir comment avancer simplement.",
  "Je te confirme que le sujet m’intéresse. Je reviens vers toi avec une réponse structurée dans la journée."
];

const steps = [
  ["01", "Installe l’extension", "Assistia apparaît dans Gmail, WhatsApp Web et bientôt LinkedIn."],
  ["02", "Écris ton intention", "Sélectionne un message ou note ce que tu veux répondre en quelques mots."],
  ["03", "Valide le brouillon", "Assistia propose une réponse. Tu relis, ajustes et envoies toi-même."]
];

const demoFlows = [
  {
    title: "Relance client",
    intent: "Dis-lui que je relance gentiment pour le devis.",
    answer:
      "Bonjour Paul, je me permets de te relancer concernant le devis envoyé la semaine dernière. Dis-moi si tu as besoin d’un complément pour avancer."
  },
  {
    title: "Objection prix",
    intent: "Réponds que je comprends, mais que la qualité justifie le prix.",
    answer:
      "Je comprends totalement ton point. Le tarif reflète surtout le niveau d’accompagnement et le temps nécessaire pour livrer un résultat fiable."
  },
  {
    title: "Brouillon pro",
    intent: "ok pour demain mais pas trop tôt",
    answer:
      "Parfait pour demain. Est-ce que 11h pourrait te convenir ? Cela me laisserait le temps de préparer les éléments avant notre échange."
  }
];

const offers = [
  {
    name: "Free",
    price: "0€",
    text: "Pour tester Assistia sur tes premières réponses.",
    features: ["20 réponses / mois", "Gmail ou WhatsApp Web", "Tons pro, court, chaleureux"],
    cta: "Commencer"
  },
  {
    name: "Pro",
    price: "9€",
    text: "Pour répondre vite et bien tous les jours.",
    features: ["1 000 réponses / mois", "Gmail + WhatsApp Web", "Templates relance, prix, refus, SAV"],
    cta: "Essayer Pro"
  },
  {
    name: "Business",
    price: "29€",
    text: "Pour les petites équipes qui répondent aux clients.",
    features: ["3 utilisateurs inclus", "Ton de marque partagé", "Historique d’usage sans contenu sensible"],
    cta: "Choisir Business"
  }
];

const useCases = [
  "Relancer un client sans paraître insistant",
  "Refuser poliment une demande",
  "Répondre à une objection prix",
  "Transformer une phrase brute en email pro",
  "Raccourcir une réponse trop longue",
  "Rendre un message plus chaleureux ou plus ferme"
];

function WhatsAppLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 32 32">
      <path
        d="M16.05 3.2A12.56 12.56 0 0 0 5.4 22.43L3.72 28.6l6.32-1.65A12.55 12.55 0 1 0 16.05 3.2Z"
        fill="#25D366"
      />
      <path
        d="M22.9 18.8c-.37-.19-2.18-1.08-2.52-1.2-.34-.13-.59-.19-.84.18-.25.38-.96 1.2-1.18 1.45-.22.25-.44.28-.81.09-.37-.19-1.57-.58-2.99-1.85a11.2 11.2 0 0 1-2.07-2.57c-.22-.37-.02-.57.16-.75.17-.17.37-.44.56-.66.19-.22.25-.37.37-.62.13-.25.06-.47-.03-.66-.09-.19-.84-2.03-1.15-2.78-.3-.72-.61-.62-.84-.63h-.72c-.25 0-.66.09-1 .47-.34.37-1.31 1.28-1.31 3.12s1.34 3.62 1.53 3.87c.19.25 2.64 4.03 6.39 5.65.89.38 1.58.61 2.12.78.89.28 1.71.24 2.35.15.72-.11 2.18-.89 2.49-1.75.31-.86.31-1.59.22-1.75-.09-.16-.34-.25-.71-.44Z"
        fill="white"
      />
    </svg>
  );
}

function AssistiaLogo({ className, priority = false }: { className: string; priority?: boolean }) {
  return (
    <Image
      alt="Assistia"
      className={`${className} object-contain`}
      height={96}
      priority={priority}
      src="/assistia-logo-round.png"
      width={96}
    />
  );
}

function PrimaryLink({
  children,
  href,
  variant = "primary"
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const classes =
    variant === "primary"
      ? "bg-white text-black hover:bg-[#25D366]"
      : "border border-white/14 bg-white/[0.04] text-white hover:bg-white/[0.08]";

  return (
    <Link
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-normal transition ${classes}`}
      href={href}
    >
      {children}
    </Link>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <motion.div
      className="mx-auto max-w-3xl text-center"
      initial="hidden"
      variants={fadeUp}
      viewport={{ once: true, margin: "-90px" }}
      whileInView="visible"
    >
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#25D366]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {text ? <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">{text}</p> : null}
    </motion.div>
  );
}

function ExtensionMockup() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[680px]"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle_at_45%_12%,rgba(37,211,102,0.22),rgba(0,0,0,0)_54%)]" />
      <div className="relative overflow-hidden rounded-[28px] border border-white/14 bg-[#070809] shadow-[0_48px_140px_rgba(0,0,0,0.74)]">
        <div className="flex h-12 items-center gap-2 border-b border-white/10 bg-white/[0.045] px-4">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <div className="ml-3 flex h-7 flex-1 items-center gap-2 rounded-full bg-black/35 px-3 text-xs text-zinc-500">
            <Chrome className="h-3.5 w-3.5" aria-hidden="true" />
            mail.google.com
          </div>
        </div>

        <div className="grid min-h-[520px] gap-0 bg-[#090A0C] md:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-white/10 bg-white/[0.025] p-4 md:border-b-0 md:border-r">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
              Boîte de réception
            </div>
            {["Léo Martin", "Client ACME", "Sophie - devis", "Support"].map((sender, index) => (
              <div
                className={`mb-2 rounded-lg border px-3 py-3 ${
                  index === 0
                    ? "border-[#25D366]/45 bg-[#25D366]/10"
                    : "border-white/8 bg-white/[0.025]"
                }`}
                key={sender}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-white">{sender}</p>
                  <span className="text-[11px] text-zinc-500">10:{index + 2}4</span>
                </div>
                <p className="mt-1 truncate text-xs text-zinc-500">
                  {index === 0
                    ? "Retour sur votre proposition commerciale"
                    : "Message client en attente de réponse"}
                </p>
              </div>
            ))}
          </div>

          <div className="relative min-w-0 p-5 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Gmail</p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Retour sur votre proposition
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300">
                <AssistiaLogo className="h-5 w-5" priority />
                Assistia activé
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-zinc-300">
              Bonjour, merci pour la proposition. Le sujet nous intéresse, mais le budget est un peu
              haut pour nous pour le moment. Est-ce qu’on peut en discuter ?
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-black/35 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Réponse en cours</p>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-zinc-400">
                  ton pro
                </span>
              </div>
              <p className="text-sm leading-6 text-zinc-500">
                Je veux répondre que je comprends, mais que la qualité justifie le prix. Propose un
                appel demain.
              </p>
            </div>

            <motion.div
              className="absolute bottom-5 left-5 right-5 rounded-2xl border border-[#25D366]/30 bg-[#0F1612]/95 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:left-auto sm:right-6 sm:w-[390px]"
              initial="hidden"
              variants={stagger}
              viewport={{ once: true }}
              whileInView="visible"
            >
              <div className="mb-3 flex items-center gap-2">
                <AssistiaLogo className="h-8 w-8" priority />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">Assistia Reply</p>
                  <p className="text-xs text-zinc-500">3 réponses prêtes à insérer</p>
                </div>
                <Sparkles className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
              </div>
              <div className="grid gap-2">
                {replySuggestions.map((reply, index) => (
                  <motion.button
                    className={`rounded-lg border p-3 text-left text-xs leading-5 transition ${
                      index === 0
                        ? "border-[#25D366]/45 bg-[#25D366]/10 text-zinc-100"
                        : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.06]"
                    }`}
                    key={reply}
                    type="button"
                    variants={fadeUp}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <button className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-black transition hover:bg-[#25D366]">
                  <MousePointer2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Insérer
                </button>
                <p className="text-[11px] text-zinc-500">Assistia n’envoie jamais à ta place.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DemoCard({
  answer,
  intent,
  title
}: {
  answer: string;
  intent: string;
  title: string;
}) {
  return (
    <motion.article
      className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
      variants={fadeUp}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{title}</p>
        <Wand2 className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
      </div>
      <div className="grid gap-3">
        <div className="rounded-[16px] bg-white/[0.06] px-4 py-3 text-sm leading-6 text-zinc-300">
          {intent}
        </div>
        <div className="rounded-[16px] border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 text-sm leading-6 text-zinc-100">
          {answer}
        </div>
      </div>
    </motion.article>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-black/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link className="flex items-center gap-2 text-sm font-semibold" href="/">
            <AssistiaLogo className="h-8 w-8" priority />
            Assistia
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a className="transition hover:text-white" href="#fonctionnement">
              Fonctionnement
            </a>
            <a className="transition hover:text-white" href="#demo">
              Démo
            </a>
            <a className="transition hover:text-white" href="#offres">
              Offres
            </a>
          </nav>
          <Link
            className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            href="/tool"
          >
            Essayer
          </Link>
        </div>
      </header>

      <section className="relative min-h-screen border-b border-white/8 px-5 pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#111_0%,#000_42%,#000_100%)]" />
        <div className="absolute inset-x-0 top-16 h-px bg-white/10" />
        <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-14 pb-20 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div animate="visible" className="max-w-2xl" initial="hidden" variants={stagger}>
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300"
              variants={fadeUp}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
              Nouveau produit : Assistia Reply
            </motion.div>
            <motion.h1
              className="text-5xl font-semibold leading-[1.03] tracking-normal text-white sm:text-6xl lg:text-7xl"
              variants={fadeUp}
            >
              Réponds mieux, plus vite, sans quitter tes conversations.
            </motion.h1>
            <motion.p
              className="mt-6 max-w-xl text-lg leading-8 text-zinc-400 sm:text-xl"
              variants={fadeUp}
            >
              Assistia génère ou reformule tes réponses professionnelles directement dans Gmail et
              WhatsApp Web.
            </motion.p>
            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
              <PrimaryLink href="/tool">
                <WhatsAppLogo />
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </PrimaryLink>
              <PrimaryLink href="#demo" variant="secondary">
                Voir la démo
              </PrimaryLink>
            </motion.div>
          </motion.div>

          <div className="relative flex justify-center lg:justify-end">
            <ExtensionMockup />
          </div>
        </div>
      </section>

      <section className="border-b border-white/8 px-5 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <motion.div
            initial="hidden"
            variants={fadeUp}
            viewport={{ once: true, margin: "-90px" }}
            whileInView="visible"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#25D366]">
              Problème
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Savoir quoi dire prend trop d’énergie.
            </h2>
          </motion.div>
          <motion.div
            className="max-w-2xl text-lg leading-8 text-zinc-400"
            initial="hidden"
            variants={fadeUp}
            viewport={{ once: true, margin: "-90px" }}
            whileInView="visible"
          >
            <p>
              Emails clients, messages WhatsApp, relances, objections prix : le vrai blocage n’est
              pas d’écrire. C’est trouver le bon ton, vite, sans paraître froid, brouillon ou trop
              insistant.
            </p>
          </motion.div>
        </div>
      </section>

      <section
        className="scroll-mt-24 border-b border-white/8 px-5 py-24 sm:py-32"
        id="fonctionnement"
      >
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Comment ça marche"
            title="Une extension. Deux actions. Tu gardes le contrôle."
            text="Assistia vit dans le champ de réponse. Il propose un brouillon, mais ne clique jamais sur envoyer."
          />
          <motion.div
            className="mt-14 grid gap-4 md:grid-cols-3"
            initial="hidden"
            variants={stagger}
            viewport={{ once: true, margin: "-90px" }}
            whileInView="visible"
          >
            {steps.map(([number, title, text]) => (
              <motion.div
                className="rounded-lg border border-white/10 bg-[#080808] p-6"
                key={number}
                variants={fadeUp}
              >
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#25D366]">{number}</span>
                  <Check className="h-5 w-5 text-white/30" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="scroll-mt-24 border-b border-white/8 px-5 py-24 sm:py-32" id="demo">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <motion.div
              initial="hidden"
              variants={fadeUp}
              viewport={{ once: true, margin: "-90px" }}
              whileInView="visible"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#25D366]">
                Démo
              </p>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Une intention brute devient une réponse professionnelle.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-400">
                Tu écris ce que tu veux dire. Assistia le transforme en réponse claire, naturelle et
                adaptée au contexte.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-4"
              initial="hidden"
              variants={stagger}
              viewport={{ once: true, margin: "-90px" }}
              whileInView="visible"
            >
              {demoFlows.map((flow) => (
                <DemoCard
                  answer={flow.answer}
                  intent={flow.intent}
                  key={flow.title}
                  title={flow.title}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/8 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Cas d’usage"
            title="Construit pour les réponses que tu repousses."
            text="Assistia est pensé pour les situations où le fond est clair, mais la formulation compte."
          />
          <motion.div
            className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            variants={stagger}
            viewport={{ once: true, margin: "-90px" }}
            whileInView="visible"
          >
            {useCases.map((useCase) => (
              <motion.div
                className="flex min-h-[92px] items-center gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5"
                key={useCase}
                variants={fadeUp}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#25D366]" aria-hidden="true" />
                <p className="text-sm leading-6 text-zinc-200">{useCase}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/8 px-5 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {[
            ["Pas d’app à ouvrir", "Assistia apparaît dans les outils où tu réponds déjà."],
            ["Pas d’auto-send", "Chaque réponse reste un brouillon que tu valides toi-même."],
            ["Pas de stockage inutile", "Le produit vise le minimum de contexte nécessaire."]
          ].map(([title, text], index) => (
            <motion.div
              className="rounded-lg border border-white/10 bg-[#080808] p-6"
              initial="hidden"
              key={title}
              variants={fadeUp}
              viewport={{ once: true, margin: "-90px" }}
              whileInView="visible"
            >
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                {index === 0 ? (
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                ) : index === 1 ? (
                  <PenLine className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="scroll-mt-24 px-5 py-24 sm:py-32" id="offres">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, margin: "-90px" }}
          whileInView="visible"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#25D366]">
              Offres
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Commence petit. Réponds mieux.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Un plan gratuit pour tester, puis un abonnement simple si Assistia devient ton réflexe
              de réponse.
            </p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {offers.map((offer) => (
              <article
                className="flex rounded-lg border border-white/10 bg-white/[0.035] p-6"
                key={offer.name}
              >
                <div className="flex min-h-[360px] w-full flex-col">
                  <h3 className="text-xl font-semibold text-white">{offer.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{offer.text}</p>
                  <div className="mt-8 flex items-end gap-1">
                    <span className="text-5xl font-semibold tracking-normal text-white">
                      {offer.price}
                    </span>
                    <span className="pb-2 text-sm text-zinc-500">/mois</span>
                  </div>
                  <ul className="mt-8 grid gap-3 text-sm text-zinc-300">
                    {offer.features.map((feature) => (
                      <li className="flex items-center gap-3" key={feature}>
                        <ShieldCheck className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition hover:bg-[#25D366]"
                    href="/tool"
                  >
                    {offer.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
