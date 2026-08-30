/**
 * ═══════════════════════════════════════════════════════════════════
 * ALMASLIBER OS · SISTEMA DE MEMÓRIA DE SESSÃO
 * Módulo: SessionLifecycle + Tab Persistence + Suspend/Restore + Audit
 * Extraído do núcleo Kobllux · v3 Delta
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ═════════════════════════════════════════════════════════════════
  // 1. CONFIGURAÇÃO E ESTADO GLOBAL
  // ═════════════════════════════════════════════════════════════════

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
    [Tier.FREE]:    { maxActive: 2,  maxSuspended: 3,  maxSessions: 5  },
    [Tier.PRO]:     { maxActive: 4,  maxSuspended: 6,  maxSessions: 12 },
    [Tier.PREMIUM]: { maxActive: 8,  maxSuspended: 12, maxSessions: 30 }
  };

  // Timers e armazenamento em memória (não persiste entre reloads)
  const timers         = new Map();   // debounce de clique no header
  const sessionStore   = new Map();   // snapshots de iframes suspensos
  const suspendedQueue = [];          // FIFO para limite de suspensas
  const sessionMeta    = new Map();   // metadata de cada sessão (state, lastActive, etc)
  const tabDataMap     = new WeakMap(); // dados de abas por janela

  const MAX_SUSPENDED      = 5;
  const IDLE_AFTER_MS      = 45000;   // 45s → idle
  const SUSPEND_AFTER_IDLE_MS = 90000; // 90s → suspend

  let counter      = 1;   // gerador de IDs
  let activeWindow = null;
  let currentTier  = Tier.FREE;

  // ═════════════════════════════════════════════════════════════════
  // 2. LIFECYCLE DA SESSÃO
  // ═════════════════════════════════════════════════════════════════

  function currentLimits() {
    return TIER_LIMITS[currentTier] || TIER_LIMITS[Tier.FREE];
  }

  function countByStates(...states) {
    let n = 0;
    sessionMeta.forEach(meta => { if (states.includes(meta.state)) n++; });
    return n;
  }

  /**
   * Altera o estado de uma sessão e dispara evento global.
   * Atualiza classes CSS para feedback visual (state-badge).
   */
  function setSessionState(id, state) {
    const win = document.getElementById(id);
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

  /** Atualiza timestamp de atividade e reativa se estiver em idle */
  function touchSession(id) {
    const meta = sessionMeta.get(id);
    if (!meta) return;
    meta.lastActive = Date.now();
    if (meta.state === SessionState.IDLE) {
      setSessionState(id, SessionState.ACTIVE);
    }
  }

  /** Encontra a sessão ativa/ociosa/loading menos recentemente usada */
  function leastRecentlyActiveSession(excludeId) {
    let oldestId = null;
    let oldestTime = Infinity;
    sessionMeta.forEach((meta, id) => {
      if (id === excludeId) return;
      const win = document.getElementById(id);
      if (win && win.classList.contains('maximized')) return;
      if (![SessionState.ACTIVE, SessionState.IDLE, SessionState.LOADING].includes(meta.state)) return;
      const t = meta.lastActive || 0;
      if (t < oldestTime) { oldestTime = t; oldestId = id; }
    });
    return oldestId;
  }

  /** Garante que o número de sessões ativas não exceda o limite do tier */
  function enforceActiveBudget(excludeId) {
    const limits = currentLimits();
    let guard = 0;
    while (
      countByStates(SessionState.ACTIVE, SessionState.LOADING, SessionState.IDLE) >= limits.maxActive &&
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

  // Loop de verificação periódica: idle → suspend
  setInterval(() => {
    const now = Date.now();
    sessionMeta.forEach((meta, id) => {
      const win = document.getElementById(id);
      if (!win) return;
      if (win.classList.contains('maximized')) { touchSession(id); return; }

      if (meta.state === SessionState.ACTIVE &&
          now - (meta.lastActive || 0) > IDLE_AFTER_MS) {
        setSessionState(id, SessionState.IDLE);
      } else if (meta.state === SessionState.IDLE &&
                 now - (meta.lastActive || 0) > SUSPEND_AFTER_IDLE_MS) {
        suspendSession(id);
      }
    });
  }, 10000);

  // ═════════════════════════════════════════════════════════════════
  // 3. PERSISTÊNCIA DE ABAS (localStorage)
  // ═════════════════════════════════════════════════════════════════

  function getTabData(win) {
    if (!tabDataMap.has(win)) {
      const initialUrl = win.querySelector('.win-frame')?.src || 'https://www.infodose.com.br/splash';
      const tabs = [{
        id: 'tab-' + Date.now(),
        url: initialUrl,
        title: 'Nova Aba',
        fav: false
      }];
      tabDataMap.set(win, { tabs, activeId: tabs[0].id });
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
    if (!data.tabs.some(t => t.id === tabId)) return;
    data.activeId = tabId;
    saveTabs(win);
    renderTabCounter(win);
    syncGlobalHeader();
    const frame = win.querySelector('.win-frame');
    const tab = getActiveTab(win);
    if (frame && tab) frame.src = tab.url || 'about:blank';
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
    const frame = win.querySelector('.win-frame');
    if (frame) frame.src = newTab.url;
  }

  function removeTab(win, tabId) {
    const data = tabDataMap.get(win);
    if (!data || data.tabs.length <= 1) return;
    const index = data.tabs.findIndex(t => t.id === tabId);
    if (index === -1) return;
    data.tabs.splice(index, 1);
    if (data.activeId === tabId) {
      data.activeId = data.tabs[Math.min(index, data.tabs.length - 1)].id;
    }
    saveTabs(win);
    renderTabCounter(win);
    syncGlobalHeader();
    const frame = win.querySelector('.win-frame');
    const active = getActiveTab(win);
    if (frame && active) frame.src = active.url;
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
    if (data.activeId === tabId) {
      const frame = win.querySelector('.win-frame');
      if (frame) frame.src = newUrl;
    }
  }

  function toggleFav(win, tabId) {
    const data = tabDataMap.get(win);
    if (!data) return;
    const tab = data.tabs.find(t => t.id === tabId);
    if (tab) { tab.fav = !tab.fav; saveTabs(win); }
  }

  function renderTabCounter(win) {
    const data = tabDataMap.get(win);
    if (!data) return;
    const btn = win.querySelector('.tab-counter');
    if (btn) btn.textContent = data.tabs.length;
  }

  // Sincroniza a URL da barra global com a aba ativa da janela ativa
  function syncGlobalHeader() {
    const urlInput = document.getElementById('urlInputNav');
    if (!urlInput || !activeWindow) { urlInput && (urlInput.value = ''); return; }
    const data = tabDataMap.get(activeWindow);
    if (!data) return;
    const activeTab = data.tabs.find(t => t.id === data.activeId);
    urlInput.value = activeTab ? (activeTab.url || '') : '';
  }

  // ═════════════════════════════════════════════════════════════════
  // 4. SUSPENSÃO E RESTAURAÇÃO DE SNAPSHOTS
  // ═════════════════════════════════════════════════════════════════

  /**
   * Suspende uma sessão: remove o iframe, salva snapshot HTML
   * e o estado no sessionStore. Mantém FIFO de no máximo MAX_SUSPENDED.
   */
  function suspendSession(id) {
    const win = document.getElementById(id);
    if (!win) return;
    const frame = win.querySelector('.win-frame');
    if (!frame) { setSessionState(id, SessionState.SUSPENDED); return; }

    let snapshot = null;
    try {
      const doc = frame.contentDocument;
      if (doc) snapshot = doc.documentElement.outerHTML;
    } catch (_) {}

    sessionStore.set(id, { url: frame.src, snapshot });
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

  /**
   * Restaura uma sessão suspensa: recria o iframe com srcdoc (snapshot)
   * ou URL original. Respeita o orçamento ativo do tier.
   */
  function restoreSession(id) {
    const win = document.getElementById(id);
    if (!win) return;
    const data = sessionStore.get(id);
    if (!data) { setSessionState(id, SessionState.ACTIVE); return; }

    enforceActiveBudget(id);
    setSessionState(id, SessionState.LOADING);

    const frame = document.createElement('iframe');
    frame.className = 'win-frame';
    frame.dataset.runtime = 'nav';
    if (data.snapshot) {
      frame.srcdoc = data.snapshot;
    } else {
      frame.src = data.url || 'https://www.infodose.com.br/splash';
    }
    frame.addEventListener('load', () => setSessionState(id, SessionState.ACTIVE), { once: true });
    win.appendChild(frame);

    win.dataset.suspended = 'false';
    win.classList.remove('suspended');
    sessionStore.delete(id);

    const index = suspendedQueue.indexOf(id);
    if (index !== -1) suspendedQueue.splice(index, 1);
  }

  /** Destrói uma sessão permanentemente, limpando todos os rastros */
  function destroySession(id) {
    const win = document.getElementById(id);
    setSessionState(id, SessionState.CLOSED);
    document.getElementById('dock-' + id)?.remove();
    win?.remove();
    sessionStore.delete(id);
    const index = suspendedQueue.indexOf(id);
    if (index !== -1) suspendedQueue.splice(index, 1);
    tabDataMap.delete(win);
    if (activeWindow === win) activeWindow = null;
  }

  // ═════════════════════════════════════════════════════════════════
  // 5. AUDITORIA E PULSO DO SISTEMA
  // ═════════════════════════════════════════════════════════════════

  /**
   * Retorna snapshot do estado atual das sessões para diagnóstico.
   * Usado pelo koblluxSystemLog() e pelo painel de controle.
   */
  window.DualSessionAudit = function() {
    const active = SessionLifecycle.listSessions()
      .filter(s => !/closed|suspended/.test(s.state));
    return {
      slotsVivos: active.length,
      slotsOciosos: active.filter(s => s.state === 'idle').length,
      proximoASuspensao: active.filter(s =>
        Date.now() - (s.lastActive || 0) > 80_000
      ).map(s => s.id)
    };
  };

  // Pulso periódico: métricas de memória e saúde do sistema
  setInterval(() => {
    try {
      const all = SessionLifecycle.listSessions();
      window._koblluxPulse = {
        hasSuspendedExc: all.some(s => s.state === 'suspended'),
        delayed: all.filter(s => Date.now() - (s.lastActive || 0) > 120_000).length,
        memory_cost: all.reduce((acc, s) => acc + (s.url?.length ?? 0), 0)
      };
    } catch(e) {}
  }, 60000);

  // ═════════════════════════════════════════════════════════════════
  // 6. API PÚBLICA
  // ═════════════════════════════════════════════════════════════════

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

  console.log('🧠 SessionMemory · Lifecycle + Tabs + Suspend + Audit carregado.');
})();
