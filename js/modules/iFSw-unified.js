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

  /* =======================================================
     SESSION LIFECYCLE MANAGER
     -------------------------------------------------------
     "Session window" (visual) e "iframe vivo" (computacional)
     são desacoplados. A window pode existir só como metadata
     (CREATED/SUSPENDED/CLOSED) sem custo real de app rodando.

     Controle comercial (FREE/PRO/PREMIUM = quanto o usuário
     PODE usar) é mantido separado do controle computacional
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

    sessionMeta.forEach(meta => {
      if (states.includes(meta.state)) n++;
    });

    return n;
  }

  function setSessionState(id, state) {
    const win = getWin(id);
    const meta = sessionMeta.get(id) || { createdAt: Date.now() };

    meta.state = state;

    if (
      state === SessionState.ACTIVE ||
      state === SessionState.LOADING
    ) {
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
        'state-created',
        'state-loading',
        'state-active',
        'state-idle',
        'state-suspended',
        'state-closed'
      );

      win.classList.add('state-' + state);
    }

    window.dispatchEvent(
      new CustomEvent('session:state-change', {
        detail: { id, state }
      })
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
      return [...sessionMeta.entries()].map(
        ([id, meta]) => ({ id, ...meta })
      );
    },

    setTier,
    getTier: () => currentTier,

    touch: touchSession,

    suspend: id => suspendSession(id),
    restore: id => restoreSession(id),
    close: id => destroySession(id),

    limits: () => currentLimits()
  };

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

  /* =======================================================
     Z STACK
     ======================================================= */

  const zStack = [];

  function bringToFront(win) {
    if (!win) return;

    const index = zStack.indexOf(win);

    if (index !== -1) {
      zStack.splice(index, 1);
    }

    zStack.push(win);

    zStack.forEach((item, i) => {
      if (!item.classList.contains('maximized')) {
        item.style.zIndex = String(1000 + i * 10);
      }
    });
  }

  /* =======================================================
     SHELL STATE
     ======================================================= */

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

  /* =======================================================
     SUSPEND
     ======================================================= */

  function suspendSession(id) {
    const win = getWin(id);

    if (!win) return;

    const frame =
      win.querySelector('.win-frame');

    if (!frame) return;

    sessionStore.set(id, {
      url: frame.src
    });

    frame.remove();

    win.dataset.suspended = 'true';
    win.classList.add('suspended');

    setSessionState(id, SessionState.SUSPENDED);

    if (!suspendedQueue.includes(id)) {
      suspendedQueue.push(id);
    }

    while (
      suspendedQueue.length > MAX_SUSPENDED
    ) {
      const oldest =
        suspendedQueue.shift();

      destroySession(oldest);
    }
  }

  /* =======================================================
     RESTORE
     ======================================================= */

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

    const frame =
      document.createElement('iframe');

    frame.className = 'win-frame';
    frame.dataset.runtime = 'nav';

    frame.addEventListener(
      'load',
      () => setSessionState(id, SessionState.ACTIVE),
      { once: true }
    );

    /*
     * Sem sandbox.
     * Downloads e recursos dependem também
     * das políticas do documento remoto.
     */
    frame.src = data.url;

    win.appendChild(frame);

    win.dataset.suspended = 'false';
    win.classList.remove('suspended');

    sessionStore.delete(id);

    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(index, 1);
    }
  }

  /* =======================================================
     DESTROY
     ======================================================= */

  function destroySession(id) {
    const win = getWin(id);

    setSessionState(id, SessionState.CLOSED);

    document
      .getElementById('dock-' + id)
      ?.remove();

    win?.remove();

    sessionStore.delete(id);

    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(index, 1);
    }

    syncShell();
  }

  /* =======================================================
     COLLAPSE
     ======================================================= */

  function toggleCollapse(id) {
    const win = getWin(id);

    if (!win) return;

    /*
     * IMPORTANTE:
     * Maximizado não bloqueia mais a ação.
     * Primeiro sai do maximizado.
     */
    if (isMaximized(win)) {
      win.classList.remove('maximized');

      win.style.zIndex = '';

      syncShell();
    }

    win.classList.toggle('collapsed');

    win.classList.remove('peeked');

    if (win.classList.contains('collapsed')) {
      if (win.dataset.suspended === 'true') {
        restoreSession(id);
      }
    }

    bringToFront(win);

    syncShell();
  }

  /* =======================================================
     PEEK
     ======================================================= */

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

      if (win.dataset.suspended === 'true') {
        restoreSession(id);
      }
    }

    bringToFront(win);

    syncShell();
  }

  /* =======================================================
     MAXIMIZE
     ======================================================= */

  function maximizeWindow(id) {
    const win = getWin(id);

    if (!win) return;

    /*
     * Se já está maximizado,
     * segundo clique restaura.
     */
    if (isMaximized(win)) {
      win.classList.remove('maximized');

      win.style.zIndex = '';

      if (win.dataset.suspended === 'true') {
        restoreSession(id);
      }

      bringToFront(win);
      syncShell();

      return;
    }

    /*
     * Limpa estados incompatíveis.
     */
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
    ].forEach(prop => {
      win.style[prop] = '';
    });

    /*
     * Restaura iframe antes de maximizar.
     */
    if (win.dataset.suspended === 'true') {
      restoreSession(id);
    }

    win.classList.add('maximized');

    /*
     * Maximizado sempre ganha da stack normal.
     */
    win.style.zIndex = '94000';

    bringToFront(win);

    syncShell();
  }

  /* =======================================================
     MINIMIZE
     ======================================================= */

  function minimizeWindow(id) {
    const win = getWin(id);

    if (!win) return;

    timers.delete(id);

    /*
     * 1 — sai explicitamente do maximizado
     */
    win.classList.remove(
      'maximized',
      'collapsed',
      'peeked',
      'header-hidden',
      'resizing'
    );

    /*
     * 2 — sincroniza imediatamente
     */
    syncShell();

    /*
     * 3 — suspende iframe
     */
    suspendSession(id);

    /*
     * 4 — estado visual minimizado
     */
    win.classList.add('minimized');

    /*
     * 5 — cria/renova dock bubble
     */
    document
      .getElementById('dock-' + id)
      ?.remove();

    const bubble =
      document.createElement('button');

    bubble.type = 'button';
    bubble.className = 'dock-bubble';
    bubble.id = 'dock-' + id;

    bubble.title = 'Restaurar janela';
    bubble.setAttribute(
      'aria-label',
      'Restaurar janela'
    );

    bubble.textContent = '۞';

    bubble.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        e.stopPropagation();

        win.classList.remove('minimized');

        if (
          win.dataset.suspended === 'true'
        ) {
          restoreSession(id);
        }

        bringToFront(win);

        requestAnimationFrame(() => {
          bringToFront(win);
          syncShell();
        });

        bubble.remove();
      }
    );

    dock?.appendChild(bubble);

    syncShell();
  }

  /* =======================================================
     CLOSE
     ======================================================= */

  function closeWindow(id) {
    destroySession(id);
  }

  /* =======================================================
     HEADER CLICK
     ======================================================= */

  function handleHeaderClick(e, id) {
    if (
      e.target.closest('.win-controls') ||
      e.target.closest('button') ||
      e.target.closest('input') ||
      e.target.closest('.win-navrow')
    ) {
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

    const timer =
      setTimeout(() => {
        timers.delete(id);
        togglePeek(id);
      }, 250);

    timers.set(id, timer);
  }

  /* =======================================================
     RESIZE
     ======================================================= */

  function makeResizeHandles(win) {
    if (win.dataset.resizeReady === '1') return;

    win.dataset.resizeReady = '1';

    const hy =
      document.createElement('div');

    hy.className =
      'resize-handle resize-y';

    const hx =
      document.createElement('div');

    hx.className =
      'resize-handle resize-x';

    const hc =
      document.createElement('div');

    hc.className =
      'resize-handle resize-corner';

    win.append(hy, hx, hc);

    bindResizeY(win, hy);
    bindResizeX(win, hx);
    bindResizeCorner(win, hc);
  }

  function freeFromMaximize(win, rect) {
    if (isMaximized(win)) {
      win.classList.remove('maximized');

      win.style.position = 'fixed';

      win.style.left =
        Math.max(0, rect.left) + 'px';

      win.style.top =
        Math.max(0, rect.top) + 'px';

      win.style.right = 'auto';
      win.style.bottom = 'auto';

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

      win.style.maxWidth = 'none';
      win.style.maxHeight = 'none';

      if (
        win.dataset.suspended === 'true'
      ) {
        restoreSession(win.id);
      }
    }

    win.classList.remove(
      'collapsed',
      'peeked'
    );

    win.classList.add('resizing');

    syncShell();
  }

  function finishResize(win) {
    win.classList.remove('resizing');
    syncShell();
  }

  function bindResizeY(win, handle) {
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
        ) return;

        const rect =
          win.getBoundingClientRect();

        active = true;
        pointerId = e.pointerId;
        startY = e.clientY;
        startH = rect.height;

        freeFromMaximize(win, rect);

        handle.setPointerCapture?.(
          pointerId
        );

        e.preventDefault();

        const move = ev => {
          if (
            !active ||
            ev.pointerId !== pointerId
          ) return;

          ev.preventDefault();

          const next =
            Math.max(
              44,
              Math.min(
                window.innerHeight,
                startH +
                (ev.clientY - startY)
              )
            );

          win.style.height =
            next + 'px';
        };

        const up = ev => {
          if (
            ev &&
            ev.pointerId !== pointerId
          ) return;

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
          { passive: false }
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
      { passive: false }
    );
  }

  function bindResizeX(win, handle) {
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
        ) return;

        const rect =
          win.getBoundingClientRect();

        active = true;
        pointerId = e.pointerId;
        startX = e.clientX;
        startW = rect.width;

        freeFromMaximize(win, rect);

        handle.setPointerCapture?.(
          pointerId
        );

        e.preventDefault();

        const move = ev => {
          if (
            !active ||
            ev.pointerId !== pointerId
          ) return;

          ev.preventDefault();

          const next =
            Math.max(
              280,
              Math.min(
                window.innerWidth,
                startW +
                (ev.clientX - startX)
              )
            );

          win.style.width =
            next + 'px';
        };

        const up = ev => {
          if (
            ev &&
            ev.pointerId !== pointerId
          ) return;

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
          { passive: false }
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
      { passive: false }
    );
  }

  function bindResizeCorner(win, handle) {
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
        ) return;

        const rect =
          win.getBoundingClientRect();

        active = true;
        pointerId = e.pointerId;

        startX = e.clientX;
        startY = e.clientY;

        startW = rect.width;
        startH = rect.height;

        freeFromMaximize(win, rect);

        handle.setPointerCapture?.(
          pointerId
        );

        e.preventDefault();

        const move = ev => {
          if (
            !active ||
            ev.pointerId !== pointerId
          ) return;

          ev.preventDefault();

          const width =
            Math.max(
              280,
              Math.min(
                window.innerWidth,
                startW +
                (ev.clientX - startX)
              )
            );

          const height =
            Math.max(
              44,
              Math.min(
                window.innerHeight,
                startH +
                (ev.clientY - startY)
              )
            );

          win.style.width =
            width + 'px';

          win.style.height =
            height + 'px';
        };

        const up = ev => {
          if (
            ev &&
            ev.pointerId !== pointerId
          ) return;

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
          { passive: false }
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
      { passive: false }
    );
  }

  /* =======================================================
     WIRE SESSION
     ======================================================= */

  function wireSession(win) {
    if (
      !win ||
      win.dataset.wired === '1'
    ) return;

    win.dataset.wired = '1';

    // Qualquer interação real na sessão conta como sinal de uso —
    // tira do estado IDLE e adia o próximo auto-suspend.
    win.addEventListener(
      'pointerdown',
      () => touchSession(win.id),
      { passive: true }
    );

    makeResizeHandles(win);

    const header =
      $('.win-hdr', win);

    header?.addEventListener(
      'click',
      e => handleHeaderClick(
        e,
        win.id
      )
    );

    const controls =
      $('.win-controls', win);

    controls?.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        e.stopPropagation();

        const btn =
          e.target.closest('button');

        if (!btn) return;

        const action =
          btn.dataset.action;

        if (action === 'collapse') {
          toggleCollapse(win.id);
        }

        else if (action === 'maximize') {
          maximizeWindow(win.id);
        }

        else if (action === 'minimize') {
          minimizeWindow(win.id);
        }

        else if (action === 'close') {
          closeWindow(win.id);
        }
      }
    );

    const input =
      $('.win-urlbar', win);

    const go =
      $('.win-go-btn', win);

    go?.addEventListener(
      'click',
      e => {
        e.preventDefault();
        e.stopPropagation();

        if (!input) return;

        let url =
          input.value.trim();

        if (!url) return;

        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }

        const frame =
          $('.win-frame', win);

        if (frame) {
          frame.src = url;
        }

        input.value = url;
      }
    );

    input?.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          e.stopPropagation();
          go?.click();
        }
      }
    );
  }

  /* =======================================================
     THEME
     ======================================================= */

  function applyTheme(theme) {
    const next =
      theme === 'light'
        ? 'light'
        : 'dark';

    ROOT.dataset.theme = next;

    try {
      localStorage.setItem(
        THEME_KEY,
        next
      );
    } catch (_) {}

    $$('.theme-dot').forEach(btn => {
      if (
        btn.textContent.includes('☀') ||
        btn.textContent.includes('🌙')
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
    set: applyTheme,

    toggle() {
      applyTheme(
        ROOT.dataset.theme === 'light'
          ? 'dark'
          : 'light'
      );
    },

    get() {
      return ROOT.dataset.theme || 'dark';
    }
  };

  /* =======================================================
     EXISTING SESSIONS
     ======================================================= */

  $$('.session-window')
    .forEach(win => {
      wireSession(win);

      // Sessões que já vêm no markup inicial entram direto
      // como ACTIVE se já têm iframe, ou CREATED caso contrário.
      const hasFrame = !!win.querySelector('.win-frame');
      setSessionState(
        win.id,
        hasFrame ? SessionState.ACTIVE : SessionState.CREATED
      );
    });

  /* =======================================================
     THEME BUTTONS
     ======================================================= */

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

  /* =======================================================
     GLOBAL NAV
     ======================================================= */

  const navInput =
    document.getElementById(
      'urlInputNav'
    );

  const session =
    document.getElementById(
      'session-iframe'
    );

  const navFrame =
    document.getElementById(
      'navFrame'
    );

  function applyGlobalUrl() {
    if (
      !navInput ||
      !session
    ) return;

    let url =
      navInput.value.trim();

    if (!url) return;

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const frame =
      session.querySelector(
        '.win-frame'
      );

    if (frame) {
      frame.src = url;
    }

    navInput.value = url;
  }

  navInput?.addEventListener(
    'keydown',
    e => {
      if (e.key === 'Enter') {
        applyGlobalUrl();
      }
    }
  );

  document
    .getElementById('goNavBtn')
    ?.addEventListener(
      'click',
      applyGlobalUrl
    );

  /* =======================================================
     CREATE SESSION
     ======================================================= */

  function createSessionWindow({
    title = '//',
    src = 'https://www.infodose.com.br'
  } = {}) {

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

    win.id = id;

    win.innerHTML = `
      <div class="win-hdr">

        <div class="win-controls">

          <button
            type="button"
            data-action="collapse"
            title="Colapsar"
            aria-label="Colapsar"
          >−</button>

          <button
            type="button"
            data-action="maximize"
            title="Maximizar"
            aria-label="Maximizar"
          >⛶</button>

          <button
            type="button"
            data-action="minimize"
            title="Minimizar"
            aria-label="Minimizar"
          >۞</button>

          <button
            type="button"
            data-action="close"
            title="Fechar"
            aria-label="Fechar"
          >×</button>

        </div>

        <div
          class="win-navrow"
          style="flex:2;min-width:0;pointer-events:auto;"
        >

          <input
            class="win-urlbar"
            type="text"
            value="${src}"
            placeholder="Digite uma URL..."
            spellcheck="false"
            autocomplete="off"
          >

          <button
            class="win-go-btn"
            type="button"
          >Go</button>

        </div>

      </div>

      <iframe
        class="win-frame"
        data-runtime="nav"
        src="${src}"
      ></iframe>
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

  document
    .getElementById('openKobBtn')
    ?.addEventListener(
      'click',
      () => createSessionWindow()
    );

  /* =======================================================
     HEADER GLOBAL COLLAPSE
     ======================================================= */

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
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.target.closest('.win-navrow') ||
        e.target.closest('.theme-dot')
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

  /* =======================================================
     SMART SCROLL
     ======================================================= */

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

      lastScrollY = current;
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

    lastScrollY = current;
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
    { passive: true }
  );

  /* =======================================================
     INITIAL STATE
     ======================================================= */

  if (
    navInput &&
    navFrame
  ) {
    navInput.value =
      navFrame.src;
  }

  syncShell();

  /* =======================================================
     DEBUG API
     ======================================================= */

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

  window.syncShellMode =
    syncShell;

  console.log(
    '🚀 Almasliber OS — Unified Core carregado.'
  );

})();