import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d’utilisation - Assistia Reply",
  description: "Conditions d’utilisation d’Assistia Reply pour la v1 Gmail."
};

const sections = [
  {
    title: "1. Objet du service",
    content: [
      "Assistia Reply est un outil d’aide à la rédaction de réponses professionnelles. La v1 permet de générer ou reformuler des brouillons à partir du contenu visible d’un email Gmail.",
      "Le service ne remplace pas l’utilisateur : il prépare un texte que l’utilisateur doit relire, modifier si besoin, puis envoyer manuellement."
    ]
  },
  {
    title: "2. Compte utilisateur",
    content: [
      "L’utilisateur doit fournir des informations exactes lors de la création de son compte et protéger ses identifiants.",
      "L’utilisateur est responsable des actions effectuées depuis son compte Assistia et depuis son extension connectée."
    ]
  },
  {
    title: "3. Usage autorisé",
    content: [
      "Assistia doit être utilisé pour rédiger, reformuler ou préparer des réponses légitimes dans un cadre professionnel ou personnel.",
      "Il est interdit d’utiliser Assistia pour produire du spam, de l’usurpation d’identité, des contenus illégaux, trompeurs, abusifs ou portant atteinte aux droits de tiers."
    ]
  },
  {
    title: "4. Limites du service",
    content: [
      "Les réponses générées par IA peuvent contenir des erreurs, imprécisions ou formulations inadaptées. L’utilisateur doit toujours relire le brouillon avant envoi.",
      "Assistia ne garantit pas qu’une réponse générée sera adaptée à tous les contextes juridiques, commerciaux, médicaux, financiers ou RH."
    ]
  },
  {
    title: "5. Extension Chrome",
    content: [
      "L’extension v1 est conçue pour Gmail. Elle ajoute une interface Assistia à la page Gmail afin de générer et insérer un brouillon.",
      "L’extension n’envoie jamais d’email automatiquement et ne modifie pas les données Gmail en dehors de l’insertion volontaire du brouillon par l’utilisateur."
    ]
  },
  {
    title: "6. Abonnements et quotas",
    content: [
      "Assistia applique des limites d’usage selon le plan choisi : Free inclut 3 réponses par jour, Essential 40 réponses par jour et Pro 200 réponses par jour.",
      "Quand le quota est atteint, la génération est bloquée jusqu’à la prochaine fenêtre de 24 heures. Les quotas peuvent être modifiés pour protéger la stabilité du service et éviter les abus."
    ]
  },
  {
    title: "7. Résiliation et suppression",
    content: [
      "L’utilisateur peut arrêter d’utiliser Assistia à tout moment et demander la suppression de son compte.",
      "Pour toute demande liée au compte ou aux données, contactez Assistia à l’adresse : contact@assistia.ai."
    ]
  }
];

export default function TermsPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "contact@assistia.ai";

  return (
    <main className="min-h-screen bg-[#030303] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold text-[#25D366] hover:text-white" href="/">
          Assistia
        </Link>
        <h1 className="mt-8 text-4xl font-semibold sm:text-5xl">Conditions d’utilisation</h1>
        <p className="mt-5 text-sm leading-6 text-zinc-400">
          Dernière mise à jour : 29 avril 2026. Ces conditions décrivent l’usage de la v1
          d’Assistia Reply, centrée sur Gmail.
        </p>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6" key={section.title}>
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <div className="mt-4 grid gap-3">
                {section.content.map((paragraph) => (
                  <p className="text-sm leading-7 text-zinc-400" key={paragraph}>
                    {paragraph.replace("contact@assistia.ai", supportEmail)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-zinc-400">
          <Link className="hover:text-white" href="/privacy">
            Politique de confidentialité
          </Link>
          <Link className="hover:text-white" href="/tool">
            Installer Assistia
          </Link>
        </div>
      </div>
    </main>
  );
}
