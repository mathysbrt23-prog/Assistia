"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BatteryFull,
  Check,
  CheckCircle2,
  ChevronLeft,
  Mic,
  MoreVertical,
  Plus,
  ShieldCheck,
  Signal,
  Wifi
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

const heroMessages = [
  {
    from: "assistia",
    text: "Voici ton programme de la journée :\n- 10h : Call avec Paul\n- 14h : Rendez-vous client\n- 17h : Suivi projet"
  },
  {
    from: "user",
    text: "Tu as reçu le mail du Léo ?"
  },
  {
    from: "assistia",
    text: "Oui, il est prêt à investir 10 000€.\nJe te prépare une réponse ?"
  }
];

const steps = [
  ["01", "Connecte tes outils", "Gmail, Calendar et WhatsApp Business."],
  ["02", "Écris sur WhatsApp", "Pose une question comme à un assistant humain."],
  ["03", "Assistia agit pour toi", "Les actions sensibles restent confirmées avant exécution."]
];

const demoFlows = [
  {
    title: "Résumé de mails",
    messages: [
      ["user", "Résume mes mails du jour"],
      ["assistia", "4 emails importants. Léo confirme son intérêt, Marie demande un créneau, Finance attend ta validation."]
    ]
  },
  {
    title: "Déplacement de rendez-vous",
    messages: [
      ["user", "Décale le call avec Paul à demain 15h"],
      ["assistia", "Je peux déplacer “Call avec Paul” à demain 15h. Confirmer ? Réponds OUI pour valider."]
    ]
  },
  {
    title: "Réponse automatique",
    messages: [
      ["user", "Prépare une réponse à Léo"],
      ["assistia", "Brouillon prêt : merci pour ton retour, je te propose un échange demain pour cadrer l’investissement."]
    ]
  }
];

const offers = [
  {
    name: "Découverte",
    price: "0€",
    text: "Pour tester Assistia avec les bases.",
    features: ["25 messages WhatsApp", "Résumé de mails", "Agenda du jour"],
    cta: "Commencer"
  },
  {
    name: "Pro",
    price: "9€",
    text: "Pour piloter ta journée sans friction.",
    features: ["500 messages WhatsApp", "Gmail + Calendar", "Confirmations sensibles"],
    cta: "Essayer Pro"
  },
  {
    name: "Business",
    price: "29€",
    text: "Pour les équipes et les usages intensifs.",
    features: ["2 000 messages WhatsApp", "Historique complet", "Support prioritaire"],
    cta: "Choisir Business"
  }
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

function AssistiaLogo({ className }: { className: string }) {
  return (
    <Image
      alt="Assistia"
      className={`${className} object-cover`}
      height={96}
      src="/assistia-logo.png"
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

function WhatsAppBubble({ from, text }: { from: string; text: string }) {
  const isUser = from === "user";

  return (
    <motion.div
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      variants={{
        hidden: { opacity: 0, x: isUser ? 22 : -22, y: 10 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
        }
      }}
    >
      {!isUser ? (
        <AssistiaLogo className="mb-1 h-9 w-9 shrink-0 rounded-xl border border-white/10 bg-black shadow-[0_0_18px_rgba(255,255,255,0.12)]" />
      ) : null}
      <div
        className={`max-w-[83%] whitespace-pre-line rounded-[19px] px-4 py-3 text-[15px] leading-6 shadow-[0_12px_30px_rgba(0,0,0,0.22)] ${
          isUser
            ? "rounded-tr-md bg-[linear-gradient(135deg,#176944,#0E4B35)] text-white"
            : "rounded-tl-md bg-[#1B242C] text-zinc-100"
        }`}
      >
        {text}
        <span className={`mt-1 block text-right text-[11px] leading-none ${isUser ? "text-white/40" : "text-white/30"}`}>
          {isUser ? "08:02 ✓✓" : "08:00"}
        </span>
      </div>
    </motion.div>
  );
}

function PhoneMockup() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[430px]"
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div className="absolute -inset-7 rounded-[72px] bg-[radial-gradient(circle_at_50%_0%,rgba(60,74,86,0.42),rgba(0,0,0,0)_64%)]" />
      <div className="absolute -left-1 top-36 h-20 w-1 rounded-l-full bg-white/18" />
      <div className="absolute -left-1 top-64 h-28 w-1 rounded-l-full bg-white/18" />
      <div className="absolute -right-1 top-56 h-28 w-1 rounded-r-full bg-white/18" />
      <div className="relative rounded-[64px] border border-white/22 bg-[#090A0C] p-[9px] shadow-[0_48px_140px_rgba(0,0,0,0.82)]">
        <div className="rounded-[58px] border border-white/12 bg-[#1A1D21] p-[3px]">
          <div className="relative flex h-[720px] overflow-hidden rounded-[53px] bg-[#071014] sm:h-[790px]">
            <div className="absolute left-1/2 top-4 z-30 h-9 w-36 -translate-x-1/2 rounded-full bg-black shadow-inner">
              <span className="absolute right-5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#101820] ring-1 ring-white/6" />
            </div>

            <div className="absolute inset-x-0 top-0 z-20 flex h-14 items-end justify-between px-8 pb-2 text-[15px] font-semibold text-white">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="h-4 w-4" aria-hidden="true" />
                <Wifi className="h-4 w-4" aria-hidden="true" />
                <BatteryFull className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(37,211,102,0.08),rgba(7,16,20,0)_34%),linear-gradient(180deg,#101820_0%,#071014_28%,#060B0D_100%)]" />

            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="z-10 mt-14 flex items-center gap-3 border-b border-white/6 bg-[#111920]/86 px-5 pb-4 pt-5 backdrop-blur-xl">
                <div className="flex items-center gap-1 text-[#3EA77A]">
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  <span className="text-sm font-semibold">12</span>
                </div>
                <AssistiaLogo className="h-10 w-10 rounded-xl border border-white/10 bg-black shadow-[0_0_18px_rgba(255,255,255,0.12)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xl font-semibold text-white">Assistia</p>
                    <CheckCircle2 className="h-4 w-4 fill-[#25D366] text-black" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-white/60">en ligne</p>
                </div>
                <MoreVertical className="h-5 w-5 text-white/70" aria-hidden="true" />
              </div>

              <motion.div
                className="relative z-10 flex flex-1 flex-col gap-4 px-4 pb-28 pt-5"
                initial="hidden"
                variants={stagger}
                viewport={{ once: true }}
                whileInView="visible"
              >
                <div className="mx-auto rounded-full bg-white/[0.06] px-4 py-1.5 text-[12px] font-medium text-white/70">
                  Aujourd’hui
                </div>
                {heroMessages.map((message) => (
                  <WhatsAppBubble from={message.from} key={message.text} text={message.text} />
                ))}
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 z-20 bg-[#111920]/86 px-5 pb-7 pt-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Plus className="h-7 w-7 text-white/70" aria-hidden="true" />
                  <div className="h-11 flex-1 rounded-full bg-white/[0.06]" />
                  <Mic className="h-6 w-6 text-white/70" aria-hidden="true" />
                </div>
                <div className="mx-auto mt-6 h-1.5 w-36 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DemoCard({
  title,
  messages
}: {
  title: string;
  messages: string[][];
}) {
  return (
    <motion.article
      className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
      variants={fadeUp}
    >
      <p className="mb-4 text-sm font-semibold text-white">{title}</p>
      <div className="grid gap-2">
        {messages.map(([from, text]) => (
          <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`} key={text}>
            <div
              className={`max-w-[86%] rounded-[16px] px-3 py-2 text-xs leading-5 ${
                from === "user" ? "bg-[#25D366] text-black" : "bg-white/10 text-zinc-100"
              }`}
            >
              {text}
            </div>
          </div>
        ))}
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
            <AssistiaLogo className="h-8 w-8 rounded-full border border-white/10 bg-black" />
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
            href="/signup"
          >
            Essayer
          </Link>
        </div>
      </header>

      <section className="relative min-h-screen border-b border-white/8 px-5 pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#111_0%,#000_42%,#000_100%)]" />
        <div className="absolute inset-x-0 top-16 h-px bg-white/10" />
        <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-14 pb-20 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            animate="visible"
            className="max-w-2xl"
            initial="hidden"
            variants={stagger}
          >
            <motion.h1
              className="text-5xl font-semibold leading-[1.03] tracking-normal text-white sm:text-6xl lg:text-7xl"
              variants={fadeUp}
            >
              Ton assistant personnel dans WhatsApp
            </motion.h1>
            <motion.p
              className="mt-6 max-w-xl text-lg leading-8 text-zinc-400 sm:text-xl"
              variants={fadeUp}
            >
              Gère tes emails, tes rendez-vous et tes tâches sans ouvrir une seule app.
            </motion.p>
            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
              <PrimaryLink href="/signup">
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
            <PhoneMockup />
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
              Trop d’apps. Trop de friction.
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
              Emails, calendar, Slack, Outlook : tout est dispersé. Chaque micro-action devient un
              changement de contexte, puis une perte d’attention.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/8 px-5 py-24 sm:py-32" id="fonctionnement">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Comment ça marche" title="Trois étapes. Zéro friction." />
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

      <section className="border-b border-white/8 px-5 py-24 sm:py-32" id="demo">
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
                Tout passe par WhatsApp.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-400">
                Un point d’entrée simple pour lire, comprendre, résumer et préparer tes actions
                quotidiennes.
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
                <DemoCard key={flow.title} messages={flow.messages} title={flow.title} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:py-32" id="offres">
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
              Choisis ton rythme.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              De la découverte gratuite à l’usage intensif, Assistia reste simple et contrôlable.
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
                    href="/signup"
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
