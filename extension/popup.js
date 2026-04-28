const input = document.querySelector("[data-app-url]");
const save = document.querySelector("[data-save]");
const dashboard = document.querySelector("[data-dashboard]");
const status = document.querySelector("[data-status]");

chrome.storage.sync.get(["assistiaAppUrl"], (stored) => {
  input.value = stored.assistiaAppUrl || "http://localhost:3000";
});

save.addEventListener("click", () => {
  const value = input.value.trim().replace(/\/$/, "");
  chrome.storage.sync.set({ assistiaAppUrl: value }, () => {
    status.textContent = "URL enregistrée.";
  });
});

dashboard.addEventListener("click", () => {
  const appUrl = (input.value.trim() || "http://localhost:3000").replace(/\/$/, "");
  chrome.tabs.create({ url: `${appUrl}/dashboard` });
});
