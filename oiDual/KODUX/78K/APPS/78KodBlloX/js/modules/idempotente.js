(function(){
  "use strict";
  const SEL = ".app > section:not([data-mxp-static])";

  function sessionize(section){
    /* idempotente */
    if (section.dataset.mxpSession === "1") return;
    /* já é session-window (ex: #s0 Slicer) — não re-embrulhar */
    if (section.classList.contains("session-window")) return;
    /* guard estrutural: já tem MXP header */
    if (section.querySelector(":scope > .win-hdr")) return;
    /* segurança: só dentro do .app */
    if (!section.closest(".app")) return;

    section.dataset.mxpSession = "1";
    section.classList.add("session-window");
    /* identidade única — mesma chave usada pelas sessions dinâmicas
       do §G e pelas dock-bubbles, pra tudo ficar linkado por data-* */
    section.dataset.sessionId = section.dataset.sessionId || section.id;

    const title =
      (section.querySelector(".section-title")?.textContent || "").trim()
      || section.dataset.title
      || section.id
      || "SESSION";
    section.dataset.sessionTitle = title;

    /* ── header ─────────────────────────────────────── */
    const hdr = document.createElement("header");
    hdr.className = "win-hdr";
    hdr.dataset.sessionHeader = "1";

    const titleEl = document.createElement("div");
    titleEl.className = "mxp-title";
    titleEl.textContent = title;
    titleEl.title = "Toque 2× para renomear";

    const controls = document.createElement("div");
    controls.className = "win-controls";
    controls.innerHTML =
      '<button type="button" data-sn="collapse" data-action="session:collapse" aria-label="Recolher">−</button>' +
      '<button type="button" data-sn="maximize" data-action="session:maximize" aria-label="Maximizar">⛶</button>' +
      '<button type="button" data-sn="minimize" data-action="session:minimize" aria-label="Minimizar">۞</button>' +
      '<button type="button" data-sn="close"    data-action="session:close"    aria-label="Fechar">×</button>';

    hdr.append(titleEl, controls);

    /* ── body ───────────────────────────────────────── */
    const body = document.createElement("div");
    body.className = "win-body";
    body.dataset.sessionBody = "1";

    /* preserva TODO o conteúdo existente (inclusive .section-head) */
    while (section.firstChild){
      body.appendChild(section.firstChild);
    }

    section.append(hdr, body);

    /* ── controles ──────────────────────────────────── */
    controls.addEventListener("click", function(e){
      const btn = e.target.closest("[data-sn]");
      if (!btn) return;
      /* se o Factory/legacy já tratou via data-action, respeita */
      if (e.defaultPrevented) return;
      /* se o legacy assumiu o controle global, não duplica */
      if (window.__LEGACY_SESSION_BOUND) return;

      switch (btn.dataset.sn){
        case "collapse": section.classList.toggle("collapsed"); break;
        case "maximize": section.classList.toggle("maximized"); break;
        case "minimize":
          window.KBLX_minimizeToDock?.(section, { title: section.dataset.sessionTitle });
          break;
        case "close":    section.classList.add("minimized");    break;
      }

      /* notifica o Factory/legacy */
      document.dispatchEvent(new CustomEvent("mxp:section-action", {
        detail: { section, action: btn.dataset.sn }
      }));
    });

    /* duplo-tap no título renomeia (mesmo padrão das sessions MXP) */
    let lastTap = 0;
    titleEl.addEventListener("click", function(){
      const now = Date.now();
      if (now - lastTap < 380){
        const novo = prompt("Nome da section:", section.dataset.sessionTitle);
        if (novo && novo.trim()){
          section.dataset.sessionTitle = novo.trim();
          titleEl.textContent = novo.trim();
          document.dispatchEvent(new CustomEvent("mxp:section-renamed", {
            detail: { section, title: section.dataset.sessionTitle }
          }));
        }
        lastTap = 0;
      } else {
        lastTap = now;
      }
    });
  }

  function boot(){
    const list = document.querySelectorAll(SEL);
    list.forEach(sessionize);
    const n = document.querySelectorAll(".app > section.session-window:not([data-mxp-static])").length;
    console.log("[MXP] sections → session-windows:", n);
  }

  /* roda agora (todas as .app > section já estão parseadas) */
  boot();

  /* e de novo no DOMContentLoaded como safety net */
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, { once:true });
  }

  /* API pro Factory/MXP reprocessar conteúdo novo dinamicamente */
  window.MXPSectionAdapter = { boot, sessionize };
})();