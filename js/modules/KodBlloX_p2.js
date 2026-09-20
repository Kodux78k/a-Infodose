/* ============================================================================
   KodBlloX_p.js
   KOBLLUX · SESSION-WINDOW ADAPTER
   v16 · MONÓLITO MODULAR
   ────────────────────────────────────────────────────────────────────────────
   PRINCÍPIO:

   .session-window = CORPO CANÔNICO DA SESSÃO

   MXP / iFSw / SessionLifecycle / Dock / Stack / Float
   são apenas interfaces sobre o mesmo corpo.

   ESTE ARQUIVO NÃO CRIA OUTRO SESSION-WINDOW.
   NÃO DUPLICA ENGINE.
   NÃO REESCREVE MXP.createSession().
   NÃO REMOVE srcdoc legítimo.
   NÃO MOVE SESSIONS ENTRE HOSTS.

   Ordem:
   bundle principal
      ↓
   KodBlloX_p.js
      ↓
   normalização / bridges / guards
   ============================================================================ */

(function KODBLLOX_P(global, document) {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════════════
     §0 · SINGLETON
     ═══════════════════════════════════════════════════════════════════════ */

  if (global.KODBLLOX_P_V16) return;
  global.KODBLLOX_P_V16 = true;

  /* ═══════════════════════════════════════════════════════════════════════
     §1 · NAMESPACE
     ═══════════════════════════════════════════════════════════════════════ */

  const KBLX = global.KBLX = global.KBLX || {};

  KBLX.version = "16";
  KBLX.sessionAdapter = KBLX.sessionAdapter || {};

  const NS = global.KBLX_NS || "kobllux";
  const DOCK_KEY = NS + ":dock";

  /*
    O monólito usa #session-iframe como base canônica.
    Ele não é recriado pelo adapter.
  */
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

  const $ = (selector, root = document) =>
    root?.querySelector?.(selector) || null;

  const $$ = (selector, root = document) =>
    root ? Array.from(root.querySelectorAll(selector)) : [];

  function cssEscape(value) {
    value = String(value ?? "");

    if (global.CSS?.escape) {
      return global.CSS.escape(value);
    }

    return value.replace(/([^\w-])/g, "\\$1");
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §2 · SESSION NORMALIZATION
     ───────────────────────────────────────────────────────────────────────
     Não transforma qualquer elemento em session-window.
     Apenas normaliza elementos que já são session-window.
     ═══════════════════════════════════════════════════════════════════════ */

  function getBaseSession() {
    const base = $(SELECTORS.base);

    if (
      base &&
      !base.classList.contains("session-window")
    ) {
      /*
        O base monolítico pode receber a classe por outro módulo.
        O adapter não cria outro elemento; apenas marca o próprio corpo.
      */
      base.classList.add("session-window");
    }

    return base;
  }

  function ensureSessionId(el, fallback) {
    if (!el) return null;

    if (!el.dataset.sessionId) {
      el.dataset.sessionId =
        fallback ||
        el.id ||
        "session-" +
          Math.random()
            .toString(36)
            .slice(2, 9);
    }

    el.dataset.kblxSession = "1";

    return el.dataset.sessionId;
  }

  function inferSessionState(el) {
    if (!el) return "active";

    if (el.classList.contains("suspended")) {
      return "suspended";
    }

    if (el.classList.contains("minimized")) {
      return "minimized";
    }

    if (el.classList.contains("collapsed")) {
      return "collapsed";
    }

    if (el.classList.contains("maximized")) {
      return "maximized";
    }

    return "active";
  }

  function normalizeSession(el, fallback) {
    if (!el) return null;

    /*
      Só o corpo canônico entra aqui.
    */
    if (!el.classList.contains("session-window")) {
      return null;
    }

    const id = ensureSessionId(el, fallback);

    el.dataset.kblxSession = "1";

    if (!el.dataset.sessionState) {
      el.dataset.sessionState = inferSessionState(el);
    }

    const frame = $(".win-frame", el);

    if (frame) {
      frame.dataset.kblxFrame = "1";

      /*
        Não força src/srcdoc.
        Apenas registra a URL quando ela já existe.
      */
      if (!el.dataset.url) {
        const src =
          frame.getAttribute("src") ||
          frame.dataset.url ||
          "";

        if (src) {
          el.dataset.url = src;
        }
      }
    }

    return id;
  }

  function normalizeAllSessions() {
    const base = getBaseSession();

    if (base) {
      normalizeSession(base, BASE_SESSION_ID);
    }

    $$(SELECTORS.sessions).forEach((el) => {
      normalizeSession(el);
    });

    return $$(SELECTORS.sessions);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §3 · RESOLVER CANÔNICO
     ═══════════════════════════════════════════════════════════════════════ */

  function resolveSession(id) {
    if (!id) return null;

    const sid = String(id);

    let el = document.querySelector(
      `.session-window[data-session-id="${cssEscape(sid)}"]`
    );

    if (el) {
      return el;
    }

    /*
      Base histórica:
      session-iframe / base / main
    */
    if (
      sid === BASE_SESSION_ID ||
      sid === "base" ||
      sid === "main"
    ) {
      const base = getBaseSession();

      if (base) {
        return base;
      }
    }

    el = document.getElementById(sid);

    if (
      el &&
      el.classList.contains("session-window")
    ) {
      return el;
    }

    /*
      Último fallback sem selector dinâmico.
    */
    return (
      $$(SELECTORS.sessions).find(
        (item) =>
          String(item.dataset.sessionId) === sid
      ) || null
    );
  }

  function getSessionId(el) {
    if (!el) return null;

    return normalizeSession(el);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §4 · STATE
     ───────────────────────────────────────────────────────────────────────
     Estado visual e estado de sessão permanecem no mesmo elemento.
     ═══════════════════════════════════════════════════════════════════════ */

  const SESSION_STATES = [
    "active",
    "collapsed",
    "minimized",
    "suspended",
    "maximized"
  ];

  function setSessionState(el, state) {
    if (!el) return false;

    const sid = normalizeSession(el);

    if (!sid) return false;

    if (!SESSION_STATES.includes(state)) {
      state = "active";
    }

    SESSION_STATES.forEach((name) => {
      if (name !== state) {
        el.classList.remove(name);
      }
    });

    el.classList.add(state);
    el.dataset.sessionState = state;

    /*
      Flags compatíveis com módulos antigos.
    */
    el.dataset.minimized =
      state === "minimized"
        ? "true"
        : "false";

    el.dataset.suspended =
      state === "suspended"
        ? "true"
        : "false";

    if (
      state === "active" ||
      state === "maximized"
    ) {
      el.dataset.minimized = "false";
      el.dataset.suspended = "false";
    }

    return true;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §5 · DOCK STORAGE
     ═══════════════════════════════════════════════════════════════════════ */

  function readDockMap() {
    try {
      const raw =
        localStorage.getItem(DOCK_KEY);

      const map =
        raw ? JSON.parse(raw) : {};

      return (
        map &&
        typeof map === "object" &&
        !Array.isArray(map)
      )
        ? map
        : {};
    } catch (_) {
      return {};
    }
  }

  function writeDockMap(map) {
    try {
      localStorage.setItem(
        DOCK_KEY,
        JSON.stringify(map || {})
      );
    } catch (_) {}
  }

  function removeDockEntry(id) {
    if (!id) return;

    const map = readDockMap();

    if (Object.prototype.hasOwnProperty.call(map, id)) {
      delete map[id];
      writeDockMap(map);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §6 · RESTORE
     ───────────────────────────────────────────────────────────────────────
     Único caminho do adapter para restaurar uma session-window.
     ═══════════════════════════════════════════════════════════════════════ */

  function restoreSession(id, source = "restore") {
    const el = resolveSession(id);

    if (!el) {
      console.warn(
        "[KodBlloX_p] restore: session não encontrada:",
        id
      );

      /*
        Não fabrica uma janela.
      */
      return false;
    }

    const sid = getSessionId(el);

    if (!sid) {
      return false;
    }

    /* corpo canônico */
    setSessionState(el, "active");

    el.hidden = false;
    el.removeAttribute("hidden");
    el.removeAttribute("aria-hidden");

    /* frame */
    const frame = $(".win-frame", el);

    if (frame) {
      frame.hidden = false;
      frame.removeAttribute("hidden");
      frame.removeAttribute("aria-hidden");
    }

    /* ─────────────────────────────────────────────────────────────
       MXP
       Apenas sincroniza metadados existentes.
       Não renderiza outra session.
       ───────────────────────────────────────────────────────────── */

    try {
      const sessions =
        global.MXP?.state?.sessions;

      if (Array.isArray(sessions)) {
        const meta =
          sessions.find(
            (item) =>
              String(item.id) === String(sid)
          );

        if (meta) {
          meta.minimized = false;
          meta.suspended = false;

          if ("state" in meta) {
            meta.state = "active";
          }
        }

        /*
          save só quando o MXP realmente possui save.
        */
        global.MXP?.save?.();
      }
    } catch (_) {}

    /* ─────────────────────────────────────────────────────────────
       SessionLifecycle / iFSw
       Adapter passivo.
       ───────────────────────────────────────────────────────────── */

    try {
      if (
        typeof global.SessionLifecycle?.restore ===
        "function"
      ) {
        global.SessionLifecycle.restore(sid);
      }
    } catch (_) {}

    /* callback próprio da session */
    try {
      if (
        typeof el._onRestore ===
        "function"
      ) {
        el._onRestore();
      }
    } catch (_) {}

    /* ─────────────────────────────────────────────────────────────
       Dock
       ───────────────────────────────────────────────────────────── */

    removeDockEntry(sid);

    const dock = $(SELECTORS.dock);

    if (dock) {
      dock
        .querySelectorAll(
          `.dock-bubble[data-session-id="${cssEscape(sid)}"]`
        )
        .forEach((bubble) => {
          try {
            bubble.remove();
          } catch (_) {}
        });
    }

    /* loose mirror */
    $$(
      `[data-dock-mirror="1"][data-session-id="${cssEscape(sid)}"]`
    ).forEach((mirror) => {
      try {
        mirror.remove();
      } catch (_) {}
    });

    /* sincronizador existente do monólito */
    try {
      global.KBLX_syncLooseWithDock?.();
    } catch (_) {}

    /* ─────────────────────────────────────────────────────────────
       Eventos
       ───────────────────────────────────────────────────────────── */

    try {
      el.dispatchEvent(
        new CustomEvent(
          "kblx:session-focus",
          {
            bubbles: true,
            detail: {
              id: sid,
              el,
              source
            }
          }
        )
      );
    } catch (_) {}

    try {
      document.dispatchEvent(
        new CustomEvent(
          "kblx:session-restored",
          {
            detail: {
              id: sid,
              el,
              source
            }
          }
        )
      );
    } catch (_) {}

    console.log(
      "[KodBlloX_p] restore:",
      sid,
      source
    );

    return true;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §7 · DOCK BUBBLE
     ═══════════════════════════════════════════════════════════════════════ */

  function getSessionTitle(session) {
    if (!session) return "SESSION";

    const title =
      session.dataset.title ||
      $(".win-title", session)?.textContent ||
      $(".win-hdr", session)?.textContent ||
      session.id ||
      "SESSION";

    return String(title)
      .replace(/\s+/g, " ")
      .trim() || "SESSION";
  }

  function createDockBubble(session) {
    if (!session) return null;

    const sid = getSessionId(session);

    if (!sid) return null;

    const dock = $(SELECTORS.dock);

    if (!dock) {
      console.warn(
        "[KodBlloX_p] #dock ausente"
      );
      return null;
    }

    let bubble =
      dock.querySelector(
        `.dock-bubble[data-session-id="${cssEscape(sid)}"]`
      );

    /*
      Não duplica.
    */
    if (bubble) {
      return bubble;
    }

    const title =
      getSessionTitle(session);

    bubble =
      document.createElement("button");

    bubble.type = "button";
    bubble.className = "dock-bubble";

    bubble.dataset.sessionId = sid;
    bubble.dataset.kblxDock = "1";

    bubble.setAttribute(
      "aria-label",
      "Restaurar " + title
    );

    bubble.title =
      "Restaurar " + title;

    /*
      Mantém a linguagem visual do dock atual.
      Se o CSS do monólito já renderizar símbolo,
      este texto continua sendo apenas fallback.
    */
    bubble.textContent =
      title.charAt(0).toUpperCase();

    bubble._onRestore = function () {
      restoreSession(sid, "dock");
    };

    dock.appendChild(bubble);

    const map = readDockMap();

    map[sid] = {
      id: sid,
      title,
      ts: Date.now()
    };

    writeDockMap(map);

    return bubble;
  }

  function minimizeSession(id) {
    const el = resolveSession(id);

    if (!el) {
      return false;
    }

    const sid = getSessionId(el);

    if (!sid) {
      return false;
    }

    /*
      Primeiro estado canônico.
    */
    setSessionState(el, "minimized");

    /*
      Não marca como suspended.
    */
    el.dataset.suspended = "false";

    /*
      Única criação de bubble.
    */
    createDockBubble(el);

    /*
      Sincronizador existente.
    */
    try {
      global.KBLX_syncLooseWithDock?.();
    } catch (_) {}

    return sid;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §8 · DOCK DELEGATE
     ───────────────────────────────────────────────────────────────────────
     Capture porque o monólito possui outros handlers no mesmo botão.
     ═══════════════════════════════════════════════════════════════════════ */

  function restoreFromDockBubble(bubble) {
    if (!bubble) return false;

    const sid =
      bubble.dataset.sessionId;

    if (!sid) return false;

    return restoreSession(
      sid,
      "dock"
    );
  }

  function installDockDelegate() {
    const dock =
      document.getElementById("dock");

    if (!dock) return;

    if (dock.__KBLX_P_BOUND__) {
      return;
    }

    dock.__KBLX_P_BOUND__ = true;

    dock.addEventListener(
      "click",
      (event) => {
        const bubble =
          event.target?.closest?.(
            ".dock-bubble"
          );

        if (
          !bubble ||
          !dock.contains(bubble)
        ) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        restoreFromDockBubble(bubble);
      },
      true
    );

    console.log(
      "[KodBlloX_p] dock delegate online"
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §9 · LOOSE / DOCK MIRROR
     ═══════════════════════════════════════════════════════════════════════ */

  function installLooseDelegate() {
    const loose =
      document.querySelector(
        '[data-slot="loose"]'
      );

    if (!loose) return;

    if (loose.__KBLX_P_BOUND__) {
      return;
    }

    loose.__KBLX_P_BOUND__ = true;

    loose.addEventListener(
      "click",
      (event) => {
        const mirror =
          event.target?.closest?.(
            '[data-dock-mirror="1"]'
          );

        if (!mirror) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        const sid =
          mirror.dataset.sessionId;

        if (!sid) return;

        restoreSession(
          sid,
          "loose"
        );
      },
      true
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §10 · QUIET TOAST
     ═══════════════════════════════════════════════════════════════════════ */

  function quietToast(message) {
    const toast =
      document.getElementById("toast") ||
      document.getElementById("nv-toast");

    if (!toast) {
      console.log(
        "[KBLX toast]",
        message
      );
      return;
    }

    toast.textContent =
      String(message ?? "");

    toast.classList.add("show");

    clearTimeout(
      global.__KBLX_P_TOAST_TIMER__
    );

    global.__KBLX_P_TOAST_TIMER__ =
      setTimeout(() => {
        toast.classList.remove("show");
      }, 1800);
  }

  global.KBLX_TOAST_QUIET =
    quietToast;

  /*
    Guarda a referência uma única vez.
  */
  if (!global.KBLX_P_TOAST_BOUND) {
    global.KBLX_P_TOAST_BOUND = true;

    global.KBLX_TOAST =
      function (message) {
        try {
          quietToast(message);
        } catch (_) {}
      };
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §11 · APP.SHOWTOAST
     ═══════════════════════════════════════════════════════════════════════ */

  function muteAppToast() {
    const app = global.App;

    if (
      !app ||
      typeof app.showToast !==
        "function"
    ) {
      return;
    }

    if (app.__KBLX_P_TOAST_MUTED__) {
      return;
    }

    app.__KBLX_P_TOAST_MUTED__ = true;

    app.showToast =
      function (message) {
        quietToast(message);
      };
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §12 · LIFECYCLE GUARD
     ───────────────────────────────────────────────────────────────────────
     O lifecycle continua sendo o lifecycle do monólito.
     Este adapter apenas impede uma suspensão/eviction precoce.

     3 min → mínimo antes de suspend
     8 min → mínimo antes de evict
     ═══════════════════════════════════════════════════════════════════════ */

  const HARD_IDLE_MS =
    3 * 60 * 1000;

  const HARD_SUSPEND_MS =
    8 * 60 * 1000;

  function installLifecycleAdapter() {
    const SL =
      global.SessionLifecycle;

    if (!SL) return;

    if (SL.__KBLX_P_GUARDED__) {
      return;
    }

    /*
      Marca antes de alterar qualquer função.
    */
    SL.__KBLX_P_GUARDED__ = true;

    if (
      typeof SL.suspend ===
      "function"
    ) {
      const originalSuspend =
        SL.suspend.bind(SL);

      SL.suspend =
        function (id) {
          let meta = null;

          try {
            meta =
              SL.getSession?.(id);
          } catch (_) {}

          const lastActive =
            Number(
              meta?.lastActive || 0
            );

          /*
            Se não existe timestamp,
            não bloqueia o engine original.
          */
          if (!lastActive) {
            return originalSuspend(id);
          }

          const age =
            Date.now() -
            lastActive;

          if (
            age < HARD_IDLE_MS
          ) {
            return false;
          }

          return originalSuspend(id);
        };
    }

    if (
      typeof SL.evict ===
      "function"
    ) {
      const originalEvict =
        SL.evict.bind(SL);

      SL.evict =
        function (id) {
          let meta = null;

          try {
            meta =
              SL.getSession?.(id);
          } catch (_) {}

          const lastSuspended =
            Number(
              meta?.lastSuspendedAt ||
              0
            );

          if (!lastSuspended) {
            return originalEvict(id);
          }

          const age =
            Date.now() -
            lastSuspended;

          if (
            age < HARD_SUSPEND_MS
          ) {
            return false;
          }

          return originalEvict(id);
        };
    }

    console.log(
      "[KodBlloX_p] lifecycle adapter · 3m / 8m"
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §13 · INDEXEDDB
     ───────────────────────────────────────────────────────────────────────
     O monólito possui App.indexedDB real.

     NÃO destruímos a API.
     Apenas impedimos o fluxo específico de background de competir
     com o Cockpit quando esses métodos existirem.
     ═══════════════════════════════════════════════════════════════════════ */

  function installIndexedDBAdapter() {
    const indexed =
      global.App?.indexedDB;

    if (!indexed) return;

    if (
      indexed.__KBLX_P_DISABLED__
    ) {
      return;
    }

    indexed.__KBLX_P_DISABLED__ =
      true;

    /*
      Background upload:
      Cockpit / Galeria são os donos desse fluxo.
    */
    if (
      typeof indexed.handleBackgroundUpload ===
      "function"
    ) {
      indexed.handleBackgroundUpload =
        async function () {
          quietToast(
            "Upload gerenciado pelo Cockpit"
          );

          return false;
        };
    }

    /*
      Background loading não deve recriar
      estado visual por fora do Cockpit.
    */
    if (
      typeof indexed.loadBackground ===
      "function"
    ) {
      indexed.loadBackground =
        async function () {
          return null;
        };
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §14 · SRCDOC PASSIVE GUARD
     ───────────────────────────────────────────────────────────────────────
     IMPORTANTE:

     O monólito pode usar srcdoc legitimamente.

     Portanto:
       NÃO remove srcdoc
       NÃO troca src por about:blank
       NÃO reinjeta HTML
       NÃO observa para destruir conteúdo

     Apenas marca o frame canônico.
     ═══════════════════════════════════════════════════════════════════════ */

  function installSrcdocGuard() {
    if (!document.body) return;

    if (
      document.body.__KBLX_P_SRCDOC_GUARD__
    ) {
      return;
    }

    document.body.__KBLX_P_SRCDOC_GUARD__ =
      true;

    $$(SELECTORS.sessions)
      .forEach((session) => {
        const frame =
          $(".win-frame", session);

        if (frame) {
          frame.dataset.kblxFrame =
            "1";
        }
      });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §15 · NATIVE DIALOG
     ─────────────────────────────────────────────────────────────────────── */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function nativePrompt(
    message,
    defaultValue = ""
  ) {
    return new Promise((resolve) => {
      if (
        typeof global.HTMLDialogElement ===
        "undefined"
      ) {
        resolve(
          global.prompt(
            message,
            defaultValue
          )
        );

        return;
      }

      const dlg =
        document.createElement(
          "dialog"
        );

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
        "font-family:inherit;" +
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

      document.body.appendChild(
        dlg
      );

      dlg.addEventListener(
        "close",
        () => {
          const input =
            dlg.querySelector(
              'input[name="v"]'
            );

          const value =
            dlg.returnValue ===
            "__cancel"
              ? null
              : input?.value ?? "";

          dlg.remove();

          resolve(value);
        },
        { once: true }
      );

      dlg.showModal();

      const input =
        dlg.querySelector(
          'input[name="v"]'
        );

      input?.focus();
      input?.select();
    });
  }

  function nativeConfirm(message) {
    return new Promise((resolve) => {
      if (
        typeof global.HTMLDialogElement ===
        "undefined"
      ) {
        resolve(
          global.confirm(message)
        );

        return;
      }

      const dlg =
        document.createElement(
          "dialog"
        );

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

      document.body.appendChild(
        dlg
      );

      dlg.addEventListener(
        "close",
        () => {
          const yes =
            dlg.returnValue ===
            "__yes";

          dlg.remove();

          resolve(yes);
        },
        { once: true }
      );

      dlg.showModal();
    });
  }

  global.KBLX_PROMPT =
    nativePrompt;

  global.KBLX_CONFIRM =
    nativeConfirm;

  /* ═══════════════════════════════════════════════════════════════════════
     §16 · SESSION API PÚBLICA
     ═══════════════════════════════════════════════════════════════════════ */

  KBLX.sessionAdapter = {
    version: "16",

    /*
      identidade
    */
    baseId:
      BASE_SESSION_ID,

    /*
      resolução
    */
    resolve:
      resolveSession,

    id:
      getSessionId,

    /*
      normalização
    */
    normalize:
      normalizeSession,

    normalizeAll:
      normalizeAllSessions,

    /*
      estado
    */
    setState:
      setSessionState,

    /*
      ciclo
    */
    restore:
      restoreSession,

    minimize:
      minimizeSession,

    /*
      dock
    */
    dock:
      createDockBubble,

    readDock:
      readDockMap,

    removeDock:
      removeDockEntry,

    /*
      lifecycle
    */
    lifecycle: {
      idle:
        HARD_IDLE_MS,

      suspend:
        HARD_SUSPEND_MS
    }
  };

  /*
    aliases compatíveis
    */
  global.KBLX_SESSION =
    KBLX.sessionAdapter;

  global.KBLX_RESTORE_SESSION =
    restoreSession;

  global.KBLX_MINIMIZE_SESSION =
    minimizeSession;

  /* ═══════════════════════════════════════════════════════════════════════
     §17 · MXP BRIDGE
     ───────────────────────────────────────────────────────────────────────
     NÃO sobrescreve createSession.

     O MXP continua sendo o dono da criação/renderização.
     O adapter apenas recebe a interface canônica.
     ═══════════════════════════════════════════════════════════════════════ */

  function installMXPBridge() {
    const MXP =
      global.MXP;

    if (!MXP) return;

    /*
      Não retorna cedo se já bridgeado caso o adapter
      tenha mudado; simplesmente garante a referência.
    */
    MXP.KBLX =
      KBLX.sessionAdapter;

    if (
      !MXP.__KBLX_P_BRIDGED__
    ) {
      MXP.__KBLX_P_BRIDGED__ =
        true;

      console.log(
        "[KodBlloX_p] MXP bridge online"
      );
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §18 · LATE MODULE BIND
     ─────────────────────────────────────────────────────────────────────── */

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

    /*
      80 × 250ms ≈ 20s
      suficiente para módulos defer/tardios.
    */
    if (lateTries >= 80) {
      clearInterval(
        lateTimer
      );

      lateTimer = null;

      console.log(
        "[KodBlloX_p] late-bind finalizado"
      );
    }
  }

  function startLateBind() {
    if (lateTimer) return;

    lateTimer =
      setInterval(
        lateBind,
        250
      );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §19 · MUTATION OBSERVER
     ───────────────────────────────────────────────────────────────────────
     Observa apenas o aparecimento de elementos relevantes.

     Não observa srcdoc.
     Não reescreve frame.
     Não cria session.
     ═══════════════════════════════════════════════════════════════════════ */

  let observer = null;

  function startObserver() {
    if (
      observer ||
      !document.body
    ) {
      return;
    }

    observer =
      new MutationObserver(
        (mutations) => {
          let relevant = false;

          for (
            const mutation of mutations
          ) {
            if (
              mutation.type !==
              "childList"
            ) {
              continue;
            }

            for (
              const node of
              mutation.addedNodes || []
            ) {
              if (
                node.nodeType !==
                1
              ) {
                continue;
              }

              if (
                node.matches?.(
                  ".session-window," +
                  ".dock-bubble," +
                  "#dock," +
                  "#sessionsLayer"
                ) ||
                node.querySelector?.(
                  ".session-window," +
                  ".dock-bubble"
                )
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
        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     §20 · BOOT
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

    console.log(
      "[KodBlloX_p] v16 · Session Window Adapter online"
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        setTimeout(
          boot,
          120
        );
      },
      { once: true }
    );
  } else {
    setTimeout(
      boot,
      120
    );
  }

  global.addEventListener(
    "load",
    () => {
      setTimeout(
        boot,
        350
      );
    },
    { once: true }
  );

  /* ═══════════════════════════════════════════════════════════════════════
     §21 · EVENT BRIDGE
     ═══════════════════════════════════════════════════════════════════════ */

  document.addEventListener(
    "kblx:session-restored",
    (event) => {
      const id =
        event.detail?.id;

      if (!id) return;

      normalizeAllSessions();

      installDockDelegate();
      installLooseDelegate();

      installMXPBridge();
    }
  );

  /*
    Eventos já utilizados pelo ecossistema.
    O adapter NÃO cria uma sessão.
    Apenas normaliza quando ela apareceu.
  */
  [
    "ifsw:session-open",
    "legacy:session-open",
    "session:open",
    "mxp:session-created"
  ].forEach((eventName) => {
    document.addEventListener(
      eventName,
      () => {
        requestAnimationFrame(() => {
          normalizeAllSessions();
          installDockDelegate();
          installLooseDelegate();
          installMXPBridge();
        });
      }
    );
  });

  /* ═══════════════════════════════════════════════════════════════════════
     §22 · DEBUG
     ═══════════════════════════════════════════════════════════════════════ */

  KBLX.debug =
    function () {
      return {
        version:
          KBLX.version,

        base:
          getBaseSession(),

        sessions:
          $$(SELECTORS.sessions)
            .map((el) => ({
              id:
                el.dataset.sessionId,

              state:
                el.dataset.sessionState,

              minimized:
                el.dataset.minimized,

              suspended:
                el.dataset.suspended,

              url:
                el.dataset.url,

              host:
                el.closest?.(
                  "#stackWrap"
                )
                  ? "stack"
                  : el.closest?.(
                      "#sessionsLayer"
                    )
                    ? "float"
                    : "unknown"
            })),

        dock:
          readDockMap(),

        MXP:
          !!global.MXP,

        SessionLifecycle:
          !!global.SessionLifecycle,

        iFSw:
          !!(
            global.iFSw ||
            global.IFSW
          ),

        baseExists:
          !!getBaseSession(),

        stackExists:
          !!$(SELECTORS.host),

        layerExists:
          !!$(SELECTORS.layer),

        dockExists:
          !!$(SELECTORS.dock)
      };
    };

  console.log(
    "[KodBlloX_p] loaded · canonical session-window adapter"
  );

})(window, document);

/* ============================================================================
   END · KodBlloX_p.js
   ============================================================================ */