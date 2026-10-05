/* ═══════════════════════════════════════════════════════════════
   KOBLLUX v7.8 — FULL MOON runtime
   Close X → Workspace Loose (does NOT destroy)
   Dock ۞ → SymbolBar bubble + Loose mirror
   Loose receives closed / minimized sessions
   Pills reflect live MXP counts
   Trash (× on loose card) is the only destroy path
   ═══════════════════════════════════════════════════════════════ */
(function KBLX_V78() {
  "use strict";
  if (window.__KBLX_V78__) return;
  window.__KBLX_V78__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    if (window.KBLX_TOAST) window.KBLX_TOAST(msg);
  }

  function findWin(id) {
    if (!id) return null;
    return (
      document.querySelector('.session-window[data-session-id="' + id + '"]:not(.dock-bubble)') ||
      document.querySelector('.mxp-window[data-session-id="' + id + '"]:not(.dock-bubble)') ||
      document.getElementById(id)
    );
  }

  function sessionRecord(id) {
    return window.MXP?.state?.sessions?.find((x) => x.id === id) || null;
  }

  function winTitle(el, s) {
    return (
      s?.name ||
      s?.title ||
      el?.dataset?.sessionTitle ||
      el?.querySelector?.(".mxp-title, [data-part='title']")?.textContent?.trim() ||
      idLabel(el, s)
    );
  }

  function idLabel(el, s) {
    return s?.id || el?.dataset?.sessionId || el?.id || "Sessão";
  }

  function persist() {
    try {
      window.MXP?.save?.();
    } catch (_) {}
  }

  /* ── PILLS ─────────────────────────────────────────────────── */
  function updatePills() {
    const sessions = window.MXP?.state?.sessions || [];
    const domWins = $$(".session-window, .mxp-window").filter(
      (el) => !el.classList.contains("dock-bubble")
    );

    let active = sessions.filter((s) => s.state !== "closed" && !s.minimized && !s.workspace).length;
    let docked = sessions.filter((s) => s.docked).length;
    let loose = sessions.filter((s) => s.state === "closed" || s.workspace || (s.minimized && !s.docked)).length;

    if (!sessions.length) {
      active = domWins.filter(
        (el) =>
          !el.classList.contains("minimized") &&
          !el.classList.contains("kblx-workspace") &&
          el.dataset.kblxClosed !== "1"
      ).length;
      docked = $$("#dock .dock-bubble").length;
      loose = $$("[data-slot='loose'] [data-closed-session]").length;
    }

    const pillActive = $('[data-pill="active"]');
    if (pillActive) pillActive.textContent = "⬡ " + active + " ATIVA" + (active !== 1 ? "S" : "");

    const pillDock = $('[data-pill="dock"]');
    if (pillDock) {
      pillDock.textContent = "⚓ " + docked;
      pillDock.style.display = docked > 0 ? "" : "none";
    }

    const pillLoose = $('[data-pill="loose"]');
    if (pillLoose) {
      pillLoose.textContent = "◈ " + loose;
      pillLoose.style.display = loose > 0 ? "" : "none";
    }

    const pillArch = $(".pill.arch, #pillArch");
    if (pillArch) {
      const arch = document.body.dataset.voiceArch || "kobllux";
      if (!pillArch.textContent || pillArch.dataset.pill === "arch") {
        pillArch.textContent = "◈ " + String(arch).toUpperCase();
      }
    }
  }

  /* ── LOOSE ─────────────────────────────────────────────────── */
  function renderClosedIntoLoose() {
    const slot = $('[data-slot="loose"]');
    if (!slot) return;

    slot.querySelectorAll("[data-closed-session]").forEach((el) => el.remove());
    slot.querySelectorAll(".kblx-loose-empty").forEach((el) => el.remove());

    const seen = new Set();
    const sessions = window.MXP?.state?.sessions || [];

    function addCard(id, title, icon) {
      if (!id || seen.has(id)) return;
      if (slot.querySelector('[data-dock-mirror="1"][data-session-id="' + id + '"]')) return;
      seen.add(id);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "mxp-btn kblx-loose-card slot-loose";
      card.dataset.closedSession = "1";
      card.dataset.sessionId = id;
      card.title = "Reabrir: " + title;
      card.innerHTML =
        '<span class="mxp-icon">' +
        (icon || "⬡") +
        '</span><span class="mxp-label"></span><span class="kblx-destroy" data-destroy="1" title="Excluir de vez">×</span>';
      card.querySelector(".mxp-label").textContent = title || "Sessão";
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-destroy]")) {
          e.preventDefault();
          e.stopPropagation();
          destroySession(id);
          return;
        }
        restoreSession(id);
      });
      slot.appendChild(card);
    }

    sessions.forEach((s) => {
      if (s.state === "closed" || s.workspace || (s.minimized && !s.docked)) {
        addCard(s.id, s.name || s.title || s.id, s.icon);
      }
    });

    $$(".session-window.kblx-workspace, .session-window[data-kblx-closed='1']").forEach((el) => {
      const id = el.dataset.sessionId || el.id;
      addCard(id, winTitle(el, sessionRecord(id)), el.dataset.icon || "⬡");
    });

    const hasAnything =
      slot.children.length > 0 && !slot.querySelector(".kblx-loose-empty");
    if (!hasAnything) {
      const empty = document.createElement("span");
      empty.className = "kblx-loose-empty";
      empty.textContent = "◌ vazio";
      slot.appendChild(empty);
    }
  }

  function syncLoose() {
    try {
      window.__KBLX_V78_SYNCING_ORIG = true;
      origSyncLoose?.();
    } finally {
      window.__KBLX_V78_SYNCING_ORIG = false;
    }
    renderClosedIntoLoose();
    updatePills();
  }

  /* ── CLOSE (not destroy) ───────────────────────────────────── */
  function closeSession(id) {
    if (!id) return;
    const s = sessionRecord(id);
    const el = findWin(id);

    if (s) {
      s.state = "closed";
      s.workspace = true;
      s.minimized = false;
      s.maximized = false;
      s.collapsed = false;
      s.peeked = false;
      s.docked = false;
      persist();
    }

    if (el) {
      el.classList.add("kblx-workspace");
      el.classList.remove("maximized", "collapsed", "peeked", "minimized");
      el.dataset.kblxClosed = "1";
      el.dataset.state = "closed";
      el.style.display = "none";
    }

    try {
      window.kblxDockRemove?.(id);
    } catch (_) {}
    document.querySelector('.dock-bubble[data-session-id="' + id + '"]')?.remove();

    const next = (window.MXP?.state?.sessions || []).find(
      (x) => x.id !== id && x.state !== "closed" && !x.workspace && !x.minimized
    );
    if (next && window.DualSession?.bringToFront) {
      const nw = findWin(next.id);
      if (nw) window.DualSession.bringToFront(nw);
    }

    syncLoose();
    toast("⬡ Sessão enviada ao Workspace Loose");
  }

  /* ── DOCK ──────────────────────────────────────────────────── */
  function dockSession(id) {
    if (!id) return;
    const s = sessionRecord(id);
    const el = findWin(id);
    if (s) {
      s.docked = true;
      s.minimized = true;
      s.maximized = false;
      s.workspace = false;
      s.state = "docked";
      persist();
    }
    if (el) {
      el.classList.remove("kblx-workspace");
      el.dataset.kblxClosed = "";
      el.style.display = "";
      window.KBLX_minimizeToDock?.(el, {
        title: winTitle(el, s),
        onMinimize: () => {
          if (s) {
            s.minimized = true;
            persist();
          }
        },
        onRestore: () => {
          if (s) {
            s.minimized = false;
            s.docked = false;
            s.state = "active";
            persist();
          }
          syncLoose();
        },
      });
    }
    syncLoose();
    toast("⬡ Docked no SymbolBar");
  }

  function undockSession(id) {
    restoreSession(id);
  }

  function restoreSession(id) {
    if (!id) return;
    const s = sessionRecord(id);
    const el = findWin(id);
    if (s) {
      s.state = "active";
      s.workspace = false;
      s.minimized = false;
      s.docked = false;
      persist();
    }
    if (el) {
      el.classList.remove("kblx-workspace", "minimized");
      el.dataset.kblxClosed = "";
      el.dataset.state = "active";
      el.style.display = "";
      window.DualSession?.bringToFront?.(el);
    } else {
      window.DualSession?.renderSessions?.();
    }
    try {
      window.kblxDockRemove?.(id);
    } catch (_) {}
    document.querySelector('.dock-bubble[data-session-id="' + id + '"]')?.remove();
    syncLoose();
    toast("⬡ Sessão restaurada");
  }

  /* ── DESTROY (trash / explicit × only) ─────────────────────── */
  function destroySession(id) {
    if (!id) return;
    const ok = window.confirm ? window.confirm("Excluir sessão permanentemente?") : true;
    if (!ok) return;

    const el = findWin(id);
    if (el) el.remove();
    document.querySelector('.dock-bubble[data-session-id="' + id + '"]')?.remove();

    const M = window.MXP;
    if (M && typeof origDestroy === "function") {
      origDestroy(id);
    } else if (M?.state?.sessions) {
      M.state.sessions = M.state.sessions.filter((x) => x.id !== id);
      if (M.state.slots) delete M.state.slots["session:" + id];
      persist();
    }
    window.KobluxEngine?.unregisterNode?.(id);
    syncLoose();
    toast("× Sessão excluída");
  }

  /* ── STACK vs FLOAT ────────────────────────────────────────── */
  function toggleSessionHost() {
    const current = document.body.dataset.sessionHost || "float";
    const next = current === "stack" ? "float" : "stack";
    document.body.dataset.sessionHost = next;
    (window.MXP?.state?.sessions || []).forEach((s) => {
      if (!s.host) s.host = next;
    });
    persist();
    window.DualSession?.renderSessions?.();
    const label = $("#hostModeLabel");
    if (label) label.textContent = next.toUpperCase();
    toast("⬡ Modo: " + next.toUpperCase());
    syncLoose();
  }

  /* ── PATCH MXP / DualSession ───────────────────────────────── */
  let origDestroy = null;
  let origSyncLoose = null;
  let patched = false;

  function patchMXP() {
    const M = window.MXP;
    if (!M) return false;
    if (M.__v78) {
      patched = true;
      return true;
    }
    M.__v78 = true;
    origDestroy =
      (typeof M.destroySession === "function" && M.destroySession.bind(M)) ||
      (typeof M.removeSession === "function" && M.removeSession.bind(M)) ||
      origDestroy;

    M.destroySession = destroySession;
    M.closeSession = closeSession;
    M.dockSession = dockSession;
    M.undockSession = undockSession;
    M.removeSession = function (id) {
      closeSession(id);
    };

    if (typeof window.KBLX_syncLooseWithDock === "function" && !window.KBLX_syncLooseWithDock.__v78) {
      origSyncLoose = window.KBLX_syncLooseWithDock;
      const wrapped = function () {
        if (window.__KBLX_V78_SYNCING_ORIG) return origSyncLoose.apply(this, arguments);
        syncLoose();
      };
      wrapped.__v78 = true;
      window.KBLX_syncLooseWithDock = wrapped;
    }

    if (window.DualSession && !window.DualSession.__v78) {
      window.DualSession.__v78 = true;
      const origRender = window.DualSession.renderSessions;
      if (typeof origRender === "function") {
        window.DualSession.renderSessions = function () {
          const r = origRender.apply(this, arguments);
          (window.MXP?.state?.sessions || []).forEach((s) => {
            if (s.state === "closed" || s.workspace) {
              const el = findWin(s.id);
              if (el) {
                el.classList.add("kblx-workspace");
                el.classList.remove("minimized");
                el.style.display = "none";
              }
            }
          });
          syncLoose();
          return r;
        };
      }
    }

    patched = true;
    return true;
  }

  /* Capture-phase: X never destroys. Tab-close buttons are ignored. */
  document.addEventListener(
    "click",
    function (e) {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(".tab-close, .tab-card .tab-close, [data-destroy]")) return;
      const btn = t.closest(
        '[data-sn="close"], [data-action="session:close"], [data-action="close"], [data-dual-action="session:close"]'
      );
      if (!btn) return;
      const win = btn.closest(".session-window, .mxp-window");
      if (!win) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const id = win.dataset.sessionId || win.id;
      closeSession(id);
    },
    true
  );

  document.addEventListener(
    "click",
    function (e) {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const btn = t.closest('[data-sn="minimize"], [data-action="minimize"], [data-action="session:minimize"]');
      if (!btn) return;
      const win = btn.closest(".session-window, .mxp-window");
      if (!win) return;
      const id = win.dataset.sessionId || win.id;
      const s = sessionRecord(id);
      if (s) {
        s.docked = true;
        s.minimized = true;
        persist();
      }
      setTimeout(syncLoose, 40);
    },
    false
  );

  window.KBLX_V78 = {
    closeSession,
    dockSession,
    undockSession,
    restoreSession,
    destroySession,
    updatePills,
    renderLoose: renderClosedIntoLoose,
    sync: syncLoose,
    toggleSessionHost,
    version: "7.8",
  };

  window.toggleSessionHost = toggleSessionHost;

  function boot() {
    patchMXP();
    const hostBtn = $("#toggleHostBtn");
    if (hostBtn && !hostBtn.__v78) {
      hostBtn.__v78 = true;
      hostBtn.addEventListener("click", () => setTimeout(syncLoose, 80));
    }
    syncLoose();
  }

  [0, 400, 1200, 2600, 4000, 7000].forEach((t) => setTimeout(boot, t));
  window.addEventListener("load", () => setTimeout(boot, 2800));
  document.addEventListener("mxp:section-action", (ev) => {
    const d = ev.detail || {};
    if (d.action === "close") {
      const id = d.section?.dataset?.sessionId || d.section?.id;
      if (id) closeSession(id);
    }
  });
  document.addEventListener("kblx:session-restored", () => setTimeout(syncLoose, 30));
})();
