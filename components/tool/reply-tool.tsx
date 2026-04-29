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
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
          <Wand2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#25D366]">Test web</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Tester Assistia</h2>
          <p className="mt-1 text-sm text-zinc-400">Colle un mail, écris ton intention, récupère une réponse prête.</p>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={generate}>
        <label className="grid gap-2 text-sm font-medium text-zinc-200">
          Mail ou message reçu
          <textarea
            className="focus-ring min-h-36 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white placeholder:text-zinc-500"
            onChange={(event) => setContext(event.target.value)}
            value={context}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-200">
          Ce que tu veux répondre
          <textarea
            className="focus-ring min-h-24 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white placeholder:text-zinc-500"
            onChange={(event) => setInstruction(event.target.value)}
            value={instruction}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-200">
          Ton
          <select
            className="focus-ring h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white"
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
          <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <Button className="h-12 rounded-2xl" disabled={loading || instruction.length < 2} type="submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Générer une réponse
        </Button>
      </form>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Réponse proposée</p>
          {usage ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-400">
              {usage.remaining} restantes
            </span>
          ) : null}
        </div>
        <textarea
          className="focus-ring min-h-40 w-full rounded-2xl border border-white/10 bg-[#050505] p-4 text-sm leading-6 text-white placeholder:text-zinc-500"
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
