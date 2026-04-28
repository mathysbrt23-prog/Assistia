chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["assistiaAppUrl"], (stored) => {
    if (!stored.assistiaAppUrl) {
      chrome.storage.sync.set({ assistiaAppUrl: "http://localhost:3000" });
    }
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "assistia.generate") return false;

  chrome.storage.sync.get(["assistiaAppUrl"], async (stored) => {
    const appUrl = (stored.assistiaAppUrl || "http://localhost:3000").replace(/\/$/, "");

    try {
      const response = await fetch(`${appUrl}/api/reply/generate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message.payload)
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        sendResponse({ ok: false, error: payload?.error || "Réponse Assistia indisponible." });
        return;
      }
      sendResponse({ ok: true, data: payload });
    } catch {
      sendResponse({ ok: false, error: "Impossible de contacter Assistia." });
    }
  });

  return true;
});
