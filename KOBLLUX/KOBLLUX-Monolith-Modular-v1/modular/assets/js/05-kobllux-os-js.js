
(function(){
  'use strict';
  if (window.__KOBLLUX_OS__) return;
  window.__KOBLLUX_OS__ = true;

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
  var toast = function(m){ try{ window.KBLX_TOAST && window.KBLX_TOAST(m); }catch(e){ console.log('[KOBLLUX OS]',m); } };

  /* ── 1. Registra no Workspace (MODS + chip do menu) ─────────────── */
  function registerWorkspace(){
    var W = window.KOBWorkspace;
    if (!W || !W.MODS) return false;
    if (!W.MODS.some(function(m){ return m.id==='kobllux'; })){
      W.MODS.push({ id:'kobllux', label:'KOBLLUX', ico:'⌂', grp:'mente', secs:['koblluxOS'] });
    }
    var strip = $('#wsMenu .ws-mod .ws-strip');
    if (strip && !strip.querySelector('[data-id="kobllux"]')){
      strip.insertAdjacentHTML('beforeend','<button class="ws-chip" data-k="mod" data-id="kobllux">⌂ KOBLLUX</button>');
    }
    try{ W.apply(); }catch(e){}
    return true;
  }
  if (!registerWorkspace()) { setTimeout(registerWorkspace, 600); setTimeout(registerWorkspace, 1800); }

  /* ── 2. Navegação entre views (Início/Biblioteca/Cortex/Ajustes) ── */
  var VIEWS = ['inicio','biblioteca','cortex','ajustes'];
  var curView = 'inicio';
  function setView(name){
    if (VIEWS.indexOf(name) < 0) return;
    curView = name;
    $$('#koblluxOS .kob-view').forEach(function(v){ v.classList.toggle('active', v.getAttribute('data-view')===name); });
    $$('#koblluxOS .kob-tab-btn').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-kob-tab')===name); });
    if (name==='biblioteca') renderBiblioteca();
    if (name==='cortex') renderCortex();
    try{ localStorage.setItem('kobllux-os:view', name); }catch(e){}
  }
  window.KOBLLUX_OS_setView = setView;

  /* tabs */
  document.addEventListener('click', function(e){
    var t = e.target.closest('#koblluxOS [data-kob-tab]');
    if (t){ e.preventDefault(); setView(t.getAttribute('data-kob-tab')); return; }

    /* botão "go to section" (biblioteca/cortex/ajustes) */
    var go = e.target.closest('#koblluxOS [data-kob-go]');
    if (go){
      e.preventDefault();
      var id = go.getAttribute('data-kob-go');
      if (id === 'drawerProfile'){ try{ window.toggleDrawer && window.toggleDrawer('drawerProfile'); }catch(_){} return; }
      try{
        if (window.KOBWorkspace && KOBWorkspace.reveal) KOBWorkspace.reveal(id);
        var sec = document.getElementById(id);
        if (sec){ sec.classList.remove('collapsed','minimized','ws-off'); sec.scrollIntoView({behavior:'smooth',block:'start'}); }
      }catch(_){}
      return;
    }
  });

  /* ── 3. Apps (grid + dock) ──────────────────────────────────────── */
  var APP_ACTIONS = {
    nebula:     function(){ navigateTo('pillsSection'); },
    grito:      function(){ toast('Grito Vivo · em breve'); },
    facetime:   function(){ toast('FaceTime · em breve'); },
    calendario: function(){ toast('Calendário · widget ativo'); },
    mail:       function(){ toast('Mail · em breve'); },
    relogio:    function(){ toast('Relógio · widget ativo'); },
    ajustes:    function(){ setView('ajustes'); },
    termux:     function(){ navigateTo('s3'); },
    phone:      function(){ toast('Phone · em breve'); },
    safari:     function(){ var inp = document.getElementById('urlInputNav'); if (inp){ inp.focus(); inp.scrollIntoView({behavior:'smooth'}); } else toast('Safari · sem URL bar'); },
    mensagens:  function(){ navigateTo('s3'); },
    arquivos:   function(){ navigateTo('pillsSection'); }
  };
  function navigateTo(id){
    try{
      if (window.KOBWorkspace && KOBWorkspace.reveal) KOBWorkspace.reveal(id);
      var sec = document.getElementById(id);
      if (sec){
        sec.classList.remove('collapsed','minimized','ws-off');
        sec.scrollIntoView({behavior:'smooth', block:'start'});
        /* se for uma section que abre com open=true, força */
        if (sec.tagName === 'DETAILS') sec.open = true;
      }
    }catch(e){ console.warn('[KOBLLUX OS] navigateTo', id, e); }
  }
  document.addEventListener('click', function(e){
    var app = e.target.closest('#koblluxOS [data-app]');
    if (app){
      e.preventDefault();
      var id = app.getAttribute('data-app');
      var fn = APP_ACTIONS[id];
      if (fn) fn(); else toast('App: ' + id);
    }
  });

  /* ── 4. Profile card + avatar → Cockpit ─────────────────────────── */
  ['#kob-profile-card','#kob-profile-avatar'].forEach(function(sel){
    var el = $(sel);
    if (el && !el.dataset.kobBound){
      el.dataset.kobBound = '1';
      el.addEventListener('click', function(){
        try{ window.toggleDrawer && window.toggleDrawer('drawerProfile'); }
        catch(e){ toast('Cockpit indisponível'); }
      });
    }
  });

  /* ── 5. Arquétipo (prev/next/select) ────────────────────────────── */
  function archList(){ return (window.ARCH_LIST && ARCH_LIST.slice()) || []; }
  function curArch(){ return (window.getArch && getArch()) || 'KOBLLUX'; }
  function cycleArch(delta){
    var list = archList(); if (!list.length) return;
    var i = list.indexOf(curArch());
    var next = list[((i + delta) % list.length + list.length) % list.length];
    try{
      if (window.applyArch) window.applyArch(next);
      if (window.__sbSync) window.__sbSync(next);
      syncArchUI();
    }catch(e){}
  }
  function setArch(name){
    if (!name) return;
    try{ if (window.applyArch) window.applyArch(name); if (window.__sbSync) window.__sbSync(name); syncArchUI(); }catch(e){}
  }
  function syncArchUI(){
    var sel = document.getElementById('kob-arch-select');
    if (sel) sel.value = curArch();
    var badge = document.getElementById('kob-user-badge');
    if (badge) badge.textContent = curArch() + ' · SISTEMA OPERACIONAL';
  }
  function buildArchSelect(){
    var sel = document.getElementById('kob-arch-select');
    if (!sel) return;
    var list = archList();
    if (!list.length) { setTimeout(buildArchSelect, 500); return; }
    sel.innerHTML = '';
    list.forEach(function(a){
      var o = document.createElement('option');
      o.value = a; o.textContent = a;
      sel.appendChild(o);
    });
    sel.value = curArch();
    if (!sel.dataset.kobBound){
      sel.dataset.kobBound = '1';
      sel.addEventListener('change', function(){ setArch(sel.value); });
    }
    syncArchUI();
  }
  buildArchSelect();

  document.addEventListener('click', function(e){
    var p = e.target.closest('#koblluxOS [data-kob-arch-prev]');
    if (p){ e.preventDefault(); cycleArch(-1); return; }
    var n = e.target.closest('#koblluxOS [data-kob-arch-next]');
    if (n){ e.preventDefault(); cycleArch(1); return; }
  });

  /* ── 6. Live: relógio, calendário, user ─────────────────────────── */
  function updateClock(){
    var now = new Date();
    var hh = String(now.getHours()).padStart(2,'0');
    var mm = String(now.getMinutes()).padStart(2,'0');
    var el = document.getElementById('kob-clock-digital');
    if (el) el.textContent = hh + ':' + mm;

    var days = ['DOM.','SEG.','TER.','QUA.','QUI.','SEX.','SÁB.'];
    var dayEl = document.getElementById('kob-cal-day');
    var numEl = document.getElementById('kob-cal-num');
    if (dayEl) dayEl.textContent = days[now.getDay()];
    if (numEl) numEl.textContent = now.getDate();

    var sec = (now.getSeconds()/60)*360;
    var min = ((now.getMinutes()+now.getSeconds()/60)/60)*360;
    var hr  = (((now.getHours()%12)+now.getMinutes()/60)/12)*360;
    var h1 = document.getElementById('kob-analog-hour'); if (h1) h1.style.transform = 'rotate('+hr+'deg)';
    var h2 = document.getElementById('kob-analog-minute'); if (h2) h2.style.transform = 'rotate('+min+'deg)';
    var h3 = document.getElementById('kob-analog-second'); if (h3) h3.style.transform = 'rotate('+sec+'deg)';
  }
  setInterval(updateClock, 1000);
  updateClock();

  function updateUser(){
    var name = '';
    try{ name = localStorage.getItem('di_userName') || ''; }catch(e){}
    if (!name && window.KOBState) { try { name = KOBState.get().user; } catch(_){} }
    var status = document.getElementById('kob-user-status');
    if (status) status.textContent = name || 'Você';
    var sub = document.getElementById('kob-profile-sub');
    if (sub) sub.textContent = (name ? name + ' · ' : '') + 'iCloud · VisionOS · HubUno Fusion';
  }
  updateUser();
  window.addEventListener('kob:statechange', updateUser);
  window.addEventListener('storage', function(e){ if (e.key==='di_userName') updateUser(); });
  setInterval(updateUser, 3000);

  /* ── 7. Mini-views (Biblioteca, Cortex) ─────────────────────────── */
  function renderBiblioteca(){
    var box = document.getElementById('kob-biblio-list');
    if (!box) return;
    var docs = (window.NebulaPills && NebulaPills.docs) || [];
    if (!docs.length){ box.className = 'kob-empty'; box.textContent = 'Carregue pílulas para ver aqui'; return; }
    box.className = '';
    box.innerHTML = docs.slice(0, 5).map(function(d){
      var nm = String(d.name||'').replace(/\.[^.]+$/,'');
      var ext = String(d.ext||'').toUpperCase();
      return '<div class="kob-list-item" data-doc-id="'+String(d.id).replace(/"/g,'')+'" data-kob-doc="1">'
        + '<span>'+escHtml(nm.slice(0,22))+'</span>'
        + '<small>'+escHtml(ext)+'</small></div>';
    }).join('')
    + (docs.length > 5 ? '<div class="kob-empty">+ '+(docs.length-5)+' mais</div>' : '');
  }
  function renderCortex(){
    var box = document.getElementById('kob-cortex-mini');
    if (!box) return;
    var nodes = (window.KobluxEngine && KobluxEngine.all && KobluxEngine.all()) || [];
    var sessions = nodes.filter(function(n){ return n.kind==='session'; });
    var active = sessions.filter(function(n){ return n.state==='active' || !n.state; }).length;
    var docked = sessions.filter(function(n){ return n.state==='docked' || n.state==='minimized'; }).length;
    var closed = sessions.filter(function(n){ return n.state==='closed'; }).length;
    box.className = '';
    box.innerHTML = '<div class="kob-list-item"><span>◉ Sessions ativas</span><small>'+active+'</small></div>'
      + '<div class="kob-list-item"><span>⚓ No dock</span><small>'+docked+'</small></div>'
      + '<div class="kob-list-item"><span>◈ Fechadas</span><small>'+closed+'</small></div>';
  }
  document.addEventListener('click', function(e){
    var it = e.target.closest('#koblluxOS [data-kob-doc]');
    if (it){
      var id = it.getAttribute('data-doc-id');
      var docs = (window.NebulaPills && NebulaPills.docs) || [];
      var d = docs.find(function(x){ return String(x.id)===String(id); });
      if (d && NebulaPills.openReader) NebulaPills.openReader(d);
    }
  });
  function escHtml(s){ return String(s||'').replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  /* ── 8. Ajustes ─────────────────────────────────────────────────── */
  var tBtn = document.getElementById('kob-toggle-theme');
  if (tBtn && !tBtn.dataset.kobBound){
    tBtn.dataset.kobBound = '1';
    tBtn.addEventListener('click', function(){
      try{
        if (window.DualTheme && DualTheme.toggle) DualTheme.toggle();
        else { var t = document.getElementById('themeToggle'); if (t) t.click(); }
      }catch(e){}
    });
  }
  var vBtn = document.getElementById('kob-version');
  if (vBtn && !vBtn.dataset.kobBound){
    vBtn.dataset.kobBound = '1';
    vBtn.addEventListener('click', function(){ alert('KOBLLUX Ultimate Fusion · v1.0\nMódulo Workspace integrado ao monólito 0r4'); });
  }

  /* ── 9. Botões de navegação na symbol bar ───────────────────────── */
  function openKobllux(){
    try{
      if (window.KOBWorkspace && KOBWorkspace.show) KOBWorkspace.show('mod','kobllux');
      var sec = document.getElementById('koblluxOS');
      if (sec){
        sec.classList.remove('collapsed','minimized','ws-off');
        if (sec.tagName === 'DETAILS') sec.open = true;
        sec.scrollIntoView({behavior:'smooth', block:'start'});
      }
      setView('inicio');
    }catch(e){ console.warn('[KOBLLUX OS]', e); }
  }
  window.KOBLLUX_OS_open = openKobllux;

  function cycleView(delta){
    var i = VIEWS.indexOf(curView);
    setView(VIEWS[((i + delta) % VIEWS.length + VIEWS.length) % VIEWS.length]);
    openKobllux();
  }

  function mountSymbolBarButtons(){
    var extras = document.querySelector('#symbolBar .sb-extras');
    if (!extras) { setTimeout(mountSymbolBarButtons, 800); return; }

    /* botão HOME */
    if (!document.getElementById('koblluxHomeBtn')){
      var home = document.createElement('button');
      home.type = 'button';
      home.className = 'sb-act';
      home.id = 'koblluxHomeBtn';
      home.title = 'KOBLLUX OS · abrir homescreen';
      home.textContent = '⌂';
      home.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); openKobllux(); });
      extras.insertBefore(home, extras.firstChild);
    }
    /* prev */
    if (!document.getElementById('koblluxPrevBtn')){
      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'sb-act';
      prev.id = 'koblluxPrevBtn';
      prev.title = 'KOBLLUX OS · view anterior';
      prev.textContent = '◄';
      prev.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); cycleView(-1); });
      extras.appendChild(prev);
    }
    /* next */
    if (!document.getElementById('koblluxNextBtn')){
      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'sb-act';
      next.id = 'koblluxNextBtn';
      next.title = 'KOBLLUX OS · próxima view';
      next.textContent = '►';
      next.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); cycleView(1); });
      extras.appendChild(next);
    }
  }
  [300, 1200, 3000, 6000].forEach(function(t){ setTimeout(mountSymbolBarButtons, t); });

  /* ── 10. Preview da biblioteca quando aba troca ─────────────────── */
  window.addEventListener('kobllux:pills-changed', renderBiblioteca);
  var _origPushDerived = window.NebulaPills && NebulaPills.pushDerivedDoc;
  if (_origPushDerived && !_origPushDerived.__koblluxOSWrapped){
    var wrapped = function(){
      var r = _origPushDerived.apply(this, arguments);
      window.dispatchEvent(new CustomEvent('kobllux:pills-changed'));
      return r;
    };
    wrapped.__koblluxOSWrapped = true;
    try { NebulaPills.pushDerivedDoc = wrapped; } catch(e){}
  }

  /* ── 11. Restaura view salva ────────────────────────────────────── */
  try{
    var saved = localStorage.getItem('kobllux-os:view');
    if (saved && VIEWS.indexOf(saved) >= 0) setView(saved);
  }catch(e){}

  /* ── 12. Preview: força render quando section abre ─────────────── */
  var sec = document.getElementById('koblluxOS');
  if (sec){
    var obs = new MutationObserver(function(){
      if (sec.open){
        try{ if (curView==='biblioteca') renderBiblioteca(); if (curView==='cortex') renderCortex(); syncArchUI(); }catch(e){}
      }
    });
    try{ obs.observe(sec, { attributes: true, attributeFilter: ['open'] }); }catch(e){}
  }

  console.log('%c[KOBLLUX OS] %c✓ módulo registrado no workspace · symbol bar + ⌂ ◄ ► · views: inicio/biblioteca/cortex/ajustes',
    'background:#22D3EE;color:#000;padding:2px 8px;border-radius:3px',
    'color:#22D3EE');
})();
