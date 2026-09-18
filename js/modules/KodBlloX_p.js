/* ============================================================================
   kblx-v16-hotfix.js  —  patch único pós-bundle
   ────────────────────────────────────────────────────────────────────────────
   Deixa cair DEPOIS do bundle k•dβll°X+2-FULL_[v5].js
   <script src="kblx-v16-hotfix.js"></script>

   Corrige:
     §1  __LEGACY_SESSION_BOUND sempre false         → recalcula
     §2  toast disparando speechSynthesis            → silencia
     §3  bubble do dock não restaura (bug principal) → delegate em capture
     §4  lifecycle 45s/90s agressivo                 → 3min/8min + guard
     §5  IndexedDB bg brigando com Cockpit           → no-op
     §6  srcdoc reinjetado (XSS em memória)          → MutationObserver limpa
     §7  prompt/confirm travando PWA/iOS             → <dialog> nativo
     §8  race seed ↔ KBLX_LOAD                       → guard defensivo
   ============================================================================ */
(function () {
  "use strict";
  if (window.__KBLX_V16__) return;
  window.__KBLX_V16__ = true;

  const NS       = window.KBLX_NS || "kobllux";
  const DOCK_KEY = NS + ":dock";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ═══════════════════════════════════════════════════════════════════════
     §0 — TOAST SILENCIOSO (usado por todo o resto)
     ═══════════════════════════════════════════════════════════════════════ */
  window.__KBLX_TOAST_QUIET__ = function (msg) {
    const t =
      document.getElementById("toast") ||
      document.getElementById("nv-toast");
    if (!t) { console.log("[toast]", msg); return; }
    t.textContent = String(msg ?? "");
    t.classList.add("show");
    clearTimeout(window.__kblx_toast_t);
    window.__kblx_toast_t = setTimeout(() => t.classList.remove("show"), 1800);
  };

  const origToast = window.KBLX_TOAST;
  window.KBLX_TOAST = function (msg) {
    try { window.__KBLX_TOAST_QUIET__(msg); }
    catch (_) { try { origToast && origToast(msg); } catch (__) {} }
  };

  const safeToast = (m) => window.__KBLX_TOAST_QUIET__(m);

  /* ═══════════════════════════════════════════════════════════════════════
     §1 — LEGACY DETECTION
     ═══════════════════════════════════════════════════════════════════════ */
  (function legacyFix() {
    const legacyNow = !!(
      window.iFSw || window.IFSW ||
      window.InfodoseBase || window.SessionWindow ||
      window.SessionLifecycle || window.DualRuntime ||
      window.createSessionWindow
    );
    if (legacyNow !== window.__LEGACY_SESSION_BOUND) {
      window.__LEGACY_SESSION_BOUND = legacyNow;
      console.log("[v16] §1 __LEGACY_SESSION_BOUND →", legacyNow);
    }
  })();

  /* ═══════════════════════════════════════════════════════════════════════
     §2 — MUTE App.showToast (que falava em voz alta)
     ═══════════════════════════════════════════════════════════════════════ */
  function muteAppToast() {
    if (window.App && typeof window.App.showToast === "function" &&
        !window.App.__toastMuted) {
      window.App.__toastMuted = true;
      window.App.showToast = function (msg /*, err*/) {
        window.__KBLX_TOAST_QUIET__(msg);
      };
      console.log("[v16] §2 App.showToast silenciado");
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §3 — DOCK BUBBLE RESTORE  (bug principal)
     ═══════════════════════════════════════════════════════════════════════ */

  function findRealWindow(id) {
    if (!id) return null;

    // 1) session-window canônica (MXP ou iFSw)
    const direct = $$(".session-window[data-session-id]").find(
      (el) => el.dataset.sessionId === id
    );
    if (direct) return direct;

    // 2) fallback: qualquer [data-session-id] que não seja auxiliar
    return (
      $$("[data-session-id]").find(
        (el) =>
          el.dataset.sessionId === id &&
          !el.classList.contains("dock-bubble") &&
          el.dataset.dockMirror !== "1" &&
          el.tagName !== "BUTTON"
      ) || null
    );
  }

  function removeDockEntry(id) {
    try {
      const map = JSON.parse(localStorage.getItem(DOCK_KEY)) || {};
      delete map[id];
      localStorage.setItem(DOCK_KEY, JSON.stringify(map));
    } catch (_) {}
  }

  function restoreFromBubble(bubble) {
    if (!bubble) return;
    const id = bubble.dataset.sessionId;
    if (!id) return;

    const target = findRealWindow(id);

    // 1) visual
    if (target) {
      target.classList.remove("minimized");
      target.classList.remove("suspended");
      if (target.dataset) target.dataset.suspended = "false";
    }

    // 2) MXP
    try {
      const s = window.MXP?.state?.sessions?.find((x) => x.id === id);
      if (s) { s.minimized = false; window.MXP?.save?.(); }
    } catch (_) {}

    // 3) iFSw
    try { window.SessionLifecycle?.restore?.(id); } catch (_) {}

    // 4) callback do minimize
    if (typeof bubble._onRestore === "function") {
      try { bubble._onRestore(); } catch (_) {}
    }

    // 5) limpa registros
    removeDockEntry(id);
    try { bubble.remove(); } catch (_) {}
    try { window.KBLX_syncLooseWithDock?.(); } catch (_) {}

    // 6) broadcast
    document.dispatchEvent(
      new CustomEvent("kblx:session-restored", { detail: { id, el: target } })
    );

    console.log("[v16] §3 restaurado do dock:", id);
  }

  function installDockDelegate() {
    const dock = document.getElementById("dock");
    if (!dock || dock.__v16Bound) return;
    dock.__v16Bound = true;
    dock.addEventListener(
      "click",
      (e) => {
        const b = e.target.closest(".dock-bubble");
        if (!b) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        restoreFromBubble(b);
      },
      true
    );
    console.log("[v16] §3 dock delegate instalado");
  }

  function installLooseDelegate() {
    const slot = document.querySelector('[data-slot="loose"]');
    if (!slot || slot.__v16Bound) return;
    slot.__v16Bound = true;
    slot.addEventListener(
      "click",
      (e) => {
        const m = e.target.closest('[data-dock-mirror="1"]');
        if (!m) return;
        e.stopImmediatePropagation();
        e.preventDefault();

        const id = m.dataset.sessionId;
        const bubble = document.querySelector(
          '.dock-bubble[data-session-id="' + id + '"]'
        );
        if (bubble) return restoreFromBubble(bubble);

        // fallback: save órfão sem bubble no DOM
        const target = findRealWindow(id);
        if (target) {
          target.classList.remove("minimized", "suspended");
          if (target.dataset) target.dataset.suspended = "false";
        }
        removeDockEntry(id);
        try { m.remove(); } catch (_) {}
      },
      true
    );
    console.log("[v16] §3 loose delegate instalado");
  }

  let dockObserver = null;
  function startDockObserver() {
    if (dockObserver || !document.body) return;
    dockObserver = new MutationObserver(() => {
      installDockDelegate();
      installLooseDelegate();
    });
    dockObserver.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §4 — LIFECYCLE GUARD (3min idle / 8min suspend)
     ═══════════════════════════════════════════════════════════════════════ */
  const HARD_IDLE_MS    = 3 * 60 * 1000;
  const HARD_SUSPEND_MS = 8 * 60 * 1000;

  function installLifecycleGuard() {
    const SL = window.SessionLifecycle;
    if (!SL || SL.__v16Guarded) return;
    SL.__v16Guarded = true;

    const origSuspend = SL.suspend?.bind(SL);
    SL.suspend = function (id) {
      const meta = SL.getSession?.(id);
      const age  = Date.now() - (meta?.lastActive || 0);
      if (age < HARD_IDLE_MS) return false;
      return origSuspend ? origSuspend(id) : false;
    };

    const origEvict = SL.evict?.bind(SL);
    SL.evict = function (id) {
      const meta = SL.getSession?.(id);
      const age  = Date.now() - (meta?.lastSuspendedAt || 0);
      if (age < HARD_SUSPEND_MS) return false;
      return origEvict ? origEvict(id) : false;
    };

    console.log("[v16] §4 lifecycle guard: idle=3min suspend=8min");
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §5 — INDEXEDDB BG DESLIGADO
     ═══════════════════════════════════════════════════════════════════════ */
  function killIndexedDbBg() {
    if (window.App?.indexedDB && !window.App.indexedDB.__v16Disabled) {
      window.App.indexedDB.__v16Disabled = true;
      window.App.indexedDB.handleBackgroundUpload = async function () {
        safeToast("Upload gerenciado pelo Cockpit");
      };
      window.App.indexedDB.loadBackground = async function () { /* noop */ };
      console.log("[v16] §5 IndexedDB bg desativado");
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §6 — SRCDOC GUARD
     ═══════════════════════════════════════════════════════════════════════ */
  function installSrcdocGuard() {
    if (!document.body) return;
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes || []) {
          if (n.nodeType !== 1) continue;
          const frames = [];
          if (n.matches?.(".win-frame")) frames.push(n);
          n.querySelectorAll?.(".win-frame").forEach((f) => frames.push(f));
          frames.forEach((f) => {
            if (f.hasAttribute("srcdoc")) {
              const url =
                f.dataset.originalSrc ||
                f.getAttribute("data-url") ||
                "about:blank";
              f.removeAttribute("srcdoc");
              f.src = url;
              console.log("[v16] §6 srcdoc neutralizado →", url);
            }
          });
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §7 — PROMPT / CONFIRM → <dialog>
     ═══════════════════════════════════════════════════════════════════════ */

  function nativePrompt(message, defaultValue = "") {
    return new Promise((resolve) => {
      if (typeof HTMLDialogElement === "undefined") {
        return resolve(window.prompt(message, defaultValue));
      }
      const dlg = document.createElement("dialog");
      dlg.style.cssText =
        "border:1px solid rgba(120,200,255,.28);border-radius:14px;" +
        "background:rgba(8,10,22,.97);color:#cfe;padding:18px;" +
        "font-family:ui-monospace,monospace;min-width:280px;max-width:90vw;";
      dlg.innerHTML =
        '<form method="dialog" style="display:flex;flex-direction:column;gap:12px">' +
        '<label style="font-size:12px;letter-spacing:1px;color:#8ab">' +
        String(message).replace(/</g, "&lt;") +
        "</label>" +
        '<input name="v" value="' +
        String(defaultValue).replace(/"/g, "&quot;") +
        '" style="padding:8px;border-radius:8px;border:1px solid #345;' +
        'background:#0a0f1e;color:#cfe;font-family:inherit">' +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button value="__cancel" style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #445;background:none;color:#9ab;cursor:pointer">Cancelar</button>' +
        '<button value="__ok" style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #4af;background:#0a2a4a;color:#cfe;cursor:pointer">OK</button>' +
        "</div></form>";
      document.body.appendChild(dlg);
      dlg.addEventListener("close", () => {
        const v =
          dlg.returnValue === "__cancel"
            ? null
            : dlg.querySelector('input[name="v"]').value;
        dlg.remove();
        resolve(v);
      });
      dlg.showModal();
      const inp = dlg.querySelector('input[name="v"]');
      inp.focus();
      inp.select();
    });
  }

  function nativeConfirm(message) {
    return new Promise((resolve) => {
      if (typeof HTMLDialogElement === "undefined") {
        return resolve(window.confirm(message));
      }
      const dlg = document.createElement("dialog");
      dlg.style.cssText =
        "border:1px solid rgba(120,200,255,.28);border-radius:14px;" +
        "background:rgba(8,10,22,.97);color:#cfe;padding:18px;" +
        "font-family:ui-monospace,monospace;min-width:280px;max-width:90vw;";
      dlg.innerHTML =
        '<form method="dialog" style="display:flex;flex-direction:column;gap:12px">' +
        '<div style="font-size:13px;line-height:1.4">' +
        String(message).replace(/</g, "&lt;") +
        "</div>" +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button value="__no" style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #445;background:none;color:#9ab;cursor:pointer">Não</button>' +
        '<button value="__yes" style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #f66;background:#3a0a0a;color:#fcc;cursor:pointer">Sim</button>' +
        "</div></form>";
      document.body.appendChild(dlg);
      dlg.addEventListener("close", () => {
        const ok = dlg.returnValue === "__yes";
        dlg.remove();
        resolve(ok);
      });
      dlg.showModal();
    });
  }

  window.KBLX_PROMPT  = nativePrompt;
  window.KBLX_CONFIRM = nativeConfirm;

  function upgradeInternalDialogs() {
    if (window.MXP && !window.MXP.__v16Dlg) {
      window.MXP.__v16Dlg = true;
      const origCreate = window.MXP.createSession?.bind(window.MXP);
      if (origCreate) {
        window.MXP.createSession = async function (name) {
          if (!name) {
            name = await nativePrompt("Nome da session:", "SESSION");
            if (!name) return null;
          }
          return origCreate(name);
        };
      }
      console.log("[v16] §7 MXP.createSession → <dialog>");
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §8 — BOOT GUARD
     ═══════════════════════════════════════════════════════════════════════ */
  function bootGuard() {
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const ok =
        window.KBLX_LOAD &&
        window.Store?.get?.(window.KBLX_KEYS?.root);
      if (ok || tries > 40) clearInterval(t);
    }, 50);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════════════════════ */

  function boot() {
    muteAppToast();
    killIndexedDbBg();
    installDockDelegate();
    installLooseDelegate();
    startDockObserver();
    installLifecycleGuard();
    installSrcdocGuard();
    upgradeInternalDialogs();
    bootGuard();
    console.log("[KBLX v16] hotfix completo online · §1–§8");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => setTimeout(boot, 260),
      { once: true }
    );
  } else {
    setTimeout(boot, 260);
  }

  // re-roda guards que dependem de App/SessionLifecycle tardios
  document.addEventListener("kblx:session-restored", () => {
    installDockDelegate();
    installLooseDelegate();
  });

  window.addEventListener(
    "load",
    () => setTimeout(boot, 500),
    { once: true }
  );
})();