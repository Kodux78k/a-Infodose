
(function(){
  'use strict';
  if (window.__MXP_PATCH_V3__) return;
  window.__MXP_PATCH_V3__ = true;

  var toast = function(m){ try{ (window.KBLX_TOAST || console.log)(m); }catch(e){} };
  var CAR_KEY = 'kobllux_sb_carousel_hidden';
  var EXT_KEY = 'kobllux_sb_extras_hidden';

  /* ══════════════════════════════════════════════════════════
     [1] Botões 🎵 e 📂 em .sb-extras (criados do zero)
     ══════════════════════════════════════════════════════════ */
  function buildTrilhaBtn(){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sb-act mxp-fab-inline';
    b.id = 'mxpTrilhaFab';
    b.title = 'Trilha (ligar/pausar)';
    b.textContent = '🎵';
    b.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      try {
        var playing = !!(window.KOBSonoro && window.KOBSonoro.isPlaying && window.KOBSonoro.isPlaying());
        if (playing) {
          if (typeof window.stopSonoroPlayback === 'function') window.stopSonoroPlayback();
          b.classList.remove('is-playing');
          b.textContent = '🎵';
          toast('⏸ Trilha pausada');
        } else {
          if (typeof window.startSonoroPlayback === 'function') window.startSonoroPlayback();
          else { var ref = document.querySelector('[data-action="play-sonoro"]'); if (ref) ref.click(); }
          b.classList.add('is-playing');
          b.textContent = '⏸';
          toast('▶ Trilha');
        }
      } catch(err){ console.warn('[mxp-fab]', err); }
    });
    return b;
  }

  function buildImportBtn(){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sb-act mxp-fab-inline';
    b.id = 'mxpImpFab';
    b.title = 'Importar JSON de trilha';
    b.textContent = '📂';

    var inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';
    inp.style.display = 'none';
    inp.setAttribute('data-mxp-json-input', '1');

    b.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      inp.click();
    });

    inp.addEventListener('change', function(){
      var f = inp.files && inp.files[0];
      inp.value = '';
      if (!f) return;
      f.text().then(function(txt){
        try {
          var obj = JSON.parse(txt);
          var ok = (obj.pads && obj.pads.length >= 16) || obj.patterns;
          if (!ok) { toast('JSON inválido'); return; }
          if (window.KOBMPC && typeof window.KOBMPC.loadPreset === 'function') window.KOBMPC.loadPreset(obj);
          else if (window.KOBSonoro && typeof window.KOBSonoro.loadPreset === 'function') window.KOBSonoro.loadPreset(obj);
          else window.dispatchEvent(new CustomEvent('kob:mpc:preset', { detail: obj }));
          toast('Trilha: ' + (obj.name || 'importada'));
        } catch(e){ toast('JSON inválido'); }
      }).catch(function(){ toast('Erro ao ler arquivo'); });
    });

    b.__fileInput = inp;
    return b;
  }

  function moveToExtras(){
    var extras = document.querySelector('#symbolBar .sb-extras');
    if (!extras) return false;

    /* remove versões flutuantes antigas (do Ajuste 3) */
    ['mxpTrilhaFab', 'mxpImpFab'].forEach(function(id){
      var el = document.getElementById(id);
      if (el && !el.closest('#symbolBar')) el.remove();
    });
    document.querySelectorAll('body > input[data-mxp-json-input]').forEach(function(el){
      if (!el.closest('#symbolBar')) el.remove();
    });

    if (!extras.querySelector('#mxpTrilhaFab')) extras.appendChild(buildTrilhaBtn());
    if (!extras.querySelector('#mxpImpFab')) {
      var imp = buildImportBtn();
      extras.appendChild(imp);
      if (imp.__fileInput) extras.appendChild(imp.__fileInput);
    }
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     [2] Rebind toggles via clone (limpa handlers antigos SEM stopPropagation)
     ══════════════════════════════════════════════════════════ */
  function bindToggleBtn(){
    var bar = document.getElementById('symbolBar');
    var old = document.getElementById('toggleBtn');
    if (!bar || !old) return false;
    if (old.__mxpBound) return true;

    var fresh = old.cloneNode(true);
    fresh.__mxpBound = true;
    old.parentNode.replaceChild(fresh, old);

    fresh.addEventListener('click', function(e){
      e.preventDefault();
      e.stopImmediatePropagation();   /* o nó é novo → não tem outro handler competindo */
      var hidden = bar.classList.toggle('carousel-hidden');
      try { localStorage.setItem(CAR_KEY, hidden ? '1' : '0'); } catch(_){}
      updateCollapsed();
      paintToggles();
    });

    return true;
  }

  function bindSbToggle(){
    var bar = document.getElementById('symbolBar');
    var old = document.getElementById('sbToggle');
    if (!bar || !old) return false;
    if (old.__mxpBound) return true;

    var fresh = old.cloneNode(true);
    fresh.__mxpBound = true;
    old.parentNode.replaceChild(fresh, old);

    fresh.addEventListener('click', function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      var hidden = bar.classList.toggle('extras-hidden');
      try { localStorage.setItem(EXT_KEY, hidden ? '1' : '0'); } catch(_){}
      updateCollapsed();
      paintToggles();
    });

    return true;
  }

  function paintToggles(){
    var bar = document.getElementById('symbolBar');
    if (!bar) return;
    var tb = document.getElementById('toggleBtn');
    var st = document.getElementById('sbToggle');
    var carOff = bar.classList.contains('carousel-hidden');
    var extOff = bar.classList.contains('extras-hidden');

    if (tb) {
      tb.classList.toggle('carousel-off', carOff);
      tb.classList.toggle('carousel-on', !carOff);
      tb.title = carOff ? 'Mostrar arquétipos' : 'Esconder arquétipos';
    }
    if (st) {
      st.textContent = extOff ? '▲' : '▼';
      st.classList.toggle('extras-off', extOff);
      st.classList.toggle('extras-on', !extOff);
      st.title = extOff ? 'Mostrar extras' : 'Esconder extras';
    }
  }

  function updateCollapsed(){
    var bar = document.getElementById('symbolBar');
    if (!bar) return;
    var carOff = bar.classList.contains('carousel-hidden');
    var extOff = bar.classList.contains('extras-hidden');
    /* se os DOIS estão escondidos, encolhe a barra inteira (largura 42px) */
    if (carOff && extOff) bar.classList.add('collapsed');
    else bar.classList.remove('collapsed');
  }

  function restoreStates(){
    var bar = document.getElementById('symbolBar');
    if (!bar) return;
    try {
      if (localStorage.getItem(CAR_KEY) === '1') bar.classList.add('carousel-hidden');
      if (localStorage.getItem(EXT_KEY) === '1') bar.classList.add('extras-hidden');
    } catch(_){}
    updateCollapsed();
    paintToggles();
  }

  /* ══════════════════════════════════════════════════════════
     [3] App MXP no KOBLLUX OS
     ══════════════════════════════════════════════════════════ */
  function injectMxpApp(){
    var grid = document.querySelector('#koblluxOS .kob-apps-grid');
    if (!grid) return false;
    if (grid.querySelector('[data-app="mxp"]')) return true;

    var app = document.createElement('div');
    app.className = 'kob-app';
    app.setAttribute('data-app', 'mxp');
    app.innerHTML = '<div class="kob-app-icon" style="background:linear-gradient(135deg,#22d3ee,#7c3aed);color:#000;font-weight:900;font-size:20px">M</div><span class="kob-app-label">MXP</span>';
    app.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      openMxpWorkspace();
    });
    var ajustes = grid.querySelector('[data-app="ajustes"]');
    if (ajustes) grid.insertBefore(app, ajustes);
    else grid.appendChild(app);
    return true;
  }

  function openMxpWorkspace(){
    try {
      var url = location.href.split('#')[0];
      var sep = url.indexOf('?') >= 0 ? '&' : '?';
      var target = url + sep + 'mxp=1';
      if (window.MXP && typeof window.MXP.createSession === 'function') {
        window.MXP.createSession('MXP · Workspace', { url: target, meta: { kind: 'mxp-workspace' } });
        toast('▶ MXP aberto');
        return;
      }
      if (typeof window.createSessionWindow === 'function') {
        window.createSessionWindow({ title: 'MXP · Workspace', src: target });
        toast('▶ MXP aberto');
        return;
      }
      window.open(target, '_blank', 'noopener');
    } catch(e){ console.warn('[mxp]', e); toast('Falha'); }
  }

  /* ══════════════════════════════════════════════════════════
     [4] Sync do botão de trilha
     ══════════════════════════════════════════════════════════ */
  function syncTrilha(){
    var t = document.getElementById('mxpTrilhaFab');
    if (!t) return;
    var on = false;
    try { on = !!(window.KOBSonoro && window.KOBSonoro.isPlaying && window.KOBSonoro.isPlaying()); } catch(_){}
    t.classList.toggle('is-playing', on);
    t.textContent = on ? '⏸' : '🎵';
    t.title = on ? 'Trilha tocando — clique para pausar' : 'Trilha pausada — clique para tocar';
  }
  window.addEventListener('kob:sonoro-state', syncTrilha);
  window.addEventListener('kob:track:state', syncTrilha);
  setInterval(syncTrilha, 2000);

  /* ══════════════════════════════════════════════════════════
     [5] Boot com retry
     ══════════════════════════════════════════════════════════ */
  var tries = 0;
  function boot(){
    tries++;
    moveToExtras();
    bindToggleBtn();
    bindSbToggle();
    injectMxpApp();
    restoreStates();
    syncTrilha();

    var ok =
      document.querySelector('#symbolBar .sb-extras #mxpTrilhaFab') &&
      document.querySelector('#symbolBar .sb-extras #mxpImpFab') &&
      document.getElementById('toggleBtn') && document.getElementById('toggleBtn').__mxpBound &&
      document.getElementById('sbToggle') && document.getElementById('sbToggle').__mxpBound &&
      document.querySelector('#koblluxOS [data-app="mxp"]');

    if (ok || tries >= 25) return;
    setTimeout(boot, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  console.log('%c[MXP-PATCH v3]%c 🎵 📂 em .sb-extras · ≡ carrossel · ▼ extras · MXP no OS · chips orbe',
    'background:#22d3ee;color:#000;padding:2px 8px;border-radius:3px',
    'color:#22d3ee');
})();
