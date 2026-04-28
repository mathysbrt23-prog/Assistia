import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { getPlan, getStripePriceId } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  plan: z.enum(["pro", "business"])
});

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireApiUser();
    const body = checkoutSchema.parse(await request.json());
    const plan = getPlan(body.plan);
    const priceId = getStripePriceId(body.plan);

    if (!plan || !priceId) {
      return NextResponse.json({ error: "Plan Stripe non configuré." }, { status: 400 });
    }

    const stripe = getStripe();
    const { data: profile } = await supabase
      .from("users_profiles")
      .select("stripe_customer_id,email")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || profile?.email || undefined,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      await supabase
        .from("users_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        user_id: user.id,
        plan: plan.id
      },
      mode: "subscription",
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan: plan.id
        }
      },
      success_url: absoluteUrl("/dashboard?stripe=success"),
      cancel_url: absoluteUrl("/pricing?stripe=cancelled")
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Impossible de créer la session Stripe." }, { status: 500 });
  }
}
