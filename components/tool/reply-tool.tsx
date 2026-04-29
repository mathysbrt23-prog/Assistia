"use client";

import { Check, Copy, Loader2, Send, Wand2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

type GenerateResponse = {
  reply?: string;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
  };
  error?: string;
};

export function ReplyTool() {
  const [context, setContext] = useState(
    "Bonjour, merci pour la proposition. Le sujet nous intéresse, mais le budget est un peu haut pour nous pour le moment. Est-ce qu’on peut en discuter ?"
  );
  const [instruction, setInstruction] = useState(
    "Réponds que je comprends, mais que la qualité justifie le prix. Propose un appel demain."
  );
  const [tone, setTone] = useState("professionnel");
  const [reply, setReply] = useState("");
  const [usage, setUsage] = useState<GenerateResponse["usage"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setCopied(false);
    setError(null);

    const response = await fetch("/api/reply/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "generate",
        source: "manual",
        context,
        instruction,
        tone,
        language: "fr"
      })
    });

    const payload = (await response.json().catch(() => null)) as GenerateResponse | null;
    if (!response.ok || !payload?.reply) {
      setError(payload?.error || "Impossible de générer la réponse.");
      setLoading(false);
      return;
    }

    setReply(payload.reply);
    setUsage(payload.usage || null);
    setLoading(false);
  }

  async function copyReply() {
    if (!reply) return;
    await navigator.clipboard.writeText(reply);
    setCopied(true);
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-mint text-moss">
          <Wand2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink">Tester Assistia</h2>
          <p className="text-sm text-zinc-600">Colle un mail, écris ton intention, récupère une réponse prête.</p>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={generate}>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Mail ou message reçu
          <textarea
            className="focus-ring min-h-36 rounded-md border border-line bg-fog p-3 text-sm leading-6 text-ink"
            onChange={(event) => setContext(event.target.value)}
            value={context}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Ce que tu veux répondre
          <textarea
            className="focus-ring min-h-24 rounded-md border border-line bg-white p-3 text-sm leading-6 text-ink"
            onChange={(event) => setInstruction(event.target.value)}
            value={instruction}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Ton
          <select
            className="focus-ring h-11 rounded-md border border-line bg-white px-3 text-sm text-ink"
            onChange={(event) => setTone(event.target.value)}
            value={tone}
          >
            <option value="professionnel">Professionnel</option>
            <option value="court">Court</option>
            <option value="chaleureux">Chaleureux</option>
            <option value="ferme">Ferme</option>
            <option value="commercial">Commercial</option>
          </select>
        </label>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button disabled={loading || instruction.length < 2} type="submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Générer une réponse
        </Button>
      </form>

      <div className="mt-5 rounded-md border border-line bg-fog p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-ink">Réponse proposée</p>
          {usage ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600">
              {usage.remaining} restantes
            </span>
          ) : null}
        </div>
        <textarea
          className="focus-ring min-h-40 w-full rounded-md border border-line bg-white p-3 text-sm leading-6 text-ink"
          onChange={(event) => setReply(event.target.value)}
          placeholder="La réponse générée apparaîtra ici."
          value={reply}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button disabled={!reply} onClick={copyReply} type="button" variant="secondary">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copié" : "Copier"}
          </Button>
        </div>
      </div>
    </section>
  );
}
