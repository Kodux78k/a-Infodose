// ===== SCRIPT 1 / 2 =====

  (function KOB_BUS(global) {
    'use strict';

    const VERSION = 'KOB-BUS.v1.1.0';
    const CONFIG = {
      debug: false,
      maxText: 1200,
      minText: 2,
      debounce: 180,
      iframeSelector: 'iframe',
      targetOrigin: '*',
      ignoredTags: ['SCRIPT', 'STYLE', 'NOSCRIPT', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION']
    };

    const STATE = {
      started: false,
      frames: new Map(),
      documents: new WeakSet(),
      lastText: '',
      lastTime: 0,
      observer: null
    };

    function log(...args) {
      if (!CONFIG.debug) return;
      console.log('%c[KOB BUS]', 'color:#00ffff;font-weight:900', ...args);
    }

    function cleanText(text) {
      return String(text || '')
        .replace(/\u200B/g, '')
        .replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, CONFIG.maxText);
    }

    function ignored(el) {
      if (!el || el.nodeType !== 1) return true;
      if (CONFIG.ignoredTags.includes(el.tagName)) return true;
      if (el.closest?.('[data-kob-ignore],[data-tts-ignore],.kob-tts-ignore')) return true;
      return false;
    }

    function extractText(target) {
      if (!target) return '';
      let el = target;
      if (el.tagName === 'SVG' || el.tagName === 'PATH' || el.tagName === 'USE') {
        el = el.closest?.('button,a,[role="button"]') || el.parentElement;
      }
      const control = el.closest?.('button,input,textarea,select');
      if (control) {
        if (!control.hasAttribute('data-kob-tts')) return '';
        el = control;
      }
      if (ignored(el)) return '';

      let text = cleanText(
        el.innerText || el.textContent || el.getAttribute?.('aria-label') || el.getAttribute?.('title') || ''
      );

      if (text.length > CONFIG.maxText) {
        const candidates = ['article', 'section', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.card', '.v-glass', '[data-kob-content]'];
        for (const selector of candidates) {
          const parent = el.closest?.(selector);
          if (!parent) continue;
          const candidate = cleanText(parent.innerText || parent.textContent || '');
          if (candidate && candidate.length < text.length) text = candidate;
        }
      }
      return cleanText(text);
    }

    function getTTS() {
      if (global.CobTTS && typeof global.CobTTS.speak === 'function') return text => global.CobTTS.speak(text);
      const objects = [global.KOB_TTS, global.KOBTTS, global.COB_TTS, global.TTS, global.tts];
      for (const obj of objects) {
        if (!obj) continue;
        if (typeof obj.speak === 'function') return text => obj.speak(text);
        if (typeof obj.say === 'function') return text => obj.say(text);
        if (typeof obj.speakText === 'function') return text => obj.speakText(text);
      }
      const functions = ['kobSpeak', 'KOBSpeak', 'speakText', 'speak', 'ttsSpeak', 'speakTTS'];
      for (const name of functions) {
        if (typeof global[name] === 'function') return text => global[name](text);
      }
      if (global.speechSynthesis) {
        return text => {
          try {
            global.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'pt-BR';
            global.speechSynthesis.speak(u);
          } catch (err) {
            log('Speech fallback error', err);
          }
        };
      }
      return null;
    }

    function speak(text, meta = {}) {
      text = cleanText(text);
      if (text.length < CONFIG.minText) return false;
      const now = Date.now();
      if (text === STATE.lastText && now - STATE.lastTime < CONFIG.debounce) return false;
      STATE.lastText = text;
      STATE.lastTime = now;
      const tts = getTTS();
      if (!tts) {
        console.warn('[KOB BUS] KOB TTS não encontrado.');
        return false;
      }
      log('TTS', meta, text);
      try {
        tts(text);
        return true;
      } catch (err) {
        console.error('[KOB BUS] TTS error', err);
        return false;
      }
    }

    function frameId(iframe) {
      if (iframe.dataset.kobBusId) return iframe.dataset.kobBusId;
      const id = 'kob-frame-' + Math.random().toString(36).slice(2, 10);
      iframe.dataset.kobBusId = id;
      return id;
    }

    function getFrameOrigin(iframe) {
      try {
        return new URL(iframe.src || iframe.getAttribute('src') || location.href, location.href).origin;
      } catch (_) {
        return location.origin;
      }
    }

    function isSameOrigin(iframe) {
      try {
        return getFrameOrigin(iframe) === location.origin;
      } catch (_) {
        return false;
      }
    }

    function syncFrameTheme(iframe, theme) {
      const currentTheme = theme || document.documentElement.dataset.theme || 'night';
      if (isSameOrigin(iframe)) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc?.documentElement) {
            doc.documentElement.dataset.theme = currentTheme;
            if (doc.body) doc.body.dataset.mode = currentTheme;
          }
        } catch (_) {}
      }
      try {
        iframe.contentWindow?.postMessage(
          { type: 'KOB_THEME_CHANGE', theme: currentTheme, mode: currentTheme },
          CONFIG.targetOrigin
        );
      } catch (_) {}
    }

    function connectSameOrigin(iframe) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return false;
        syncFrameTheme(iframe);
        if (STATE.documents.has(doc)) return true;
        STATE.documents.add(doc);

        doc.addEventListener('click', event => {
          const text = extractText(event.target);
          if (!text) return;
          speak(text, { source: 'same-origin', iframe: frameId(iframe), url: iframe.src });
        }, true);

        log('SAME-ORIGIN conectado', iframe.src);
        return true;
      } catch (err) {
        log('Same-origin falhou', err);
        return false;
      }
    }

    function connectCrossOrigin(iframe) {
      const id = frameId(iframe);
      const origin = getFrameOrigin(iframe);
      const currentTheme = document.documentElement.dataset.theme || 'night';

      STATE.frames.set(id, { iframe, origin, crossOrigin: true });

      try {
        iframe.contentWindow.postMessage({
          type: 'KOB_BUS_INIT',
          bus: VERSION,
          frameId: id,
          parentOrigin: location.origin,
          theme: currentTheme
        }, CONFIG.targetOrigin);
      } catch (err) {
        log('postMessage INIT error', err);
      }
      log('CROSS-ORIGIN conectado', { id, origin });
    }

    function connectFrame(iframe) {
      if (!iframe) return;
      const id = frameId(iframe);
      if (!iframe.__kobBusLoad) {
        iframe.__kobBusLoad = true;
        iframe.addEventListener('load', () => {
          isSameOrigin(iframe) ? connectSameOrigin(iframe) : connectCrossOrigin(iframe);
        }, true);
      }
      isSameOrigin(iframe) ? connectSameOrigin(iframe) : connectCrossOrigin(iframe);
      log('FRAME', id, iframe.src);
    }

    function receiveMessage(event) {
      const data = event.data;
      if (!data || typeof data.type !== 'string') return;

      if (data.type === 'KOB_TTS') {
        const text = cleanText(data.text);
        if (!text) return;
        speak(text, {
          source: 'cross-origin',
          frameId: data.frameId || 'unknown',
          url: data.url || event.origin,
          origin: event.origin
        });
        return;
      }

      if (data.type === 'KOB_SET_THEME' && data.theme && global.DualTheme) {
        global.DualTheme.set(data.theme);
        return;
      }

      if (data.type === 'KOB_BUS_PING') {
        try {
          event.source?.postMessage({
            type: 'KOB_BUS_PONG',
            version: VERSION,
            parent: location.origin,
            theme: document.documentElement.dataset.theme || 'night'
          }, event.origin === 'null' ? '*' : event.origin);
        } catch (_) {}
      }
    }

    function scan() {
      const frames = document.querySelectorAll(CONFIG.iframeSelector);
      frames.forEach(connectFrame);
      log('frames:', frames.length);
    }

    function broadcastTheme(theme) {
      document.querySelectorAll(CONFIG.iframeSelector).forEach(iframe => {
        syncFrameTheme(iframe, theme);
      });
    }

    function observe() {
      if (!global.MutationObserver || STATE.observer) return;
      STATE.observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;
            if (node.matches?.('iframe')) connectFrame(node);
            node.querySelectorAll?.('iframe').forEach(connectFrame);
          }
        }
      });
      STATE.observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    function installParentClick() {
      document.addEventListener('click', event => {
        if (event.target?.closest?.('iframe')) return;
        const text = extractText(event.target);
        if (!text || global.KOB_TTS_IFRAME_BRIDGE) return;
        speak(text, { source: 'parent' });
      }, true);
    }

    const API = {
      version: VERSION,
      state: STATE,
      scan,
      connectFrame,
      broadcastTheme,
      speak,
      getTTS,
      config: CONFIG,
      debug(value) { CONFIG.debug = Boolean(value); }
    };

    global.KOBBus = API;
    global.KOB_BUS = API;

    function boot() {
      if (STATE.started) return;
      STATE.started = true;
      global.addEventListener('message', receiveMessage, false);
      installParentClick();
      scan();
      observe();
      setTimeout(scan, 500);
      setTimeout(scan, 1500);
      setTimeout(scan, 3500);
      log('BOOT OK', VERSION);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
  })(window);
  

// ===== SCRIPT 2 / 2 =====
(function(bundle, s='body') {
  const p = new DOMParser();
  const c = p.parseFromString(bundle, 'text/html');
  const t = document.querySelector(s) || document.body;

  Array.from(c.querySelectorAll('style')).forEach(style => {
    const n = document.createElement('style');
    n.textContent = style.textContent;
    document.head.appendChild(n);
  });

  const f = document.createDocumentFragment();
  Array.from(c.body.childNodes).forEach(node => {
    if (node.nodeName !== 'SCRIPT') {
      f.appendChild(document.importNode(node, true));
    }
  });
  t.appendChild(f);

  Array.from(c.querySelectorAll('script')).forEach(x => {
    const n = document.createElement('script');
    for (const a of x.attributes) n.setAttribute(a.name, a.value);
    n.textContent = x.textContent;
    document.body.appendChild(n);
  });
})(`<script>
/* ═══════════════════════════════════════════════════════
   DUAL MONOLITH · THEME (NIGHT / DAY / SUNSET) + HEADER
═══════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const ROOT = document.documentElement;
  const BODY = document.body;
  const HEADER = document.getElementById("main-header");
  const MAIN = document.getElementById("main-content");
  const THEME_DOT = document.getElementById("theme-dot");
  const META_COLOR = document.getElementById("metaThemeColor");

  /* ═══════════════════════════════════════════════════════
     THEME ENGINE · 3 MODOS (night → day → sunset)
  ═══════════════════════════════════════════════════════ */
  const STORAGE_KEY = "dual-theme";
  const DI_STORAGE_KEY = "di_themeMode"; // Padrão DI_
  const MODES = ["night", "day", "sunset"];

  const THEME_META = {
    night: {
      label: "Noite (Night)",
      metaColor: "#0b1020",
      emoji: "🌙",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
    },
    day: {
      label: "Dia (Day)",
      metaColor: "#d0e9ff",
      emoji: "☀️",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
    },
    sunset: {
      label: "Pôr do Sol (Sunset)",
      metaColor: "#fb923c",
      emoji: "🌅",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline></svg>'
    }
  };

  function normalizeTheme(theme) {
    if (theme === "light") return "day";
    if (theme === "dark") return "night";
    return MODES.includes(theme) ? theme : "night";
  }

  function applyTheme(theme) {
    const nextTheme = normalizeTheme(theme);
    const meta = THEME_META[nextTheme];

    // Sincroniza <html> e <body> (compatível com KxTsK e iFSw)
    ROOT.dataset.theme = nextTheme;
    if (BODY) BODY.dataset.mode = nextTheme;

    // Atualiza barra de status mobile
    if (META_COLOR) {
      META_COLOR.setAttribute("content", meta.metaColor);
    }

    // Atualiza ícone e tooltip da bolinha
    if (THEME_DOT) {
      THEME_DOT.innerHTML = meta.svg;
      THEME_DOT.setAttribute("title", "Tema: " + meta.label + " (toque para alternar)");
      THEME_DOT.setAttribute("aria-label", "Tema atual: " + meta.label);
    }

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
      localStorage.setItem(DI_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.warn("DUAL Theme · localStorage indisponível");
    }

    // Propaga tema para iframes conectados via KOB BUS
    if (window.KOBBus && typeof window.KOBBus.broadcastTheme === "function") {
      window.KOBBus.broadcastTheme(nextTheme);
    }

    // Evento global para módulos internos e externos
    window.dispatchEvent(
      new CustomEvent("dual:theme-change", {
        detail: {
          theme: nextTheme,
          mode: nextTheme,
          meta
        }
      })
    );
  }

  function getInitialTheme() {
    try {
      const saved =
        localStorage.getItem(DI_STORAGE_KEY) ||
        localStorage.getItem(STORAGE_KEY);
      if (saved) return normalizeTheme(saved);
    } catch (error) {}
    return "night";
  }

  /* ═══════════════════════════════════════════════════════
     API GLOBAL
  ═══════════════════════════════════════════════════════ */
  window.DualTheme = {
    modes: MODES,
    set(theme) {
      applyTheme(theme);
    },
    toggle() {
      const current = normalizeTheme(ROOT.dataset.theme);
      const nextIndex = (MODES.indexOf(current) + 1) % MODES.length;
      applyTheme(MODES[nextIndex]);
    },
    get() {
      return normalizeTheme(ROOT.dataset.theme);
    }
  };

  /* ═══════════════════════════════════════════════════════
     BOLINHA DE TEMA
  ═══════════════════════════════════════════════════════ */
  if (THEME_DOT) {
    THEME_DOT.addEventListener("click", event => {
      event.stopPropagation();
      DualTheme.toggle();
    });
  }

  /* ═══════════════════════════════════════════════════════
     HEADER → COLLAPSE DO MAIN
  ═══════════════════════════════════════════════════════ */
  if (HEADER && MAIN) {
    HEADER.addEventListener("click", event => {
      if (event.target.closest("#theme-dot, #theme-dot2, .top-actions, .uni-actions, .navbar")) {
        return;
      }
      MAIN.classList.toggle("hidden");
      const collapsed = MAIN.classList.contains("hidden");
      HEADER.classList.toggle("is-collapsed", collapsed);

      window.dispatchEvent(
        new CustomEvent("dual:content-collapse", {
          detail: { collapsed }
        })
      );
    });
  }

  /* ═══════════════════════════════════════════════════════
     SMART HEADER (SCROLL DOWN → ESCONDE | SCROLL UP → MOSTRA)
  ═══════════════════════════════════════════════════════ */
  let lastScrollY = window.scrollY;
  let ticking = false;
  const SCROLL_THRESHOLD = 8;

  function updateHeader() {
    if (!HEADER) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 10) {
      HEADER.classList.remove("header-hidden");
      HEADER.classList.add("header-visible");
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }
    if (currentScrollY > lastScrollY + SCROLL_THRESHOLD) {
      HEADER.classList.remove("header-visible");
      HEADER.classList.add("header-hidden");
    } else if (currentScrollY < lastScrollY - SCROLL_THRESHOLD) {
      HEADER.classList.remove("header-hidden");
      HEADER.classList.add("header-visible");
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ═══════════════════════════════════════════════════════
     INICIALIZAÇÃO
  ═══════════════════════════════════════════════════════ */
  applyTheme(getInitialTheme());
  console.log("DUAL · GLOBAL SYSTEM READY [NIGHT · DAY · SUNSET]");
})();
<\/script>

<!-- PONTE DE TEMA (garante sincronia com botões externos) -->
<script>
  (function () {
    var canonBtn = document.getElementById('theme-dot');
    var themeToggleBtn = document.getElementById('themeToggle');
    if (!canonBtn) return;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.theme-dot');
      if (trigger && trigger !== canonBtn) canonBtn.click();
    });

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function () {
        canonBtn.click();
      });

      var icons = { night: '🌙', day: '☀️', sunset: '🌅' };
      var syncIcon = function () {
        var t = document.documentElement.getAttribute('data-theme') || 'night';
        themeToggleBtn.textContent = icons[t] || '🌙';
      };

      syncIcon();
      new MutationObserver(syncIcon).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }
  })();
<\/script>`);