"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  Chrome,
  CopyCheck,
  Gauge,
  LockKeyhole,
  Mail,
  MessageSquareText,
  MousePointer2,
  PenLine,
  ShieldCheck,
  Sparkles,
  Wand2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const reveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 }
  }
};

const proofPoints = [
  "Brouillons uniquement",
  "Pensé pour Gmail",
  "Extension Chrome",
  "Essai immédiat"
];

const features: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Mail,
    title: "Comprend le mail ouvert",
    text: "Assistia utilise le contexte visible dans Gmail pour proposer une réponse adaptée à l’échange."
  },
  {
    icon: PenLine,
    title: "Transforme une idée brute",
    text: "Écris ce que tu veux dire en une phrase. Assistia le reformule en message clair et professionnel."
  },
  {
    icon: MessageSquareText,
    title: "Standardise tes échanges client",
    text: "Relances, objections prix, refus ou suivi : Assistia aide à garder un ton clair dans Gmail."
  },
  {
    icon: ShieldCheck,
    title: "Ne décide jamais à ta place",
    text: "L’outil prépare et insère un brouillon. L’envoi reste toujours entre tes mains."
  }
];

const workflow = [
  {
    step: "01",
    title: "Ouvre un message",
    text: "Tu restes dans Gmail, sur le fil que tu dois traiter."
  },
  {
    step: "02",
    title: "Donne ton intention",
    text: "Quelques mots suffisent : accepter, refuser, négocier, relancer ou rassurer."
  },
  {
    step: "03",
    title: "Insère la réponse",
    text: "Assistia propose un brouillon prêt à ajuster, puis tu gardes le dernier mot."
  }
];

const demos = [
  {
    request: "Réponds que le prix est justifié, mais propose un appel demain.",
    answer:
      "Merci pour ton retour. Je comprends ton point sur le budget. Le tarif reflète le niveau d’accompagnement prévu, mais je peux te proposer un appel demain pour ajuster le périmètre si besoin."
  },
  {
    request: "Relance le devis sans paraître pressant.",
    answer:
      "Je me permets de revenir vers toi concernant le devis envoyé la semaine dernière. Dis-moi si tu souhaites que je clarifie certains points ou que nous en reparlions rapidement."
  },
  {
    request: "Refuse poliment, mais garde la relation ouverte.",
    answer:
      "Merci beaucoup pour ta proposition. Ce n’est pas le bon moment pour nous engager maintenant, mais je serais ravi de garder le contact pour une future opportunité."
  }
];

const pricing = [
  {
    name: "Free",
    price: "0€",
    description: "Pour tester la valeur en conditions réelles.",
    items: ["20 réponses par mois", "Générateur web", "Extension locale"],
    cta: "Commencer"
  },
  {
    name: "Pro",
    price: "9€",
    description: "Pour répondre mieux et plus vite chaque semaine.",
    items: ["1 000 réponses par mois", "Extension Gmail", "Tons professionnels"],
    cta: "Essayer Pro",
    featured: true
  },
  {
    name: "Team",
    price: "29€",
    description: "Pour harmoniser les réponses d’une petite équipe.",
    items: ["3 utilisateurs inclus", "Ton de marque partagé", "Usage équipe"],
    cta: "Choisir Team"
  }
];

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

function ButtonLink({
  children,
  href,
  variant = "primary"
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const style =
    variant === "primary"
      ? "bg-white text-black hover:bg-zinc-200"
      : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]";

  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition ${style}`}
      href={href}
    >
      {children}
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="mx-auto max-w-3xl text-center"
      initial="hidden"
      variants={stagger}
      viewport={{ once: true, margin: "-80px" }}
      whileInView="visible"
    >
      <motion.p className="text-sm font-semibold uppercase tracking-[0.18em] text-white" variants={reveal}>
        {eyebrow}
      </motion.p>
      <motion.h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl" variants={reveal}>
        {title}
      </motion.h2>
      <motion.p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg" variants={reveal}>
        {children}
      </motion.p>
    </motion.div>
  );
}

function Header() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
      <Link className="flex items-center gap-3" href="/">
        <AssistiaLogo className="h-10 w-10" priority />
        <span className="text-base font-semibold text-white">Assistia</span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
        <Link className="transition hover:text-white" href="#demo">
          Démo
        </Link>
        <Link className="transition hover:text-white" href="#fonctionnement">
          Fonctionnement
        </Link>
        <Link className="transition hover:text-white" href="#securite">
          Sécurité
        </Link>
        <Link className="transition hover:text-white" href="#prix">
          Prix
        </Link>
      </nav>
      <Link
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
        href="/tool"
      >
        Essayer
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </header>
  );
}

function HeroWorkspace() {
  return (
    <motion.div
      className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8"
      initial="hidden"
      variants={stagger}
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div
        className="overflow-hidden rounded-[28px] border border-white/10 bg-[#090A0B] shadow-[0_40px_140px_rgba(0,0,0,0.7)]"
        variants={reveal}
      >
        <div className="flex h-12 items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <div className="ml-3 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-full bg-black/40 px-3 text-xs text-zinc-500">
            <Chrome className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">mail.google.com</span>
          </div>
        </div>

        <div className="relative grid min-h-[640px] bg-[#070808] lg:grid-cols-[250px_1fr]">
          <aside className="hidden border-r border-white/10 p-5 lg:block">
            <div className="mb-5 flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black">
              <PenLine className="h-4 w-4" aria-hidden="true" />
              Nouveau message
            </div>
            {["Boîte de réception", "Messages suivis", "Envoyés", "Brouillons"].map((item, index) => (
              <div
                className={`mb-2 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                  index === 0 ? "bg-white/[0.07] text-white" : "text-zinc-500"
                }`}
                key={item}
              >
                <span>{item}</span>
                {index === 0 ? <span className="text-xs text-white">12</span> : null}
              </div>
            ))}
          </aside>

          <main className="min-w-0 p-4 sm:p-7">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-5 text-zinc-500">
              <Mail className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm">Retour sur la proposition commerciale</span>
              <span className="ml-auto rounded-full border border-white/10 px-3 py-1 text-xs">Client</span>
            </div>

            <div className="max-w-2xl py-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#635BFF] text-sm font-bold text-white">
                  LM
                </div>
                <div>
                  <p className="font-semibold text-white">Léo Martin</p>
                  <p className="text-sm text-zinc-500">leo@acme.co</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white">Budget et prochaine étape</h3>
              <div className="mt-5 space-y-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm leading-7 text-zinc-300">
                <p>Bonjour,</p>
                <p>
                  Merci pour la proposition. Le sujet nous intéresse, mais le budget est un peu haut
                  pour nous à ce stade.
                </p>
                <p>Est-ce qu’on peut en discuter pour voir s’il existe une option plus légère ?</p>
              </div>
            </div>

            <motion.div
              className="mx-auto mt-2 w-full max-w-[440px] rounded-[24px] border border-white/15 bg-[#0D0D0F]/95 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:absolute lg:right-7 lg:top-24"
              variants={reveal}
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <AssistiaLogo className="h-10 w-10" priority />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">Assistia</p>
                  <p className="text-xs text-zinc-500">Réponse professionnelle</p>
                </div>
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">Ton intention</p>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3 text-sm leading-6 text-zinc-200">
                  Réponds que je comprends, que le prix reflète l’accompagnement, et propose un appel demain.
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-white">Brouillon proposé</p>
                <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-3 text-sm leading-6 text-zinc-100">
                  Bonjour Léo, merci pour ton retour. Je comprends votre point sur le budget. La
                  proposition reflète le niveau d’accompagnement prévu, mais je serais ravi d’en
                  discuter demain pour ajuster le périmètre si besoin.
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-black">
                  <MousePointer2 className="h-4 w-4" aria-hidden="true" />
                  Insérer
                </button>
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] text-sm font-semibold text-white">
                  <Wand2 className="h-4 w-4" aria-hidden="true" />
                  Ajuster
                </button>
              </div>
            </motion.div>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProofStrip() {
  return (
    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 px-5 sm:px-8 md:grid-cols-4">
      {proofPoints.map((point) => (
        <div
          className="flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-4 text-center text-sm text-zinc-300"
          key={point}
        >
          {point}
        </div>
      ))}
    </div>
  );
}

function ProductSection() {
  return (
    <section className="px-5 py-24 sm:px-8" id="produit">
      <SectionHeading eyebrow="Produit" title="Une extension IA qui travaille là où la réponse se joue.">
        Assistia ne remplace pas Gmail. Il ajoute une couche intelligente au-dessus de tes messages
        pour écrire plus vite, avec plus de nuance et moins de friction.
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
              initial="hidden"
              key={feature.title}
              variants={reveal}
              viewport={{ once: true, margin: "-80px" }}
              whileInView="visible"
            >
              <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="border-y border-white/10 bg-white/[0.018] px-5 py-24 sm:px-8" id="fonctionnement">
      <SectionHeading eyebrow="Workflow" title="Trois gestes. Une réponse prête.">
        Pas de nouvel outil à apprendre. L’utilisateur reste dans son message, donne son intention,
        puis décide ce qui est envoyé.
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
        {workflow.map((item) => (
          <motion.div
            className="relative rounded-2xl border border-white/10 bg-[#080909] p-6"
            initial="hidden"
            key={item.step}
            variants={reveal}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="visible"
          >
            <span className="text-sm font-semibold text-white">{item.step}</span>
            <h3 className="mt-8 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section className="px-5 py-24 sm:px-8" id="demo">
      <SectionHeading eyebrow="Démo" title="De l’intention brute au message propre.">
        Assistia est conçu pour les petites réponses qui reviennent tous les jours : relancer,
        négocier, refuser, rassurer ou clarifier.
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4">
        {demos.map((demo, index) => (
          <motion.div
            className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-[0.9fr_1.3fr]"
            initial="hidden"
            key={demo.request}
            variants={reveal}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="visible"
          >
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
                <Wand2 className="h-4 w-4" aria-hidden="true" />
                Intention {index + 1}
              </div>
              <p className="text-sm leading-6 text-zinc-300">{demo.request}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/[0.06] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-white">
                <CopyCheck className="h-4 w-4" aria-hidden="true" />
                Brouillon Assistia
              </div>
              <p className="text-sm leading-6 text-zinc-100">{demo.answer}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="border-y border-white/10 bg-white/[0.018] px-5 py-24 sm:px-8" id="securite">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          <motion.p className="text-sm font-semibold uppercase tracking-[0.18em] text-white" variants={reveal}>
            Sécurité
          </motion.p>
          <motion.h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl" variants={reveal}>
            Une IA utile, mais jamais autonome.
          </motion.h2>
          <motion.p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg" variants={reveal}>
            Le produit est volontairement simple : comprendre le contexte visible, proposer un
            brouillon, laisser l’utilisateur valider. C’est plus rassurant, plus facile à adopter et
            plus adapté au MVP.
          </motion.p>
        </motion.div>

        <div className="grid gap-3">
          {[
            ["Aucun envoi automatique", "Assistia ne clique jamais sur Envoyer."],
            ["Contexte limité", "Le MVP travaille sur le message visible, pas sur toute la boîte mail."],
            ["Contrôle humain", "Chaque brouillon est relu, modifié et envoyé par l’utilisateur."]
          ].map(([title, text]) => (
            <motion.div
              className="flex gap-4 rounded-2xl border border-white/10 bg-[#080909] p-5"
              initial="hidden"
              key={title}
              variants={reveal}
              viewport={{ once: true, margin: "-80px" }}
              whileInView="visible"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="border-t border-white/10 px-5 py-24 sm:px-8" id="prix">
      <SectionHeading eyebrow="Prix" title="Simple à tester. Facile à rentabiliser.">
        L’objectif du pricing est clair : faire essayer vite, puis devenir un réflexe quotidien pour
        les professionnels qui répondent beaucoup.
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4 lg:grid-cols-3">
        {pricing.map((plan) => (
          <motion.div
            className={`rounded-2xl border p-6 ${
              plan.featured
                ? "border-white/30 bg-white/[0.07]"
                : "border-white/10 bg-white/[0.035]"
            }`}
            initial="hidden"
            key={plan.name}
            variants={reveal}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="visible"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              {plan.featured ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                  Recommandé
                </span>
              ) : null}
            </div>
            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-semibold text-white">{plan.price}</span>
              <span className="pb-2 text-sm text-zinc-500">/ mois</span>
            </div>
            <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-400">{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.items.map((item) => (
                <li className="flex items-start gap-3 text-sm text-zinc-300" key={item}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className={`mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition ${
                plan.featured
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              }`}
              href="/tool"
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-5 pb-10 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-white/10 bg-white/[0.035] px-6 py-14 text-center sm:px-10">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
          <AssistiaLogo className="h-12 w-12" />
        </div>
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
          Essaie Assistia sur un vrai message en moins d’une minute.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          Colle un mail, écris ton intention, génère une réponse. L’extension vient ensuite quand tu
          veux le tester directement dans Gmail.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/tool">
            Essayer gratuitement
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="#demo" variant="secondary">
            Voir les exemples
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-white">
      <section className="relative border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(3,3,3,0)_34%),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_100%,80px_80px,80px_80px]"
        />
        <Header />

        <div className="relative z-10 mx-auto max-w-6xl px-5 pt-16 text-center sm:px-8 sm:pt-24">
          <motion.div initial="hidden" variants={stagger} animate="visible">
            <motion.div
              className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-zinc-300"
              variants={reveal}
            >
              <Gauge className="h-4 w-4 text-white" aria-hidden="true" />
              L’assistant de réponse qui vit dans Gmail
            </motion.div>
            <motion.h1
              className="mx-auto max-w-5xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
              variants={reveal}
            >
              Réponds parfaitement sans quitter ta conversation.
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400 sm:text-xl"
              variants={reveal}
            >
              Assistia lit le contexte visible, comprend ce que tu veux dire et transforme ton idée
              brute en brouillon professionnel prêt à insérer.
            </motion.p>
            <motion.div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row" variants={reveal}>
              <ButtonLink href="/tool">
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#demo" variant="secondary">
                Voir la démo
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>

        <HeroWorkspace />
        <ProofStrip />

        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-4 px-5 py-16 sm:px-8 md:grid-cols-3">
          {[
            ["30 sec", "pour passer d’une intention à un brouillon"],
            ["0 auto-send", "rien ne part sans validation humaine"],
            ["1 onglet", "tout se fait dans ton outil de travail"]
          ].map(([value, label]) => (
            <div
              className="rounded-2xl border border-white/10 bg-black/30 p-5 text-center"
              key={value}
            >
              <p className="text-3xl font-semibold text-white">{value}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductSection />
      <WorkflowSection />
      <DemoSection />
      <SecuritySection />
      <PricingSection />
      <FinalCTA />

      <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AssistiaLogo className="h-8 w-8" />
            <span>Assistia</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link className="transition hover:text-white" href="/tool">
              Essayer
            </Link>
            <Link className="transition hover:text-white" href="/privacy">
              Confidentialité
            </Link>
            <Link className="transition hover:text-white" href="/terms">
              Conditions
            </Link>
            <Link className="transition hover:text-white" href="#securite">
              Sécurité
            </Link>
            <Link className="transition hover:text-white" href="#prix">
              Prix
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
