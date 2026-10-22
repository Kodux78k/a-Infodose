/* ═══════════════════════════════════════════════════════════════════════════
   KOB · FASE 3 · Manifesto de boot + store único            ~2.2 KB min
   Fases: boot → register → init → mount → hydrate. Deps resolvidas (topo-sort).
   Módulos legados entram como ADAPTADORES (não reescreve IIFEs; só ordena,
   liga/desliga e deixa de depender de "roda por último").
   Requer fase2-hooks.js antes.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (W) {
  'use strict';
  var KOB = W.KOB; if (!KOB || !KOB.__hooks) { console.warn('[KOB fase3] precisa da fase 2'); return; }
  if (KOB.__boot) return; KOB.__boot = 1;

  /* ── store único (Map + subscribe) ───────────────────────────────────── */
  var data = new Map(), subs = new Map(), any = [];
  KOB.store = {
    get: function (k, d) { return data.has(k) ? data.get(k) : d; },
    set: function (k, v, meta) {
      var old = data.get(k); if (old === v) return v;
      data.set(k, v);
      (subs.get(k) || []).slice().forEach(function (f) { try { f(v, old, meta); } catch (e) { console.warn('[KOB store]', k, e); } });
      any.slice().forEach(function (f) { try { f(k, v, old, meta); } catch (e) {} });
      return v;
    },
    on: function (k, f) { var l = subs.get(k) || []; l.push(f); subs.set(k, l); return function () { subs.set(k, (subs.get(k) || []).filter(function (x) { return x !== f; })); }; },
    onAny: function (f) { any.push(f); return function () { any = any.filter(function (x) { return x !== f; }); }; },
    snapshot: function () { var o = {}; data.forEach(function (v, k) { o[k] = v; }); return o; }
  };

  /* ── registro de módulos ─────────────────────────────────────────────── */
  var MODS = Object.create(null), MOFF = {}, PHASES = ['init', 'mount', 'hydrate'];
  try { JSON.parse(localStorage.getItem('kob:mod:off') || '[]').forEach(function (n) { MOFF[n] = 1; }); } catch (e) {}
  KOB.register = function (m) {
    if (!m || !m.name) throw new Error('KOB.register: name obrigatório');
    MODS[m.name] = { name: m.name, deps: m.deps || [], init: m.init, mount: m.mount, hydrate: m.hydrate,
                     lazy: m.lazy || null, core: !!m.core, state: 'registered', ms: 0 };
    return m.name;
  };
  KOB.module = function (n, on) { if (on === false) MOFF[n] = 1; else delete MOFF[n]; try { localStorage.setItem('kob:mod:off', JSON.stringify(Object.keys(MOFF))); } catch (e) {} };
  KOB.modules = function () { return Object.keys(MODS).map(function (n) { var m = MODS[n]; return { name: n, deps: m.deps.join(','), state: m.state, ms: +m.ms.toFixed(1) }; }); };

  function order() {                                   // topo-sort com detecção de ciclo
    var out = [], mark = {};
    function visit(n, path) {
      if (mark[n] === 2) return;
      if (mark[n] === 1) throw new Error('ciclo de deps: ' + path.concat(n).join(' → '));
      var m = MODS[n]; if (!m) { console.warn('[KOB] dep ausente:', n, 'em', path.join('>')); return; }
      mark[n] = 1; m.deps.forEach(function (d) { visit(d, path.concat(n)); }); mark[n] = 2; out.push(m);
    }
    Object.keys(MODS).forEach(function (n) { visit(n, []); });
    return out;
  }
  function disabled(m) { return (MOFF[m.name] || KOB.safe) && !m.core; }
  function step(m, phase) {
    if (!m[phase] || m.state === 'off' || m.state === 'failed') return;
    var t = performance.now();
    try { m[phase](KOB); m.state = phase; } catch (e) { m.state = 'failed'; console.warn('[KOB mod:' + m.name + ':' + phase + ']', e); }
    m.ms += performance.now() - t;
  }
  KOB.boot = function () {
    if (KOB.booted) return; KOB.booted = 1;
    var seq; try { seq = order(); } catch (e) { console.error('[KOB boot]', e); return; }
    seq.forEach(function (m) { if (disabled(m)) m.state = 'off'; else if (m.deps.some(function (d) { return MODS[d] && (MODS[d].state === 'off' || MODS[d].state === 'failed'); })) m.state = 'off'; });
    KOB.run('boot:init', {});
    seq.forEach(function (m) { step(m, 'init'); });
    KOB.run('boot:mount', {});
    seq.forEach(function (m) { step(m, 'mount'); });
    var h = function () { seq.forEach(function (m) { step(m, 'hydrate'); }); KOB.run('boot:hydrate', {}); document.documentElement.setAttribute('data-kob-booted', '1'); };
    (document.readyState === 'complete') ? h() : W.addEventListener('load', h, { once: true });
  };

  /* ═══ ADAPTADORES dos módulos legados (ordem explícita, desligáveis) ════ */
  KOB.register({ name: 'perf',     core: true, init: function () { /* kob-perf já roda inline no <head> */ } });
  KOB.register({ name: 'arch',     core: true, deps: ['perf'],  init: function () { KOB.installArch(); } });
  KOB.register({ name: 'mxp',      deps: ['perf'],             init: function () { KOB.attachSession(); } });
  KOB.register({ name: 'tabstore', deps: ['mxp'],              init: function () { if (!W.TabStore) console.info('[KOB] TabStore ausente'); } });
  KOB.register({ name: 'voice',    deps: ['arch'],             init: function () { KOB.attachTTS(); } });
  KOB.register({ name: 'glass',    deps: ['perf'],             mount: function () { if (W.KOBGlass) W.KOBGlass.set(W.KOBGlass.get(), false); } });
  KOB.register({ name: 'ui',       deps: ['arch'],             init: function () { KOB.attachUI(); } });

  /* ═══ STORE ⇄ legado: um só lugar para ler/escrever arquétipo ═══════════
     escrever:  KOB.store.set('arch', 'NOVA')   → chama window.applyArch (único escritor)
     ler:       KOB.store.get('arch')           ← alimentado por kob:arch e KOBArch  */
  KOB.register({ name: 'store-bridge', deps: ['arch'], init: function () {
    var feeding = false;
    var cur = (W.getArch && W.getArch()) || 'KOBLLUX';
    data.set('arch', cur);
    data.set('arch.voice', W.KOBArch ? W.KOBArch.voice : cur);
    data.set('arch.music', W.KOBArch ? W.KOBArch.music : cur);
    data.set('perf.lite', document.documentElement.classList.contains('kob-perf-lite'));
    W.addEventListener('kob:arch', function (e) {
      var a = e && e.detail && e.detail.arch; if (!a) return;
      feeding = true; KOB.store.set('arch', String(a).toUpperCase(), 'event'); feeding = false;
    });
    if (W.KOBArch && W.KOBArch.subscribe) W.KOBArch.subscribe(function (ev) { KOB.store.set('arch.' + ev.type, ev.current, 'KOBArch'); });
    KOB.store.on('arch', function (v, o, meta) { if (!feeding && meta !== 'event' && typeof W.applyArch === 'function') W.applyArch(v); });
    KOB.store.on('perf.lite', function (v) { document.documentElement.classList.toggle('kob-perf-lite', !!v); try { localStorage.setItem('kob:perf:lite', v ? '1' : '0'); } catch (e) {} });
  } });

  KOB.boot();
})(window);
