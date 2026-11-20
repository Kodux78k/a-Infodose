// Service Worker da Extensão gerada pelo DualInfodose Builder

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extensão instalada e pronta a funcionar.");
});

// Escuta mensagens vindas do popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "ok", message: "Background ativo!" });
  }
  return true;
});