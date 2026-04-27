import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "") {
  const base = process.env.APP_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "Non renseigné";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function normalizePhoneNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function compactText(value: string, max = 280) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}
