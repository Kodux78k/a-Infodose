/* ═══════════════════════════════════════════════════════════════════════════
   ∆§ · KOBLLUX BUNDLE · iFSw BRIDGE · v13
   ───────────────────────────────────────────────────────────────────────────
   Detecta se iFSw-base-full.js está ativo. Se sim, delega:
     · createSession      → legacy
     · updateBgAttr       → legacy
     · toggleDrawer       → legacy
     · initSolarPanel     → legacy
   Mantém todas as 16 arquétipos + voz + diálogo + nebula intactos.
   ═══════════════════════════════════════════════════════════════════════════ */
;(function (root) {
"use strict";

/* ── 1 · Detecção de Legacy ── */
const LEGACY = !!(
  root.iFSw || root.IFSW || root.InfodoseBase || root.SessionWindow
);
root.__LEGACY_SESSION_BOUND = LEGACY;

console.log(
  "%c[bundle.ifsw] legacy-bound = " + LEGACY,
  "color:#00f2ff;font-weight:bold"
);

/* ── 2 · Atalho para o bundle unificado ── */
const BASE = root.KOBLLUX_BUNDLE;

/* ── 3 · Bridge: se legacy existe, sobrescrevemos com delegadores ── */
if (LEGACY) {
  /* 3.1 · createSession → legacy */
  if (typeof root.createSession === "function" && root.genus_mxp) {
    const _orig = root.genus_mxp.createSession;
    root.genus_mxp.createSession = function (name) {
      try {
        const s = _orig.call(root.genus_mxp, name);
        document.dispatchEvent(new CustomEvent("mxp:session-created", { detail: { session: s } }));
        return s;
      } catch (e) {
        console.warn("[bridge] createSession legacy", e);
        return _orig.call(root.genus_mxp, name);
      }
    };
  }

  /* 3.2 · updateBgAttr → legacy */
  if (typeof root.updateBgAttr === "function" && root.serena_update_bg) {
    const _legacy = root.updateBgAttr;
    root.serena_update_bg = function (attr, val) {
      try { _legacy(attr, val); } catch (_) {}
      return root.serena_update_bg_original ? root.serena_update_bg_original(attr, val) : null;
    };
  }

  /* 3.3 · toggleDrawer → legacy */
  if (typeof root.toggleDrawer === "function" && root.lumine_toggle_drawer) {
    root.lumine_toggle_drawer = root.toggleDrawer;
  }

  /* 3.4 · Eventos do legacy → MXP */
  ["ifsw:session-open", "legacy:session-open", "session:open"].forEach(ev => {
    document.addEventListener(ev, e => {
      const url = e.detail && e.detail.url;
      if (url && root.genus_mxp && root.genus_mxp.createSession) {
        root.genus_mxp.createSession((e.detail && e.detail.name) || "legacy");
      }
    });
  });
}

/* ── 4 · Boot do bundle base + selo ── */
(function bootIFSw() {
  try {
    if (root.KOBLLUX_VOICE_SEED && root.KOBLLUX_VOICE_SEED.bindToCore) {
      root.KOBLLUX_VOICE_SEED.bindToCore();
    }
    if (root.aion_load) root.aion_load();

    console.log(
      "%c∆§ KOBLLUX BUNDLE · iFSw · 178 · Eli Lama Sabachthani",
      "color:#ffd700;background:#050608;padding:4px 8px;border-radius:4px;font-weight:bold;"
    );
  } catch (e) {
    console.error("[bundle.ifsw] boot error:", e);
  }
})();

})(typeof window !== "undefined" ? window : this);

/* ∴ Em Nome do Pai, do Filho e do Espírito Santo. Amém. */
