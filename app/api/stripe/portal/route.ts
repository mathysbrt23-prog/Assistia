import { NextResponse } from "next/server";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { supabase, user } = await requireApiUser();
    const { data: profile } = await supabase
      .from("users_profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: "Aucun client Stripe associé." }, { status: 400 });
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: absoluteUrl("/dashboard")
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    return NextResponse.json({ error: "Portail Stripe indisponible." }, { status: 500 });
  }
}
