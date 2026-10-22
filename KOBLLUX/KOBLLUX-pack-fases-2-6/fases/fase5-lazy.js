/* ═══════════════════════════════════════════════════════════════════════════
   KOB · FASE 5 · Lazy / code-splitting              ~1.8 KB min
   KOB.lazy.ensure(['tone','pdf']) → Promise · KOB.lazy.ready([...]) → bool
   Tone.js (≈341 KB, bloco text/plain #kob-tone-inline): nunca parseado até ser
   preciso. Ordem de carga: inline → arquivo local vendor/Tone.js → CDN.
   Overrides com {needs:['tone']} só executam depois que a lib chegou (Fase 2).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (W, D) {
  'use strict';
  var KOB = W.KOB; if (!KOB || !KOB.__hooks) { console.warn('[KOB fase5] precisa da fase 2'); return; }
  if (KOB.lazy) return;

  var reg = Object.create(null), pend = Object.create(null);
  function script(src) { return new Promise(function (ok, no) { var s = D.createElement('script'); s.src = src; s.async = true; s.onload = function () { ok(); }; s.onerror = function () { no(new Error('falhou ' + src)); }; D.head.appendChild(s); }); }
  function blobFrom(id) {
    var el = D.getElementById(id), code = el ? (el.textContent || '') : '';
    if (code.length < 1000) return Promise.reject(new Error('bloco vazio ' + id));
    var u = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
    return script(u).then(function () { try { URL.revokeObjectURL(u); } catch (e) {} });
  }
  function chain(steps) { return steps.reduce(function (p, f) { return p.catch(f); }, Promise.reject()); }

  KOB.lazy = {
    define: function (name, cfg) { reg[name] = cfg; },
    ready:  function (names) { return [].concat(names).every(function (n) { return reg[n] && reg[n].test(); }); },
    ensure: function (names) {
      return Promise.all([].concat(names).map(function (n) {
        var c = reg[n]; if (!c) return Promise.reject(new Error('lazy desconhecido: ' + n));
        if (c.test()) return Promise.resolve(true);
        return pend[n] || (pend[n] = c.load().then(function () { delete pend[n]; return c.test(); }, function (e) { delete pend[n]; console.warn('[KOB lazy]', n, e); return false; }));
      }));
    },
    /* pré-aquecimento por intenção (não por timer): hover/touch/focus no controle */
    warmOn: function (selector, names) {
      var done = false, go = function () { if (done) return; done = true; KOB.lazy.ensure(names); };
      ['pointerenter', 'touchstart', 'focusin'].forEach(function (ev) { D.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest(selector)) go(); }, { passive: true, capture: true }); });
    }
  };

  KOB.lazy.define('tone', {
    test: function () { return typeof W.Tone !== 'undefined' && !!W.Tone; },
    load: function () {
      return chain([function () { return blobFrom('kob-tone-inline'); },
                    function () { return script('vendor/Tone.js'); },
                    function () { return script('https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js'); }]);
    }
  });
  KOB.lazy.define('pdf', {
    test: function () { return !!W.pdfjsLib; },
    load: function () { return W.KOBLoadPDF ? W.KOBLoadPDF() : Promise.reject(new Error('KOBLoadPDF ausente')); }
  });
  KOB.lazy.define('voices', {            // lista de vozes do TTS chega assíncrona
    test: function () { return !('speechSynthesis' in W) || W.speechSynthesis.getVoices().length > 0; },
    load: function () { return new Promise(function (ok) { var s = W.speechSynthesis; if (!s) return ok(); var t = setTimeout(ok, 1500); s.addEventListener('voiceschanged', function () { clearTimeout(t); ok(); }, { once: true }); }); }
  });

  /* KOBLoadTone passa pela mesma fila (mantém a API que o monólito já usa) */
  var legacy = W.KOBLoadTone;
  W.KOBLoadTone = function () { return KOB.lazy.ensure('tone').then(function (r) { return r[0] ? W.Tone : (legacy ? legacy() : null); }); };

  /* aquecer só onde há intenção de som/leitura — e nunca em perf-lite / saveData */
  var lite = D.documentElement.classList.contains('kob-perf-lite') || (navigator.connection && navigator.connection.saveData);
  if (!lite) KOB.lazy.warmOn('#sonoroSection, #sonoroPlayBtn, #sbSpeak, #btn-play', ['tone']);
  KOB.lazy.warmOn('#ttsBtn, #ttsBtnTop, #sbSpeak, #btn-play', ['voices']);

  /* uso: KOB.override('meu.hook','arch:after',fn,{needs:['tone'],when:function(){return window.__somAtivo;}})
     → `when` é avaliado ANTES de `needs`: a lib só é baixada se o hook realmente for rodar. */
})(window, document);
