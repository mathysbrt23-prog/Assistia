import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class ApiAuthError extends Error {
  status = 401;
}

export async function getUserOrNull() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function requireApiUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ApiAuthError("Utilisateur non authentifié.");
  }

  return { supabase, user };
}

export function unauthorizedResponse(message = "Connexion requise.") {
  return NextResponse.json({ error: message }, { status: 401 });
}
