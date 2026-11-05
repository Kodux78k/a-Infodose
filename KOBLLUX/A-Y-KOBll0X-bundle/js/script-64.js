
/* ═══════════════════════════════════════════════════════════
   BLOCO F — Interatividade Total
   1) Converte [[sfx|desc]] (e [[btn:...]] não renderizados) em botões clicáveis
   2) Estende ACTIONS com todas as ações do template
   3) Controle de volume global + verificadores
   Cola antes do </body>, depois do Bloco D (MPC).
   ═══════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  if(window.__TL2_INTERATIVO__) return;
  window.__TL2_INTERATIVO__ = true;

  const $ = (s, r=document) => r.querySelector(s);
  const toast = window.toast || (m => { try{ console.log('[toast]', m); }catch(e){} });

  /* ─── volume global ─── */
  let masterVol = 0.8;
  function applyVol(){
    try{
      if(typeof Tone !== 'undefined' && Tone && Tone.Master){
        Tone.Master.volume.rampTo(Tone.gainToDb(masterVol), 0.1);
      }
    }catch(e){}
  }
  window.__setMasterVol = v => { masterVol = Math.max(0, Math.min(1.5, v)); applyVol(); };
  window.__getMasterVol = () => masterVol;

  /* ─── 1) Renderizador de [[sfx|...]] e [[btn:...]] via TreeWalker ─── */
  const RX_TOKEN = /\[\[(sfx\|[^\]]+|btn:[a-zA-Z0-9_\-:]+(?:\|[^\]]*)?)\]\]/g;

  function skipParent(el){
    let p = el;
    while(p && p.nodeType === 1){
      const t = p.tagName;
      if(t === 'CODE' || t === 'PRE' || t === 'SCRIPT' || t === 'STYLE' || t === 'TEXTAREA' || t === 'INPUT') return true;
      p = p.parentElement;
    }
    return false;
  }

  function replaceTextNode(node){
    const text = node.nodeValue;
    if(!text || !RX_TOKEN.test(text)) return;
    RX_TOKEN.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while((m = RX_TOKEN.exec(text)) !== null){
      if(m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const inner = m[1];
      if(inner.indexOf('sfx|') === 0){
        const desc = inner.slice(4).trim();
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn action sfx-btn';
        btn.setAttribute('data-sfx', desc);
        btn.textContent = '\uD83D\uDD0A ' + desc;
        frag.appendChild(btn);
      } else {
        const rest = inner.slice(4);
        const pipe = rest.indexOf('|');
        const act = (pipe >= 0 ? rest.slice(0, pipe) : rest).trim();
        const label = (pipe >= 0 ? rest.slice(pipe+1) : act).trim();
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn action';
        btn.setAttribute('data-action', act);
        btn.textContent = label || act;
        frag.appendChild(btn);
      }
      last = RX_TOKEN.lastIndex;
    }
    if(last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    if(node.parentNode) node.parentNode.replaceChild(frag, node);
  }

  let scanning = false;
  function scan(root){
    if(!root || scanning) return;
    scanning = true;
    try{
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n){
          if(!n.nodeValue) return NodeFilter.FILTER_REJECT;
          if(skipParent(n.parentElement)) return NodeFilter.FILTER_REJECT;
          RX_TOKEN.lastIndex = 0;
          return RX_TOKEN.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = [];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(replaceTextNode);
    }catch(e){}
    scanning = false;
  }

  // observer: qualquer conteúdo novo adicionado é escaneado
  const obs = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => { if(n.nodeType === 1) scan(n); });
    });
  });
  if(document.body) obs.observe(document.body, { childList:true, subtree:true });
  // scan inicial (com retry até o body existir)
  function bootScan(){ if(document.body){ scan(document.body); } else { setTimeout(bootScan, 100); } }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootScan);
  else bootScan();

  /* ─── 2) Ações extendidas ─── */
  function addAction(name, fn){
    try{ if(typeof ACTIONS !== 'undefined') ACTIONS[name] = fn; }catch(e){}
    try{ window.ACTIONS = window.ACTIONS || {}; window.ACTIONS[name] = fn; }catch(e){}
    F_ACTIONS[name] = fn;
  }
  const F_ACTIONS = {};

  // trilha / som
  addAction('play_trilha', (el) => {
    if(window.KOBMPC && typeof window.KOBMPC.play === 'function'){
      window.KOBMPC.play();
      toast('\u25B6 Trilha ligada (MPC)');
    } else {
      window.dispatchEvent(new CustomEvent('kob:track:request', {detail:{when:'now'}}));
      toast('\u25B6 Trilha solicitada');
    }
  });
  addAction('pause_trilha', (el) => {
    if(window.KOBMPC && typeof window.KOBMPC.stop === 'function'){
      window.KOBMPC.stop();
      toast('\u23F8 Trilha pausada');
    }
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  });
  addAction('mais_volume', () => {
    masterVol = Math.min(1.5, masterVol + 0.15);
    applyVol();
    toast('\uD83D\uDD0A Volume: ' + Math.round(masterVol*100) + '%');
  });
  addAction('menos_volume', () => {
    masterVol = Math.max(0, masterVol - 0.15);
    applyVol();
    toast('\uD83D\uDD09 Volume: ' + Math.round(masterVol*100) + '%');
  });

  // navegação
  addAction('proxima_cena', () => {
    const hs = Array.from(document.querySelectorAll('#root h1, #root h2, #root h3, #root h4, .sec h2'));
    const next = hs.find(h => h.getBoundingClientRect().top > 100);
    if(next){ next.scrollIntoView({behavior:'smooth', block:'start'}); toast('\u279C ' + (next.textContent||'').trim().slice(0,40)); }
    else if(window.ACTIONS && typeof window.ACTIONS.ttsNext === 'function'){ window.ACTIONS.ttsNext(); }
    else toast('Fim do livro \uD83C\uDFC1');
  });
  addAction('reiniciar', () => {
    window.scrollTo({top:0, behavior:'smooth'});
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    toast('\u21BB Recomeçou do topo');
  });

  // verificadores
  addAction('chk_som', () => {
    const t = typeof Tone !== 'undefined';
    const s = !!(window.KOBSonoro);
    const m = !!(window.KOBMPC);
    toast('\uD83D\uDD0A Som: Tone=' + (t?'\u2713':'\u2717') + ' Soneto=' + (s?'\u2713':'\u2717') + ' MPC=' + (m?'\u2713':'\u2717'));
    if(window.KOBSonoro && window.KOBSonoro.sfx) window.KOBSonoro.sfx('bolha cristalina ascendente');
  });
  addAction('chk_arquetipos', () => {
    const names = window.KOBTextEvents && window.KOBTextEvents.archNames ? window.KOBTextEvents.archNames().length : 17;
    const evs = window.KOBTextBridge ? window.KOBTextBridge.events.length : 'n/d';
    toast('\uD83C\uDFAD ' + names + ' arquétipos registrados · eventos no texto: ' + evs);
    if(window.KOBSonoro && window.KOBSonoro.transition) window.KOBSonoro.transition('KOBLLUX');
  });
  addAction('chk_sfx', () => {
    if(window.KOBSonoro && window.KOBSonoro.sfx){
      window.KOBSonoro.sfx('portal transicao');
      toast('\u2728 SFX OK — tocou portal');
    } else toast('\u274C KOBSonoro.sfx não disponível');
  });
  addAction('chk_botoes', () => {
    const n = document.querySelectorAll('button.btn.action').length;
    toast('\uD83D\uDD18 ' + n + ' botões ativos na página');
  });
  addAction('chk_voz', () => {
    const on = !!(window.__tts_on);
    const sp = 'speechSynthesis' in window;
    toast('\uD83D\uDC44 Voz: ' + (on?'ligada':'desligada') + ' · speechSynthesis=' + (sp?'\u2713':'\u2717'));
    if(!on && window.ACTIONS && typeof window.ACTIONS.tts === 'function') window.ACTIONS.tts();
  });

  // placeholders do template (campos editáveis) — dão feedback ao clique
  ['doc_nome','tag_ecossistema','tag_modo','tag_uso','cena_titulo',
   'ident_arquetipos','ident_fluxo','estilo_microacao','tema','ARCH1','ARCH2','ARCH3','ARCH4',
   'narrador','falainicial','sentir','caos','exp2','pedido','fechofala','resultado',
   'sec_titulo','sec_resumo','sec_ponto2','sec_ponto3','sec_contexto','sec_acao',
   'ritual_nome','ritual_contexto','ritual_passo1','ritual_passo2','ritual_mantra',
   'chk_dor','chk_virada','chk_callouts','chk_titulos','chk_identidade','ex_nota'].forEach(name => {
    addAction(name, (el) => {
      const label = el && el.textContent ? el.textContent.trim() : name;
      toast('\u270F\uFE0F Edit\u00E1vel: ' + label.slice(0, 40));
    });
  });

  /* ─── 3) Click delegation: SFX + fallback de ações ─── */
  document.addEventListener('click', (e) => {
    // botão SFX
    const sfxBtn = e.target.closest && e.target.closest('[data-sfx]');
    if(sfxBtn){
      e.preventDefault();
      const desc = sfxBtn.getAttribute('data-sfx') || '';
      if(window.KOBSonoro && typeof window.KOBSonoro.sfx === 'function'){
        window.KOBSonoro.sfx(desc);
      } else {
        window.dispatchEvent(new CustomEvent('kob:sfx', { detail:{ desc } }));
      }
      toast('\uD83D\uDD0A ' + desc);
      return;
    }
    // ação não tratada pelo ACTIONS original
    const a = e.target.closest && e.target.closest('[data-action]');
    if(!a) return;
    const act = a.getAttribute('data-action');
    if(!act) return;
    let originalHas = false;
    try{ if(typeof ACTIONS !== 'undefined' && ACTIONS[act]) originalHas = true; }catch(e){}
    if(originalHas) return; // o handler original cuida
    if(F_ACTIONS[act]){ e.preventDefault(); F_ACTIONS[act](a); }
  }, true); // captura pra rodar antes e não conflitar

  // garante volume aplicado quando Tone carregar
  const iv = setInterval(() => {
    if(typeof Tone !== 'undefined' && Tone && Tone.Master){ clearInterval(iv); applyVol(); }
  }, 500);
  setTimeout(() => clearInterval(iv), 15000);

  console.log('[TL2] Interatividade Total pronta — SFX viram botões, todas as ações respondem');
})();
