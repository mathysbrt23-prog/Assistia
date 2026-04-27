import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiAuthError, requireApiUser, unauthorizedResponse } from "@/lib/auth";
import { getGoogleAuthUrl } from "@/lib/google/oauth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireApiUser();
    const state = randomBytes(24).toString("hex");
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
      httpOnly: true,
      maxAge: 10 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return NextResponse.redirect(getGoogleAuthUrl(state));
  } catch (error) {
    if (error instanceof ApiAuthError) return unauthorizedResponse();
    return NextResponse.json({ error: "Connexion Google indisponible." }, { status: 500 });
  }
}
