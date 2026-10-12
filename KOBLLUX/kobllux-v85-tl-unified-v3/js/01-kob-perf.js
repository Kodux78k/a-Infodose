/* ══ KOB-PERF runtime · 1 módulo, 0 MutationObserver, 0 timers de polling ═════
   1 perf-lite (auto em mobile/pouca RAM; escolha do usuário persiste)
   2 fetch guard único: URLs mortas · cache archetypes 24h · memo oEmbed SoundCloud
   3 Delivery Registry: Tone.js + PDF.js sob demanda, LOCAL primeiro (CDN = alternativa)
   4 botões no Cockpit (perf-lite + freeze)
   5 KOB_PERF.report() — funciona em Firefox/Safari (sem performance.memory)
   ═══════════════════════════════════════════════════════════════════════════ */
(function KOBPerf(){
  "use strict";
  if (window.KOB_PERF) return;
  var root = document.documentElement;
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function toast(m){ try{ window.KBLX_TOAST && window.KBLX_TOAST(m); }catch(e){} }
  function mm(q){ try{ return matchMedia(q).matches; }catch(e){ return false; } }

  /* 1 ── perf-lite ─────────────────────────────────────────── */
  var LITE_KEY = 'kob:perf:lite';
  var auto = !!(navigator.deviceMemory && navigator.deviceMemory <= 4)
          || mm('(prefers-reduced-motion: reduce)') || mm('(max-width: 760px)');
  var saved = lsGet(LITE_KEY);                       // só existe se o usuário escolheu
  root.classList.toggle('kob-perf-lite', saved == null ? auto : saved === '1');
  function isLite(){ return root.classList.contains('kob-perf-lite'); }
  function setLite(on){ root.classList.toggle('kob-perf-lite', !!on); lsSet(LITE_KEY, on ? '1' : '0'); syncUI(); toast('perf-lite: ' + (on ? 'ON' : 'OFF')); }
  function setFrozen(on){ root.classList.toggle('kob-frozen', !!on); syncUI(); toast(on ? '❄ congelado' : '▶ retomado'); }

  /* 2 ── fetch guard (um único wrapper) ───────────────────── */
  var DEAD   = [/oembed.*_0x01h_/, /oembed.*0x01_-kdx/, /oembed.*0x08-trilhas-set-governante/, /oembed.*ZaS4eux4tmpD0jSnyp/];
  var AR_KEY = 'kob:arch:cache', AR_TTL = 864e5, sc = Object.create(null);
  function jsonRes(t){ return new Response(t, { status:200, headers:{ 'content-type':'application/json' } }); }
  var _fetch = window.fetch;
  if (typeof _fetch === 'function') window.fetch = function(input, init){
    var u = typeof input === 'string' ? input : (input && input.url) || String(input || '');
    var self = this;
    for (var i = 0; i < DEAD.length; i++) if (DEAD[i].test(u)) return Promise.resolve(jsonRes('{}'));
    if (/\/archetypes\.json(\?|$)/.test(u)){
      try{
        var c = JSON.parse(lsGet(AR_KEY) || 'null');
        if (c && Date.now() - c.t < AR_TTL) return Promise.resolve(jsonRes(typeof c.d === 'string' ? c.d : JSON.stringify(c.d)));
      }catch(e){}
      return _fetch.call(self, input, init).then(function(r){
        if (r.ok) r.clone().text().then(function(t){ try{ JSON.parse(t); lsSet(AR_KEY, JSON.stringify({ t:Date.now(), d:t })); }catch(e){} });
        return r;
      });
    }
    if (/oembed/.test(u) && /soundcloud/i.test(u)){
      if (!sc[u]) sc[u] = _fetch.call(self, input, init).then(function(r){ if (!r.ok) delete sc[u]; return r; }, function(e){ delete sc[u]; throw e; });
      return sc[u].then(function(r){ return r.clone(); });
    }
    return _fetch.call(self, input, init);
  };

  /* 3 ── Delivery Registry · local primeiro, CDN só como alternativa ─────────
     KOB_DELIVERY.load('tone'|'pdfjs') → Promise<lib|null>. Tenta cada origem em ordem;
     o Service Worker (sw.js) guarda os arquivos locais para uso offline. */
  var CDJ = 'https://cdnjs.cloudflare.com/ajax/libs/';
  var REG = {
    tone:  { srcs: ['./vendor/Tone.js', CDJ + 'tone/14.8.49/Tone.js'],
             ready: function(){ return window.Tone; } },
    pdfjs: { srcs: ['./vendor/pdfjs/pdf.min.js', CDJ + 'pdf.js/3.11.174/pdf.min.js'],
             workers: ['./vendor/pdfjs/pdf.worker.min.js', CDJ + 'pdf.js/3.11.174/pdf.worker.min.js'],
             ready: function(){ return window.pdfjsLib; },
             after: function(i){ try{ window.pdfjsLib.GlobalWorkerOptions.workerSrc = this.workers[i]; }catch(e){} } }
  };
  var pend = Object.create(null);
  function inject(src){
    return new Promise(function(ok, no){
      var el = document.createElement('script');
      el.src = src; el.async = true;
      el.onload = function(){ ok(); };
      el.onerror = function(){ try{ el.remove(); }catch(e){} no(); };
      document.head.appendChild(el);
    });
  }
  function load(id){
    var d = REG[id]; if (!d) return Promise.resolve(null);
    if (d.ready()) return Promise.resolve(d.ready());
    if (pend[id]) return pend[id];
    pend[id] = d.srcs.reduce(function(p, src, i){
      return p.then(function(v){
        if (v) return v;
        return inject(src).then(function(){ if (d.after) d.after(i); return d.ready() || null; }, function(){ return null; });
      });
    }, Promise.resolve(null)).then(function(v){ if (!v) delete pend[id]; return v; });
    return pend[id];
  }
  window.KOB_DELIVERY = {
    load: load,
    has: function(id){ return !!(REG[id] && REG[id].ready()); },
    prefetch: function(id){ try{ if (REG[id]) fetch(REG[id].srcs[0]).catch(function(){}); }catch(e){} },
    registry: function(){ return JSON.parse(JSON.stringify(REG)); }
  };
  window.KOBLoadPDF  = function(){ return load('pdfjs'); };   /* contrato preservado */
  window.KOBLoadTone = function(){ return load('tone'); };
  /* pointerdown precede o click: começa a carregar o Tone assim que o usuário toca num botão de som */
  document.addEventListener('pointerdown', function(e){
    var t = e.target && e.target.closest && e.target.closest('[data-action="play-sonoro"],#sonoroPlayBtn,#snckPlay,.music-btn');
    if (t) load('tone');
  }, true);

  /* 4 ── botões no Cockpit ────────────────────────────────── */
  function syncUI(){
    var a = document.getElementById('kobPerfToggle'), b = document.getElementById('kobPerfFreeze');
    if (a) a.textContent = 'perf-lite: ' + (isLite() ? 'ON' : 'OFF');
    if (b) b.textContent = root.classList.contains('kob-frozen') ? '▶ RETOMAR' : '🧊 FREEZE';
  }
  function mountCockpit(){
    var body = document.querySelector('#drawerProfile .drawer-body');
    if (!body || document.getElementById('kobPerfRow')) return;
    var row = document.createElement('div');
    row.className = 'cockpit-item'; row.id = 'kobPerfRow';
    row.innerHTML = '<div class="cockpit-label">⚡ Performance</div><div class="control-row">'
      + '<button class="btn-block" id="kobPerfToggle" type="button"></button>'
      + '<button class="btn-block" id="kobPerfFreeze" type="button"></button></div>';
    body.appendChild(row);
    document.getElementById('kobPerfToggle').onclick = function(){ setLite(!isLite()); };
    document.getElementById('kobPerfFreeze').onclick = function(){ setFrozen(!root.classList.contains('kob-frozen')); };
    syncUI();
  }
  document.addEventListener('DOMContentLoaded', mountCockpit);
  window.addEventListener('load', function(){ [300, 2500, 5000].forEach(function(t){ setTimeout(mountCockpit, t); }); });

  /* 5 ── diagnóstico ──────────────────────────────────────── */
  function report(){
    var rules = 0, sheets = document.styleSheets.length, mem = performance.memory;
    for (var i = 0; i < sheets; i++){ try{ rules += document.styleSheets[i].cssRules.length; }catch(e){} }
    var o = {
      heap: mem ? (mem.usedJSHeapSize / 1048576).toFixed(1) + 'MB' : 'n/d (Firefox/Safari)',
      nodes: document.getElementsByTagName('*').length, stylesheets: sheets, cssRules: rules,
      iframes: document.getElementsByTagName('iframe').length, imgs: document.images.length,
      scripts: document.scripts.length, lite: isLite(), frozen: root.classList.contains('kob-frozen')
    };
    console.log('%c[KOB-PERF]', 'background:#0af;color:#000;padding:2px 6px;border-radius:3px', o);
    return o;
  }
  window.KOB_PERF = {
    report: report, setLite: setLite, toggle: function(){ setLite(!isLite()); }, freeze: setFrozen,
    get lite(){ return isLite(); },
    clearCache: function(){ try{ localStorage.removeItem(AR_KEY); }catch(e){} sc = Object.create(null); }
  };
})();
