const input = document.querySelector("[data-app-url]");
const token = document.querySelector("[data-token]");
const save = document.querySelector("[data-save]");
const dashboard = document.querySelector("[data-dashboard]");
const openPanel = document.querySelector("[data-open]");
const status = document.querySelector("[data-status]");
const EXTENSION_VERSION = "0.3.2";

function normalizeUrl(value) {
  return String(value || "http://localhost:3000").trim().replace(/\/$/, "");
}

async function currentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function isGmailTab(tab) {
  return typeof tab?.url === "string" && tab.url.startsWith("https://mail.google.com/");
}

async function injectAssistia(tabId) {
  await chrome.scripting.insertCSS({
    target: { tabId },
    files: ["content.css"]
  });
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"]
  });
}

chrome.storage.sync.get(["assistiaAppUrl", "assistiaExtensionToken"], (stored) => {
  input.value = stored.assistiaAppUrl || "http://localhost:3000";
  token.value = stored.assistiaExtensionToken || "";
});

save.addEventListener("click", async () => {
  const appUrl = normalizeUrl(input.value);
  const extensionToken = token.value.trim();

  await chrome.storage.sync.set({
    assistiaAppUrl: appUrl,
    assistiaExtensionToken: extensionToken
  });

  chrome.runtime.sendMessage(
    {
      type: "assistia.ping",
      payload: {
        source: "popup",
        extensionVersion: EXTENSION_VERSION
      }
    },
    (response) => {
      status.textContent = response?.ok
        ? "Extension connectée."
        : response?.error || "Paramètres enregistrés. Vérifie la clé.";
    }
  );
});

dashboard.addEventListener("click", () => {
  const appUrl = normalizeUrl(input.value);
  chrome.tabs.create({ url: `${appUrl}/dashboard` });
});

openPanel.addEventListener("click", async () => {
  const tab = await currentTab();
  if (!tab?.id) return;
  if (!isGmailTab(tab)) {
    status.textContent = "Ouvre Gmail pour afficher Assistia sur la page.";
    return;
  }

  try {
    await injectAssistia(tab.id);
  } catch {
    status.textContent = "Impossible d’injecter Assistia. Recharge Gmail puis réessaie.";
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "assistia.open" }, () => {
    if (chrome.runtime.lastError) {
      status.textContent = "Ouvre Gmail puis recharge la page.";
      return;
    }
    window.close();
  });
});
