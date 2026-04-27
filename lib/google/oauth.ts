import { google } from "googleapis";
import { absoluteUrl } from "@/lib/utils";

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events"
];

export function createGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || absoluteUrl("/api/google/callback");

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google OAuth environment variables.");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleAuthUrl(state: string) {
  const client = createGoogleOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: GOOGLE_SCOPES,
    state
  });
}

export function scopeIncludes(scope: string | null | undefined, expected: string) {
  return Boolean(scope?.split(/\s+/).includes(expected));
}
