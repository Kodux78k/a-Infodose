(function(){
"use strict";
const SEL = ".app > section:not([data-mxp-static])";
function sessionize(section){
  if (section.dataset.mxpSession === "1") return;
  if (section.classList.contains("session-window")) return;
  if (section.querySelector(":scope > .win-hdr")) return;
  if (!section.closest(".app")) return;
  section.dataset.mxpSession = "1";
  section.classList.add("session-window");
  section.dataset.sessionId = section.dataset.sessionId || section.id;
  const title = (section.querySelector(".section-title")?.textContent || "").trim() || section.dataset.title || section.id || "SESSION";
  section.dataset.sessionTitle = title;
  const hdr = document.createElement("header");
  hdr.className = "win-hdr"; hdr.dataset.sessionHeader = "1";
  const titleEl = document.createElement("div");
  titleEl.className = "mxp-title"; titleEl.textContent = title; titleEl.title = "Toque 2× para renomear";
  const controls = document.createElement("div");
  controls.className = "win-controls";
  controls.innerHTML = '<button type="button" data-sn="collapse" data-action="session:collapse" aria-label="Recolher">−</button><button type="button" data-sn="maximize" data-action="session:maximize" aria-label="Maximizar">⛶</button><button type="button" data-sn="minimize" data-action="session:minimize" aria-label="Minimizar">۞</button><button type="button" data-sn="close" data-action="session:close" aria-label="Fechar">×</button>';
  hdr.append(titleEl, controls);
  const body = document.createElement("div");
  body.className = "win-body"; body.dataset.sessionBody = "1";
  while (section.firstChild){ body.appendChild(section.firstChild); }
  section.append(hdr, body);
  controls.addEventListener("click", function(e){
    const btn = e.target.closest("[data-sn]"); if (!btn) return;
    if (e.defaultPrevented) return;
    if (window.__LEGACY_SESSION_BOUND) return;
    switch (btn.dataset.sn){
      case "collapse": section.classList.toggle("collapsed"); break;
      case "maximize": section.classList.toggle("maximized"); break;
      case "minimize": window.KBLX_minimizeToDock?.(section, { title: section.dataset.sessionTitle }); break;
      case "close": section.classList.add("minimized"); break;
    }
    document.dispatchEvent(new CustomEvent("mxp:section-action", { detail:{ section, action: btn.dataset.sn } }));
  });
  let lastTap = 0;
  titleEl.addEventListener("click", function(){
    const now = Date.now();
    if (now - lastTap < 380){
      const novo = prompt("Nome da section:", section.dataset.sessionTitle);
      if (novo && novo.trim()){ section.dataset.sessionTitle = novo.trim(); titleEl.textContent = novo.trim();
        document.dispatchEvent(new CustomEvent("mxp:section-renamed", { detail:{ section, title: section.dataset.sessionTitle } })); }
      lastTap = 0;
    } else { lastTap = now; }
  });
}
function boot(){ document.querySelectorAll(SEL).forEach(sessionize); console.log("[MXP] sections → session-windows:", document.querySelectorAll(".app > section.session-window:not([data-mxp-static])").length); }
boot();
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once:true });
window.MXPSectionAdapter = { boot, sessionize };
})();