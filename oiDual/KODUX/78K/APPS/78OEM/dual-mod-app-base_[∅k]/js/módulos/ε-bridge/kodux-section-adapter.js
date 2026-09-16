/* ═══════════════════════════════════════════════════════════
   §ADAPTER · kodux-section-adapter · Section → Session
   Arquétipo: KODUX · Prefixo: kodux_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

const dv_sel = ".genus_app > section:not([data-mxp-static])";

function kodux_sessionize(section){
  if (section.dataset.mxpSession === "1") return;
  if (section.classList.contains("rhea_session-window")) return;
  if (section.querySelector(":scope > .atlas_win-hdr")) return;
  if (!section.closest(".genus_app")) return;

  section.dataset.mxpSession = "1";
  section.classList.add("rhea_session-window");

  const title =
    (section.querySelector(".genus_section-title")?.textContent || "").trim()
    || section.dataset.title
    || section.id
    || "SESSION";
  section.dataset.sessionTitle = title;

  /* ── header ── */
  const hdr = document.createElement("header");
  hdr.className = "atlas_win-hdr";
  hdr.dataset.sessionHeader = "1";

  const titleEl = document.createElement("div");
  titleEl.className = "genus_mxp-title";
  titleEl.textContent = title;
  titleEl.title = "Toque 2× para renomear";

  const controls = document.createElement("div");
  controls.className = "atlas_win-controls";
  controls.innerHTML =
    '<button type="button" data-sn="collapse" data-action="session:collapse" aria-label="Recolher">−</button>' +
    '<button type="button" data-sn="maximize" data-action="session:maximize" aria-label="Maximizar">⛶</button>' +
    '<button type="button" data-sn="minimize" data-action="session:minimize" aria-label="Minimizar">۞</button>' +
    '<button type="button" data-sn="close"    data-action="session:close"    aria-label="Fechar">×</button>';

  hdr.append(titleEl, controls);

  /* ── body ── */
  const body = document.createElement("div");
  body.className = "atlas_win-body";
  body.dataset.sessionBody = "1";

  while (section.firstChild){
    body.appendChild(section.firstChild);
  }
  section.append(hdr, body);

  /* ── controles ── */
  controls.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-sn]");
    if (!btn) return;
    if (e.defaultPrevented) return;
    if (window.__LEGACY_SESSION_BOUND) return;

    switch (btn.dataset.sn){
      case "collapse": section.classList.toggle("kodux_collapsed"); break;
      case "maximize": section.classList.toggle("atlas_maximized"); break;
      case "minimize":
        window.kodux_minimize_to_dock?.(section, { title: section.dataset.sessionTitle });
        break;
      case "close": section.classList.add("solus_minimized"); break;
    }

    document.dispatchEvent(new CustomEvent("mxp:section-action", {
      detail: { section, action: btn.dataset.sn }
    }));
  });

  /* ── renomear 2× ── */
  let rt_lastTap = 0;
  titleEl.addEventListener("click", () => {
    const now = Date.now();
    if (now - rt_lastTap < 380){
      const novo = prompt("Nome da section:", section.dataset.sessionTitle);
      if (novo && novo.trim()){
        section.dataset.sessionTitle = novo.trim();
        titleEl.textContent = novo.trim();
        document.dispatchEvent(new CustomEvent("mxp:section-renamed", {
          detail: { section, title: section.dataset.sessionTitle }
        }));
      }
      rt_lastTap = 0;
    } else {
      rt_lastTap = now;
    }
  });
}

function kodux_adapter_boot(){
  const list = document.querySelectorAll(dv_sel);
  list.forEach(kodux_sessionize);
  const n = document.querySelectorAll(".genus_app > section.rhea_session-window:not([data-mxp-static])").length;
  console.log("[kodux-section-adapter] sections → rhea_session-window:", n);
}

kodux_adapter_boot();
if (document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", kodux_adapter_boot, { once:true });
}

window.kodux_section_adapter = { boot: kodux_adapter_boot, sessionize: kodux_sessionize };

console.log('[kodux-section-adapter] online');
})();

