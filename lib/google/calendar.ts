import { google, type calendar_v3 } from "googleapis";
import { getGoogleAuthClientForUser } from "@/lib/google/client";

export type CalendarEvent = {
  id: string;
  calendarId: string;
  summary: string;
  description?: string | null;
  location?: string | null;
  startIso: string;
  endIso: string;
  timeZone?: string | null;
  htmlLink?: string | null;
};

export type CalendarMoveProposal = {
  calendarId: string;
  eventId: string;
  eventSummary: string;
  oldStartIso: string;
  oldEndIso: string;
  newStartIso: string;
  newEndIso: string;
  timeZone?: string | null;
};

function offsetForTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );
  return asUtc - date.getTime();
}

function zonedDate(year: number, month: number, day: number, hour: number, minute: number, timeZone: string) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = offsetForTimeZone(utcGuess, timeZone);
  return new Date(utcGuess.getTime() - offset);
}

function todayParts(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    day: Number(values.day),
    month: Number(values.month),
    year: Number(values.year)
  };
}

function dayRange(timeZone = "Europe/Paris") {
  const parts = todayParts(timeZone);
  return {
    start: zonedDate(parts.year, parts.month, parts.day, 0, 0, timeZone),
    end: zonedDate(parts.year, parts.month, parts.day + 1, 0, 0, timeZone),
    afternoonStart: zonedDate(parts.year, parts.month, parts.day, 12, 0, timeZone),
    afternoonEnd: zonedDate(parts.year, parts.month, parts.day, 19, 0, timeZone)
  };
}

function normalizeEvent(event: calendar_v3.Schema$Event, calendarId = "primary"): CalendarEvent {
  const start = event.start?.dateTime || event.start?.date || new Date().toISOString();
  const end = event.end?.dateTime || event.end?.date || start;
  return {
    calendarId,
    description: event.description,
    endIso: new Date(end).toISOString(),
    htmlLink: event.htmlLink,
    id: event.id || "",
    location: event.location,
    startIso: new Date(start).toISOString(),
    summary: event.summary || "(Sans titre)",
    timeZone: event.start?.timeZone || event.end?.timeZone || null
  };
}

async function listEventsBetween(userId: string, start: Date, end: Date) {
  const auth = await getGoogleAuthClientForUser(userId);
  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.events.list({
    calendarId: "primary",
    orderBy: "startTime",
    singleEvents: true,
    timeMax: end.toISOString(),
    timeMin: start.toISOString()
  });

  return (response.data.items || []).map((event) => normalizeEvent(event));
}

export async function getTodayCalendarEvents(userId: string, timeZone = "Europe/Paris") {
  const range = dayRange(timeZone);
  return listEventsBetween(userId, range.start, range.end);
}

export async function getAfternoonCalendarEvents(userId: string, timeZone = "Europe/Paris") {
  const range = dayRange(timeZone);
  return listEventsBetween(userId, range.afternoonStart, range.afternoonEnd);
}

export async function findCalendarEvent(userId: string, query: string, timeZone = "Europe/Paris") {
  const auth = await getGoogleAuthClientForUser(userId);
  const calendar = google.calendar({ version: "v3", auth });
  const now = new Date();
  const future = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const response = await calendar.events.list({
    calendarId: "primary",
    orderBy: "startTime",
    q: query,
    singleEvents: true,
    timeMax: future.toISOString(),
    timeMin: now.toISOString(),
    timeZone
  });

  return (response.data.items || []).map((event) => normalizeEvent(event))[0] || null;
}

export function proposeCalendarMove(event: CalendarEvent, targetStartIso: string): CalendarMoveProposal {
  const oldStart = new Date(event.startIso);
  const oldEnd = new Date(event.endIso);
  const duration = Math.max(oldEnd.getTime() - oldStart.getTime(), 15 * 60 * 1000);
  const newStart = new Date(targetStartIso);
  const newEnd = new Date(newStart.getTime() + duration);

  return {
    calendarId: event.calendarId,
    eventId: event.id,
    eventSummary: event.summary,
    newEndIso: newEnd.toISOString(),
    newStartIso: newStart.toISOString(),
    oldEndIso: event.endIso,
    oldStartIso: event.startIso,
    timeZone: event.timeZone || undefined
  };
}

export async function confirmCalendarMove(userId: string, proposal: CalendarMoveProposal) {
  const auth = await getGoogleAuthClientForUser(userId);
  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.events.patch({
    calendarId: proposal.calendarId || "primary",
    eventId: proposal.eventId,
    requestBody: {
      end: {
        dateTime: proposal.newEndIso,
        timeZone: proposal.timeZone || undefined
      },
      start: {
        dateTime: proposal.newStartIso,
        timeZone: proposal.timeZone || undefined
      }
    }
  });

  return normalizeEvent(response.data, proposal.calendarId);
}

export function formatCalendarEvents(events: CalendarEvent[]) {
  if (!events.length) return "Aucun rendez-vous trouvé.";
  return events
    .map((event) => {
      const start = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(new Date(event.startIso));
      return `• ${start} — ${event.summary}${event.location ? ` (${event.location})` : ""}`;
    })
    .join("\n");
}
