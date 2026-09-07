(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     KXTSK-SHELL / STACKWRAP
     iFSw BASE NEPHESH
     
     Arquitetura:
       SESSION ≠ WINDOW ≠ RUNTIME ≠ TAB

       CREATED
          ↓
       LOADING
          ↓
       ACTIVE
          ↓
       IDLE
          ↓
       SUSPENDED
          ↓
       EVICTED
          ↓
       CLOSED
  ═══════════════════════════════════════════════════════════════ */

  const ROOT = document.documentElement;
  const THEME_KEY = 'dual-theme';

  const stackWrap = document.getElementById('stackWrap');
  const dock = document.getElementById('dock');

  if (!stackWrap) {
    console.warn('[iFSw] #stackWrap não encontrado.');
  }

  /* ─────────────────────────────────────────────────────────────
     CONSTANTES
  ───────────────────────────────────────────────────────────── */

  const SessionState = {
    CREATED:   'created',
    LOADING:   'loading',
    ACTIVE:    'active',
    IDLE:      'idle',
    SUSPENDED: 'suspended',
    EVICTED:   'evicted',
    CLOSED:    'closed'
  };

  const Tier = {
    FREE:    'free',
    PRO:     'pro',
    PREMIUM: 'premium'
  };

  const TIER_LIMITS = {
    [Tier.FREE]: {
      maxActive: 2,
      maxSuspended: 3,
      maxSessions: 5
    },

    [Tier.PRO]: {
      maxActive: 4,
      maxSuspended: 6,
      maxSessions: 12
    },

    [Tier.PREMIUM]: {
      maxActive: 8,
      maxSuspended: 12,
      maxSessions: 30
    }
  };

  const IDLE_AFTER_MS = 45_000;
  const SUSPEND_AFTER_IDLE_MS = 90_000;

  let currentTier = Tier.FREE;
  let counter = 1;

  let activeWindow = null;
  let currentSwitcherWin = null;

  /* ─────────────────────────────────────────────────────────────
     STORES
  ───────────────────────────────────────────────────────────── */

  const timers = new Map();

  /*
    RuntimeStore

    Guarda apenas aquilo que é necessário para reconstruir
    o iframe/runtime.
  */
  const runtimeStore = new Map();

  /*
    SessionMeta

    Estado lógico da sessão.
  */
  const sessionMeta = new Map();

  /*
    TabData

    Estado das abas pertence à WINDOW/SESSION,
    não ao iframe.
  */
  const tabDataMap = new WeakMap();

  /*
    Ordem de suspensão.
    O primeiro é o mais antigo candidato a eviction.
  */
  const suspendedQueue = [];

  /*
    Ordem visual/z-index.
  */
  const zStack = [];

  /* ─────────────────────────────────────────────────────────────
     LIMITES
  ───────────────────────────────────────────────────────────── */

  function currentLimits() {
    return TIER_LIMITS[currentTier] || TIER_LIMITS[Tier.FREE];
  }

  function countByStates(...states) {
    let count = 0;

    sessionMeta.forEach(meta => {
      if (states.includes(meta.state)) count++;
    });

    return count;
  }

  function countSessions() {
    return countByStates(
      SessionState.CREATED,
      SessionState.LOADING,
      SessionState.ACTIVE,
      SessionState.IDLE,
      SessionState.SUSPENDED,
      SessionState.EVICTED
    );
  }

  /* ─────────────────────────────────────────────────────────────
     HELPERS DOM
  ───────────────────────────────────────────────────────────── */

  const $ = (sel, root = document) =>
    root.querySelector(sel);

  const $$ = (sel, root = document) =>
    [...root.querySelectorAll(sel)];

  function getWin(id) {
    return document.getElementById(id);
  }

  function isMaximized(win) {
    return !!win?.classList.contains('maximized');
  }

  function isMinimized(win) {
    return !!win?.classList.contains('minimized');
  }

  function isPinned(win) {
    return win?.dataset.pinned === 'true';
  }

  /* ─────────────────────────────────────────────────────────────
     SESSION META
  ───────────────────────────────────────────────────────────── */

  function ensureSessionMeta(id) {
    let meta = sessionMeta.get(id);

    if (!meta) {
      meta = {
        id,
        state: SessionState.CREATED,
        createdAt: Date.now(),
        lastActive: Date.now(),

        /*
          Proteções
        */
        pinned: false,
        hasUnsavedWork: false,
        mediaPlaying: false,

        /*
          Estatísticas
        */
        suspendCount: 0,
        restoreCount: 0,
        lastSuspendedAt: null,
        lastRestoredAt: null
      };

      sessionMeta.set(id, meta);
    }

    return meta;
  }

  function setSessionState(id, state, extra = {}) {
    const win = getWin(id);
    const meta = ensureSessionMeta(id);

    meta.state = state;

    Object.assign(meta, extra);

    if (
      state === SessionState.ACTIVE ||
      state === SessionState.LOADING
    ) {
      meta.lastActive = Date.now();
    }

    if (state === SessionState.SUSPENDED) {
      meta.lastSuspendedAt = Date.now();
      meta.suspendCount++;
    }

    if (state === SessionState.CLOSED) {
      sessionMeta.delete(id);
    }

    if (win) {
      win.dataset.state = state;

      win.classList.remove(
        'state-created',
        'state-loading',
        'state-active',
        'state-idle',
        'state-suspended',
        'state-evicted',
        'state-closed'
      );

      win.classList.add('state-' + state);

      win.dataset.suspended =
        state === SessionState.SUSPENDED ||
        state === SessionState.EVICTED
          ? 'true'
          : 'false';
    }

    window.dispatchEvent(
      new CustomEvent('session:state-change', {
        detail: {
          id,
          state,
          meta: { ...meta }
        }
      })
    );

    updateStateBadge(win);
  }

  function getSessionState(id) {
    return sessionMeta.get(id)?.state || null;
  }

  function touchSession(id) {
    const meta = sessionMeta.get(id);
    if (!meta) return;

    meta.lastActive = Date.now();

    if (meta.state === SessionState.IDLE) {
      setSessionState(id, SessionState.ACTIVE);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     POLÍTICA DE LIFECYCLE
  ───────────────────────────────────────────────────────────── */

  const LifecyclePolicy = {

    canSuspend(id) {
      const win = getWin(id);
      const meta = sessionMeta.get(id);

      if (!win || !meta) return false;

      if (
        meta.state !== SessionState.ACTIVE &&
        meta.state !== SessionState.IDLE
      ) {
        return false;
      }

      if (isMaximized(win)) return false;
      if (isPinned(win) || meta.pinned) return false;

      /*
        Não suspendemos algo que ainda está carregando.
      */
      if (meta.state === SessionState.LOADING) return false;

      return true;
    },

    canEvict(id) {
      const win = getWin(id);
      const meta = sessionMeta.get(id);

      if (!meta) return false;

      if (meta.state !== SessionState.SUSPENDED) {
        return false;
      }

      if (win) {
        if (isMaximized(win)) return false;
        if (isPinned(win)) return false;
      }

      if (meta.pinned) return false;

      /*
        Se o app marcou trabalho não salvo,
        não fazemos eviction automático.
      */
      if (meta.hasUnsavedWork) return false;

      return true;
    },

    canRestore(id) {
      const meta = sessionMeta.get(id);

      if (!meta) return false;

      return (
        meta.state === SessionState.SUSPENDED ||
        meta.state === SessionState.EVICTED
      );
    }
  };

  /* ─────────────────────────────────────────────────────────────
     CANDIDATO DE SUSPENSÃO
  ───────────────────────────────────────────────────────────── */

  function leastRecentlyActiveSession(excludeId = null) {

    let candidate = null;
    let oldest = Infinity;

    sessionMeta.forEach((meta, id) => {

      if (id === excludeId) return;

      const win = getWin(id);

      if (!win) return;

      if (!LifecyclePolicy.canSuspend(id)) {
        return;
      }

      const time = meta.lastActive || 0;

      if (time < oldest) {
        oldest = time;
        candidate = id;
      }
    });

    return candidate;
  }

  /* ─────────────────────────────────────────────────────────────
     CANDIDATO DE EVICTION
  ───────────────────────────────────────────────────────────── */

  function findEvictionCandidate() {

    let candidate = null;
    let bestScore = -Infinity;

    sessionMeta.forEach((meta, id) => {

      const win = getWin(id);

      if (!LifecyclePolicy.canEvict(id)) {
        return;
      }

      /*
        Quanto maior o score,
        mais fácil de eliminar.
      */
      let score = 0;

      const now = Date.now();

      const age =
        now - (meta.lastActive || meta.lastSuspendedAt || now);

      /*
        Antiguidade pesa bastante.
      */
      score += age;

      /*
        Favoritos recebem proteção.
      */
      const data = win ? tabDataMap.get(win) : null;

      if (data) {
        const hasFavorite = data.tabs.some(tab => tab.fav);

        if (hasFavorite) {
          score -= 10_000_000_000;
        }
      }

      /*
        Mídia ativa é protegida.
      */
      if (meta.mediaPlaying) {
        score -= 20_000_000_000;
      }

      /*
        Trabalho não salvo é fortemente protegido.
      */
      if (meta.hasUnsavedWork) {
        score -= 50_000_000_000;
      }

      /*
        Quanto maior o score,
        mais candidato à eliminação.
      */
      if (score > bestScore) {
        bestScore = score;
        candidate = id;
      }
    });

    return candidate;
  }

  /* ─────────────────────────────────────────────────────────────
     ACTIVE BUDGET
  ───────────────────────────────────────────────────────────── */

  function enforceActiveBudget(excludeId = null) {

    const limit = currentLimits().maxActive;

    let guard = 0;

    while (
      countByStates(
        SessionState.ACTIVE,
        SessionState.LOADING,
        SessionState.IDLE
      ) > limit &&
      guard++ < 100
    ) {

      const victim =
        leastRecentlyActiveSession(excludeId);

      if (!victim) break;

      suspendSession(victim);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     SUSPENDED BUDGET
  ───────────────────────────────────────────────────────────── */

  function enforceSuspendedBudget() {

    const limit = currentLimits().maxSuspended;

    let guard = 0;

    while (
      countByStates(SessionState.SUSPENDED) > limit &&
      guard++ < 100
    ) {

      const victim = findEvictionCandidate();

      if (!victim) break;

      evictSession(victim);
    }

    /*
      Limpa referências antigas da fila.
    */
    for (let i = suspendedQueue.length - 1; i >= 0; i--) {

      const id = suspendedQueue[i];

      const state = sessionMeta.get(id)?.state;

      if (state !== SessionState.SUSPENDED) {
        suspendedQueue.splice(i, 1);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     TOTAL SESSION BUDGET
  ───────────────────────────────────────────────────────────── */

  function enforceSessionBudget() {

    const limit = currentLimits().maxSessions;

    let guard = 0;

    while (countSessions() > limit && guard++ < 100) {

      const victim = findEvictionCandidate();

      if (!victim) break;

      evictSession(victim);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     TIER
  ───────────────────────────────────────────────────────────── */

  function setTier(tier) {

    if (!TIER_LIMITS[tier]) return;

    currentTier = tier;

    enforceActiveBudget();
    enforceSuspendedBudget();
    enforceSessionBudget();

    window.dispatchEvent(
      new CustomEvent('session:tier-change', {
        detail: {
          tier,
          limits: currentLimits()
        }
      })
    );
  }

  /* ─────────────────────────────────────────────────────────────
     AUTOMATIC LIFECYCLE LOOP
  ───────────────────────────────────────────────────────────── */

  setInterval(() => {

    const now = Date.now();

    sessionMeta.forEach((meta, id) => {

      const win = getWin(id);

      if (!win) return;

      /*
        Nunca deixa uma janela maximizada
        virar idle/suspended.
      */
      if (isMaximized(win)) {

        if (meta.state !== SessionState.ACTIVE) {
          setSessionState(id, SessionState.ACTIVE);
        }

        touchSession(id);

        return;
      }

      /*
        ACTIVE → IDLE
      */
      if (
        meta.state === SessionState.ACTIVE &&
        now - (meta.lastActive || 0) >
          IDLE_AFTER_MS
      ) {

        setSessionState(
          id,
          SessionState.IDLE
        );

        return;
      }

      /*
        IDLE → SUSPENDED
      */
      if (
        meta.state === SessionState.IDLE &&
        now - (meta.lastActive || 0) >
          SUSPEND_AFTER_IDLE_MS
      ) {

        if (LifecyclePolicy.canSuspend(id)) {
          suspendSession(id);
        }
      }

    });

    enforceActiveBudget();
    enforceSuspendedBudget();

  }, 10_000);

  /* ─────────────────────────────────────────────────────────────
     SNAPSHOT
  ───────────────────────────────────────────────────────────── */

  function createRuntimeSnapshot(win) {

    if (!win) return null;

    const frame = win.querySelector('.win-frame');

    if (!frame) {
      return runtimeStore.get(win.id) || null;
    }

    const activeTab = getActiveTab(win);

    let snapshotHTML = null;

    /*
      DOM snapshot é apenas fallback.
      O estado real da aplicação deve,
      idealmente, ser fornecido pelo próprio app.
    */
    try {

      const doc = frame.contentDocument;

      if (doc?.documentElement) {
        snapshotHTML =
          doc.documentElement.outerHTML;
      }

    } catch (_) {}

    let scrollX = 0;
    let scrollY = 0;

    try {

      const doc = frame.contentDocument;

      if (doc?.defaultView) {
        scrollX = doc.defaultView.scrollX || 0;
        scrollY = doc.defaultView.scrollY || 0;
      }

    } catch (_) {}

    const snapshot = {

      url:
        activeTab?.url ||
        frame.src ||
        'about:blank',

      title:
        activeTab?.title ||
        win.querySelector('.win-title')?.textContent ||
        'Nova Aba',

      html: snapshotHTML,

      scrollX,
      scrollY,

      timestamp: Date.now(),

      tabId:
        activeTab?.id || null

    };

    return snapshot;
  }

  /* ─────────────────────────────────────────────────────────────
     APP SNAPSHOT VIA POSTMESSAGE
  ───────────────────────────────────────────────────────────── */

  function requestAppSnapshot(win) {

    const frame = win?.querySelector('.win-frame');

    if (!frame?.contentWindow) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {

      let done = false;

      const finish = data => {

        if (done) return;

        done = true;

        window.removeEventListener(
          'message',
          listener
        );

        resolve(data || null);
      };

      const listener = e => {

        if (e.source !== frame.contentWindow) {
          return;
        }

        if (
          e.data?.type ===
          'DUAL_SESSION_STATE'
        ) {

          finish(e.data.state);
        }
      };

      window.addEventListener(
        'message',
        listener
      );

      try {

        frame.contentWindow.postMessage(
          {
            type: 'DUAL_SESSION_SAVE'
          },
          '*'
        );

      } catch (_) {
        finish(null);
        return;
      }

      /*
        Apps que não implementam
        o protocolo não ficam esperando.
      */
      setTimeout(() => finish(null), 350);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     SUSPEND
  ───────────────────────────────────────────────────────────── */

  async function suspendSession(id) {

    const win = getWin(id);

    if (!win) return false;

    if (!LifecyclePolicy.canSuspend(id)) {
      return false;
    }

    const meta = ensureSessionMeta(id);

    /*
      Não suspende duas vezes.
    */
    if (meta.state === SessionState.SUSPENDED) {
      return true;
    }

    const frame =
      win.querySelector('.win-frame');

    /*
      Tenta primeiro obter estado
      semântico da aplicação.
    */
    let appState = null;

    try {
      appState =
        await requestAppSnapshot(win);
    } catch (_) {
      appState = null;
    }

    /*
      Snapshot estrutural de fallback.
    */
    const snapshot =
      createRuntimeSnapshot(win);

    if (!snapshot && !appState) {
      return false;
    }

    runtimeStore.set(id, {
      snapshot,
      appState,
      url:
        snapshot?.url ||
        frame?.src ||
        'https://www.infodose.com.br/splash',

      savedAt: Date.now()
    });

    /*
      Agora sim soltamos o runtime.
    */
    if (frame) {
      frame.remove();
    }

    win.classList.add('suspended');

    setSessionState(
      id,
      SessionState.SUSPENDED
    );

    /*
      Fila de suspensão.
    */
    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(index, 1);
    }

    suspendedQueue.push(id);

    enforceSuspendedBudget();

    syncShell();

    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     RESTORE
  ───────────────────────────────────────────────────────────── */

  function restoreSession(id) {

    const win = getWin(id);

    if (!win) return false;

    const meta = sessionMeta.get(id);

    if (!meta) return false;

    if (
      meta.state !== SessionState.SUSPENDED &&
      meta.state !== SessionState.EVICTED
    ) {
      return true;
    }

    /*
      Respeita limite ativo.
    */
    enforceActiveBudget(id);

    const runtime =
      runtimeStore.get(id);

    const data =
      tabDataMap.get(win);

    const activeTab =
      getActiveTab(win);

    setSessionState(
      id,
      SessionState.LOADING
    );

    const frame =
      document.createElement('iframe');

    frame.className = 'win-frame';

    frame.dataset.runtime = 'nav';

    frame.setAttribute(
      'allow',
      'autoplay; fullscreen; clipboard-read; clipboard-write'
    );

    /*
      Primeiro tentamos restaurar
      a URL real da aba.
    */
    const url =
      runtime?.url ||
      activeTab?.url ||
      'https://www.infodose.com.br/splash';

    /*
      Snapshot HTML só é usado quando
      temos certeza que ele pertence
      ao runtime atual.
    */
    if (runtime?.snapshot?.html) {

      try {

        frame.srcdoc =
          runtime.snapshot.html;

      } catch (_) {

        frame.src = url;
      }

    } else {

      frame.src = url;
    }

    frame.addEventListener(
      'load',
      () => {

        /*
          Restaura scroll quando possível.
        */
        try {

          const snapshot =
            runtime?.snapshot;

          if (
            snapshot &&
            frame.contentWindow
          ) {

            frame.contentWindow.scrollTo(
              snapshot.scrollX || 0,
              snapshot.scrollY || 0
            );

          }

        } catch (_) {}

        /*
          Reinjeta estado semântico
          fornecido pelo app.
        */
        if (
          runtime?.appState &&
          frame.contentWindow
        ) {

          try {

            frame.contentWindow.postMessage(
              {
                type:
                  'DUAL_SESSION_RESTORE',

                state:
                  runtime.appState
              },
              '*'
            );

          } catch (_) {}
        }

        const meta =
          sessionMeta.get(id);

        if (meta) {
          meta.lastRestoredAt =
            Date.now();

          meta.restoreCount++;
        }

        setSessionState(
          id,
          SessionState.ACTIVE
        );

        win.classList.remove(
          'suspended'
        );

        win.dataset.suspended =
          'false';

        syncGlobalHeader();

      },
      { once: true }
    );

    win.appendChild(frame);

    runtimeStore.delete(id);

    const queueIndex =
      suspendedQueue.indexOf(id);

    if (queueIndex !== -1) {
      suspendedQueue.splice(
        queueIndex,
        1
      );
    }

    win.classList.remove(
      'suspended'
    );

    win.dataset.suspended =
      'false';

    /*
      Reativa wiring do iframe.
    */
    wireFrame(win, frame);

    syncShell();

    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     EVICT
  ───────────────────────────────────────────────────────────── */

  function evictSession(id) {

    const win = getWin(id);

    const meta =
      sessionMeta.get(id);

    if (!meta) return false;

    if (!LifecyclePolicy.canEvict(id)) {
      return false;
    }

    /*
      Runtime já deveria estar solto.
    */
    const frame =
      win?.querySelector('.win-frame');

    frame?.remove();

    /*
      Mantém a janela e as abas.
      Só marca o runtime como evicted.
    */
    setSessionState(
      id,
      SessionState.EVICTED
    );

    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(
        index,
        1
      );
    }

    /*
      Não destruímos automaticamente
      a metadata das abas.
    */

    window.dispatchEvent(
      new CustomEvent(
        'session:evicted',
        {
          detail: { id }
        }
      )
    );

    syncShell();

    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     DESTROY / CLOSE
  ───────────────────────────────────────────────────────────── */

  function destroySession(id) {

    const win = getWin(id);

    setSessionState(
      id,
      SessionState.CLOSED
    );

    document
      .getElementById('dock-' + id)
      ?.remove();

    win?.remove();

    runtimeStore.delete(id);

    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(
        index,
        1
      );
    }

    /*
      WeakMap não precisa de delete manual,
      mas mantemos compatibilidade se
      a implementação mudar futuramente.
    */

    timers.delete(id);

    if (activeWindow === win) {
      setActiveWindow(null);
    }

    syncShell();
  }

  /* ─────────────────────────────────────────────────────────────
     Z-STACK
  ───────────────────────────────────────────────────────────── */

  function bringToFront(win) {

    if (!win) return;

    const index =
      zStack.indexOf(win);

    if (index !== -1) {
      zStack.splice(index, 1);
    }

    zStack.push(win);

    zStack.forEach((item, i) => {

      if (
        !item.classList.contains(
          'maximized'
        )
      ) {

        item.style.zIndex =
          String(1000 + i * 10);
      }

    });

    setActiveWindow(win);

    touchSession(win.id);
  }

  function setActiveWindow(win) {

    if (activeWindow === win) {
      syncGlobalHeader();
      return;
    }

    activeWindow = win;

    if (win) {
      touchSession(win.id);
    }

    syncGlobalHeader();
  }

  /* ─────────────────────────────────────────────────────────────
     GLOBAL HEADER
  ───────────────────────────────────────────────────────────── */

  function syncGlobalHeader() {

    const urlInput =
      document.getElementById(
        'urlInputNav'
      );

    if (!urlInput) return;

    if (!activeWindow) {
      urlInput.value = '';
      return;
    }

    const data =
      tabDataMap.get(activeWindow);

    if (!data) {
      urlInput.value = '';
      return;
    }

    const activeTab =
      data.tabs.find(
        t => t.id === data.activeId
      );

    urlInput.value =
      activeTab?.url || '';
  }

  /* ─────────────────────────────────────────────────────────────
     TABS
  ───────────────────────────────────────────────────────────── */

  function getTabData(win) {

    if (!tabDataMap.has(win)) {

      const initialUrl =
        win.querySelector(
          '.win-frame'
        )?.src ||
        'https://www.infodose.com.br/splash';

      const tabs = [
        {
          id:
            'tab-' +
            Date.now(),

          url: initialUrl,

          title: 'Nova Aba',

          fav: false,

          favicon: '◉'
        }
      ];

      tabDataMap.set(win, {
        tabs,
        activeId: tabs[0].id
      });
    }

    return tabDataMap.get(win);
  }

  function saveTabs(win) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    try {

      localStorage.setItem(
        'dual_tabs_' + win.id,
        JSON.stringify(data)
      );

    } catch (_) {}
  }

  function loadTabs(win) {

    try {

      const raw =
        localStorage.getItem(
          'dual_tabs_' + win.id
        );

      if (!raw) return false;

      const data =
        JSON.parse(raw);

      if (
        data &&
        Array.isArray(data.tabs) &&
        data.tabs.length
      ) {

        tabDataMap.set(
          win,
          data
        );

        return true;
      }

    } catch (_) {}

    return false;
  }

  function getActiveTab(win) {

    const data =
      tabDataMap.get(win);

    if (!data) return null;

    return (
      data.tabs.find(
        t => t.id === data.activeId
      ) ||
      data.tabs[0] ||
      null
    );
  }

  function setActiveTab(
    win,
    tabId
  ) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const exists =
      data.tabs.some(
        t => t.id === tabId
      );

    if (!exists) return;

    /*
      Se a sessão está suspensa,
      restaura antes de ativar.
    */
    const state =
      getSessionState(win.id);

    if (
      state === SessionState.SUSPENDED ||
      state === SessionState.EVICTED
    ) {
      restoreSession(win.id);
    }

    data.activeId = tabId;

    saveTabs(win);

    renderTabCounter(win);

    syncGlobalHeader();

    const frame =
      win.querySelector(
        '.win-frame'
      );

    const tab =
      getActiveTab(win);

    if (frame && tab) {
      frame.src =
        tab.url ||
        'about:blank';
    }

    bringToFront(win);
  }

  function addTab(
    win,
    url = ''
  ) {

    if (!win) return;

    const data =
      getTabData(win);

    const newTab = {

      id:
        'tab-' +
        Date.now() +
        '-' +
        Math.random()
          .toString(36)
          .slice(2, 7),

      url:
        url ||
        'https://www.infodose.com.br/splash',

      title:
        url
          ? url
              .replace(
                /^https?:\/\//,
                ''
              )
              .split('/')[0]
          : 'Nova Aba',

      fav: false,

      favicon: '◉'
    };

    data.tabs.push(newTab);

    data.activeId =
      newTab.id;

    saveTabs(win);

    renderTabCounter(win);

    const state =
      getSessionState(win.id);

    if (
      state === SessionState.SUSPENDED ||
      state === SessionState.EVICTED
    ) {
      restoreSession(win.id);
    }

    const frame =
      win.querySelector(
        '.win-frame'
      );

    if (frame) {
      frame.src =
        newTab.url;
    }

    syncGlobalHeader();

    closeTabSwitcher();

    bringToFront(win);
  }

  function removeTab(
    win,
    tabId
  ) {

    const data =
      tabDataMap.get(win);

    if (
      !data ||
      data.tabs.length <= 1
    ) {
      return;
    }

    const index =
      data.tabs.findIndex(
        t => t.id === tabId
      );

    if (index === -1) return;

    data.tabs.splice(
      index,
      1
    );

    if (
      data.activeId === tabId
    ) {

      data.activeId =
        data.tabs[
          Math.min(
            index,
            data.tabs.length - 1
          )
        ].id;
    }

    saveTabs(win);

    renderTabCounter(win);

    const frame =
      win.querySelector(
        '.win-frame'
      );

    const active =
      getActiveTab(win);

    if (frame && active) {
      frame.src =
        active.url;
    }

    syncGlobalHeader();

    if (
      document
        .getElementById(
          'tabSwitcherOverlay'
        )
        ?.classList.contains('open')
    ) {
      renderTabSwitcher(win);
    }
  }

  function updateTabUrl(
    win,
    tabId,
    newUrl
  ) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const tab =
      data.tabs.find(
        t => t.id === tabId
      );

    if (!tab) return;

    tab.url = newUrl;

    tab.title =
      newUrl
        .replace(
          /^https?:\/\//,
          ''
        )
        .split('/')[0] ||
      'Nova Aba';

    saveTabs(win);

    syncGlobalHeader();

    if (
      data.activeId === tabId
    ) {

      const frame =
        win.querySelector(
          '.win-frame'
        );

      if (frame) {
        frame.src =
          newUrl;
      }
    }

    if (
      document
        .getElementById(
          'tabSwitcherOverlay'
        )
        ?.classList.contains('open')
    ) {

      renderTabSwitcher(win);
    }
  }

  function toggleFav(
    win,
    tabId
  ) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const tab =
      data.tabs.find(
        t => t.id === tabId
      );

    if (!tab) return;

    tab.fav = !tab.fav;

    saveTabs(win);

    if (
      document
        .getElementById(
          'tabSwitcherOverlay'
        )
        ?.classList.contains('open')
    ) {

      renderTabSwitcher(win);
    }
  }

  function renderTabCounter(win) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const btn =
      win.querySelector(
        '.tab-counter'
      );

    if (btn) {
      btn.textContent =
        data.tabs.length;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     TAB SWITCHER
  ───────────────────────────────────────────────────────────── */

  function openTabSwitcher(win) {

    currentSwitcherWin = win;

    const overlay =
      document.getElementById(
        'tabSwitcherOverlay'
      );

    const title =
      document.getElementById(
        'tabSwitcherTitle'
      );

    if (!overlay) return;

    if (title) {

      title.textContent =
        'Abas — ' +
        (
          win.querySelector(
            '.win-title'
          )?.textContent ||
          'janela'
        );
    }

    renderTabSwitcher(win);

    overlay.classList.add(
      'open'
    );

    overlay.onclick =
      function (e) {

        if (e.target === overlay) {
          closeTabSwitcher();
        }

      };
  }

  function closeTabSwitcher() {

    document
      .getElementById(
        'tabSwitcherOverlay'
      )
      ?.classList.remove(
        'open'
      );

    currentSwitcherWin = null;
  }

  function renderTabSwitcher(win) {

    const grid =
      document.getElementById(
        'tabGrid'
      );

    if (!grid) return;

    const data =
      tabDataMap.get(win);

    if (!data) {

      grid.innerHTML = `
        <div class="tab-empty">
          <div class="tab-empty-icon">◌</div>
          <div class="tab-empty-title">
            Nenhuma aba
          </div>
          <div class="tab-empty-text">
            Abra uma nova aba para começar.
          </div>
        </div>
      `;

      return;
    }

    grid.innerHTML = '';

    data.tabs.forEach(tab => {

      const card =
        document.createElement(
          'div'
        );

      card.className =
        'tab-card' +
        (
          tab.id === data.activeId
            ? ' active'
            : ''
        );

      card.dataset.tabId =
        tab.id;

      card.innerHTML = `

        <div class="tab-card-inner">

          <div class="tab-card-main">

            <div class="tab-card-head">

              <div class="tab-favicon">
                ${tab.favicon || '◉'}
              </div>

              <div class="tab-card-info">

                <div class="tab-title">
                  ${escapeHTML(
                    tab.title ||
                    'Nova Aba'
                  )}
                </div>

                <div class="tab-url">
                  ${escapeHTML(
                    tab.url || ''
                  )}
                </div>

              </div>

            </div>

            <div class="tab-status">
              ${
                tab.id === data.activeId
                  ? '<span class="tab-active-dot"></span> Ativa'
                  : ''
              }
            </div>

          </div>

          <div class="tab-card-actions">

            <button
              type="button"
              class="tab-action tab-fav ${
                tab.fav ? 'active' : ''
              }"
              data-tabid="${tab.id}"
              title="${
                tab.fav
                  ? 'Remover favorito'
                  : 'Favoritar aba'
              }"
              aria-label="${
                tab.fav
                  ? 'Remover favorito'
                  : 'Favoritar aba'
              }"
            >
              ${tab.fav ? '★' : '☆'}
            </button>

            <button
              type="button"
              class="tab-action tab-close"
              data-tabid="${tab.id}"
              title="Fechar aba"
              aria-label="Fechar aba"
            >
              ×
            </button>

          </div>

        </div>
      `;

      card.addEventListener(
        'click',
        function (e) {

          if (
            e.target.closest(
              '.tab-close'
            ) ||
            e.target.closest(
              '.tab-fav'
            )
          ) {
            return;
          }

          setActiveTab(
            win,
            tab.id
          );

          closeTabSwitcher();
        }
      );

      card
        .querySelector(
          '.tab-close'
        )
        ?.addEventListener(
          'click',
          function (e) {

            e.preventDefault();
            e.stopPropagation();

            removeTab(
              win,
              tab.id
            );
          }
        );

      card
        .querySelector(
          '.tab-fav'
        )
        ?.addEventListener(
          'click',
          function (e) {

            e.preventDefault();
            e.stopPropagation();

            toggleFav(
              win,
              tab.id
            );
          }
        );

      grid.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     ESCAPE HTML
  ───────────────────────────────────────────────────────────── */

  function escapeHTML(value) {

    return String(value)
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#039;'
      );
  }

  /* ─────────────────────────────────────────────────────────────
     WINDOW MODES
  ───────────────────────────────────────────────────────────── */

  function syncShell() {

    const maximized =
      !!document.querySelector(
        '.session-window.maximized:not(.minimized)'
      );

    document.body.classList.toggle(
      'has-maximized',
      maximized
    );

    document.body.classList.toggle(
      'ui-immersive',
      maximized
    );
  }

  function toggleCollapse(id) {

    const win =
      getWin(id);

    if (!win) return;

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.zIndex = '';

      syncShell();
    }

    win.classList.toggle(
      'collapsed'
    );

    win.classList.remove(
      'peeked'
    );

    /*
      Importante:
      collapse NÃO destrói runtime.

      Se estava suspensa,
      o toque restaura.
    */
    if (
      win.classList.contains(
        'collapsed'
      )
    ) {

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(id);
      }
    }

    bringToFront(win);

    syncShell();
  }

  function togglePeek(id) {

    const win =
      getWin(id);

    if (!win) return;

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.zIndex = '';

      syncShell();
    }

    win.classList.toggle(
      'peeked'
    );

    if (
      win.classList.contains(
        'peeked'
      )
    ) {

      win.classList.remove(
        'collapsed'
      );

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(id);
      }
    }

    bringToFront(win);

    syncShell();
  }

  function maximizeWindow(id) {

    const win =
      getWin(id);

    if (!win) return;

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.zIndex = '';

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(id);
      }

      bringToFront(win);

      syncShell();

      return;
    }

    /*
      Maximizar automaticamente restaura.
    */
    if (
      win.dataset.suspended ===
      'true'
    ) {
      restoreSession(id);
    }

    win.classList.remove(
      'collapsed',
      'peeked',
      'minimized',
      'header-hidden',
      'resizing'
    );

    [
      'top',
      'left',
      'right',
      'bottom',
      'width',
      'height',
      'maxWidth',
      'maxHeight'
    ].forEach(
      p => win.style[p] = ''
    );

    win.classList.add(
      'maximized'
    );

    win.style.zIndex =
      '94000';

    bringToFront(win);

    syncShell();
  }

  /* ─────────────────────────────────────────────────────────────
     MINIMIZE
     
     Minimize é visual.
     O lifecycle pode suspender separadamente.
  ───────────────────────────────────────────────────────────── */

  function minimizeWindow(id) {

    const win =
      getWin(id);

    if (!win) return;

    timers.delete(id);

    win.classList.remove(
      'maximized',
      'collapsed',
      'peeked',
      'header-hidden',
      'resizing'
    );

    /*
      Primeiro libera a janela.
    */
    syncShell();

    /*
      Aqui permitimos suspensão,
      mas ela é lifecycle, não minimize.
    */
    if (
      LifecyclePolicy.canSuspend(id)
    ) {
      suspendSession(id);
    }

    win.classList.add(
      'minimized'
    );

    document
      .getElementById(
        'dock-' + id
      )
      ?.remove();

    const bubble =
      document.createElement(
        'button'
      );

    bubble.type =
      'button';

    bubble.className =
      'dock-bubble';

    bubble.id =
      'dock-' + id;

    bubble.title =
      'Restaurar janela';

    bubble.setAttribute(
      'aria-label',
      'Restaurar janela'
    );

    bubble.textContent =
      '۞';

    bubble.addEventListener(
      'click',
      function (e) {

        e.preventDefault();
        e.stopPropagation();

        win.classList.remove(
          'minimized'
        );

        if (
          win.dataset.suspended ===
          'true'
        ) {
          restoreSession(id);
        }

        bringToFront(win);

        requestAnimationFrame(
          () => {

            bringToFront(win);

            syncShell();

          }
        );

        bubble.remove();
      }
    );

    dock?.appendChild(
      bubble
    );

    syncShell();
  }

  function closeWindow(id) {

    destroySession(id);
  }

  /* ─────────────────────────────────────────────────────────────
     HEADER
  ───────────────────────────────────────────────────────────── */

  function handleHeaderClick(
    e,
    id
  ) {

    if (
      e.target.closest(
        '.win-controls'
      ) ||
      e.target.closest(
        'button'
      ) ||
      e.target.closest(
        'input'
      ) ||
      e.target.closest(
        '.win-navrow'
      )
    ) {
      return;
    }

    const win =
      getWin(id);

    if (!win) return;

    /*
      Se a sessão estiver suspensa,
      qualquer interação com o header
      restaura.
    */
    if (
      win.dataset.suspended ===
      'true'
    ) {

      restoreSession(id);

      bringToFront(win);

      return;
    }

    bringToFront(win);

    const old =
      timers.get(id);

    if (old) {

      clearTimeout(old);

      timers.delete(id);

      maximizeWindow(id);

      return;
    }

    const timer =
      setTimeout(
        () => {

          timers.delete(id);

          togglePeek(id);

        },
        250
      );

    timers.set(
      id,
      timer
    );
  }

  /* ─────────────────────────────────────────────────────────────
     RESIZE
  ───────────────────────────────────────────────────────────── */

  function makeResizeHandles(win) {

    if (
      win.dataset.resizeReady ===
      '1'
    ) {
      return;
    }

    win.dataset.resizeReady =
      '1';

    const hy =
      document.createElement(
        'div'
      );

    hy.className =
      'resize-handle resize-y';

    const hx =
      document.createElement(
        'div'
      );

    hx.className =
      'resize-handle resize-x';

    const hc =
      document.createElement(
        'div'
      );

    hc.className =
      'resize-handle resize-corner';

    win.append(
      hy,
      hx,
      hc
    );

    bindResizeY(
      win,
      hy
    );

    bindResizeX(
      win,
      hx
    );

    bindResizeCorner(
      win,
      hc
    );
  }

  function freeFromMaximize(
    win,
    rect
  ) {

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.position =
        'fixed';

      win.style.left =
        Math.max(
          0,
          rect.left
        ) + 'px';

      win.style.top =
        Math.max(
          0,
          rect.top
        ) + 'px';

      win.style.right =
        'auto';

      win.style.bottom =
        'auto';

      win.style.width =
        Math.min(
          rect.width,
          window.innerWidth
        ) + 'px';

      win.style.height =
        Math.min(
          rect.height,
          window.innerHeight
        ) + 'px';

      win.style.maxWidth =
        'none';

      win.style.maxHeight =
        'none';

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(
          win.id
        );
      }
    }

    win.classList.remove(
      'collapsed',
      'peeked'
    );

    win.classList.add(
      'resizing'
    );

    syncShell();
  }

  function finishResize(win) {

    win.classList.remove(
      'resizing'
    );

    syncShell();
  }

  function bindResizeY(
    win,
    handle
  ) {

    let active = false;
    let pointerId = null;
    let startY = 0;
    let startH = 0;

    handle.addEventListener(
      'pointerdown',
      function (e) {

        if (
          e.button != null &&
          e.button !== 0
        ) {
          return;
        }

        const rect =
          win.getBoundingClientRect();

        active = true;

        pointerId =
          e.pointerId;

        startY =
          e.clientY;

        startH =
          rect.height;

        freeFromMaximize(
          win,
          rect
        );

        handle.setPointerCapture
          ?.(
            pointerId
          );

        e.preventDefault();

        const move =
          ev => {

            if (
              !active ||
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            ev.preventDefault();

            const next =
              Math.max(
                44,
                Math.min(
                  window.innerHeight,
                  startH +
                    (
                      ev.clientY -
                      startY
                    )
                )
              );

            win.style.height =
              next + 'px';
          };

        const up =
          ev => {

            if (
              ev &&
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            active = false;

            window.removeEventListener(
              'pointermove',
              move
            );

            window.removeEventListener(
              'pointerup',
              up
            );

            window.removeEventListener(
              'pointercancel',
              up
            );

            finishResize(win);
          };

        window.addEventListener(
          'pointermove',
          move,
          {
            passive: false
          }
        );

        window.addEventListener(
          'pointerup',
          up
        );

        window.addEventListener(
          'pointercancel',
          up
        );

      },
      {
        passive: false
      }
    );
  }

  function bindResizeX(
    win,
    handle
  ) {

    let active = false;
    let pointerId = null;
    let startX = 0;
    let startW = 0;

    handle.addEventListener(
      'pointerdown',
      function (e) {

        if (
          e.button != null &&
          e.button !== 0
        ) {
          return;
        }

        const rect =
          win.getBoundingClientRect();

        active = true;

        pointerId =
          e.pointerId;

        startX =
          e.clientX;

        startW =
          rect.width;

        freeFromMaximize(
          win,
          rect
        );

        handle.setPointerCapture
          ?.(
            pointerId
          );

        e.preventDefault();

        const move =
          ev => {

            if (
              !active ||
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            ev.preventDefault();

            const next =
              Math.max(
                44,
                Math.min(
                  window.innerWidth,
                  startW +
                    (
                      ev.clientX -
                      startX
                    )
                )
              );

            win.style.width =
              next + 'px';
          };

        const up =
          ev => {

            if (
              ev &&
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            active = false;

            window.removeEventListener(
              'pointermove',
              move
            );

            window.removeEventListener(
              'pointerup',
              up
            );

            window.removeEventListener(
              'pointercancel',
              up
            );

            finishResize(win);
          };

        window.addEventListener(
          'pointermove',
          move,
          {
            passive: false
          }
        );

        window.addEventListener(
          'pointerup',
          up
        );

        window.addEventListener(
          'pointercancel',
          up
        );

      },
      {
        passive: false
      }
    );
  }

  function bindResizeCorner(
    win,
    handle
  ) {

    let active = false;
    let pointerId = null;

    let startX = 0;
    let startY = 0;

    let startW = 0;
    let startH = 0;

    handle.addEventListener(
      'pointerdown',
      function (e) {

        if (
          e.button != null &&
          e.button !== 0
        ) {
          return;
        }

        const rect =
          win.getBoundingClientRect();

        active = true;

        pointerId =
          e.pointerId;

        startX =
          e.clientX;

        startY =
          e.clientY;

        startW =
          rect.width;

        startH =
          rect.height;

        freeFromMaximize(
          win,
          rect
        );

        handle.setPointerCapture
          ?.(
            pointerId
          );

        e.preventDefault();

        const move =
          ev => {

            if (
              !active ||
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            ev.preventDefault();

            const width =
              Math.max(
                44,
                Math.min(
                  window.innerWidth,
                  startW +
                    (
                      ev.clientX -
                      startX
                    )
                )
              );

            const height =
              Math.max(
                44,
                Math.min(
                  window.innerHeight,
                  startH +
                    (
                      ev.clientY -
                      startY
                    )
                )
              );

            win.style.width =
              width + 'px';

            win.style.height =
              height + 'px';
          };

        const up =
          ev => {

            if (
              ev &&
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            active = false;

            window.removeEventListener(
              'pointermove',
              move
            );

            window.removeEventListener(
              'pointerup',
              up
            );

            window.removeEventListener(
              'pointercancel',
              up
            );

            finishResize(win);
          };

        window.addEventListener(
          'pointermove',
          move,
          {
            passive: false
          }
        );

        window.addEventListener(
          'pointerup',
          up
        );

        window.addEventListener(
          'pointercancel',
          up
        );

      },
      {
        passive: false
      }
    );
  }

  /* ─────────────────────────────────────────────────────────────
     STATE BADGE
  ───────────────────────────────────────────────────────────── */

  function updateStateBadge(win) {

    if (!win) return;

    const badge =
      win.querySelector(
        '.state-badge'
      );

    if (!badge) return;

    const state =
      win.dataset.state ||
      SessionState.CREATED;

    const colors = {

      active:
        '#39ffb6',

      loading:
        '#00e5ff',

      idle:
        '#ffd700',

      suspended:
        '#ff6b6b',

      evicted:
        '#b36bff',

      created:
        '#aaa',

      closed:
        '#555'
    };

    const labels = {

      active:
        'ATIVO',

      loading:
        'CARREGANDO',

      idle:
        'OCIOSO',

      suspended:
        'SUSPENSO',

      evicted:
        'LIBERADO',

      created:
        'CRIADO',

      closed:
        'FECHADO'
    };

    const color =
      colors[state] ||
      '#aaa';

    badge.textContent =
      '●';

    badge.title =
      labels[state] ||
      state;

    badge.style.color =
      color;

    badge.style.background =
      color + '33';
  }

  /* ─────────────────────────────────────────────────────────────
     FRAME WIRING
  ───────────────────────────────────────────────────────────── */

  function wireFrame(
    win,
    frame
  ) {

    if (!frame) return;

    if (
      frame.dataset.ifsWired ===
      '1'
    ) {
      return;
    }

    frame.dataset.ifsWired =
      '1';

    frame.addEventListener(
      'load',
      function () {

        try {

          const doc =
            this.contentDocument;

          if (
            doc &&
            doc.title
          ) {

            const active =
              getActiveTab(win);

            if (active) {

              active.title =
                doc.title;

              saveTabs(win);
            }
          }

        } catch (_) {}

        try {

          if (this.src) {

            const active =
              getActiveTab(win);

            if (
              active &&
              active.url !==
                this.src
            ) {

              active.url =
                this.src;

              saveTabs(win);
            }

            const input =
              win.querySelector(
                '.win-urlbar'
              );

            if (input) {
              input.value =
                this.src;
            }

            syncGlobalHeader();
          }

        } catch (_) {}

        if (
          getSessionState(win.id) ===
          SessionState.LOADING
        ) {

          setSessionState(
            win.id,
            SessionState.ACTIVE
          );
        }

      }
    );

    frame.addEventListener(
      'pointerdown',
      function () {

        touchSession(
          win.id
        );

        if (
          !win.classList.contains(
            'maximized'
          )
        ) {
          bringToFront(win);
        }

      },
      {
        passive: true
      }
    );

    frame.addEventListener(
      'load',
      function () {

        /*
          Permite que o app informe
          mídia/trabalho não salvo.
        */
        try {

          this.contentWindow?.postMessage(
            {
              type:
                'DUAL_SESSION_CAPABILITIES'
            },
            '*'
          );

        } catch (_) {}
      }
    );
  }

  /* ─────────────────────────────────────────────────────────────
     WIRE SESSION
  ───────────────────────────────────────────────────────────── */

  function wireSession(win) {

    if (
      !win ||
      win.dataset.wired === '1'
    ) {
      return;
    }

    win.dataset.wired =
      '1';

    ensureSessionMeta(
      win.id
    );

    /*
      Qualquer toque acorda sessão.
    */
    win.addEventListener(
      'pointerdown',
      function () {

        if (
          win.dataset.suspended ===
          'true'
        ) {

          restoreSession(
            win.id
          );
        }

        touchSession(
          win.id
        );

      },
      {
        passive: true
      }
    );

    /*
      Tabs.
    */
    if (!loadTabs(win)) {

      const frame =
        win.querySelector(
          '.win-frame'
        );

      const src =
        frame?.src ||
        'https://www.infodose.com.br/splash';

      const tabs = [
        {
          id:
            'tab-' +
            Date.now(),

          url: src,

          title:
            src
              .replace(
                /^https?:\/\//,
                ''
              )
              .split('/')[0] ||
            'Nova Aba',

          fav: false,

          favicon: '◉'
        }
      ];

      tabDataMap.set(
        win,
        {
          tabs,
          activeId:
            tabs[0].id
        }
      );

      saveTabs(win);
    }

    renderTabCounter(win);

    makeResizeHandles(win);

    /*
      Header.
    */
    const header =
      $('.win-hdr', win);

    header?.addEventListener(
      'click',
      e =>
        handleHeaderClick(
          e,
          win.id
        )
    );

    /*
      Controls.
    */
    const controls =
      $('.win-controls', win);

    controls?.addEventListener(
      'click',
      function (e) {

        e.preventDefault();
        e.stopPropagation();

        const btn =
          e.target.closest(
            'button'
          );

        if (!btn) return;

        const action =
          btn.dataset.action;

        if (
          action ===
          'collapse'
        ) {
          toggleCollapse(
            win.id
          );
        }

        else if (
          action ===
          'maximize'
        ) {
          maximizeWindow(
            win.id
          );
        }

        else if (
          action ===
          'minimize'
        ) {
          minimizeWindow(
            win.id
          );
        }

        else if (
          action ===
          'close'
        ) {
          closeWindow(
            win.id
          );
        }

        else if (
          action ===
          'tab-switcher'
        ) {
          openTabSwitcher(
            win
          );
        }

      }
    );

    /*
      URL local.
    */
    const input =
      $('.win-urlbar', win);

    const go =
      $('.win-go-btn', win);

    const navigate =
      function () {

        if (!input) return;

        let url =
          input.value.trim();

        if (!url) return;

        if (
          !/^https?:\/\//i.test(
            url
          )
        ) {
          url =
            'https://' +
            url;
        }

        /*
          Se estava suspensa,
          primeiro restaura.
        */
        if (
          win.dataset.suspended ===
          'true'
        ) {
          restoreSession(
            win.id
          );
        }

        const active =
          getActiveTab(win);

        if (active) {

          updateTabUrl(
            win,
            active.id,
            url
          );
        }

        input.value =
          url;

        touchSession(
          win.id
        );
      };

    go?.addEventListener(
      'click',
      function (e) {

        e.preventDefault();
        e.stopPropagation();

        navigate();

      }
    );

    input?.addEventListener(
      'keydown',
      function (e) {

        if (
          e.key === 'Enter'
        ) {

          e.stopPropagation();

          navigate();
        }
      }
    );

    /*
      Frame.
    */
    const frame =
      win.querySelector(
        '.win-frame'
      );

    if (frame) {
      wireFrame(
        win,
        frame
      );
    }

    /*
      Estado inicial.
    */
    const active =
      getActiveTab(win);

    if (
      frame &&
      active &&
      frame.src !==
        active.url
    ) {

      frame.src =
        active.url;
    }

    if (
      frame &&
      active
    ) {

      const localInput =
        win.querySelector(
          '.win-urlbar'
        );

      if (localInput) {
        localInput.value =
          active.url;
      }
    }

    if (!activeWindow) {
      setActiveWindow(
        win
      );
    }

    /*
      Badge.
    */
    const hdr =
      win.querySelector(
        '.win-hdr'
      );

    if (
      hdr &&
      !hdr.querySelector(
        '.state-badge'
      )
    ) {

      const badge =
        document.createElement(
          'span'
        );

      badge.className =
        'state-badge';

      badge.textContent =
        '●';

      hdr.appendChild(
        badge
      );
    }

    updateStateBadge(
      win
    );
  }

  /* ─────────────────────────────────────────────────────────────
     CREATE SESSION
  ───────────────────────────────────────────────────────────── */

  function createSessionWindow({
    title = '//',
    src =
      'https://www.infodose.com.br'
  } = {}) {

    /*
      Primeiro verifica limite total.
    */
    const limits =
      currentLimits();

    if (
      countSessions() >=
      limits.maxSessions
    ) {

      /*
        Tenta liberar espaço
        automaticamente.
      */
      enforceSessionBudget();

      if (
        countSessions() >=
        limits.maxSessions
      ) {

        console.warn(
          '[iFSw] Limite de sessões atingido.',
          limits
        );

        window.dispatchEvent(
          new CustomEvent(
            'session:limit-reached',
            {
              detail: {
                tier:
                  currentTier,

                limits
              }
            }
          )
        );

        return null;
      }
    }

    const id =
      'session-' +
      Date.now() +
      '-' +
      counter++;

    const win =
      document.createElement(
        'section'
      );

    win.className =
      'session-window peeked';

    win.id =
      id;

    win.dataset.state =
      SessionState.CREATED;

    win.dataset.suspended =
      'false';

    win.innerHTML = `

      <div class="win-hdr">

        <div class="win-controls">

          <button
            type="button"
            data-action="collapse"
            title="Colapsar"
            aria-label="Colapsar"
          >
            −
          </button>

          <button
            type="button"
            data-action="tab-switcher"
            class="tab-counter"
          >
            1
          </button>

          <button
            type="button"
            data-action="maximize"
            title="Maximizar"
            aria-label="Maximizar"
          >
            ⛶
          </button>

          <button
            type="button"
            data-action="minimize"
            title="Minimizar"
            aria-label="Minimizar"
          >
            ۞
          </button>

          <button
            type="button"
            data-action="close"
            title="Fechar"
            aria-label="Fechar"
          >
            ×
          </button>

        </div>

        <div
          class="win-navrow"
          style="
            flex:2;
            min-width:0;
            pointer-events:auto;
          "
        >

          <input
            class="win-urlbar"
            type="text"
            value="${escapeHTML(src)}"
            placeholder="Digite uma URL..."
            spellcheck="false"
            autocomplete="off"
          >

          <button
            class="win-go-btn"
            type="button"
          >
            Go
          </button>

        </div>

      </div>

      <iframe
        class="win-frame"
        data-runtime="nav"
        src="${escapeHTML(src)}"
        allow="autoplay; fullscreen; clipboard-read; clipboard-write"
      ></iframe>
    `;

    stackWrap?.appendChild(
      win
    );

    ensureSessionMeta(
      id
    );

    setSessionState(
      id,
      SessionState.CREATED
    );

    enforceActiveBudget(
      id
    );

    setSessionState(
      id,
      SessionState.LOADING
    );

    const frame =
      win.querySelector(
        '.win-frame'
      );

    frame?.addEventListener(
      'load',
      () => {

        setSessionState(
          id,
          SessionState.ACTIVE
        );

      },
      {
        once: true
      }
    );

    wireSession(
      win
    );

    wireFrame(
      win,
      frame
    );

    bringToFront(
      win
    );

    enforceActiveBudget(
      id
    );

    return id;
  }

  /* ─────────────────────────────────────────────────────────────
     THEME
  ───────────────────────────────────────────────────────────── */

  function applyTheme(
    theme
  ) {

    const next =
      theme === 'light'
        ? 'light'
        : 'dark';

    ROOT.dataset.theme =
      next;

    try {

      localStorage.setItem(
        THEME_KEY,
        next
      );

    } catch (_) {}

    $$('.theme-dot')
      .forEach(btn => {

        if (
          btn.textContent.includes(
            '☀'
          ) ||
          btn.textContent.includes(
            '🌙'
          )
        ) {

          btn.textContent =
            next === 'light'
              ? '☀️'
              : '🌙';
        }

      });

    window.dispatchEvent(
      new CustomEvent(
        'dual:theme-change',
        {
          detail: {
            theme: next
          }
        }
      )
    );
  }

  function getInitialTheme() {

    try {

      const saved =
        localStorage.getItem(
          THEME_KEY
        );

      if (
        saved === 'light' ||
        saved === 'dark'
      ) {
        return saved;
      }

    } catch (_) {}

    return 'dark';
  }

  window.DualTheme = {

    set:
      applyTheme,

    toggle() {

      applyTheme(
        ROOT.dataset.theme ===
          'light'
          ? 'dark'
          : 'light'
      );

    },

    get() {

      return (
        ROOT.dataset.theme ||
        'dark'
      );

    }

  };

  $$('.theme-dot')
    .forEach(btn => {

      btn.addEventListener(
        'click',
        e => {

          e.preventDefault();
          e.stopPropagation();

          DualTheme.toggle();

        }
      );

    });

  applyTheme(
    getInitialTheme()
  );

  /* ─────────────────────────────────────────────────────────────
     GLOBAL NAV
  ───────────────────────────────────────────────────────────── */

  const navInput =
    document.getElementById(
      'urlInputNav'
    );

  const goNavBtn =
    document.getElementById(
      'goNavBtn'
    );

  const favBtn =
    document.getElementById(
      'favBtn'
    );

  function applyGlobalUrl() {

    if (
      !navInput ||
      !activeWindow
    ) {
      return;
    }

    let url =
      navInput.value.trim();

    if (!url) return;

    if (
      !/^https?:\/\//i.test(
        url
      )
    ) {

      url =
        'https://' +
        url;
    }

    if (
      activeWindow.dataset.suspended ===
      'true'
    ) {

      restoreSession(
        activeWindow.id
      );
    }

    const active =
      getActiveTab(
        activeWindow
      );

    if (active) {

      updateTabUrl(
        activeWindow,
        active.id,
        url
      );
    }

    navInput.value =
      url;

    touchSession(
      activeWindow.id
    );
  }

  navInput?.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'Enter'
      ) {
        applyGlobalUrl();
      }

    }
  );

  goNavBtn?.addEventListener(
    'click',
    applyGlobalUrl
  );

  favBtn?.addEventListener(
    'click',
    function () {

      if (!activeWindow) return;

      const active =
        getActiveTab(
          activeWindow
        );

      if (active) {

        toggleFav(
          activeWindow,
          active.id
        );
      }

    }
  );

  /* ─────────────────────────────────────────────────────────────
     NEW TAB
  ───────────────────────────────────────────────────────────── */

  document
    .getElementById(
      'newTabBtn'
    )
    ?.addEventListener(
      'click',
      function () {

        if (
          currentSwitcherWin
        ) {

          addTab(
            currentSwitcherWin
          );
        }

      }
    );

  document
    .getElementById(
      'closeTabSwitcher'
    )
    ?.addEventListener(
      'click',
      closeTabSwitcher
    );

  document
    .getElementById(
      'openKobBtn'
    )
    ?.addEventListener(
      'click',
      () =>
        createSessionWindow()
    );

  /* ─────────────────────────────────────────────────────────────
     MAIN HEADER
  ───────────────────────────────────────────────────────────── */

  const HEADER =
    document.getElementById(
      'main-header'
    );

  const MAIN =
    document.getElementById(
      'main-content'
    );

  HEADER?.addEventListener(
    'click',
    e => {

      if (
        e.target.closest(
          'button'
        ) ||
        e.target.closest(
          'input'
        ) ||
        e.target.closest(
          '.win-navrow'
        ) ||
        e.target.closest(
          '.theme-dot'
        )
      ) {
        return;
      }

      MAIN?.classList.toggle(
        'hidden'
      );

      const collapsed =
        MAIN?.classList.contains(
          'hidden'
        );

      HEADER.classList.toggle(
        'is-collapsed',
        collapsed
      );

      window.dispatchEvent(
        new CustomEvent(
          'dual:content-collapse',
          {
            detail: {
              collapsed
            }
          }
        )
      );
    }
  );

  /* ─────────────────────────────────────────────────────────────
     HEADER AUTO-HIDE
  ───────────────────────────────────────────────────────────── */

  let lastScrollY =
    window.scrollY;

  let ticking = false;

  const SCROLL_THRESHOLD = 8;

  function updateHeader() {

    if (!HEADER) return;

    const current =
      window.scrollY;

    if (current <= 10) {

      HEADER.classList.remove(
        'header-hidden'
      );

      HEADER.classList.add(
        'header-visible'
      );

      lastScrollY =
        current;

      ticking = false;

      return;
    }

    if (
      current >
      lastScrollY +
        SCROLL_THRESHOLD
    ) {

      HEADER.classList.remove(
        'header-visible'
      );

      HEADER.classList.add(
        'header-hidden'
      );

    }

    else if (
      current <
      lastScrollY -
        SCROLL_THRESHOLD
    ) {

      HEADER.classList.remove(
        'header-hidden'
      );

      HEADER.classList.add(
        'header-visible'
      );
    }

    lastScrollY =
      current;

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {

      if (!ticking) {

        requestAnimationFrame(
          updateHeader
        );

        ticking = true;
      }

    },
    {
      passive: true
    }
  );

  /* ─────────────────────────────────────────────────────────────
     EXISTING WINDOWS
  ───────────────────────────────────────────────────────────── */

  $$('.session-window')
    .forEach(win => {

      ensureSessionMeta(
        win.id
      );

      wireSession(
        win
      );

      const frame =
        win.querySelector(
          '.win-frame'
        );

      /*
        Se já veio marcado como suspended,
        não força ACTIVE.
      */
      if (
        win.dataset.suspended ===
        'true'
      ) {

        setSessionState(
          win.id,
          SessionState.SUSPENDED
        );

      }

      else {

        setSessionState(
          win.id,
          frame
            ? SessionState.ACTIVE
            : SessionState.CREATED
        );

      }

      if (!activeWindow) {
        setActiveWindow(
          win
        );
      }

    });

  syncGlobalHeader();

  syncShell();

  /* ─────────────────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────────────────── */

  window.SessionLifecycle = {

    States:
      SessionState,

    Tiers:
      Tier,

    Policy:
      LifecyclePolicy,

    getState:
      getSessionState,

    listSessions() {

      return [
        ...sessionMeta.entries()
      ].map(
        ([id, meta]) => ({
          id,
          ...meta
        })
      );

    },

    getSession(id) {

      const meta =
        sessionMeta.get(id);

      if (!meta) return null;

      const win =
        getWin(id);

      return {

        ...meta,

        hasWindow:
          !!win,

        hasRuntime:
          !!win?.querySelector(
            '.win-frame'
          ),

        tabs:
          win
            ? (
                tabDataMap.get(
                  win
                )?.tabs || []
              )
            : []
      };
    },

    setTier,

    getTier:
      () => currentTier,

    touch:
      touchSession,

    suspend:
      id =>
        suspendSession(id),

    restore:
      id =>
        restoreSession(id),

    evict:
      id =>
        evictSession(id),

    close:
      id =>
        destroySession(id),

    limits:
      () =>
        currentLimits(),

    enforce() {

      enforceActiveBudget();
      enforceSuspendedBudget();
      enforceSessionBudget();

    },

    pin(
      id,
      value = true
    ) {

      const meta =
        sessionMeta.get(id);

      const win =
        getWin(id);

      if (!meta) return;

      meta.pinned =
        !!value;

      if (win) {

        win.dataset.pinned =
          value
            ? 'true'
            : 'false';

        win.classList.toggle(
          'is-pinned',
          !!value
        );
      }

    },

    markUnsaved(
      id,
      value = true
    ) {

      const meta =
        sessionMeta.get(id);

      if (!meta) return;

      meta.hasUnsavedWork =
        !!value;

    },

    markMedia(
      id,
      value = true
    ) {

      const meta =
        sessionMeta.get(id);

      if (!meta) return;

      meta.mediaPlaying =
        !!value;

    }

  };

  /* ─────────────────────────────────────────────────────────────
     GLOBAL API
  ───────────────────────────────────────────────────────────── */

  window.createSessionWindow =
    createSessionWindow;

  window.togglePeek =
    togglePeek;

  window.toggleCollapse =
    toggleCollapse;

  window.maximizeWindow =
    maximizeWindow;

  window.minimizeWindow =
    minimizeWindow;

  window.closeWindow =
    closeWindow;

  window.suspendSession =
    suspendSession;

  window.restoreSession =
    restoreSession;

  window.evictSession =
    evictSession;

  window.syncShellMode =
    syncShell;

  /* ─────────────────────────────────────────────────────────────
     DEBUG
  ───────────────────────────────────────────────────────────── */

  window.DualRuntime =
    {

      get(id) {

        return (
          runtimeStore.get(id) ||
          null
        );

      },

      list() {

        return [
          ...runtimeStore.entries()
        ].map(
          ([id, data]) => ({
            id,
            ...data
          })
        );

      },

      clear(id) {

        runtimeStore.delete(id);

      }

    };

  console.log(
    '🚀 Almasliber OS — iFSw Nephesh Runtime Manager carregado.',
    {
      tier:
        currentTier,

      limits:
        currentLimits(),

      states:
        SessionState
    }
  );

})();