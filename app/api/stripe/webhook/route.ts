import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPlanFromStripePrice } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function upsertSubscription(subscription: Stripe.Subscription) {
  const supabase = createSupabaseAdminClient();
  const sub = subscription as Stripe.Subscription & {
    current_period_end?: number;
    current_period_start?: number;
  };
  const priceId = subscription.items.data[0]?.price.id || null;
  const plan = getPlanFromStripePrice(priceId) || subscription.metadata.plan || null;
  const userId = subscription.metadata.user_id;

  if (!userId) return;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status: subscription.status,
      stripe_customer_id: String(subscription.customer),
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      current_period_start: sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    },
    { onConflict: "stripe_subscription_id" }
  );

  await supabase
    .from("users_profiles")
    .update({ stripe_customer_id: String(subscription.customer), updated_at: new Date().toISOString() })
    .eq("id", userId);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe non configuré." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature Stripe invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await upsertSubscription(subscription);
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await upsertSubscription(event.data.object as Stripe.Subscription);
  }

  return NextResponse.json({ received: true });
}
