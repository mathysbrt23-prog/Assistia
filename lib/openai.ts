import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAI() {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }
  client = new OpenAI({ apiKey });
  return client;
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}
