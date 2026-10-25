
/* ═══════════════════════════════════════════════════════════════════
   KOB-PERF v4.2 · camada de coalescing · 3 patches, zero mudança de comportamento
   Ordem de impacto: (1) CSS vars, (2) MutationObservers de arquétipo, (3) TTS restart
   Injetado no <head> — roda ANTES de qualquer script do app.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__kobPerf) return;
  var root = document.documentElement;

  /* ── PATCH 1: coalescing de setProperty(--kob-*) no :root ──────────
     applyVoiceTheme + updateArchetype + KobFlow escrevem 8–12 vars em
     sequência no documentElement → 8–12 style recalcs em cascata.
     Bufferizamos e aplicamos TUDO num único burst síncrono por frame. */
  var pending = null, rafId = 0;
  var origSetProp = CSSStyleDeclaration.prototype.setProperty;
  var origGetProp = CSSStyleDeclaration.prototype.getPropertyValue;
  var origGetComputed = window.getComputedStyle;

  function flushTheme() {
    rafId = 0;
    if (!pending) return;
    var p = pending; pending = null;
    for (var k in p) {
      if (Object.prototype.hasOwnProperty.call(p, k)) {
        try { origSetProp.call(root.style, k, p[k]); } catch (e) {}
      }
    }
  }

  CSSStyleDeclaration.prototype.setProperty = function (prop, val, prio) {
    if (this === root.style && typeof prop === 'string' &&
        prop.indexOf('--kob-') === 0 && !prio) {
      if (!pending) pending = {};
      pending[prop] = val;
      if (!rafId) rafId = requestAnimationFrame(flushTheme);
      return undefined;
    }
    return origSetProp.call(this, prop, val, prio);
  };

  CSSStyleDeclaration.prototype.getPropertyValue = function (prop) {
    if (this === root.style && pending &&
        Object.prototype.hasOwnProperty.call(pending, prop)) {
      return pending[prop];
    }
    return origGetProp.call(this, prop);
  };

  // Qualquer getComputedStyle força flush → leitura sempre vê valor fresco
  window.getComputedStyle = function (elt, pseudo) {
    if (pending && rafId) flushTheme();
    return origGetComputed.call(window, elt, pseudo);
  };

  window.__kobPerfFlushTheme = flushTheme;

  /* ── PATCH 2: coalescing de callbacks de MutationObserver ──────────
     7 observe() em atributos de arquétipo (data-arch, data-voice-arch,
     data-theme, data-art-voice-active) sobre body/root. Uma troca de
     arquétipo escreve 4 atributos → cada observer dispara 4x → cascata
     de kobEnterExternal/archMusicApply/schedule. Agrupamos cada callback
     desse tipo em 1 disparo por frame, com records acumulados. */
  var ARCH_ATTRS = {
    'data-arch': 1, 'data-voice-arch': 1, 'data-theme': 1,
    'data-art-voice-active': 1, 'data-art': 1
  };
  var OrigMO = window.MutationObserver;

  function isArchTarget(t) { return t === document.body || t === root; }
  function isArchFilter(f) {
    if (!f || !f.length) return false;
    for (var i = 0; i < f.length; i++) if (ARCH_ATTRS[f[i]]) return true;
    return false;
  }

  function PatchedMO(realCb) {
    var coalesced = false, pendingMuts = null, raf = 0, self = this;
    function fire() {
      raf = 0;
      var m = pendingMuts; pendingMuts = null;
      try { realCb(m, self); } catch (e) { /* callbacks originais já tratam */ }
    }
    function wrapped(muts) {
      if (!coalesced) { realCb(muts, self); return; }
      pendingMuts = (pendingMuts || []).concat(Array.prototype.slice.call(muts));
      if (!raf) raf = requestAnimationFrame(fire);
    }
    var obs = new OrigMO(wrapped);
    var origObserve = obs.observe.bind(obs);
    obs.observe = function (target, opts) {
      if (opts && opts.attributes && isArchTarget(target) &&
          isArchFilter(opts.attributeFilter)) {
        coalesced = true;
      }
      return origObserve(target, opts);
    };
    return obs;
  }
  PatchedMO.prototype = OrigMO.prototype;
  window.MutationObserver = PatchedMO;

  /* ── PATCH 3: restartFrom do TTS — espera silêncio REAL, não 120ms cego */
  function waitForSilence(cb, cap) {
    cap = cap || 450;
    var t0 = Date.now();
    (function tick() {
      var ss = window.speechSynthesis;
      if (!ss || !ss.speaking || Date.now() - t0 > cap) { cb(); return; }
      setTimeout(tick, 25);
    })();
  }
  function patchKOBArch() {
    var A = window.KOBArch;
    if (!A || A.__perfPatched || typeof A.restartFrom !== 'function') return;
    A.__perfPatched = true;
    A.restartFrom = function (charIndex, newArch) {
      if (newArch && typeof A.setVoice === 'function') {
        try { A.setVoice(newArch); } catch (e) {}
      }
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
      waitForSilence(function () {
        var holo = window.KOB_HOLO || window.KOBHolo;
        if (holo && typeof holo.speakFrom === 'function') {
          try { holo.speakFrom(charIndex || 0); } catch (e) {}
        }
      });
      return A;
    };
  }
  var tries = 0;
  var iv = setInterval(function () {
    if (window.KOBArch) { clearInterval(iv); patchKOBArch(); }
    else if (++tries > 120) clearInterval(iv); // 6s de teto
  }, 50);

  window.__kobPerf = {
    version: '4.2',
    themeCoalescing: true,
    mutationObserverCoalescing: true,
    ttsSafeRestart: true,
    flush: flushTheme
  };
})();

