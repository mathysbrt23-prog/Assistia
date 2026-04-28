const input = document.querySelector("[data-app-url]");
const token = document.querySelector("[data-token]");
const save = document.querySelector("[data-save]");
const dashboard = document.querySelector("[data-dashboard]");
const openPanel = document.querySelector("[data-open]");
const status = document.querySelector("[data-status]");

function normalizeUrl(value) {
  return String(value || "http://localhost:3000").trim().replace(/\/$/, "");
}

async function currentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
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
        extensionVersion: "0.2.0"
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
  chrome.tabs.sendMessage(tab.id, { type: "assistia.open" }, () => {
    if (chrome.runtime.lastError) {
      status.textContent = "Ouvre Gmail puis recharge la page.";
      return;
    }
    window.close();
  });
});
