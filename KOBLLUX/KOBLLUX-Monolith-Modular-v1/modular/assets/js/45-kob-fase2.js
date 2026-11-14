
/* ═══════════════════════════════════════════════════════════════════════════
   KOB · FASE 2 · Motor de override (hooks)           ~2.5 KB min · vanilla
   Substitui "patch de patch" por pontos de extensão com id, ordem e kill-switch.
   Instalar: tag script com id kob-fase2 no FIM do body (depois do glass-pref) — ou use assemble.py.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (W) {
  'use strict';
  if (W.KOB && W.KOB.__hooks) return;            // idempotente
  var KOB = W.KOB = W.KOB || {};
  KOB.__hooks = 1;

  /* ── persistência do kill-switch ─────────────────────────────────────── */
  var OFF_KEY = 'kob:ovr:off', off = {};
  try { (JSON.parse(localStorage.getItem(OFF_KEY) || '[]')).forEach(function (i) { off[i] = 1; }); } catch (e) {}
  function saveOff() { try { localStorage.setItem(OFF_KEY, JSON.stringify(Object.keys(off))); } catch (e) {} }

  /* safe mode: ?safe=1  ou  localStorage kob:safe=1  → só overrides {core:true} rodam */
  KOB.safe = /[?&]safe=1\b/.test(location.search) || (function () { try { return localStorage.getItem('kob:safe') === '1'; } catch (e) { return false; } })();

  /* ── registry ────────────────────────────────────────────────────────── */
  KOB.hooks = KOB.hooks || {};
  KOB.override = function (id, point, fn, o) {
    o = o || {};
    var list = KOB.hooks[point] || (KOB.hooks[point] = []);
    for (var i = list.length; i--;) if (list[i].id === id) list.splice(i, 1);   // re-registro substitui
    list.push({ id: id, point: point, fn: fn, core: !!o.core, prio: o.prio || 0,
                when: o.when || null, needs: o.needs || null, once: !!o.once, runs: 0, errors: 0 });
    list.sort(function (a, b) { return a.prio - b.prio; });
    return id;
  };
  KOB.enable  = function (id, on) { if (on === false) off[id] = 1; else delete off[id]; saveOff(); };
  KOB.isOn    = function (h) { return !off[h.id] && (!KOB.safe || h.core); };
  KOB.list    = function () { var r = []; Object.keys(KOB.hooks).forEach(function (p) { KOB.hooks[p].forEach(function (h) { r.push({ id: h.id, point: p, on: KOB.isOn(h), runs: h.runs, errors: h.errors, prio: h.prio, core: h.core }); }); }); return r; };

  function call(h, acc, args) {
    try { h.runs++; var r = h.fn.apply(null, [acc].concat(args)); return r === undefined ? acc : r; }
    catch (e) { h.errors++; console.warn('[KOB hook:' + h.id + ']', e); return acc; }   // um hook nunca derruba o core
  }
  KOB.run = function (point, ctx) {
    var args = Array.prototype.slice.call(arguments, 2), list = KOB.hooks[point];
    if (!list || !list.length) return ctx;
    var snap = list.slice(), acc = ctx;
    for (var i = 0; i < snap.length; i++) {
      var h = snap[i];
      if (!KOB.isOn(h)) continue;
      if (h.when) { try { if (!h.when(acc)) continue; } catch (e) { continue; } }
      if (h.needs && KOB.lazy && !KOB.lazy.ready(h.needs)) {            // peso só sob demanda (Fase 5)
        (function (hh, a) { KOB.lazy.ensure(hh.needs).then(function () { call(hh, a, args); }); })(h, acc);
        continue;
      }
      acc = call(h, acc, args);
      if (h.once) { var ix = list.indexOf(h); if (ix > -1) list.splice(ix, 1); }
    }
    return acc;
  };

  /* ── hookFn: torna qualquer função de objeto em ponto de extensão ───────
     KOB.hookFn(obj,'createSession','session:create', {args:['name','opts']})
     before recebe ctx {args:[...]} e pode alterar ctx.args ou setar ctx.cancel=true
     after  recebe ctx {args, result}                                          */
  KOB.hookFn = function (obj, key, point, o) {
    o = o || {};
    var orig = obj && obj[key];
    if (typeof orig !== 'function' || orig.__kobHooked) return false;
    var w = function () {
      var ctx = KOB.run(point + ':before', { args: Array.prototype.slice.call(arguments), self: this });
      if (ctx.cancel) return ctx.result;
      var res = orig.apply(this, ctx.args);
      if (res && typeof res.then === 'function') {
        return res.then(function (r) { ctx.result = r; KOB.run(point + ':after', ctx); return ctx.result; });
      }
      ctx.result = res; KOB.run(point + ':after', ctx); return ctx.result;
    };
    w.__kobHooked = true; w.__original = orig;
    for (var k in orig) { try { w[k] = orig[k]; } catch (e) {} }
    obj[key] = w; return true;
  };

  /* ═══ CORE: applyArch canônico ═══════════════════════════════════════════
     Pega o applyArch ATUAL (já com o wrapper do Profile) como núcleo e o
     envolve UMA vez. A partir daqui ninguém mais envelopa: registra hook.   */
  function installArch() {
    var core = W.applyArch;
    if (typeof core !== 'function' || core.__kobHooked) return false;
    var busy = null;
    var hooked = function (name, origin) {
      var key = String(name || '').toUpperCase();
      if (busy === key) return;                         // reentrância (A→B→A)
      var prev = busy; busy = key;
      try {
        var ctx = KOB.run('arch:before', { name: name, origin: origin, key: key });
        if (ctx.cancel) return;
        var sawEvt = false, probe = function () { sawEvt = true; };
        W.addEventListener('kob:arch', probe);
        var r;
        try { r = core.call(this, ctx.name, ctx.origin); } finally { W.removeEventListener('kob:arch', probe); }
        ctx.sawEvent = sawEvt;
        KOB.run('arch:after', ctx);
        return r;
      } finally { busy = prev; }
    };
    hooked.__kobHooked = true; hooked.__original = core; hooked.__kobProfileWrapped = true; hooked.__canonicalWrapped = true;
    W.applyArch = hooked;
    return true;
  }
  KOB.installArch = installArch;

  /* overrides que substituem os patches antigos ───────────────────────── */
  // 1) voz ↔ rótulo sempre sincronizados (era o "canônico" por envelope)
  KOB.override('arch.sync-voice', 'arch:after', function (ctx) {
    var A = W.KOBArch, k = ctx.key;
    if (A && A.voice !== k && A.setVoice) A.setVoice(k);
    return ctx;
  }, { core: true, prio: 10 });
  // 2) evento kob:arch garantido (1x) mesmo se o core não disparou
  KOB.override('arch.event', 'arch:after', function (ctx) {
    if (!ctx.sawEvent) W.dispatchEvent(new CustomEvent('kob:arch', { detail: { arch: ctx.key, origin: 'hooks' } }));
    return ctx;
  }, { core: true, prio: 20 });
  // 3) normaliza nome inválido antes do core (JESUS é o fallback do core; aqui só uppercase)
  KOB.override('arch.normalize', 'arch:before', function (ctx) {
    if (typeof ctx.name === 'string') ctx.name = ctx.name.toUpperCase();
    return ctx;
  }, { core: true, prio: -10 });

  /* updateInterface defensivo (só se estiver exposto em window; nos closures do
     monólito ele não é alcançável → ver README) */
  KOB.override('ui.defensive', 'ui:before', function (ctx) {
    if (typeof ctx.args[0] !== 'string' || !ctx.args[0]) ctx.args[0] = 'Convidado';
    return ctx;
  }, { core: true });

  /* glass-pref vira módulo da Fase 3 (KOBGlass já expõe get/set); aqui só o hook */
  KOB.override('glass.repaint', 'boot:mount', function (ctx) {
    try { W.KOBGlass && W.KOBGlass.set(W.KOBGlass.get(), false); } catch (e) {} return ctx;
  }, { prio: 50 });

  /* pontos de extensão sobre APIs existentes */
  KOB.attachSession = function () { return W.MXP && KOB.hookFn(W.MXP, 'createSession', 'session:create'); };
  KOB.attachTTS     = function () { return W.KBLX_VOICE && KOB.hookFn(W.KBLX_VOICE, 'forArch', 'tts:voice'); };
  KOB.attachUI      = function () { return KOB.hookFn(W, 'updateInterface', 'ui'); };

  /* instalação imediata (esta tag roda por último no body) */
  installArch(); KOB.attachSession(); KOB.attachTTS(); KOB.attachUI();
  KOB.run('boot:mount', {});
})(window);

