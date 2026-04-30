import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!hasSupabaseConfig) {
    const fallbackPath = process.env.NODE_ENV === "production" ? "/signup?next=/tool" : "/tool";
    return NextResponse.redirect(new URL(fallbackPath, request.url));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return NextResponse.redirect(new URL(user ? "/tool" : "/signup?next=/tool", request.url));
}
