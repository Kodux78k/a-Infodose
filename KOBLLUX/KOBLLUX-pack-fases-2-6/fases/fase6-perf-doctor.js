/* ═══════════════════════════════════════════════════════════════════════════
   KOB · FASE 6 · Performance + diagnóstico                    ~2.4 KB min
   KOB.perf.report()      → tempos de boot, long tasks, nº de nós/estilos/scripts
   KOB.perf.cssCoverage() → regras CSS sem match no DOM atual, por <style> (alvo da poda)
   KOB.perf.archRules()   → regras que dependem de [data-arch]/[data-voice-arch] (candidatas a virar variáveis)
   KOB.perf.deferStyles() → ativa <style data-kob-defer media="not all"> no 1º gesto/idle
   KOB.doctor()           → hooks, módulos, store, lazy, safe-mode numa tabela
   Sem MutationObserver, sem polling. PerformanceObserver só registra long tasks.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (W, D) {
  'use strict';
  var KOB = W.KOB; if (!KOB || !KOB.__hooks) { console.warn('[KOB fase6] precisa da fase 2'); return; }
  if (KOB.perf) return;
  var root = D.documentElement, lt = { n: 0, ms: 0, max: 0 };

  try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { lt.n++; lt.ms += e.duration; if (e.duration > lt.max) lt.max = e.duration; }); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}

  /* CSS cirúrgico: só o que é seguro por padrão. Desligar: <html data-kob-cv="off"> */
  var st = D.createElement('style'); st.id = 'kob-perf-css-v2';
  st.textContent =
    'html:not([data-kob-cv="off"]) details.section:not([open]){content-visibility:auto;contain-intrinsic-size:auto 120px}' +
    'html.kob-frozen *,html.kob-frozen *::before,html.kob-frozen *::after{animation-play-state:paused!important}' +
    '@media (prefers-reduced-motion:reduce){html.kob-perf-lite .kob-orb-anim{animation:none!important}}';
  D.head.appendChild(st);

  function simple(sel) { return sel.replace(/::?[a-z-]+(\([^)]*\))?/gi, '').trim() || '*'; }   // tira pseudo p/ testar match
  function sheets() { var r = []; for (var i = 0; i < D.styleSheets.length; i++) { var s = D.styleSheets[i], o = s.ownerNode, rules; try { rules = s.cssRules; } catch (e) { continue; } r.push({ i: i, id: (o && (o.id || o.getAttribute('data-name'))) || '', rules: rules }); } return r; }

  KOB.perf = {
    report: function () {
      var nav = performance.getEntriesByType('navigation')[0] || {}, fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime;
      var o = { 'HTML (KB)': Math.round((D.documentElement.outerHTML.length) / 1024), 'DOM nodes': D.getElementsByTagName('*').length,
        '<style>': D.querySelectorAll('style').length, '<script>': D.querySelectorAll('script').length,
        'iframes': D.querySelectorAll('iframe').length, 'DCL (ms)': Math.round(nav.domContentLoadedEventEnd || 0), 'load (ms)': Math.round(nav.loadEventEnd || 0),
        'FCP (ms)': fcp ? Math.round(fcp) : 'n/d', 'long tasks': lt.n, 'long tasks total (ms)': Math.round(lt.ms), 'maior (ms)': Math.round(lt.max),
        'perf-lite': root.classList.contains('kob-perf-lite') };
      console.table(o); return o;
    },
    cssCoverage: function () {
      var out = [];
      sheets().forEach(function (s) {
        var total = 0, unused = 0;
        (function walk(rules) { for (var k = 0; k < rules.length; k++) { var r = rules[k];
          if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; }
          if (!r.selectorText) continue; total++;
          var hit = false; try { hit = r.selectorText.split(',').some(function (x) { try { return !!D.querySelector(simple(x)); } catch (e) { return true; } }); } catch (e) { hit = true; }
          if (!hit) unused++; } })(s.rules);
        out.push({ sheet: s.i, id: s.id, regras: total, 'sem match': unused, '% morto': total ? Math.round(100 * unused / total) : 0 });
      });
      console.table(out); return out;
    },
    archRules: function () {
      var by = {}, n = 0;
      sheets().forEach(function (s) { (function walk(rules) { for (var k = 0; k < rules.length; k++) { var r = rules[k];
        if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; }
        var m = r.selectorText && r.selectorText.match(/\[data-(?:voice-)?arch=["']?([A-Za-z0-9_-]+)/g);
        if (m) { n++; m.forEach(function (x) { var a = x.split('=')[1].replace(/["']/g, '').toUpperCase(); (by[a] = by[a] || []).push('sheet ' + s.i + ': ' + r.selectorText.slice(0, 80)); }); } } })(s.rules); });
      console.log('regras dependentes de arquétipo:', n); console.table(Object.keys(by).map(function (a) { return { arch: a, regras: by[a].length }; })); return by;
    },
    deferStyles: function () {
      var go = function () { D.querySelectorAll('style[data-kob-defer]').forEach(function (s) { s.media = 'all'; s.removeAttribute('data-kob-defer'); }); };
      var once = function () { go(); ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) { W.removeEventListener(e, once, true); }); };
      ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) { W.addEventListener(e, once, { capture: true, passive: true }); });
      (W.requestIdleCallback || function (f) { setTimeout(f, 2500); })(once, { timeout: 4000 });
    },
    contain: function (selector, on) {                 // opt-in: KOB.perf.contain('.session-window', true) — teste em dispositivo antes de fixar
      var id = 'kob-contain-' + selector.replace(/[^a-z0-9]/gi, ''), el = D.getElementById(id);
      if (on === false) { if (el) el.remove(); return; }
      if (!el) { el = D.createElement('style'); el.id = id; el.textContent = selector + '{contain:layout style}'; D.head.appendChild(el); }
    }
  };
  if (D.querySelector('style[data-kob-defer]')) KOB.perf.deferStyles();

  KOB.setSafe = function (on) { try { localStorage.setItem('kob:safe', on ? '1' : '0'); } catch (e) {} location.reload(); };
  KOB.doctor = function () {
    console.log('%cKOB doctor', 'font-weight:bold', { safe: KOB.safe, booted: !!KOB.booted });
    console.table(KOB.list()); if (KOB.modules) console.table(KOB.modules());
    if (KOB.store) console.log('store', KOB.store.snapshot());
    if (KOB.lazy) console.log('lazy', { tone: KOB.lazy.ready('tone'), pdf: KOB.lazy.ready('pdf'), voices: KOB.lazy.ready('voices') });
    return { hooks: KOB.list().length, modules: KOB.modules ? KOB.modules().length : 0 };
  };
  root.setAttribute('data-kob-v', '2');
})(window, document);
