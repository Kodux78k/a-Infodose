
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
  