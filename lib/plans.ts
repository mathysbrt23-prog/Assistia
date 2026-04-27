export type PlanId = "starter" | "pro" | "business";

export const plans: Array<{
  id: PlanId;
  name: string;
  price: string;
  monthlyMessages: number;
  description: string;
  priceEnv: string;
  features: string[];
}> = [
  {
    id: "starter",
    name: "Starter",
    price: "19€",
    monthlyMessages: 200,
    description: "Pour tester l’assistant sur les demandes personnelles.",
    priceEnv: "STRIPE_PRICE_STARTER",
    features: ["200 messages WhatsApp / mois", "Résumé Gmail", "Consultation agenda"]
  },
  {
    id: "pro",
    name: "Pro",
    price: "49€",
    monthlyMessages: 1000,
    description: "Pour utiliser WhatsAgent au quotidien.",
    priceEnv: "STRIPE_PRICE_PRO",
    features: [
      "1 000 messages WhatsApp / mois",
      "Gmail + Calendar complet",
      "Modification de rendez-vous avec confirmation",
      "Historique des demandes"
    ]
  },
  {
    id: "business",
    name: "Business",
    price: "99€",
    monthlyMessages: 5000,
    description: "Pour les équipes et usages plus volumineux.",
    priceEnv: "STRIPE_PRICE_BUSINESS",
    features: [
      "5 000 messages WhatsApp / mois",
      "Plusieurs utilisateurs",
      "Support prioritaire",
      "Paramètres de sécurité avancés"
    ]
  }
];

export function getPlan(planId: string | null | undefined) {
  return plans.find((plan) => plan.id === planId);
}

export function getStripePriceId(planId: string) {
  const plan = getPlan(planId);
  if (!plan) return null;
  return process.env[plan.priceEnv] || null;
}

export function getPlanFromStripePrice(priceId?: string | null) {
  if (!priceId) return null;
  return plans.find((plan) => process.env[plan.priceEnv] === priceId)?.id || null;
}

export function isActiveSubscriptionStatus(status?: string | null) {
  return status === "active" || status === "trialing";
}
