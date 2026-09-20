/* ============================================================================
KodBlloX_p.js
KOBLLUX · SESSION-WINDOW ADAPTER
v16 · MONÓLITO MODULAR
============================================================================ */

(function KODBLLOX_P(global, document) {
  "use strict";

  if (global.KODBLLOX_P_V16) return;
  global.KODBLLOX_P_V16 = true;

  /* ═══════════════════════════════════════════════════════════════════════
  §0 · NAMESPACE
  ═══════════════════════════════════════════════════════════════════════ */

  const KBLX = global.KBLX = global.KBLX || {};
  KBLX.version = "16";
  KBLX.sessionAdapter = KBLX.sessionAdapter || {};

  const NS = global.KBLX_NS || "kobllux";
  const DOCK_KEY = NS + ":dock";
  const BASE_SESSION_ID = "session-iframe";

  const SELECTORS = {
    host: "#stackWrap",
    layer: "#sessionsLayer",
    base: "#session-iframe",
    dock: "#dock",
    sessions: ".session-window",
    frame: ".win-frame",
    header: ".win-hdr"
  };

  const $  = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const cssEscape = (value) =>
    global.CSS?.escape
      ? CSS.escape(String(value))
      : String(value).replace(/["\\]/g, "\\$&");

  /* ═══════════════════════════════════════════════════════════════════════
  §1 · SESSION NORMALIZATION
  ═══════════════════════════════════════════════════════════════════════ */

  function getBaseSession() {
    return document.querySelector(SELECTORS.base);
  }

  function ensureSessionId(el, fallback) {
    if (!el) return null;

    if (!el.dataset.sessionId) {
      el.dataset.sessionId =
        fallback ||
        el.id ||
        "session-" + Math.random().toString(36).slice(2, 9);
    }
    el.dataset.kblxSession = "1";
    return el.dataset.sessionId;
  }

  function normalizeSession(el, fallback) {
    if (!el) return null;

    const id = ensureSessionId(el, fallback);
    el.dataset.kblxSession = "1";

    if (!el.dataset.sessionState) {
      if (el.classList.contains("suspended")) {
        el.dataset.sessionState = "suspended";
      } else if (el.classList.contains("minimized")) {
        el.dataset.sessionState = "minimized";
      } else if (el.classList.contains("collapsed")) {
        el.dataset.sessionState = "collapsed";
      } else {
        el.dataset.sessionState = "active";
      }
    }

    const frame = $(".win-frame", el);
    if (frame) {
      frame.dataset.kblxFrame = "1";
      if (!el.dataset.url) {
        const src =
          frame.getAttribute("src") ||
          frame.dataset.url ||
          "";
        if (src) el.dataset.url = src;
      }
    }
    return id;
  }

  function normalizeAllSessions() {
    const base = getBaseSession();
    if (base) normalizeSession(base, BASE_SESSION_ID);
    $$(SELECTORS.sessions).forEach((el) => normalizeSession(el));
    return $$(SELECTORS.sessions);
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §2 · RESOLVER CANÔNICO
  ═══════════════════════════════════════════════════════════════════════ */

  function resolveSession(id) {
    if (!id) return null;

    const escaped = cssEscape(id);
    let el = document.querySelector(
      `.session-window[data-session-id="${escaped}"]`
    );
    if (el) return el;

    el = document.getElementById(String(id));
    if (el && el.classList.contains("session-window")) return el;

    if (
      id === BASE_SESSION_ID ||
      id === "base" ||
      id === "main"
    ) {
      return getBaseSession();
    }

    el = $$(SELECTORS.sessions).find(
      (item) => item.dataset.sessionId === String(id)
    );
    return el || null;
  }

  function getSessionId(el) {
    if (!el) return null;
    return normalizeSession(el);
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §3 · STATE
  ═══════════════════════════════════════════════════════════════════════ */

  function setSessionState(el, state) {
    if (!el) return false;

    normalizeSession(el);
    const states = ["active", "collapsed", "minimized", "suspended", "maximized"];
    states.forEach((name) => {
      if (name !== state) el.classList.remove(name);
    });
    el.classList.add(state);
    el.dataset.sessionState = state;

    if (state === "active") {
      el.dataset.suspended = "false";
      el.dataset.minimized = "false";
    }
    if (state === "minimized") el.dataset.minimized = "true";
    if (state === "suspended") el.dataset.suspended = "true";

    return true;
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §4 · RESTORE
  ═══════════════════════════════════════════════════════════════════════ */

  function restoreSession(id, source) {
    const el = resolveSession(id);
    if (!el) {
      console.warn("[KodBlloX_p] restore: session não encontrada", id);
      return false;
    }

    const sid = getSessionId(el);
    setSessionState(el, "active");
    el.hidden = false;
    el.removeAttribute("aria-hidden");

    const frame = $(".win-frame", el);
    if (frame) {
      frame.hidden = false;
      frame.removeAttribute("aria-hidden");
    }

    /* MXP — apenas sincroniza se existir */
    try {
      const sessions = global.MXP?.state?.sessions;
      if (Array.isArray(sessions)) {
        const meta = sessions.find((item) => String(item.id) === String(sid));
        if (meta) {
          meta.minimized = false;
          meta.suspended = false;
        }
        global.MXP?.save?.();
      }
    } catch (_) {}

    /* iFSw / lifecycle — adapter, não dependência */
    try {
      global.SessionLifecycle?.restore?.(sid);
    } catch (_) {}

    /* callbacks existentes */
    try {
      el._onRestore?.();
    } catch (_) {}

    /* dock */
    removeDockEntry(sid);
    const dock = document.querySelector(
      `.dock-bubble[data-session-id="${cssEscape(sid)}"]`
    );
    if (dock) {
      try { dock.remove(); } catch (_) {}
    }

    /* loose mirror */
    $$(`[data-dock-mirror="1"][data-session-id="${cssEscape(sid)}"]`)
      .forEach((mirror) => {
        try { mirror.remove(); } catch (_) {}
      });

    /* foco */
    try {
      el.dispatchEvent(
        new CustomEvent("kblx:session-focus", {
          bubbles: true,
          detail: { id: sid, source: source || "restore" }
        })
      );
    } catch (_) {}

    document.dispatchEvent(
      new CustomEvent("kblx:session-restored", {
        detail: { id: sid, el, source: source || "restore" }
      })
    );
    return true;
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §5 · MINIMIZE / DOCK
  ═══════════════════════════════════════════════════════════════════════ */

  function minimizeSession(id) {
    const el = resolveSession(id);
    if (!el) return false;
    const sid = getSessionId(el);
    setSessionState(el, "minimized");
    el.dataset.suspended = "false";
    createDockBubble(el);
    return sid;
  }

  function removeDockEntry(id) {
    try {
      const map = JSON.parse(localStorage.getItem(DOCK_KEY) || "{}");
      delete map[id];
      localStorage.setItem(DOCK_KEY, JSON.stringify(map));
    } catch (_) {}
  }

  function readDockMap() {
    try {
      return JSON.parse(localStorage.getItem(DOCK_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function writeDockMap(map) {
    try {
      localStorage.setItem(DOCK_KEY, JSON.stringify(map || {}));
    } catch (_) {}
  }

  function createDockBubble(session) {
    if (!session) return null;

    const dock = document.getElementById("dock");
    if (!dock) return null;

    const id = getSessionId(session);
    if (!id) return null;

    let bubble = dock.querySelector(
      `.dock-bubble[data-session-id="${cssEscape(id)}"]`
    );
    if (bubble) return bubble;

    bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "dock-bubble";
    bubble.dataset.sessionId = id;
    bubble.dataset.kblxDock = "1";

    const title =
      session.dataset.title ||
      session.querySelector(".win-title")?.textContent ||
      session.querySelector(".win-hdr")?.textContent ||
      id;

    bubble.setAttribute("aria-label", "Restaurar " + title.trim());
    bubble.title = "Restaurar " + title.trim();
    bubble.textContent = title.trim().slice(0, 1).toUpperCase();
    bubble._onRestore = () => restoreSession(id, "dock");

    dock.appendChild(bubble);

    const map = readDockMap();
    map[id] = { id, title: title.trim(), ts: Date.now() };
    writeDockMap(map);

    return bubble;
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §6 · DOCK DELEGATE
  ═══════════════════════════════════════════════════════════════════════ */

  function restoreFromDockBubble(bubble) {
    if (!bubble) return;
    const id = bubble.dataset.sessionId;
    if (!id) return;
    restoreSession(id, "dock");
  }

  function installDockDelegate() {
    const dock = document.getElementById("dock");
    if (!dock || dock.__KBLX_P_BOUND__) return;

    dock.__KBLX_P_BOUND__ = true;
    dock.addEventListener(
      "click",
      (event) => {
        const bubble = event.target.closest?.(".dock-bubble");
        if (!bubble || !dock.contains(bubble)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        restoreFromDockBubble(bubble);
      },
      true
    );

    console.log("[KodBlloX_p] dock adapter online");
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §7 · LOOSE / DOCK MIRROR
  ═══════════════════════════════════════════════════════════════════════ */

  function installLooseDelegate() {
    const loose = document.querySelector('[data-slot="loose"]');
    if (!loose || loose.__KBLX_P_BOUND__) return;

    loose.__KBLX_P_BOUND__ = true;
    loose.addEventListener(
      "click",
      (event) => {
        const mirror = event.target.closest?.('[data-dock-mirror="1"]');
        if (!mirror) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const id = mirror.dataset.sessionId;
        if (!id) return;
        restoreSession(id, "loose");
      },
      true
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §8 · QUIET TOAST
  ═══════════════════════════════════════════════════════════════════════ */

  function quietToast(message) {
    const toast =
      document.getElementById("toast") ||
      document.getElementById("nv-toast");

    if (!toast) {
      console.log("[KBLX toast]", message);
      return;
    }

    toast.textContent = String(message ?? "");
    toast.classList.add("show");
    clearTimeout(global.__KBLX_P_TOAST_TIMER__);
    global.__KBLX_P_TOAST_TIMER__ = setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  global.KBLX_TOAST_QUIET = quietToast;

  const originalToast = global.KBLX_TOAST;
  if (!global.KBLX_P_TOAST_BOUND) {
    global.KBLX_P_TOAST_BOUND = true;
    global.KBLX_TOAST = function (message) {
      try {
        quietToast(message);
      } catch (_) {
        try { originalToast?.(message); } catch (__) {}
      }
    };
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §9 · APP.SHOWTOAST
  ═══════════════════════════════════════════════════════════════════════ */

  function muteAppToast() {
    const app = global.App;
    if (
      !app ||
      typeof app.showToast !== "function" ||
      app.__KBLX_P_TOAST_MUTED__
    ) {
      return;
    }
    app.__KBLX_P_TOAST_MUTED__ = true;
    app.showToast = function (message) {
      quietToast(message);
    };
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §10 · LIFECYCLE ADAPTER
  ═══════════════════════════════════════════════════════════════════════ */

  const HARD_IDLE_MS = 3 * 60 * 1000;
  const HARD_SUSPEND_MS = 8 * 60 * 1000;

  function installLifecycleAdapter() {
    const SL = global.SessionLifecycle;
    if (!SL || SL.__KBLX_P_GUARDED__) return;
    SL.__KBLX_P_GUARDED__ = true;

    if (typeof SL.suspend === "function") {
      const originalSuspend = SL.suspend.bind(SL);
      SL.suspend = function (id) {
        let meta = null;
        try { meta = SL.getSession?.(id); } catch (_) {}
        const lastActive = meta?.lastActive || Date.now();
        const age = Date.now() - lastActive;
        if (age < HARD_IDLE_MS) return false;
        return originalSuspend(id);
      };
    }

    if (typeof SL.evict === "function") {
      const originalEvict = SL.evict.bind(SL);
      SL.evict = function (id) {
        let meta = null;
        try { meta = SL.getSession?.(id); } catch (_) {}
        const lastSuspended = meta?.lastSuspendedAt || Date.now();
        const age = Date.now() - lastSuspended;
        if (age < HARD_SUSPEND_MS) return false;
        return originalEvict(id);
      };
    }

    console.log("[KodBlloX_p] lifecycle adapter · 3m / 8m");
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §11 · INDEXEDDB ADAPTER
  ═══════════════════════════════════════════════════════════════════════ */

  function installIndexedDBAdapter() {
    const indexed = global.App?.indexedDB;
    if (!indexed || indexed.__KBLX_P_DISABLED__) return;
    indexed.__KBLX_P_DISABLED__ = true;

    if (typeof indexed.handleBackgroundUpload === "function") {
      indexed.handleBackgroundUpload = async function () {
        quietToast("Upload gerenciado pelo Cockpit");
        return false;
      };
    }
    if (typeof indexed.loadBackground === "function") {
      indexed.loadBackground = async function () {
        return null;
      };
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §12 · SRCdoc PASSIVE GUARD
  ═══════════════════════════════════════════════════════════════════════ */

  function installSrcdocGuard() {
    if (!document.body || document.body.__KBLX_P_SRCDOC_GUARD__) return;
    document.body.__KBLX_P_SRCDOC_GUARD__ = true;

    /*
      IMPORTANTE:
      Não removemos srcdoc automaticamente.
      Apenas marcamos frames de Session Window.
      Assim o patch não destrói srcdoc legítimo do monólito.
    */
    $$(SELECTORS.sessions).forEach((session) => {
      const frame = $(".win-frame", session);
      if (frame) frame.dataset.kblxFrame = "1";
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §13 · NATIVE DIALOG
  ═══════════════════════════════════════════════════════════════════════ */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nativePrompt(message, defaultValue = "") {
    return new Promise((resolve) => {
      if (typeof global.HTMLDialogElement === "undefined") {
        resolve(global.prompt(message, defaultValue));
        return;
      }

      const dlg = document.createElement("dialog");
      dlg.style.cssText =
        "border:1px solid rgba(120,200,255,.28);" +
        "border-radius:14px;" +
        "background:rgba(8,10,22,.97);" +
        "color:#cfe;padding:18px;" +
        "font-family:ui-monospace,monospace;" +
        "min-width:280px;max-width:90vw;";

      dlg.innerHTML =
        '<form method="dialog" ' +
        'style="display:flex;flex-direction:column;gap:12px">' +
        '<label style="font-size:12px;letter-spacing:1px;color:#8ab">' +
        escapeHTML(message) +
        "</label>" +
        '<input name="v" value="' +
        escapeHTML(defaultValue) +
        '" style="' +
        "padding:8px;" +
        "border-radius:8px;" +
        "border:1px solid #345;" +
        "background:#0a0f1e;" +
        "color:#cfe;" +
        "font-family:inherit" +
        '">' +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button value="__cancel" ' +
        'style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #445;background:none;color:#9ab">' +
        "Cancelar" +
        "</button>" +
        '<button value="__ok" ' +
        'style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #4af;background:#0a2a4a;color:#cfe">' +
        "OK" +
        "</button>" +
        "</div>" +
        "</form>";

      document.body.appendChild(dlg);

      dlg.addEventListener(
        "close",
        () => {
          const input = dlg.querySelector('input[name="v"]');
          const value =
            dlg.returnValue === "__cancel"
              ? null
              : input?.value ?? "";
          dlg.remove();
          resolve(value);
        },
        { once: true }
      );

      dlg.showModal();
      const input = dlg.querySelector('input[name="v"]');
      input?.focus();
      input?.select();
    });
  }

  function nativeConfirm(message) {
    return new Promise((resolve) => {
      if (typeof global.HTMLDialogElement === "undefined") {
        resolve(global.confirm(message));
        return;
      }

      const dlg = document.createElement("dialog");
      dlg.style.cssText =
        "border:1px solid rgba(120,200,255,.28);" +
        "border-radius:14px;" +
        "background:rgba(8,10,22,.97);" +
        "color:#cfe;padding:18px;" +
        "font-family:ui-monospace,monospace;" +
        "min-width:280px;max-width:90vw;";

      dlg.innerHTML =
        '<form method="dialog" ' +
        'style="display:flex;flex-direction:column;gap:12px">' +
        '<div style="font-size:13px;line-height:1.4">' +
        escapeHTML(message) +
        "</div>" +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button value="__no" ' +
        'style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #445;background:none;color:#9ab">' +
        "Não" +
        "</button>" +
        '<button value="__yes" ' +
        'style="padding:6px 12px;border-radius:6px;' +
        'border:1px solid #f66;background:#3a0a0a;color:#fcc">' +
        "Sim" +
        "</button>" +
        "</div>" +
        "</form>";

      document.body.appendChild(dlg);

      dlg.addEventListener(
        "close",
        () => {
          const yes = dlg.returnValue === "__yes";
          dlg.remove();
          resolve(yes);
        },
        { once: true }
      );

      dlg.showModal();
    });
  }

  global.KBLX_PROMPT = nativePrompt;
  global.KBLX_CONFIRM = nativeConfirm;

  /* ═══════════════════════════════════════════════════════════════════════
  §14 · SESSION API PÚBLICA
  ═══════════════════════════════════════════════════════════════════════ */

  KBLX.sessionAdapter = {
    version: "16",
    baseId: BASE_SESSION_ID,
    resolve: resolveSession,
    id: getSessionId,
    normalize: normalizeSession,
    normalizeAll: normalizeAllSessions,
    restore: restoreSession,
    minimize: minimizeSession,
    dock: createDockBubble,
    setState: setSessionState,
    lifecycle: {
      idle: HARD_IDLE_MS,
      suspend: HARD_SUSPEND_MS
    }
  };

  global.KBLX_SESSION = KBLX.sessionAdapter;
  global.KBLX_RESTORE_SESSION = restoreSession;
  global.KBLX_MINIMIZE_SESSION = minimizeSession;

  /* ═══════════════════════════════════════════════════════════════════════
  §15 · MXP BRIDGE
  ═══════════════════════════════════════════════════════════════════════ */

  function installMXPBridge() {
    const MXP = global.MXP;
    if (!MXP || MXP.__KBLX_P_BRIDGED__) return;
    MXP.__KBLX_P_BRIDGED__ = true;

    /*
      Não substituímos createSession.
      Apenas expomos o adapter para o MXP.
    */
    MXP.KBLX = KBLX.sessionAdapter;
    console.log("[KodBlloX_p] MXP bridge online");
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §16 · LATE MODULE BRIDGE
  ═══════════════════════════════════════════════════════════════════════ */

  let lateTimer = null;
  let lateTries = 0;

  function lateBind() {
    lateTries++;
    normalizeAllSessions();
    installDockDelegate();
    installLooseDelegate();
    muteAppToast();
    installIndexedDBAdapter();
    installLifecycleAdapter();
    installMXPBridge();

    if (lateTries >= 80) {
      clearInterval(lateTimer);
      lateTimer = null;
      console.log("[KodBlloX_p] late-bind finalizado");
    }
  }

  function startLateBind() {
    if (lateTimer) return;
    lateTimer = setInterval(lateBind, 250);
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §17 · MUTATION OBSERVER
  ═══════════════════════════════════════════════════════════════════════ */

  let observer = null;

  function startObserver() {
    if (observer || !document.body) return;

    observer = new MutationObserver((mutations) => {
      let relevant = false;

      for (const mutation of mutations) {
        if (mutation.type !== "childList") continue;

        for (const node of mutation.addedNodes || []) {
          if (node.nodeType !== 1) continue;

          if (
            node.matches?.(
              ".session-window,.dock-bubble,#dock,#sessionsLayer"
            ) ||
            node.querySelector?.(".session-window,.dock-bubble")
          ) {
            relevant = true;
            break;
          }
        }
        if (relevant) break;
      }

      if (!relevant) return;

      normalizeAllSessions();
      installDockDelegate();
      installLooseDelegate();
      installMXPBridge();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
  §18 · BOOT
  ═══════════════════════════════════════════════════════════════════════ */

  function boot() {
    normalizeAllSessions();
    installDockDelegate();
    installLooseDelegate();
    installSrcdocGuard();
    muteAppToast();
    installIndexedDBAdapter();
    installLifecycleAdapter();
    installMXPBridge();
    startObserver();
    startLateBind();

    console.log("[KodBlloX_p] v16 · Session Window Adapter online");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => setTimeout(boot, 120),
      { once: true }
    );
  } else {
    setTimeout(boot, 120);
  }

  global.addEventListener(
    "load",
    () => setTimeout(boot, 350),
    { once: true }
  );

  /* ═══════════════════════════════════════════════════════════════════════
  §19 · EVENT BRIDGE
  ═══════════════════════════════════════════════════════════════════════ */

  document.addEventListener("kblx:session-restored", (event) => {
    const id = event.detail?.id;
    if (!id) return;
    normalizeAllSessions();
    installDockDelegate();
    installLooseDelegate();
  });

  /* ═══════════════════════════════════════════════════════════════════════
  §20 · DEBUG
  ═══════════════════════════════════════════════════════════════════════ */

  KBLX.debug = function () {
    return {
      version: KBLX.version,
      base: getBaseSession(),
      sessions: $$(SELECTORS.sessions).map((el) => ({
        id: el.dataset.sessionId,
        state: el.dataset.sessionState,
        url: el.dataset.url
      })),
      dock: readDockMap(),
      MXP: !!global.MXP,
      SessionLifecycle: !!global.SessionLifecycle,
      iFSw: !!(global.iFSw || global.IFSW)
    };
  };
})(window, document);

/* ============================================================================
END · KodBlloX_p.js
============================================================================ */