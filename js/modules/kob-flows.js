/* KobFlow · orquestração de comportamento (cores em cadeia · voz em etapas · idle/carga)
   Não substitui nada: observa o que já existe e muda o RITMO.
   Ciclo 3-6-9-12 (+1 de memória = 13): cada etapa dura k × unit (k = 3,6,9,12).
   API: KobFlow.config · .status() · .retarget() · .disable()/.enable() · .setUnit(ms)
   Desligar: localStorage.kob_flow='off' ou ?flow=off */
(function (w, d) {
  'use strict';
  if (w.KobFlow) return;
  try { if (/[?&]flow=off/.test(location.search) || localStorage.getItem('kob_flow') === 'off') return; } catch (e) {}

  var CFG = {
    unit: 700,                       /* ms por "1" do ciclo: etapas = 3u, 6u, 9u, 12u */
    mult: { btn: 3, hud: 6, blob: 9, root: 12 },
    order: ['btn', 'hud', 'blob', 'root'],   /* prioridade: botões → hud → blobs → resto */
    fps: 15,                         /* passos/s da transição (barato e suave p/ cor lenta) */
    voiceWindows: { rate: 3, pitch: 6, voice: 9 },   /* em unidades: rate→pitch→voz */
    voiceBlend: true,
    idleUnit: 10000,                 /* idle: 30s/60s/90s/120s */
    playUnit: 5000,                  /* música tocando: 15s/30s/45s/60s */
    tickMs: 2000
  };
  var VARS = { kp: '--kob-voice-primary', ks: '--kob-voice-secondary',
               bp: '--bllue-voice-primary', bs: '--bllue-voice-secondary',
               ac: '--active-color', as: '--active-secondary', ag: '--active-glow' };
  var KEYS = Object.keys(VARS);
  var root = d.documentElement;
  var reduce = false;
  try { reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var enabled = true, booted = false;

  /* ---------------------------------------------------------------- cor */
  var probe = null;
  function ensureProbe() {
    if (probe || !d.body) return;
    probe = d.createElement('i');
    probe.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden;pointer-events:none';
    d.body.appendChild(probe);
  }
  function parse(str) {
    if (!str) return null; ensureProbe(); if (!probe) return null;
    probe.style.color = ''; probe.style.color = String(str).trim();
    if (!probe.style.color) return null;
    var m = getComputedStyle(probe).color.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    var p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  function fmt(c) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (Math.round(c[3] * 1000) / 1000) + ')'; }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t]; }
  function dist(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3]) * 255; }
  function ease(p) { return p * p * p * (p * (p * 6 - 15) + 10); }   /* smootherstep */
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* ----------------------------------------------- estilos: escopo por etapa */
  var sheetEl = null;
  function splitSel(t) {
    var out = [], depth = 0, cur = '', q = '';
    for (var i = 0; i < t.length; i++) {
      var ch = t[i];
      if (q) { cur += ch; if (ch === q && t[i - 1] !== '\\') q = ''; continue; }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      if (ch === '(' || ch === '[') depth++;
      if (ch === ')' || ch === ']') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  var RE_BLOB = /ambient|blob|orb\b|orb-|nebula|theme-(layer|grad|grid)|chroma|aurora|\bbg-|glow-layer/i;
  var RE_BTN = /button|\.btn|\bbtn|pill|chip|toggle|\.dot|input|select|symbol-wrap|\.tab\b|tab-card|action|icon/i;
  var RE_HUD = /hud|header|topbar|symbol-bar|\.sb|holo|status|badge|title|label|win|card|footer|nav|bar\b|menu|panel|drawer/i;
  function classify(sel) { return RE_BLOB.test(sel) ? 'blob' : RE_BTN.test(sel) ? 'btn' : RE_HUD.test(sel) ? 'hud' : null; }
  var USES = new RegExp('var\\(\\s*(' + KEYS.map(function (k) { return VARS[k]; }).join('|') + ')');
  var DEFS = new RegExp('(^|[;{\\s])(' + KEYS.map(function (k) { return VARS[k]; }).join('|') + ')\\s*:');

  function walkRules(list, ctx, fn) {
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      if (r.type === 1) fn(r, ctx);
      else if ((r.type === 4 || r.type === 12) && r.cssRules) walkRules(r.cssRules, (ctx ? ctx + '|' : '') + (r.type === 4 ? '@media ' + r.conditionText : '@supports ' + r.conditionText), fn);
    }
  }
  var ruleCache = null;
  function eachRule(fn) {   /* varre o CSS UMA vez; stage-sheet e degradê reutilizam a lista */
    if (!ruleCache) {
      ruleCache = [];
      for (var s = 0; s < d.styleSheets.length; s++) {
        var sh = d.styleSheets[s]; if (sh.ownerNode && /^kob-flow-/.test(sh.ownerNode.id || '')) continue;
        var rules; try { rules = sh.cssRules; } catch (e) { continue; }
        if (rules) walkRules(rules, '', function (r, ctx) { ruleCache.push([r, ctx]); });
      }
    }
    for (var i = 0; i < ruleCache.length; i++) fn(ruleCache[i][0], ruleCache[i][1]);
  }
  function wrapCtx(ctx, body) {
    if (!ctx) return body;
    return ctx.split('|').reduceRight(function (acc, c) { return c + '{' + acc + '}'; }, body);
  }
  function buildStageSheet(have) {
    var buckets = {};   /* ctx -> {btn:[],hud:[],blob:[]} */
    var total = 0;
    eachRule(function (r, ctx) {
      var txt = r.style && r.style.cssText; if (!txt || !USES.test(txt) || DEFS.test(txt)) return;
      splitSel(r.selectorText).forEach(function (sel) {
        if (/^(html|:root|body)/i.test(sel) && !/[\s>+~]/.test(sel.replace(/^(html|:root|body)/i, ''))) return;   /* só raiz: fica na etapa root */
        var st = classify(sel); if (!st) return;
        var b = buckets[ctx] || (buckets[ctx] = { btn: [], hud: [], blob: [] });
        b[st].push(sel); total++; if (!ctx) stageSel[st].push(sel);
      });
    });
    var css = '';
    Object.keys(buckets).forEach(function (ctx) {
      ['btn', 'hud', 'blob'].forEach(function (st) {
        var sels = buckets[ctx][st]; if (!sels.length) return;
        var decl = KEYS.filter(function (k) { return have[k]; }).map(function (k) { return VARS[k] + ':var(--flow-' + st + '-' + k + ')'; }).join(';');
        css += wrapCtx(ctx, sels.join(',') + '{' + decl + '}') + '\n';
      });
    });
    /* resto do app: html/body herdam a etapa "root" (!important vence os blocos [data-arch]) */
    var rdecl = KEYS.filter(function (k) { return have[k]; }).map(function (k) { return VARS[k] + ':var(--flow-root-' + k + ')!important'; }).join(';');
    css += 'html,body{' + rdecl + '}\n';
    return { css: css, selectors: total };
  }

  /* ------------------------------------------------- cores em cadeia (3-6-9-12) */
  var have = {};              /* quais vars existem */
  var cur = {}, tgt = {}, raw = {};   /* cur[stage][k]=rgba · tgt[k]=rgba */
  var run = null;             /* {st,t0,dur,from:{k:rgba}} */
  var pending = [];           /* etapas aguardando, na ordem de prioridade */
  var raf = 0, lastTs = 0;
  var stats = { retargets: 0, steps: 0, selectors: 0, skipped: 0 };
  var stageSel = { btn: [], hud: [], blob: [] };   /* seletores (sem @media) p/ saber se a etapa tem elementos */

  function readNatural() {
    if (sheetEl) sheetEl.disabled = true;
    var cs = getComputedStyle(d.body), out = {};
    KEYS.forEach(function (k) { out[k] = cs.getPropertyValue(VARS[k]).trim(); });
    if (sheetEl) sheetEl.disabled = false;
    return out;
  }
  function writeStage(st, k, c) { root.style.setProperty('--flow-' + st + '-' + k, typeof c === 'string' ? c : fmt(c)); }
  function setAll(st, obj) { KEYS.forEach(function (k) { if (obj[k]) writeStage(st, k, obj[k]); }); }
  function phase(v) { root.setAttribute('data-kob-phase', String(v)); }

  function initColors() {
    var nat = readNatural(); raw = nat;
    KEYS.forEach(function (k) { var c = parse(nat[k]); have[k] = !!nat[k]; if (c) tgt[k] = c; });
    CFG.order.forEach(function (st) { cur[st] = {}; KEYS.forEach(function (k) { if (tgt[k]) { cur[st][k] = tgt[k].slice(); writeStage(st, k, tgt[k]); } else if (nat[k]) writeStage(st, k, nat[k]); }); });
    var built = buildStageSheet(have); stats.selectors = built.selectors;
    sheetEl = d.createElement('style'); sheetEl.id = 'kob-flow-css'; sheetEl.textContent = built.css; d.head.appendChild(sheetEl);
    phase(13);
  }
  function startStage(st, now) {
    var from = {}; KEYS.forEach(function (k) { if (cur[st][k]) from[k] = cur[st][k].slice(); });
    run = { st: st, t0: now, dur: reduce ? 0 : CFG.mult[st] * CFG.unit, from: from };
    phase(CFG.mult[st]);
  }
  function stageHasEls(st) {   /* etapa sem nenhum elemento na tela não gasta tempo do ciclo */
    if (st === 'root') return true;
    var s = stageSel[st]; if (!s || !s.length) return false;
    try { return !!d.querySelector(s.join(',')); } catch (e) { return true; }
  }
  function nextStage(now) {
    while (pending.length) {
      var st = pending.shift(), need = false;
      if (!stageHasEls(st)) { stats.skipped++; KEYS.forEach(function (k) { if (tgt[k]) cur[st][k] = tgt[k].slice(); }); continue; }
      KEYS.forEach(function (k) { if (tgt[k] && cur[st][k] && dist(cur[st][k], tgt[k]) > 1.5) need = true; });
      if (!need) { KEYS.forEach(function (k) { if (tgt[k]) cur[st][k] = tgt[k].slice(); }); continue; }
      startStage(st, now); return true;
    }
    run = null; phase(13); return false;
  }
  function step(now) {
    if (!run) { if (!nextStage(now)) return; }
    var p = run.dur ? clamp((now - run.t0) / run.dur) : 1, e = ease(p), st = run.st;
    KEYS.forEach(function (k) { if (!tgt[k] || !run.from[k]) return; var c = lerp(run.from[k], tgt[k], e); cur[st][k] = c; writeStage(st, k, c); });
    stats.steps++;
    if (p >= 1) { run = null; nextStage(now); }
  }
  function loop(ts) {
    raf = 0;
    if (!run && !pending.length) return;
    if (!lastTs || ts - lastTs >= 1000 / CFG.fps) { lastTs = ts; step(performance.now()); }
    if (run || pending.length) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  function retarget() {
    if (!booted || !enabled) return;
    var nat = readNatural(); stats.retargets++;
    var changed = false;
    KEYS.forEach(function (k) {
      if (!nat[k]) return;
      var c = parse(nat[k]);
      if (!c) { CFG.order.forEach(function (st) { writeStage(st, k, nat[k]); }); return; }    /* não interpolável: direto */
      if (!tgt[k] || dist(tgt[k], c) > 1.5) changed = true;
      tgt[k] = c;
    });
    if (!changed) return;
    var now = performance.now();
    if (run) {   /* a etapa em curso continua de onde está (sem salto) rumo ao novo alvo */
      KEYS.forEach(function (k) { if (cur[run.st][k]) run.from[k] = cur[run.st][k].slice(); });
      run.t0 = now;
    }
    pending = CFG.order.filter(function (st) { return !run || st !== run.st; });
    if (!run) nextStage(now);
    kick();
  }
  var rtT = 0;
  function scheduleRetarget() { clearTimeout(rtT); rtT = setTimeout(retarget, 30); }

  /* ------------------------------------------------ voz em etapas (rate→pitch→voz) */
  var V = { applied: null, from: null, to: null, t0: 0, active: false, spoken: 0 };
  function tuneUtterance(u) {
    if (!enabled || !CFG.voiceBlend || reduce) return;
    var t = { rate: u.rate, pitch: u.pitch, voice: u.voice || null, lang: u.lang };
    var key = (t.voice ? t.voice.name : '') + '|' + t.rate + '|' + t.pitch;
    var now = performance.now();
    if (!V.applied) { V.applied = t; V.to = t; V.toKey = key; return; }
    if (key !== V.toKey) {                  /* alvo mudou: parte do que foi falado por último */
      V.from = { rate: V.applied.rate, pitch: V.applied.pitch, voice: V.applied.voice, lang: V.applied.lang };
      V.to = t; V.toKey = key; V.t0 = now; V.active = true;
    }
    if (!V.active) { V.applied = t; return; }
    var el = now - V.t0, W = CFG.voiceWindows, U = CFG.unit;
    var pr = clamp(el / (W.rate * U)), pp = clamp((el - W.rate * U) / ((W.pitch - W.rate) * U));
    var useTo = el >= W.voice * U;
    u.rate = V.from.rate + (V.to.rate - V.from.rate) * ease(pr);
    u.pitch = V.from.pitch + (V.to.pitch - V.from.pitch) * ease(pp);
    var vo = useTo ? V.to.voice : V.from.voice, lg = useTo ? V.to.lang : V.from.lang;
    if (vo) { u.voice = vo; if (lg) u.lang = lg; }
    V.applied = { rate: u.rate, pitch: u.pitch, voice: vo, lang: lg };
    root.setAttribute('data-kob-voice-phase', useTo ? 'voice' : el >= W.rate * U ? 'pitch' : 'rate');
    if (useTo && pr >= 1 && pp >= 1) { V.active = false; V.applied = V.to; root.removeAttribute('data-kob-voice-phase'); }
  }
  function hookSpeech() {
    if (!w.speechSynthesis || w.speechSynthesis.__kobFlowHooked) return;
    var orig = w.speechSynthesis.speak.bind(w.speechSynthesis);
    w.speechSynthesis.speak = function (u) { try { tuneUtterance(u); } catch (e) { console.warn('[KobFlow] voz', e); } return orig(u); };
    try { Object.defineProperty(w.speechSynthesis, '__kobFlowHooked', { value: true }); } catch (e) { w.speechSynthesis.__kobFlowHooked = true; }
  }

  /* --------------------------------------- idle e carga (música) → degradê de efeitos */
  var lastActive = Date.now(), playSince = 0, level = 0, degradeEl = null, hidden = false;
  function strip(f) { return f.replace(/drop-shadow\((?:[^()]|\([^()]*\))*\)/g, '').replace(/\s+/g, ' ').trim() || 'none'; }
  function prefixed(sels, lv) {
    return splitSel(sels).filter(function (s) { return !/^(html|:root)\b/i.test(s); })
      .map(function (s) { return 'html[data-kob-l' + lv + '] ' + s; }).join(',');
  }
  function buildDegrade() {
    var out = '', n = 0;
    eachRule(function (r, ctx) {
      var st = r.style; if (!st) return; var css;
      var f = st.getPropertyValue('filter') || st.getPropertyValue('-webkit-filter');
      if (f && /drop-shadow/.test(f)) { css = prefixed(r.selectorText, 1); if (css) { out += wrapCtx(ctx, css + '{filter:' + strip(f) + '!important;-webkit-filter:' + strip(f) + '!important}') + '\n'; n++; } }
      var an = (st.getPropertyValue('animation') || '') + ' ' + (st.getPropertyValue('animation-iteration-count') || '');
      if (/infinite/.test(an)) { css = prefixed(r.selectorText, 2); if (css) { out += wrapCtx(ctx, css + '{animation-play-state:paused!important}') + '\n'; n++; } }
      var bf = st.getPropertyValue('backdrop-filter') || st.getPropertyValue('-webkit-backdrop-filter');
      if (bf && /blur\(/.test(bf)) {
        var nb = bf.replace(/blur\(\s*([\d.]+)px\s*\)/g, function (m, v) { return 'blur(' + Math.min(parseFloat(v), 6) + 'px)'; });
        css = prefixed(r.selectorText, 3); if (css) { out += wrapCtx(ctx, css + '{backdrop-filter:' + nb + '!important;-webkit-backdrop-filter:' + nb + '!important}') + '\n'; n++; }
      }
      var bs = st.getPropertyValue('box-shadow');
      if (bs && bs !== 'none') { css = prefixed(r.selectorText, 4); if (css) { out += wrapCtx(ctx, css + '{box-shadow:none!important}') + '\n'; n++; } }
    });
    degradeEl = d.createElement('style'); degradeEl.id = 'kob-flow-degrade'; degradeEl.textContent = out; d.head.appendChild(degradeEl);
    stats.degradeRules = n;
  }
  function setLevel(n) {
    if (n === level) return;
    if (n > 0 && !degradeEl) buildDegrade();
    level = n;
    for (var i = 1; i <= 4; i++) { if (i <= n) root.setAttribute('data-kob-l' + i, ''); else root.removeAttribute('data-kob-l' + i); }
    root.setAttribute('data-kob-level', String(n));
  }
  function musicOn() { try { return !!(w.KOBSonoro && w.KOBSonoro.isPlaying && w.KOBSonoro.isPlaying()); } catch (e) { return false; } }
  function lvFrom(ms, unit) { var m = CFG.mult; return ms >= 12 * unit ? 4 : ms >= 9 * unit ? 3 : ms >= 6 * unit ? 2 : ms >= 3 * unit ? 1 : 0; }
  function tick() {
    if (!enabled) return;
    var now = Date.now(), on = musicOn();
    if (on && !playSince) playSince = now; if (!on) playSince = 0;
    var li = lvFrom(now - lastActive, CFG.idleUnit), lp = on ? lvFrom(now - playSince, CFG.playUnit) : 0;
    setLevel(Math.max(li, lp));
    root.setAttribute('data-kob-audio-load', on ? '1' : '0');
  }
  function activity() { lastActive = Date.now(); if (level > 0 && !musicOn()) setLevel(0); else if (level > 0) tick(); }

  /* --------------------------------------------------------------- boot */
  function boot() {
    if (booted || !d.body) return;
    try {
      initColors(); hookSpeech(); booted = true;
      new MutationObserver(scheduleRetarget).observe(d.body, { attributes: true, attributeFilter: ['data-voice-arch', 'data-arch', 'data-theme'] });
      new MutationObserver(scheduleRetarget).observe(root, { attributes: true, attributeFilter: ['data-arch', 'data-theme'] });
      ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) { w.addEventListener(ev, activity, { passive: true, capture: true }); });
      d.addEventListener('visibilitychange', function () { hidden = d.hidden; root.setAttribute('data-kob-hidden', hidden ? '1' : '0'); if (!hidden) activity(); });
      setInterval(function () { if (!hidden) tick(); }, CFG.tickMs);
    } catch (e) { console.error('[KobFlow] boot', e); }
  }
  function scheduleBoot() {   /* depois do load e só quando o navegador está ocioso (não disputa o boot do app) */
    setTimeout(function () { if (w.requestIdleCallback) w.requestIdleCallback(boot, { timeout: 3000 }); else boot(); }, 900);
  }
  if (d.readyState === 'complete') scheduleBoot(); else w.addEventListener('load', scheduleBoot);

  w.KobFlow = {
    version: '1.0', config: CFG,
    status: function () { return { booted: booted, enabled: enabled, running: run && run.st, pending: pending.slice(), level: level, stats: stats, phase: root.getAttribute('data-kob-phase') }; },
    retarget: retarget, boot: boot, tick: tick, tune: tuneUtterance,
    setUnit: function (ms) { CFG.unit = ms; },
    disable: function () { enabled = false; if (sheetEl) sheetEl.disabled = true; if (degradeEl) degradeEl.disabled = true; setLevel(0); root.removeAttribute('data-kob-phase'); },
    enable: function () { enabled = true; if (sheetEl) sheetEl.disabled = false; if (degradeEl) degradeEl.disabled = false; retarget(); }
  };
})(window, document);
