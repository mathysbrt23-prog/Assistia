(() => {
  if (window.__assistiaReplyLoaded) return;
  window.__assistiaReplyLoaded = true;

  const EXTENSION_VERSION = "0.3.0";
  const STATE = {
    lastOutput: "",
    lastContext: "",
    selectedTone: "professionnel",
    isBusy: false
  };

  const root = document.createElement("div");
  root.className = "assistia-root";
  root.innerHTML = `
    <button class="assistia-reply-trigger" type="button" aria-label="Ouvrir Assistia">
      <span class="assistia-trigger-mark">A</span>
      <span>Assistia</span>
    </button>

    <section class="assistia-reply-panel" hidden>
      <header class="assistia-reply-head">
        <div class="assistia-brand">
          <span class="assistia-logo">A</span>
          <div>
            <p class="assistia-reply-title">Assistia</p>
            <p class="assistia-reply-subtitle" data-assistia-status>Prêt dans Gmail</p>
          </div>
        </div>
        <button class="assistia-reply-close" type="button" aria-label="Fermer">×</button>
      </header>

      <div class="assistia-context-card">
        <div>
          <p class="assistia-kicker">Mail détecté</p>
          <p class="assistia-context-title" data-assistia-context-title>Aucun mail détecté</p>
        </div>
        <button class="assistia-small-button" type="button" data-assistia-refresh>Relire</button>
      </div>

      <div class="assistia-reply-body">
        <label class="assistia-field">
          <span>Ton idée de réponse</span>
          <textarea data-assistia-instruction placeholder="Ex : dis-lui que je suis intéressé, mais que le budget est trop élevé. Propose un appel demain."></textarea>
        </label>

        <div class="assistia-tone-row" aria-label="Ton de réponse">
          <button class="is-active" type="button" data-tone="professionnel">Pro</button>
          <button type="button" data-tone="court">Court</button>
          <button type="button" data-tone="chaleureux">Chaleureux</button>
          <button type="button" data-tone="ferme">Ferme</button>
        </div>

        <button class="assistia-generate" type="button" data-assistia-generate>
          Générer la réponse
        </button>

        <div class="assistia-output-wrap">
          <div class="assistia-output-head">
            <p>Réponse proposée</p>
            <span data-assistia-usage></span>
          </div>
          <textarea class="assistia-reply-output" data-assistia-output placeholder="La réponse apparaîtra ici. Tu pourras l’ajuster avant de l’insérer."></textarea>
        </div>
      </div>

      <footer class="assistia-reply-actions">
        <button class="assistia-reply-secondary" type="button" data-assistia-copy>Copier</button>
        <button class="assistia-reply-secondary" type="button" data-assistia-rewrite>Reformuler</button>
        <button class="assistia-reply-primary" type="button" data-assistia-insert>Insérer dans Gmail</button>
      </footer>
    </section>
  `;

  document.documentElement.append(root);

  const panel = root.querySelector(".assistia-reply-panel");
  const trigger = root.querySelector(".assistia-reply-trigger");
  const close = root.querySelector(".assistia-reply-close");
  const status = root.querySelector("[data-assistia-status]");
  const contextTitle = root.querySelector("[data-assistia-context-title]");
  const refresh = root.querySelector("[data-assistia-refresh]");
  const instruction = root.querySelector("[data-assistia-instruction]");
  const output = root.querySelector("[data-assistia-output]");
  const usage = root.querySelector("[data-assistia-usage]");
  const generate = root.querySelector("[data-assistia-generate]");
  const rewrite = root.querySelector("[data-assistia-rewrite]");
  const insert = root.querySelector("[data-assistia-insert]");
  const copy = root.querySelector("[data-assistia-copy]");
  const toneButtons = Array.from(root.querySelectorAll("[data-tone]"));

  function isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function cleanText(value, max = 6000) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, max);
  }

  function textOf(selector, scope = document) {
    const element = scope.querySelector(selector);
    return cleanText(element?.innerText || element?.textContent || "", 500);
  }

  function getSource() {
    if (location.hostname.includes("mail.google.com")) return "gmail";
    if (location.hostname.includes("web.whatsapp.com")) return "whatsapp_web";
    if (location.hostname.includes("linkedin.com")) return "linkedin";
    if (location.hostname.includes("outlook")) return "outlook_web";
    return "manual";
  }

  function getGmailSubject() {
    return textOf("h2.hP") || textOf("[data-thread-id] h2") || textOf('[role="main"] h2');
  }

  function getGmailSender() {
    const sender = document.querySelector(".gD[email], .go, [email]");
    const name = sender?.getAttribute("name") || sender?.textContent || "";
    const email = sender?.getAttribute("email") || "";
    return cleanText([name, email ? `<${email}>` : ""].filter(Boolean).join(" "), 220);
  }

  function getVisibleGmailBodies() {
    const candidates = Array.from(
      document.querySelectorAll(".a3s.aiL, .a3s, .ii.gt div[dir], [role='main'] div[dir='ltr']")
    )
      .filter(isVisible)
      .map((node) => cleanText(node.innerText || node.textContent || "", 2400))
      .filter((text) => text.length > 40);

    return Array.from(new Set(candidates)).slice(-4);
  }

  function getGmailContext() {
    const selection = cleanText(window.getSelection()?.toString() || "", 5000);
    const subject = getGmailSubject();
    const sender = getGmailSender();
    const bodies = selection ? [selection] : getVisibleGmailBodies();

    if (!subject && !bodies.length) {
      return {
        title: "Ouvre un email Gmail",
        context: cleanText(document.body.innerText || "", 5000)
      };
    }

    const title = subject || "Conversation Gmail";
    const context = [
      subject ? `Sujet : ${subject}` : null,
      sender ? `Expéditeur : ${sender}` : null,
      bodies.length ? `Contenu visible :\n${bodies.join("\n\n---\n\n")}` : null
    ]
      .filter(Boolean)
      .join("\n\n");

    return { title, context: cleanText(context, 6000) };
  }

  function getGenericContext() {
    const selection = cleanText(window.getSelection()?.toString() || "", 5000);
    if (selection) return { title: "Sélection détectée", context: selection };
    return {
      title: document.title || "Page active",
      context: cleanText(document.body.innerText || "", 6000)
    };
  }

  function readContext() {
    const data = getSource() === "gmail" ? getGmailContext() : getGenericContext();
    STATE.lastContext = data.context;
    contextTitle.textContent = data.title || "Contexte détecté";
    status.textContent = data.context ? "Contexte prêt" : "Aucun contexte";
    return data;
  }

  function findReplyEditable() {
    const selectors = [
      "div[aria-label='Corps du message'][contenteditable='true']",
      "div[aria-label='Message Body'][contenteditable='true']",
      "div[g_editable='true'][role='textbox']",
      "div[contenteditable='true'][role='textbox']",
      "div[contenteditable='true'][aria-label*='message' i]",
      "textarea"
    ];

    for (const selector of selectors) {
      const elements = Array.from(document.querySelectorAll(selector)).filter(isVisible);
      const element = elements.at(-1);
      if (element) return element;
    }

    return null;
  }

  function clickReplyButton() {
    const buttons = Array.from(document.querySelectorAll("[role='button'], button")).filter(isVisible);
    const replyButton = buttons.find((button) => {
      const label = [
        button.getAttribute("aria-label"),
        button.getAttribute("data-tooltip"),
        button.getAttribute("title"),
        button.textContent
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return label.includes("répondre") || label.includes("reply");
    });

    if (replyButton) {
      replyButton.click();
      return true;
    }

    return false;
  }

  async function waitForEditable() {
    let editable = findReplyEditable();
    if (editable) return editable;

    clickReplyButton();
    await new Promise((resolve) => setTimeout(resolve, 600));
    editable = findReplyEditable();
    return editable;
  }

  function insertText(editable, text) {
    editable.focus();
    if ("value" in editable) {
      const start = editable.selectionStart ?? editable.value.length;
      const end = editable.selectionEnd ?? editable.value.length;
      editable.value = `${editable.value.slice(0, start)}${text}${editable.value.slice(end)}`;
      editable.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    document.execCommand("insertText", false, text);
    editable.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
    return true;
  }

  function setBusy(isBusy) {
    STATE.isBusy = isBusy;
    generate.disabled = isBusy;
    rewrite.disabled = isBusy;
    insert.disabled = isBusy;
    generate.textContent = isBusy ? "Assistia rédige..." : "Générer la réponse";
  }

  async function ping() {
    chrome.runtime.sendMessage({
      type: "assistia.ping",
      payload: {
        source: getSource(),
        extensionVersion: EXTENSION_VERSION,
        location: location.href
      }
    });
  }

  async function askAssistia(mode) {
    const value = cleanText(instruction.value, 1800);
    if (!value) {
      status.textContent = "Écris ton idée de réponse";
      instruction.focus();
      return;
    }

    const context = readContext().context;
    setBusy(true);
    status.textContent = "Génération en cours";
    output.value = "";
    usage.textContent = "";

    chrome.runtime.sendMessage(
      {
        type: "assistia.generate",
        payload: {
          mode,
          source: getSource(),
          context,
          instruction: value,
          draft: output.value,
          tone: STATE.selectedTone,
          language: "fr"
        }
      },
      (response) => {
        setBusy(false);
        if (!response?.ok) {
          status.textContent = "Action requise";
          output.value =
            response?.error ||
            "Impossible de générer. Vérifie l’URL et la clé extension dans le popup Chrome.";
          return;
        }

        STATE.lastOutput = response.data.reply;
        output.value = STATE.lastOutput;
        status.textContent = "Réponse prête";
        if (response.data.usage) {
          usage.textContent = `${response.data.usage.remaining} restantes`;
        }
      }
    );
  }

  function openPanel() {
    panel.hidden = false;
    readContext();
    ping();
    setTimeout(() => instruction.focus(), 80);
  }

  function closePanel() {
    panel.hidden = true;
  }

  trigger.addEventListener("click", () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });

  close.addEventListener("click", closePanel);
  refresh.addEventListener("click", readContext);

  toneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      STATE.selectedTone = button.dataset.tone;
      toneButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    });
  });

  generate.addEventListener("click", () => askAssistia("generate"));
  rewrite.addEventListener("click", () => askAssistia("rewrite"));

  copy.addEventListener("click", async () => {
    const text = cleanText(output.value || STATE.lastOutput, 3000);
    if (!text) return;
    await navigator.clipboard.writeText(text);
    status.textContent = "Réponse copiée";
  });

  insert.addEventListener("click", async () => {
    const text = cleanText(output.value || STATE.lastOutput, 3000);
    if (!text) {
      status.textContent = "Génère une réponse d’abord";
      return;
    }

    const editable = await waitForEditable();
    if (!editable) {
      await navigator.clipboard.writeText(text);
      status.textContent = "Réponse copiée. Clique sur Répondre puis colle-la.";
      return;
    }

    insertText(editable, text);
    status.textContent = "Brouillon inséré";
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "assistia.open") {
      openPanel();
    }
  });
})();
