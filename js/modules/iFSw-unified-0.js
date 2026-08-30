(function () {
  'use strict';

  const ROOT = document.documentElement;
  const THEME_KEY = 'dual-theme';

  const stackWrap = document.getElementById('stackWrap');
  const dock = document.getElementById('dock');

  const timers = new Map();
  const sessionStore = new Map();
  const suspendedQueue = [];

  const MAX_SUSPENDED = 5;

  let counter = 1;
  let activeWindow = null;               // referência à janela ativa (para header global)
  const tabDataMap = new WeakMap();      // associa window -> { tabs, activeId }

  /* =======================================================
     SESSION LIFECYCLE MANAGER
     -------------------------------------------------------
     "Session window" (visual) e "iframe vivo" (computacional)
     são desacoplados. A window pode existir só como metadata
     (CREATED/SUSPENDED/CLOSED) sem custo real de app rodando.

     Controle comercial (FREE/PRO/PREMIUM = quanto o usuário
     PODE usar) fica separado do controle computacional
     (ACTIVE/IDLE/SUSPENDED = quanto o dispositivo AGUENTA
     manter vivo ao mesmo tempo).
     ======================================================= */

  const SessionState = {
    CREATED:   'created',
    LOADING:   'loading',
    ACTIVE:    'active',
    IDLE:      'idle',
    SUSPENDED: 'suspended',
    CLOSED:    'closed'
  };

  const Tier = {
    FREE:    'free',
    PRO:     'pro',
    PREMIUM: 'premium'
  };

  const TIER_LIMITS = {
    [Tier.FREE]:    { maxActive: 2, maxSuspended: 3,  maxSessions: 5  },
    [Tier.PRO]:     { maxActive: 4, maxSuspended: 6,  maxSessions: 12 },
    [Tier.PREMIUM]: { maxActive: 8, maxSuspended: 12, maxSessions: 30 }
  };

  const IDLE_AFTER_MS = 45000;         // ACTIVE sem interação → IDLE
  const SUSPEND_AFTER_IDLE_MS = 90000; // IDLE sem interação → SUSPENDED

  let currentTier = Tier.FREE;

  // Metadata por sessão: { state, createdAt, lastActive }
  const sessionMeta = new Map();

  function currentLimits() {
    return TIER_LIMITS[currentTier] || TIER_LIMITS[Tier.FREE];
  }

  function countByStates(...states) {
    let n = 0;
    sessionMeta.forEach(meta => { if (states.includes(meta.state)) n++; });
    return n;
  }

  function setSessionState(id, state) {
    const win = getWin(id);
    const meta = sessionMeta.get(id) || { createdAt: Date.now() };

    meta.state = state;

    if (state === SessionState.ACTIVE || state === SessionState.LOADING) {
      meta.lastActive = Date.now();
    }

    if (state === SessionState.CLOSED) {
      sessionMeta.delete(id);
    } else {
      sessionMeta.set(id, meta);
    }

    if (win) {
      win.dataset.state = state;
      win.classList.remove(
        'state-created', 'state-loading', 'state-active',
        'state-idle', 'state-suspended', 'state-closed'
      );
      win.classList.add('state-' + state);
    }

    window.dispatchEvent(
      new CustomEvent('session:state-change', { detail: { id, state } })
    );
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

  // Sessão viva (ACTIVE/IDLE/LOADING) usada há mais tempo,
  // candidata a ser suspensa para liberar orçamento.
  function leastRecentlyActiveSession(excludeId) {
    let oldestId = null;
    let oldestTime = Infinity;

    sessionMeta.forEach((meta, id) => {
      if (id === excludeId) return;

      const win = getWin(id);
      if (win && isMaximized(win)) return; // janela em foco não é vítima

      if (
        meta.state !== SessionState.ACTIVE &&
        meta.state !== SessionState.IDLE &&
        meta.state !== SessionState.LOADING
      ) return;

      const t = meta.lastActive || 0;

      if (t < oldestTime) {
        oldestTime = t;
        oldestId = id;
      }
    });

    return oldestId;
  }

  // Garante que abrir/restaurar uma sessão não estoure o
  // orçamento de sessões computacionalmente vivas do tier atual.
  function enforceActiveBudget(excludeId) {
    const limits = currentLimits();
    let guard = 0;

    while (
      countByStates(
        SessionState.ACTIVE,
        SessionState.LOADING,
        SessionState.IDLE
      ) >= limits.maxActive &&
      guard++ < 50
    ) {
      const victim = leastRecentlyActiveSession(excludeId);
      if (!victim) break;

      suspendSession(victim);
    }
  }

  function setTier(tier) {
    if (!TIER_LIMITS[tier]) return;
    currentTier = tier;
    enforceActiveBudget();
  }

  // Ronda periódica do ciclo de vida.
  setInterval(() => {
    const now = Date.now();

    sessionMeta.forEach((meta, id) => {
      const win = getWin(id);
      if (!win) return;

      if (isMaximized(win)) {
        touchSession(id);
        return;
      }

      if (
        meta.state === SessionState.ACTIVE &&
        now - (meta.lastActive || 0) > IDLE_AFTER_MS
      ) {
        setSessionState(id, SessionState.IDLE);
      }

      else if (
        meta.state === SessionState.IDLE &&
        now - (meta.lastActive || 0) > SUSPEND_AFTER_IDLE_MS
      ) {
        suspendSession(id);
      }
    });
  }, 10000);

  window.SessionLifecycle = {
    States: SessionState,
    Tiers: Tier,

    getState: getSessionState,

    listSessions() {
      return [...sessionMeta.entries()].map(([id, meta]) => ({ id, ...meta }));
    },

    setTier,
    getTier: () => currentTier,

    touch: touchSession,

    suspend: id => suspendSession(id),
    restore: id => restoreSession(id),
    close: id => destroySession(id),

    limits: () => currentLimits()
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function getWin(id) { return document.getElementById(id); }
  function isMaximized(win) { return !!win?.classList.contains('maximized'); }

  /* =======================================================
     Z STACK
     ======================================================= */
  const zStack = [];

  function bringToFront(win) {
    if (!win) return;
    const index = zStack.indexOf(win);
    if (index !== -1) zStack.splice(index, 1);
    zStack.push(win);
    zStack.forEach((item, i) => {
      if (!item.classList.contains('maximized')) {
        item.style.zIndex = String(1000 + i * 10);
      }
    });
    // Define como janela ativa para o header global
    setActiveWindow(win);
  }

  /* =======================================================
     ACTIVE WINDOW (para sincronia com header global)
     ======================================================= */
  function setActiveWindow(win) {
    if (activeWindow === win) return;
    activeWindow = win;
    syncGlobalHeader();
  }

  function syncGlobalHeader() {
    const urlInput = document.getElementById('urlInputNav');
    if (!activeWindow) {
      urlInput.value = '';
      return;
    }
    const data = tabDataMap.get(activeWindow);
    if (!data) return;
    const activeTab = data.tabs.find(t => t.id === data.activeId);
    if (activeTab) {
      urlInput.value = activeTab.url || '';
    } else {
      urlInput.value = '';
    }
  }

  /* =======================================================
     TABS MANAGEMENT
     ======================================================= */
  function getTabData(win) {
    if (!tabDataMap.has(win)) {
      // Inicializa com uma aba padrão
      const initialUrl = win.querySelector('.win-frame')?.src || 'https://www.infodose.com.br/splash';
      const tabs = [{ id: 'tab-' + Date.now(), url: initialUrl, title: 'Nova Aba', fav: false }];
      const activeId = tabs[0].id;
      tabDataMap.set(win, { tabs, activeId });
    }
    return tabDataMap.get(win);
  }

  function saveTabs(win) {
    const data = tabDataMap.get(win);
    if (!data) return;
    try {
      localStorage.setItem('dual_tabs_' + win.id, JSON.stringify(data));
    } catch (_) {}
  }

  function loadTabs(win) {
    try {
      const raw = localStorage.getItem('dual_tabs_' + win.id);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.tabs && data.tabs.length) {
          tabDataMap.set(win, data);
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  function getActiveTab(win) {
    const data = tabDataMap.get(win);
    if (!data) return null;
    return data.tabs.find(t => t.id === data.activeId) || data.tabs[0] || null;
  }

  function setActiveTab(win, tabId) {
    const data = tabDataMap.get(win);
    if (!data) return;
    const exists = data.tabs.some(t => t.id === tabId);
    if (!exists) return;
    data.activeId = tabId;
    saveTabs(win);
    renderTabCounter(win);
    syncGlobalHeader();
    // Atualiza o iframe com a URL da nova aba ativa
    const frame = win.querySelector('.win-frame');
    const tab = getActiveTab(win);
    if (frame && tab) {
      frame.src = tab.url || 'about:blank';
    }
  }

  function addTab(win, url = '') {
    const data = tabDataMap.get(win);
    if (!data) return;
    const newTab = {
      id: 'tab-' + Date.now(),
      url: url || 'https://www.infodose.com.br/splash',
      title: url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'Nova Aba',
      fav: false
    };
    data.tabs.push(newTab);
    data.activeId = newTab.id;
    saveTabs(win);
    renderTabCounter(win);
    syncGlobalHeader();
    // Atualiza iframe
    const frame = win.querySelector('.win-frame');
    if (frame) frame.src = newTab.url;
    // Fecha switcher se estiver aberto
    closeTabSwitcher();
  }

  function removeTab(win, tabId) {
    const data = tabDataMap.get(win);
    if (!data || data.tabs.length <= 1) return; // mantém pelo menos uma aba
    const index = data.tabs.findIndex(t => t.id === tabId);
    if (index === -1) return;
    data.tabs.splice(index, 1);
    if (data.activeId === tabId) {
      data.activeId = data.tabs[Math.min(index, data.tabs.length - 1)].id;
    }
    saveTabs(win);
    renderTabCounter(win);
    syncGlobalHeader();
    // Atualiza iframe
    const frame = win.querySelector('.win-frame');
    const active = getActiveTab(win);
    if (frame && active) frame.src = active.url;
    // Re-renderiza switcher se aberto
    if (document.getElementById('tabSwitcherOverlay').classList.contains('open')) {
      renderTabSwitcher(win);
    }
  }

  function updateTabUrl(win, tabId, newUrl) {
    const data = tabDataMap.get(win);
    if (!data) return;
    const tab = data.tabs.find(t => t.id === tabId);
    if (!tab) return;
    tab.url = newUrl;
    tab.title = newUrl.replace(/^https?:\/\//, '').split('/')[0] || 'Nova Aba';
    saveTabs(win);
    syncGlobalHeader();
    // Atualiza iframe se for a aba ativa
    if (data.activeId === tabId) {
      const frame = win.querySelector('.win-frame');
      if (frame) frame.src = newUrl;
    }
    if (document.getElementById('tabSwitcherOverlay').classList.contains('open')) {
      renderTabSwitcher(win);
    }
  }

  function toggleFav(win, tabId) {
    const data = tabDataMap.get(win);
    if (!data) return;
    const tab = data.tabs.find(t => t.id === tabId);
    if (!tab) return;
    tab.fav = !tab.fav;
    saveTabs(win);
    if (document.getElementById('tabSwitcherOverlay').classList.contains('open')) {
      renderTabSwitcher(win);
    }
  }

  function renderTabCounter(win) {
    const data = tabDataMap.get(win);
    if (!data) return;
    const btn = win.querySelector('.tab-counter');
    if (btn) btn.textContent = data.tabs.length;
  }

  /* =======================================================
     TAB SWITCHER UI (global overlay)
     ======================================================= */
  let currentSwitcherWin = null;

  function openTabSwitcher(win) {
    currentSwitcherWin = win;
    const overlay = document.getElementById('tabSwitcherOverlay');
    const title = document.getElementById('tabSwitcherTitle');
    title.textContent = 'Abas — ' + (win.querySelector('.win-title')?.textContent || 'janela');
    renderTabSwitcher(win);
    overlay.classList.add('open');
    // Fecha ao clicar fora do painel
    overlay.onclick = function(e) {
      if (e.target === overlay) closeTabSwitcher();
    };
  }

  function closeTabSwitcher() {
    document.getElementById('tabSwitcherOverlay').classList.remove('open');
    currentSwitcherWin = null;
  }

function renderTabSwitcher(win) {
  const grid = document.getElementById('tabGrid');
  const data = tabDataMap.get(win);

  if (!data) {
    grid.innerHTML = `
      <div class="tab-empty">
        <div class="tab-empty-icon">◌</div>
        <div class="tab-empty-title">Nenhuma aba</div>
        <div class="tab-empty-text">Abra uma nova aba para começar.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';

  data.tabs.forEach(tab => {
    const card = document.createElement('div');

    card.className =
      'tab-card' +
      (tab.id === data.activeId ? ' active' : '');

    card.dataset.tabId = tab.id;

    card.innerHTML = `
      <div class="tab-card-inner">

        <div class="tab-card-main">

          <div class="tab-card-head">
            <div class="tab-favicon">
              ${tab.favicon || '◉'}
            </div>

            <div class="tab-card-info">
              <div class="tab-title">
                ${tab.title || 'Nova Aba'}
              </div>

              <div class="tab-url">
                ${tab.url || ''}
              </div>
            </div>

          </div>

          <div class="tab-status">
            ${tab.id === data.activeId
              ? '<span class="tab-active-dot"></span> Ativa'
              : ''}
          </div>

        </div>

        <div class="tab-card-actions">

          <button
            type="button"
            class="tab-action tab-fav ${tab.fav ? 'active' : ''}"
            data-tabid="${tab.id}"
            title="${tab.fav ? 'Remover favorito' : 'Favoritar aba'}"
            aria-label="${tab.fav ? 'Remover favorito' : 'Favoritar aba'}"
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

    /* =========================================
       ABRIR / ATIVAR ABA
       ========================================= */

    card.addEventListener('click', function (e) {
      if (
        e.target.closest('.tab-close') ||
        e.target.closest('.tab-fav')
      ) {
        return;
      }

      setActiveTab(win, tab.id);
      closeTabSwitcher();
    });

    /* =========================================
       FECHAR ABA
       ========================================= */

    const closeBtn = card.querySelector('.tab-close');

    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      removeTab(win, tab.id);
    });

    /* =========================================
       FAVORITO
       ========================================= */

    const favBtn = card.querySelector('.tab-fav');

    favBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      toggleFav(win, tab.id);
    });

    grid.appendChild(card);
  });
}

  /* =======================================================
     SHELL STATE
     ======================================================= */
  function syncShell() {
    const maximized = !!document.querySelector('.session-window.maximized:not(.minimized)');
    document.body.classList.toggle('has-maximized', maximized);
    document.body.classList.toggle('ui-immersive', maximized);
  }

  /* =======================================================
     SUSPEND / RESTORE / DESTROY (adaptado para preservar abas)
     ======================================================= */
  function suspendSession(id) {
    const win = getWin(id);
    if (!win) return;
    const frame = win.querySelector('.win-frame');
    if (!frame) return;
    // Salva a URL atual no objeto de dados (já está salvo)
    sessionStore.set(id, { url: frame.src });
    frame.remove();
    win.dataset.suspended = 'true';
    win.classList.add('suspended');
    setSessionState(id, SessionState.SUSPENDED);
    if (!suspendedQueue.includes(id)) suspendedQueue.push(id);
    while (suspendedQueue.length > MAX_SUSPENDED) {
      const oldest = suspendedQueue.shift();
      destroySession(oldest);
    }
  }

  function restoreSession(id) {
    const win = getWin(id);
    if (!win) return;
    const data = sessionStore.get(id);
    if (!data) return;

    // Restaurar um iframe é reativar consumo real de recurso:
    // antes de reviver, garante orçamento (pode suspender outra
    // sessão ociosa para abrir espaço para esta).
    enforceActiveBudget(id);
    setSessionState(id, SessionState.LOADING);

    const frame = document.createElement('iframe');
    frame.className = 'win-frame';
    frame.dataset.runtime = 'nav';
    frame.addEventListener(
      'load',
      () => setSessionState(id, SessionState.ACTIVE),
      { once: true }
    );
    frame.src = data.url;
    win.appendChild(frame);
    win.dataset.suspended = 'false';
    win.classList.remove('suspended');
    sessionStore.delete(id);
    const index = suspendedQueue.indexOf(id);
    if (index !== -1) suspendedQueue.splice(index, 1);
  }

  function destroySession(id) {
    const win = getWin(id);
    setSessionState(id, SessionState.CLOSED);
    document.getElementById('dock-' + id)?.remove();
    win?.remove();
    sessionStore.delete(id);
    const index = suspendedQueue.indexOf(id);
    if (index !== -1) suspendedQueue.splice(index, 1);
    tabDataMap.delete(win);
    syncShell();
    if (activeWindow === win) setActiveWindow(null);
  }

  /* =======================================================
     COLLAPSE / PEEK / MAXIMIZE / MINIMIZE (mantidos)
     ======================================================= */
  function toggleCollapse(id) {
    const win = getWin(id);
    if (!win) return;
    if (isMaximized(win)) {
      win.classList.remove('maximized');
      win.style.zIndex = '';
      syncShell();
    }
    win.classList.toggle('collapsed');
    win.classList.remove('peeked');
    if (win.classList.contains('collapsed')) {
      if (win.dataset.suspended === 'true') restoreSession(id);
    }
    bringToFront(win);
    syncShell();
  }

  function togglePeek(id) {
    const win = getWin(id);
    if (!win) return;
    if (isMaximized(win)) {
      win.classList.remove('maximized');
      win.style.zIndex = '';
      syncShell();
    }
    win.classList.toggle('peeked');
    if (win.classList.contains('peeked')) {
      win.classList.remove('collapsed');
      if (win.dataset.suspended === 'true') restoreSession(id);
    }
    bringToFront(win);
    syncShell();
  }

  function maximizeWindow(id) {
    const win = getWin(id);
    if (!win) return;
    if (isMaximized(win)) {
      win.classList.remove('maximized');
      win.style.zIndex = '';
      if (win.dataset.suspended === 'true') restoreSession(id);
      bringToFront(win);
      syncShell();
      return;
    }
    win.classList.remove('collapsed', 'peeked', 'minimized', 'header-hidden', 'resizing');
    ['top','left','right','bottom','width','height','maxWidth','maxHeight'].forEach(p => win.style[p] = '');
    if (win.dataset.suspended === 'true') restoreSession(id);
    win.classList.add('maximized');
    win.style.zIndex = '94000';
    bringToFront(win);
    syncShell();
  }

  function minimizeWindow(id) {
    const win = getWin(id);
    if (!win) return;
    timers.delete(id);
    win.classList.remove('maximized', 'collapsed', 'peeked', 'header-hidden', 'resizing');
    syncShell();
    suspendSession(id);
    win.classList.add('minimized');
    document.getElementById('dock-' + id)?.remove();
    const bubble = document.createElement('button');
    bubble.type = 'button';
    bubble.className = 'dock-bubble';
    bubble.id = 'dock-' + id;
    bubble.title = 'Restaurar janela';
    bubble.setAttribute('aria-label', 'Restaurar janela');
    bubble.textContent = '۞';
    bubble.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      win.classList.remove('minimized');
      if (win.dataset.suspended === 'true') restoreSession(id);
      bringToFront(win);
      requestAnimationFrame(() => { bringToFront(win); syncShell(); });
      bubble.remove();
    });
    dock?.appendChild(bubble);
    syncShell();
  }

  function closeWindow(id) {
    destroySession(id);
  }

  /* =======================================================
     HEADER CLICK (para foco)
     ======================================================= */
  function handleHeaderClick(e, id) {
    if (e.target.closest('.win-controls') || e.target.closest('button') || e.target.closest('input') || e.target.closest('.win-navrow')) {
      return;
    }
    const win = getWin(id);
    if (!win) return;
    bringToFront(win);
    const old = timers.get(id);
    if (old) {
      clearTimeout(old);
      timers.delete(id);
      maximizeWindow(id);
      return;
    }
    const timer = setTimeout(() => {
      timers.delete(id);
      togglePeek(id);
    }, 250);
    timers.set(id, timer);
  }

  /* =======================================================
     RESIZE (mantido)
     ======================================================= */
  function makeResizeHandles(win) {
    if (win.dataset.resizeReady === '1') return;
    win.dataset.resizeReady = '1';
    const hy = document.createElement('div');
    hy.className = 'resize-handle resize-y';
    const hx = document.createElement('div');
    hx.className = 'resize-handle resize-x';
    const hc = document.createElement('div');
    hc.className = 'resize-handle resize-corner';
    win.append(hy, hx, hc);
    bindResizeY(win, hy);
    bindResizeX(win, hx);
    bindResizeCorner(win, hc);
  }

  function freeFromMaximize(win, rect) {
    if (isMaximized(win)) {
      win.classList.remove('maximized');
      win.style.position = 'fixed';
      win.style.left = Math.max(0, rect.left) + 'px';
      win.style.top = Math.max(0, rect.top) + 'px';
      win.style.right = 'auto';
      win.style.bottom = 'auto';
      win.style.width = Math.min(rect.width, window.innerWidth) + 'px';
      win.style.height = Math.min(rect.height, window.innerHeight) + 'px';
      win.style.maxWidth = 'none';
      win.style.maxHeight = 'none';
      if (win.dataset.suspended === 'true') restoreSession(win.id);
    }
    win.classList.remove('collapsed', 'peeked');
    win.classList.add('resizing');
    syncShell();
  }

  function finishResize(win) {
    win.classList.remove('resizing');
    syncShell();
  }

  function bindResizeY(win, handle) {
    let active = false, pointerId = null, startY = 0, startH = 0;
    handle.addEventListener('pointerdown', function(e) {
      if (e.button != null && e.button !== 0) return;
      const rect = win.getBoundingClientRect();
      active = true; pointerId = e.pointerId;
      startY = e.clientY; startH = rect.height;
      freeFromMaximize(win, rect);
      handle.setPointerCapture?.(pointerId);
      e.preventDefault();
      const move = ev => {
        if (!active || ev.pointerId !== pointerId) return;
        ev.preventDefault();
        const next = Math.max(44, Math.min(window.innerHeight, startH + (ev.clientY - startY)));
        win.style.height = next + 'px';
      };
      const up = ev => {
        if (ev && ev.pointerId !== pointerId) return;
        active = false;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        finishResize(win);
      };
      window.addEventListener('pointermove', move, { passive: false });
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }, { passive: false });
  }

  function bindResizeX(win, handle) {
    let active = false, pointerId = null, startX = 0, startW = 0;
    handle.addEventListener('pointerdown', function(e) {
      if (e.button != null && e.button !== 0) return;
      const rect = win.getBoundingClientRect();
      active = true; pointerId = e.pointerId;
      startX = e.clientX; startW = rect.width;
      freeFromMaximize(win, rect);
      handle.setPointerCapture?.(pointerId);
      e.preventDefault();
      const move = ev => {
        if (!active || ev.pointerId !== pointerId) return;
        ev.preventDefault();
        const next = Math.max(280, Math.min(window.innerWidth, startW + (ev.clientX - startX)));
        win.style.width = next + 'px';
      };
      const up = ev => {
        if (ev && ev.pointerId !== pointerId) return;
        active = false;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        finishResize(win);
      };
      window.addEventListener('pointermove', move, { passive: false });
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }, { passive: false });
  }

  function bindResizeCorner(win, handle) {
    let active = false, pointerId = null, startX = 0, startY = 0, startW = 0, startH = 0;
    handle.addEventListener('pointerdown', function(e) {
      if (e.button != null && e.button !== 0) return;
      const rect = win.getBoundingClientRect();
      active = true; pointerId = e.pointerId;
      startX = e.clientX; startY = e.clientY;
      startW = rect.width; startH = rect.height;
      freeFromMaximize(win, rect);
      handle.setPointerCapture?.(pointerId);
      e.preventDefault();
      const move = ev => {
        if (!active || ev.pointerId !== pointerId) return;
        ev.preventDefault();
        const width = Math.max(280, Math.min(window.innerWidth, startW + (ev.clientX - startX)));
        const height = Math.max(44, Math.min(window.innerHeight, startH + (ev.clientY - startY)));
        win.style.width = width + 'px';
        win.style.height = height + 'px';
      };
      const up = ev => {
        if (ev && ev.pointerId !== pointerId) return;
        active = false;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        finishResize(win);
      };
      window.addEventListener('pointermove', move, { passive: false });
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }, { passive: false });
  }

  /* =======================================================
     WIRE SESSION (com tabs)
     ======================================================= */
  function wireSession(win) {
    if (!win || win.dataset.wired === '1') return;
    win.dataset.wired = '1';

    // Qualquer interação real na sessão conta como sinal de uso —
    // tira do estado IDLE e adia o próximo auto-suspend.
    win.addEventListener(
      'pointerdown',
      () => touchSession(win.id),
      { passive: true }
    );

    // Inicializa dados de abas (carrega do localStorage ou cria default)
    if (!loadTabs(win)) {
      // fallback: cria a partir do iframe existente
      const frame = win.querySelector('.win-frame');
      const src = frame ? frame.src : 'https://www.infodose.com.br/splash';
      const tabs = [{ id: 'tab-' + Date.now(), url: src, title: src.replace(/^https?:\/\//, '').split('/')[0] || 'Nova Aba', fav: false }];
      tabDataMap.set(win, { tabs, activeId: tabs[0].id });
      saveTabs(win);
    }
    renderTabCounter(win);

    makeResizeHandles(win);

    const header = $('.win-hdr', win);
    header?.addEventListener('click', e => handleHeaderClick(e, win.id));

    const controls = $('.win-controls', win);
    controls?.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === 'collapse') toggleCollapse(win.id);
      else if (action === 'maximize') maximizeWindow(win.id);
      else if (action === 'minimize') minimizeWindow(win.id);
      else if (action === 'close') closeWindow(win.id);
      else if (action === 'tab-switcher') openTabSwitcher(win);
    });

    // Navegação local (dentro da janela)
    const input = $('.win-urlbar', win);
    const go = $('.win-go-btn', win);
    go?.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!input) return;
      let url = input.value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      const activeTab = getActiveTab(win);
      if (activeTab) {
        updateTabUrl(win, activeTab.id, url);
      }
      input.value = url;
    });
    input?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.stopPropagation();
        go?.click();
      }
    });

    // Sincroniza com o iframe (quando carregar, atualiza título)
    const frame = win.querySelector('.win-frame');
    frame?.addEventListener('load', function() {
      try {
        const doc = this.contentDocument;
        if (doc && doc.title) {
          const data = tabDataMap.get(win);
          const active = getActiveTab(win);
          if (active) {
            active.title = doc.title;
            saveTabs(win);
          }
        }
      } catch (_) {}
      // Atualiza URL no input local e global
      if (this.src) {
        const data = tabDataMap.get(win);
        const active = getActiveTab(win);
        if (active && active.url !== this.src) {
          active.url = this.src;
          saveTabs(win);
        }
        const localInput = win.querySelector('.win-urlbar');
        if (localInput) localInput.value = this.src;
        syncGlobalHeader();
      }
    });

    // Traz para frente ao clicar no frame (se não estiver maximizado)
    frame?.addEventListener('click', function() {
      if (!win.classList.contains('maximized')) {
        bringToFront(win);
      }
    });

    // Se a janela já estiver criada com um iframe, garante que a aba ativa tenha a URL correta
    const active = getActiveTab(win);
    if (frame && active && frame.src !== active.url) {
      frame.src = active.url;
    }
    if (frame && active) {
      // atualiza input local
      const localInput = win.querySelector('.win-urlbar');
      if (localInput) localInput.value = active.url;
    }

    // Se esta é a primeira janela, define como ativa
    if (!activeWindow) setActiveWindow(win);
  }

  /* =======================================================
     CRIAÇÃO DE NOVA JANELA (com abas)
     ======================================================= */
  function createSessionWindow({ title = '//', src = 'https://www.infodose.com.br' } = {}) {
    const id = 'session-' + Date.now() + '-' + counter++;
    const win = document.createElement('section');
    win.className = 'session-window peeked';
    win.id = id;
    win.innerHTML = `
      <div class="win-hdr">
        <div class="win-controls">
          <button type="button" data-action="collapse" title="Colapsar" aria-label="Colapsar">−</button>
          <button type="button" data-action="tab-switcher" class="tab-counter">1</button>
          <button type="button" data-action="maximize" title="Maximizar" aria-label="Maximizar">⛶</button>
          <button type="button" data-action="minimize" title="Minimizar" aria-label="Minimizar">۞</button>
          <button type="button" data-action="close" title="Fechar" aria-label="Fechar">×</button>
        </div>
        <div class="win-navrow" style="flex:2;min-width:0;pointer-events:auto;">
          <input class="win-urlbar" type="text" value="${src}" placeholder="Digite uma URL..." spellcheck="false" autocomplete="off">
          <button class="win-go-btn" type="button">Go</button>
        </div>
      </div>
      <iframe class="win-frame" data-runtime="nav" src="${src}"></iframe>
    `;
    stackWrap.appendChild(win);

    setSessionState(id, SessionState.CREATED);

    // Nova sessão nasce pedindo um "slot ativo" — se o orçamento
    // do tier já estiver cheio, uma sessão ociosa é suspensa antes.
    enforceActiveBudget(id);
    setSessionState(id, SessionState.LOADING);

    const newFrame = win.querySelector('.win-frame');
    newFrame?.addEventListener(
      'load',
      () => setSessionState(id, SessionState.ACTIVE),
      { once: true }
    );

    wireSession(win);
    bringToFront(win);
    return id;
  }

  /* =======================================================
     THEME
     ======================================================= */
  function applyTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    ROOT.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    $$('.theme-dot').forEach(btn => {
      if (btn.textContent.includes('☀') || btn.textContent.includes('🌙')) {
        btn.textContent = next === 'light' ? '☀️' : '🌙';
      }
    });
    window.dispatchEvent(new CustomEvent('dual:theme-change', { detail: { theme: next } }));
  }
  function getInitialTheme() {
    try { const saved = localStorage.getItem(THEME_KEY); if (saved === 'light' || saved === 'dark') return saved; } catch (_) {}
    return 'dark';
  }
  window.DualTheme = {
    set: applyTheme,
    toggle() { applyTheme(ROOT.dataset.theme === 'light' ? 'dark' : 'light'); },
    get() { return ROOT.dataset.theme || 'dark'; }
  };

  $$('.theme-dot').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); DualTheme.toggle(); });
  });
  applyTheme(getInitialTheme());

  /* =======================================================
     HEADER GLOBAL NAVEGAÇÃO (com janela ativa)
     ======================================================= */
  const navInput = document.getElementById('urlInputNav');
  const goNavBtn = document.getElementById('goNavBtn');
  const favBtn = document.getElementById('favBtn');

  function applyGlobalUrl() {
    if (!navInput || !activeWindow) return;
    let url = navInput.value.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    const activeTab = getActiveTab(activeWindow);
    if (activeTab) {
      updateTabUrl(activeWindow, activeTab.id, url);
    }
    navInput.value = url;
  }

  navInput?.addEventListener('keydown', e => { if (e.key === 'Enter') applyGlobalUrl(); });
  goNavBtn?.addEventListener('click', applyGlobalUrl);

  // Favoritar aba atual
  favBtn?.addEventListener('click', function() {
    if (!activeWindow) return;
    const activeTab = getActiveTab(activeWindow);
    if (activeTab) {
      toggleFav(activeWindow, activeTab.id);
    }
  });

  // Atualiza o header global quando a URL da aba ativa muda (já chamado em updateTabUrl)
  // Mas também precisamos atualizar quando o iframe carrega
  // Já temos no load do frame.

  /* =======================================================
     BOTÃO NOVA ABA (no switcher)
     ======================================================= */
  document.getElementById('newTabBtn')?.addEventListener('click', function() {
    if (currentSwitcherWin) {
      addTab(currentSwitcherWin);
    }
  });

  document.getElementById('closeTabSwitcher')?.addEventListener('click', closeTabSwitcher);

  /* =======================================================
     CRIAÇÃO DE NOVA JANELA VIA BOTÃO +
     ======================================================= */
  document.getElementById('openKobBtn')?.addEventListener('click', () => createSessionWindow());

  /* =======================================================
     HEADER GLOBAL COLLAPSE (conteúdo)
     ======================================================= */
  const HEADER = document.getElementById('main-header');
  const MAIN = document.getElementById('main-content');
  HEADER?.addEventListener('click', e => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.win-navrow') || e.target.closest('.theme-dot')) return;
    MAIN?.classList.toggle('hidden');
    const collapsed = MAIN?.classList.contains('hidden');
    HEADER.classList.toggle('is-collapsed', collapsed);
    window.dispatchEvent(new CustomEvent('dual:content-collapse', { detail: { collapsed } }));
  });

  /* =======================================================
     SMART SCROLL (header)
     ======================================================= */
  let lastScrollY = window.scrollY, ticking = false;
  const SCROLL_THRESHOLD = 8;
  function updateHeader() {
    if (!HEADER) return;
    const current = window.scrollY;
    if (current <= 10) {
      HEADER.classList.remove('header-hidden');
      HEADER.classList.add('header-visible');
      lastScrollY = current; ticking = false; return;
    }
    if (current > lastScrollY + SCROLL_THRESHOLD) {
      HEADER.classList.remove('header-visible');
      HEADER.classList.add('header-hidden');
    } else if (current < lastScrollY - SCROLL_THRESHOLD) {
      HEADER.classList.remove('header-hidden');
      HEADER.classList.add('header-visible');
    }
    lastScrollY = current; ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; } }, { passive: true });

  /* =======================================================
     INICIALIZAÇÃO DAS JANELAS EXISTENTES
     ======================================================= */
  $$('.session-window').forEach(win => {
    wireSession(win);

    // Sessões já presentes no markup inicial entram direto como
    // ACTIVE se já têm iframe vivo, ou CREATED caso contrário.
    const hasFrame = !!win.querySelector('.win-frame');
    setSessionState(
      win.id,
      hasFrame ? SessionState.ACTIVE : SessionState.CREATED
    );

    // Se for a primeira, ativa
    if (!activeWindow) setActiveWindow(win);
  });

  // Sincroniza o header global com a janela ativa inicial
  syncGlobalHeader();

  syncShell();

  /* =======================================================
     DEBUG / API
     ======================================================= */
  window.createSessionWindow = createSessionWindow;
  window.togglePeek = togglePeek;
  window.toggleCollapse = toggleCollapse;
  window.maximizeWindow = maximizeWindow;
  window.minimizeWindow = minimizeWindow;
  window.closeWindow = closeWindow;
  window.syncShellMode = syncShell;

  console.log('🚀 Almasliber OS — Unified Core com Abas e Persistência carregado.');

})();