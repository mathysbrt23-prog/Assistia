export type PlanId = "free" | "pro" | "business";

export const plans: Array<{
  id: PlanId;
  name: string;
  price: string;
  monthlyReplies: number;
  description: string;
  priceEnv?: string;
  features: string[];
}> = [
  {
    id: "free",
    name: "Free",
    price: "0€",
    monthlyReplies: 20,
    description: "Pour tester Assistia sur quelques réponses.",
    features: ["20 réponses / mois", "Extension Gmail", "Tons pro, court, chaleureux"]
  },
  {
    id: "pro",
    name: "Pro",
    price: "9€",
    monthlyReplies: 1000,
    description: "Pour répondre vite et bien tous les jours.",
    priceEnv: "STRIPE_PRICE_PRO",
    features: [
      "1 000 réponses / mois",
      "Extension Gmail",
      "Templates relance, prix, refus, SAV",
      "Préférences de ton"
    ]
  },
  {
    id: "business",
    name: "Team",
    price: "29€",
    monthlyReplies: 3000,
    description: "Pour les petites équipes qui répondent aux clients.",
    priceEnv: "STRIPE_PRICE_BUSINESS",
    features: [
      "3 000 réponses / mois",
      "3 utilisateurs inclus",
      "Ton de marque partagé",
      "Historique d’usage sans contenu sensible"
    ]
  }
];

export const paidPlans = plans.filter((plan) => plan.id !== "free");

export function getPlan(planId: string | null | undefined) {
  return plans.find((plan) => plan.id === planId);
}

export function getEffectivePlan(planId: string | null | undefined, active = false) {
  if (!active) return getPlan("free")!;
  return getPlan(planId) || getPlan("free")!;
}

export function getStripePriceId(planId: string) {
  const plan = getPlan(planId);
  if (!plan?.priceEnv) return null;
  return process.env[plan.priceEnv] || null;
}

export function getPlanFromStripePrice(priceId?: string | null) {
  if (!priceId) return null;
  return plans.find((plan) => plan.priceEnv && process.env[plan.priceEnv] === priceId)?.id || null;
}

export function isActiveSubscriptionStatus(status?: string | null) {
  return status === "active" || status === "trialing";
}
