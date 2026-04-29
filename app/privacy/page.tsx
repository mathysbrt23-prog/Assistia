import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Assistia Reply",
  description: "Politique de confidentialité d’Assistia Reply pour la v1 Gmail."
};

const sections = [
  {
    title: "1. Données que nous collectons",
    content: [
      "Assistia Reply collecte les informations de compte nécessaires au fonctionnement du service : email, identifiant utilisateur, préférences de ton, langue et état d’abonnement lorsque Stripe sera activé.",
      "Lorsque l’utilisateur génère une réponse, Assistia peut traiter le contenu visible du mail Gmail ouvert, l’instruction écrite par l’utilisateur et le brouillon généré. Ces données sont nécessaires pour produire une réponse adaptée au contexte."
    ]
  },
  {
    title: "2. Données traitées par l’extension Chrome",
    content: [
      "L’extension v1 fonctionne uniquement sur Gmail. Elle lit le contenu visible ou sélectionné dans la page afin de préparer un brouillon de réponse.",
      "L’extension ne lit pas toute la boîte mail, ne parcourt pas l’historique Gmail et ne clique jamais sur le bouton d’envoi."
    ]
  },
  {
    title: "3. Utilisation de l’IA",
    content: [
      "Pour générer une réponse, le contexte visible du mail et l’instruction de l’utilisateur peuvent être transmis à l’API OpenAI.",
      "Assistia utilise ces informations uniquement pour produire le brouillon demandé. L’utilisateur reste responsable de relire, modifier et envoyer le message final."
    ]
  },
  {
    title: "4. Stockage et sécurité",
    content: [
      "Les clés d’extension sont stockées sous forme de hash côté base de données. La clé complète n’est affichée qu’une seule fois au moment de sa création.",
      "Les historiques de génération sont limités au strict nécessaire pour suivre l’usage, appliquer les quotas et améliorer le produit."
    ]
  },
  {
    title: "5. Ce qu’Assistia ne fait pas",
    content: [
      "Assistia n’envoie jamais un email automatiquement.",
      "Assistia ne supprime pas de mails, ne modifie pas les paramètres Gmail et ne vend pas les données utilisateur.",
      "Assistia ne demande pas d’accès Gmail API pour la v1 : le produit travaille depuis l’extension Chrome sur le contenu visible dans la page."
    ]
  },
  {
    title: "6. Droits utilisateur",
    content: [
      "L’utilisateur peut demander la suppression de son compte, de ses historiques et de ses données associées.",
      "Pour toute demande liée aux données personnelles, contactez Assistia à l’adresse : contact@assistia.ai."
    ]
  }
];

export default function PrivacyPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "contact@assistia.ai";

  return (
    <main className="min-h-screen bg-[#030303] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold text-[#25D366] hover:text-white" href="/">
          Assistia
        </Link>
        <h1 className="mt-8 text-4xl font-semibold sm:text-5xl">Politique de confidentialité</h1>
        <p className="mt-5 text-sm leading-6 text-zinc-400">
          Dernière mise à jour : 29 avril 2026. Cette politique concerne la v1 d’Assistia Reply,
          centrée sur la génération de brouillons professionnels dans Gmail.
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
          <Link className="hover:text-white" href="/terms">
            Conditions d’utilisation
          </Link>
          <Link className="hover:text-white" href="/tool">
            Tester Assistia
          </Link>
        </div>
      </div>
    </main>
  );
}
