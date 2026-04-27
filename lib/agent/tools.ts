import {
  confirmCalendarMove,
  findCalendarEvent,
  formatCalendarEvents,
  getAfternoonCalendarEvents,
  getTodayCalendarEvents,
  proposeCalendarMove
} from "@/lib/google/calendar";
import {
  draftEmailReply,
  searchEmails,
  summarizeImportantEmails,
  summarizeTodayEmails
} from "@/lib/google/gmail";
import { sendWhatsAppText } from "@/lib/whatsapp/client";

export const agentTools = {
  confirmCalendarMove,
  draftEmailReply,
  findCalendarEvent,
  formatCalendarEvents,
  getAfternoonCalendarEvents,
  getTodayCalendarEvents,
  proposeCalendarMove,
  searchEmails,
  sendWhatsAppMessage: sendWhatsAppText,
  summarizeImportantEmails,
  summarizeTodayEmails
};
