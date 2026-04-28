(() => {
  if (window.__assistiaReplyLoaded) return;
  window.__assistiaReplyLoaded = true;

  let lastOutput = "";

  const trigger = document.createElement("button");
  trigger.className = "assistia-reply-trigger";
  trigger.type = "button";
  trigger.innerHTML = "<span>✦</span> Assistia";

  const panel = document.createElement("section");
  panel.className = "assistia-reply-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="assistia-reply-head">
      <div>
        <p class="assistia-reply-title">Assistia Reply</p>
        <p class="assistia-reply-subtitle">Générer ou reformuler un brouillon</p>
      </div>
      <button class="assistia-reply-close" type="button" aria-label="Fermer">×</button>
    </div>
    <div class="assistia-reply-body">
      <textarea data-assistia-instruction placeholder="Exemple : réponds que je comprends, mais que le prix est justifié."></textarea>
      <select data-assistia-tone>
        <option value="professionnel">Professionnel</option>
        <option value="court">Court</option>
        <option value="chaleureux">Chaleureux</option>
        <option value="ferme">Ferme</option>
        <option value="commercial">Commercial</option>
      </select>
      <div class="assistia-reply-output" data-assistia-output>La réponse apparaîtra ici.</div>
    </div>
    <div class="assistia-reply-actions">
      <button class="assistia-reply-secondary" type="button" data-assistia-generate>Générer</button>
      <button class="assistia-reply-secondary" type="button" data-assistia-rewrite>Reformuler</button>
      <button class="assistia-reply-primary" type="button" data-assistia-insert>Insérer</button>
    </div>
  `;

  document.documentElement.append(trigger, panel);

  const instruction = panel.querySelector("[data-assistia-instruction]");
  const tone = panel.querySelector("[data-assistia-tone]");
  const output = panel.querySelector("[data-assistia-output]");
  const close = panel.querySelector(".assistia-reply-close");
  const generate = panel.querySelector("[data-assistia-generate]");
  const rewrite = panel.querySelector("[data-assistia-rewrite]");
  const insert = panel.querySelector("[data-assistia-insert]");

  function getSource() {
    if (location.hostname.includes("mail.google.com")) return "gmail";
    if (location.hostname.includes("web.whatsapp.com")) return "whatsapp_web";
    if (location.hostname.includes("linkedin.com")) return "linkedin";
    return "manual";
  }

  function activeEditable() {
    const element = document.activeElement;
    if (!element) return null;
    const tag = element.tagName?.toLowerCase();
    if (tag === "textarea" || tag === "input" || element.isContentEditable) return element;
    return document.querySelector('[contenteditable="true"][role="textbox"]');
  }

  function getContext() {
    const selection = window.getSelection()?.toString().trim();
    if (selection) return selection.slice(0, 5000);
    const editable = activeEditable();
    if (editable?.value) return String(editable.value).slice(0, 3000);
    if (editable?.innerText) return String(editable.innerText).slice(0, 3000);
    return document.body.innerText.slice(0, 5000);
  }

  function insertText(text) {
    const editable = activeEditable();
    if (!editable) {
      navigator.clipboard?.writeText(text);
      output.textContent = "Brouillon copié. Clique dans le champ de réponse puis colle-le.";
      return;
    }
    editable.focus();
    if ("value" in editable) {
      const start = editable.selectionStart ?? editable.value.length;
      const end = editable.selectionEnd ?? editable.value.length;
      editable.value = `${editable.value.slice(0, start)}${text}${editable.value.slice(end)}`;
      editable.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    document.execCommand("insertText", false, text);
  }

  async function askAssistia(mode) {
    const value = instruction.value.trim();
    if (!value) {
      output.textContent = "Écris d’abord ce que tu veux répondre.";
      return;
    }

    output.textContent = "Assistia prépare une réponse...";
    chrome.runtime.sendMessage(
      {
        type: "assistia.generate",
        payload: {
          mode,
          source: getSource(),
          context: getContext(),
          instruction: value,
          tone: tone.value,
          language: "fr"
        }
      },
      (response) => {
        if (!response?.ok) {
          output.textContent = response?.error || "Erreur Assistia.";
          return;
        }
        lastOutput = response.data.reply;
        output.textContent = lastOutput;
      }
    );
  }

  trigger.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) instruction.focus();
  });

  close.addEventListener("click", () => {
    panel.hidden = true;
  });

  generate.addEventListener("click", () => askAssistia("generate"));
  rewrite.addEventListener("click", () => askAssistia("rewrite"));
  insert.addEventListener("click", () => {
    if (lastOutput) insertText(lastOutput);
  });
})();
