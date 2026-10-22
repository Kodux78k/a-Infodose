/* @kob-mod 068 · kob-v86-patch-js · body */

(function(){
  "use strict";

  /* ═══ Item 6: KOBLoadTone — Tone.js sob demanda (bundle inline em text/plain) ═══ */
  window.KOBLoadTone = (function(){
    var p = null;
    function waitForTone(res, tries){
      if (typeof Tone !== 'undefined' && Tone) { res(Tone); return; }
      if (tries <= 0) { console.warn('[KOBLoadTone] Tone não definido após espera'); res(null); return; }
      setTimeout(function(){ waitForTone(res, tries-1); }, 100);
    }
    return function(){
      if (typeof Tone !== 'undefined' && Tone) return Promise.resolve(Tone);
      if (p) return p;
      p = new Promise(function(res){
        var el = document.getElementById('kob-tone-inline');
        var code = el ? (el.textContent || el.innerText || '') : '';
        if (code && code.length > 1000) {
          try {
            var blob = new Blob([code], {type:'application/javascript'});
            var url = URL.createObjectURL(blob);
            var s = document.createElement('script');
            s.src = url;
            s.onload = function(){ try{ URL.revokeObjectURL(url); }catch(e){} waitForTone(res, 30); };
            s.onerror = function(){ console.warn('[KOBLoadTone] erro no blob, tentando CDN'); p=null; res(null); };
            document.head.appendChild(s);
            console.log('[KOBLoadTone] injetando via Blob URL (' + Math.round(code.length/1024) + 'KB)');
            return;
          } catch(e) { console.warn('[KOBLoadTone] blob falhou:', e); }
        }
        /* Fallback: CDN (se o bloco inline estiver ausente) */
        var s2 = document.createElement('script');
        s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js';
        s2.onload = function(){ waitForTone(res, 30); };
        s2.onerror = function(){ p = null; res(null); };
        document.head.appendChild(s2);
      });
      return p;
    };
  })();

  /* ═══ Item 3: KOBArch — Dois orbes separados (voice ↔ music) ═══ */
  window.KOBArch = window.KOBArch || (function(){
    var _voice = 'INFODOSE', _music = 'KOBLLUX', _listeners = [];
    function notify(type, cur, prev){
      _listeners.forEach(function(cb){ try{ cb({type:type, current:cur, previous:prev}); }catch(e){} });
    }
    return {
      get voice(){ return _voice; },
      get music(){ return _music; },
      setVoice: function(a){ var o=_voice; _voice=a; notify('voice',a,o); return this; },
      setMusic: function(a){ var o=_music; _music=a; notify('music',a,o); return this; },
      subscribe: function(cb){ _listeners.push(cb); return function(){ _listeners=_listeners.filter(function(l){return l!==cb;}); }; },
      /* Troca voz no meio da leitura: mata utterance atual e reinicia do charIndex capturado */
      restartFrom: function(charIndex, newArch){
        if(newArch) this.setVoice(newArch);
        try{
          if('speechSynthesis' in window) speechSynthesis.cancel();
          var holo = window.KOB_HOLO || window.KOBHolo;
          if(holo && holo.speakFrom && holo.fullText){
            setTimeout(function(){ holo.speakFrom(charIndex||0); }, 120);
          }
        }catch(e){}
        return this;
      }
    };
  })();
  window.KOBArch.subscribe(function(ev){
    if(ev.type==='voice'){
      try{ document.body.setAttribute('data-voice-arch', String(ev.current).toLowerCase()); }catch(e){}
    }
  });
  try{ document.body.setAttribute('data-voice-arch', String(window.KOBArch.voice).toLowerCase()); }catch(e){}

  /* ═══ Item 4: Workspace colapsável — botão ▾ no resumo do #workspace ═══ */
  function initWorkspaceCollapse(){
    var ws = document.getElementById('workspace');
    if (!ws) return;
    var summary = ws.querySelector('summary');
    if (!summary) return;
    var KEY = 'kob:ws:collapsed';
    var btn = document.getElementById('wsCollapseToggle');
    if (btn && btn.__kobCollapseBound) return;               /* idempotente (boot roda 3x) */
    var collapsed = false;
    try { collapsed = localStorage.getItem(KEY) === '1'; } catch(e){}
    if (!btn) {
      var chev = summary.querySelector('.ws-chevron');
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'wsCollapseToggle';
      btn.setAttribute('aria-label', 'Recolher/expandir workspace');
      btn.textContent = '▾';
      if (chev) chev.replaceWith(btn); else summary.appendChild(btn);
    }
    function apply(state){
      ws.classList.toggle('kob-collapsed', state);
      btn.classList.toggle('kob-collapsed', state);
      btn.title = state ? 'Expandir workspace' : 'Recolher workspace';
      try { localStorage.setItem(KEY, state ? '1' : '0'); } catch(e){}
    }
    apply(collapsed);
    btn.__kobCollapseBound = true;
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();                                    /* não dispara o toggle nativo do <details> */
      apply(!ws.classList.contains('kob-collapsed'));
    });
  }

  /* ═══ Item 5: Pílulas ação-primeiro — ⊕ FUNDIR · 🎧 OUVIR · ⧉ COPIAR + chip do doc ativo ═══
     (Semente/Espelho/Abrir ficam de fora: o ⊕ já marca a semente e funde, e o card abre o leitor.) */
  function initPillActions(){
    var bar = document.getElementById('nebulaToolbar');
    if (!bar) return;
    /* [V5.11] sem botões na frente da toolbar (redundantes com os do card/pílula): só o chip do doc ativo */
    if (!document.getElementById('activeDocChip')) {
      var chip = document.createElement('span');
      chip.id = 'activeDocChip';
      bar.appendChild(chip);
    }
    updateActiveDocChip();
  }

  /* ═══ Ações sobre o documento ativo ═══*/
  function pillAct(action){
    var NP = window.NebulaPills;
    var S = window.KOBSonoro;
    var doc = NP && NP.activeDoc ? NP.activeDoc() : null;
    if(!doc && action!=='list'){
      try{ window.KBLX_TOAST && KBLX_TOAST('Selecione um documento'); }catch(e){}
      return;
    }
    var text = (doc && (doc.content || doc.name)) || '';
    var nm = String((doc && doc.name) || '').replace(/\.[^.]+$/, '');
    switch(action){
      case 'seed':
        if(NP && NP.markSeed) NP.markSeed(doc);
        if(S && doc.content) S.toSeed(doc.content);
        try{ window.KBLX_TOAST && KBLX_TOAST('🌱 Semente'); }catch(e){}
        break;
      case 'mirror':
        if(S && doc.content){ S.toMirror(doc.content); try{ KBLX_TOAST && KBLX_TOAST('🪞 Espelho'); }catch(e){} }
        else { try{ KBLX_TOAST && KBLX_TOAST('sem texto'); }catch(e){} }
        break;
      case 'fuse':
        if(NP && NP.fundirComSemente) NP.fundirComSemente(doc);
        break;
      case 'hear':
        if(NP && NP.hearToggle) NP.hearToggle(doc);
        break;
      case 'copy':
        if(NP && NP.copyDoc) NP.copyDoc(doc);
        break;
      case 'speak':
        if(S) S.playText(text, nm);
        else if(NP && NP.speak) NP.speak(text.slice(0,5000));
        break;
      case 'open':
        if(NP && NP.openReader) NP.openReader(doc);
        break;
      case 'list':
        var bar = document.getElementById('docPillsBar');
        if(bar){ bar.style.display = (bar.style.display==='none') ? '' : 'none'; }
        var pillsBtn = document.getElementById('btnPills');
        if(pillsBtn) pillsBtn.click();
        break;
    }
    updateActiveDocChip();
  }

  function updateActiveDocChip(){
    var chip = document.getElementById('activeDocChip');
    if(!chip) return;
    try{
      var NP = window.NebulaPills;
      var doc = NP && NP.activeDoc ? NP.activeDoc() : null;
      chip.textContent = doc ? ('◉ ' + String(doc.name||'').slice(0,18)) : '';
    }catch(e){}
  }


  /* ── Boot ── */
  function boot(){
    try{ initWorkspaceCollapse(); }catch(e){ console.warn('[patch] ws collapse:', e && e.message, e && e.stack); }
    try{ initPillActions(); }catch(e){ console.warn('[patch] pills:', e && e.message, e && e.stack); }
    console.log('%c[V86-PATCH] ✓ Itens 1·2·3·4·5 aplicados', 'background:#38bdf8;color:#000;padding:2px 8px;border-radius:3px');
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  /* fallback: tenta novamente após load (elementos injetados tardiamente) */
  window.addEventListener('load', function(){ setTimeout(boot, 300); setTimeout(boot, 1500); });
  /* KOB-PERF v2: Tone.js permanece realmente sob demanda.
     startSonoroPlayback() já chama KOBLoadTone() quando o usuário solicita áudio.
     Não carregamos o motor pesado no primeiro toque genérico da interface. */
})();
