const DEFAULT_APP_URL = "http://localhost:3000";
const ASSISTIA_ICON_PATHS = {
  16: "icons/icon16.png",
  32: "icons/icon32.png",
  48: "icons/icon48.png",
  128: "icons/icon128.png"
};

function normalizeAppUrl(value) {
  return String(value || DEFAULT_APP_URL).trim().replace(/\/$/, "");
}

function applyAssistiaIcon() {
  chrome.action.setIcon({ path: ASSISTIA_ICON_PATHS });
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(["assistiaAppUrl", "assistiaExtensionToken"]);
  return {
    appUrl: normalizeAppUrl(stored.assistiaAppUrl),
    token: String(stored.assistiaExtensionToken || "").trim()
  };
}

async function callAssistia(path, payload) {
  const { appUrl, token } = await getSettings();
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${appUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(payload || {})
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Assistia est indisponible.");
  }

  return data;
}

chrome.runtime.onInstalled.addListener(() => {
  applyAssistiaIcon();
  chrome.storage.sync.get(["assistiaAppUrl"], (stored) => {
    if (!stored.assistiaAppUrl) {
      chrome.storage.sync.set({ assistiaAppUrl: DEFAULT_APP_URL });
    }
  });
});

chrome.runtime.onStartup.addListener(() => {
  applyAssistiaIcon();
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message?.type !== "assistia.connect") return false;

  (async () => {
    try {
      const appUrl = normalizeAppUrl(message.appUrl);
      const token = String(message.token || "").trim();

      if (!token) {
        sendResponse({ ok: false, error: "Clé extension manquante." });
        return;
      }

      await chrome.storage.sync.set({
        assistiaAppUrl: appUrl,
        assistiaExtensionToken: token
      });

      const data = await callAssistia("/api/extension/ping", {
        source: "external-connect",
        extensionVersion: String(message.extensionVersion || "0.3.7"),
        location: sender?.url || undefined
      });

      sendResponse({ ok: true, data });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error?.message || "Impossible de connecter Assistia."
      });
    }
  })();

  return true;
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message?.type?.startsWith("assistia.")) return false;

  (async () => {
    try {
      if (message.type === "assistia.generate") {
        const data = await callAssistia("/api/reply/generate", message.payload);
        sendResponse({ ok: true, data });
        return;
      }

      if (message.type === "assistia.ping") {
        const data = await callAssistia("/api/extension/ping", message.payload);
        sendResponse({ ok: true, data });
        return;
      }

      sendResponse({ ok: false, error: "Action Assistia inconnue." });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error?.message || "Impossible de contacter Assistia."
      });
    }
  })();

  return true;
});
