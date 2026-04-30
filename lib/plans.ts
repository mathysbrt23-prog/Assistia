export type PlanId = "free" | "essential" | "pro";

export const DAILY_QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;

export const plans: Array<{
  id: PlanId;
  name: string;
  price: string;
  dailyReplies: number;
  description: string;
  priceEnv?: string;
  features: string[];
}> = [
  {
    id: "free",
    name: "Free",
    price: "0€",
    dailyReplies: 3,
    description: "Pour essayer Assistia sans carte bancaire.",
    features: [
      "3 réponses / jour",
      "Extension Gmail",
      "Tous les tons de réponse",
      "Blocage 24h quand le quota est atteint"
    ]
  },
  {
    id: "essential",
    name: "Essential",
    price: "4,99€",
    dailyReplies: 40,
    description: "Pour les indépendants qui répondent tous les jours.",
    priceEnv: "STRIPE_PRICE_ESSENTIAL",
    features: [
      "40 réponses / jour",
      "Extension Gmail",
      "Templates relance, prix, refus, SAV",
      "Préférences de ton"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: "19,99€",
    dailyReplies: 200,
    description: "Pour les profils sales, fondateurs et équipes en volume.",
    priceEnv: "STRIPE_PRICE_PRO",
    features: [
      "200 réponses / jour",
      "Extension Gmail",
      "Templates relance, prix, refus, SAV",
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

export function rollingQuotaWindowStartIso(now = new Date()) {
  return new Date(now.getTime() - DAILY_QUOTA_WINDOW_MS).toISOString();
}

export function nextQuotaResetIso(oldestUsageIso?: string | null, now = new Date()) {
  if (!oldestUsageIso) return new Date(now.getTime() + DAILY_QUOTA_WINDOW_MS).toISOString();
  return new Date(new Date(oldestUsageIso).getTime() + DAILY_QUOTA_WINDOW_MS).toISOString();
}
