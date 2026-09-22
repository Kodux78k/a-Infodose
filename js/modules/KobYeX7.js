/* ===== source-https-www-infodose-com-br-js-kob-outline-uni-js.js ===== */
/* SOURCE: https://www.infodose.com.br/js/kob-outline-uni.js */


document.addEventListener('DOMContentLoaded', () => {

  const iframe = document.getElementById('frame');

  if (!iframe) return;

  function rebindTTS() {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      if (!doc) return;

      console.log('🔁 Rebinding COBTTS...');

      // limpa estados antigos (se existir)
      if (window.kobTTS && typeof window.kobTTS.reset === 'function') {
        window.kobTTS.reset();
      }

      // fallback: remover classes antigas
      document.querySelectorAll('.kob-tts-active')
        .forEach(el => el.classList.remove('kob-tts-active'));

      // 🔥 aqui você reativa leitura no NOVO DOM
      if (window.kobInitTTS) {
        window.kobInitTTS(doc);
      }

      // fallback universal (caso não tenha API exposta)
      window.__kob_doc = doc;

    } catch (err) {
      console.warn('Erro no rebind:', err);
    }
  }

  // dispara quando iframe carrega nova página
  iframe.addEventListener('load', () => {
    setTimeout(rebindTTS, 120); // pequeno delay evita race condition
  });

});








document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('frame');
  if (!iframe) return;

  let boundDoc = null;

  function onDocClick(ev) {
    const selector = 'h1,h2,h3,p,li,blockquote,pre,td,th';
    const target = ev.target && ev.target.closest ? ev.target.closest(selector) : null;
    if (!target) return;

    // ignora cliques no HUD da página pai, caso a função seja reaproveitada
    if (target.closest && (target.closest('#symbolBar') || target.closest('.kob-tts-dock'))) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc) return;

      // reindexa antes de achar o bloco
      if (window.KOBLLUX && typeof window.KOBLLUX.rebuildBlocks === 'function') {
        window.KOBLLUX.rebuildBlocks();
      }

      const blocks = [...doc.querySelectorAll(selector)].filter(n => (n.innerText || '').trim().length > 0);
      let idx = blocks.findIndex(b => b.isEqualNode && b.isEqualNode(target));

      if (idx < 0) {
        const ttext = (target.innerText || '').trim();
        idx = blocks.findIndex(b => (b.innerText || '').trim() === ttext);
      }

      if (idx >= 0 && window.KOBLLUX && window.KOBLLUX.state) {
        window.KOBLLUX.state.currentBlockIdx = idx;
      }

      if (window.KOBLLUX && typeof window.KOBLLUX.startSpeech === 'function') {
        const prefs = (window.StorageSafe && StorageSafe.get)
          ? StorageSafe.get('prefs', { outline: true, clickToSpeak: true })
          : { clickToSpeak: true };

        if (prefs.clickToSpeak) {
          window.KOBLLUX.state.isSpeaking = true;
          window.KOBLLUX.startSpeech();
        }
      }
    } catch (err) {
      console.warn('click-to-speak failed:', err);
    }
  }

  function onDocSelectionSpeak() {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc) return;

      const selected = String(doc.getSelection ? doc.getSelection() : window.getSelection());
      if (!selected || !selected.trim()) return;

      const text = selected.trim();
      if (window.KOBLLUX && typeof window.KOBLLUX.speakText === 'function') {
        window.KOBLLUX.speakText(text, {});
      }
    } catch (err) {
      console.warn('selection speak failed:', err);
    }
  }

  function bindIframeDoc() {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || doc === boundDoc) return;

      boundDoc = doc;

      // remove listener antigo, se houver
      if (doc.__kobTtsClickBound) return;
      doc.__kobTtsClickBound = true;

      doc.addEventListener('click', onDocClick, { passive: true });
      doc.addEventListener('pointerup', onDocSelectionSpeak, { passive: true });

      console.log('KOBTTS click trigger bound ✓');
    } catch (err) {
      console.warn('bindIframeDoc failed:', err);
    }
  }

  function rebindAll() {
    if (window.KOBLLUX && typeof window.KOBLLUX.rebuildBlocks === 'function') {
      window.KOBLLUX.rebuildBlocks();
    }

    if (window.KOBLLUX && typeof window.KOBLLUX.updateArchetype === 'function') {
      try {
        window.KOBLLUX.updateArchetype(window.KOBLLUX.state?.archIdx || 0);
      } catch (e) {}
    }

    bindIframeDoc();
  }

  iframe.addEventListener('load', () => {
    setTimeout(rebindAll, 120);
  });

  bindIframeDoc();
});

/* ===== source-https-www-infodose-com-br-js-kob-js.js ===== */
/* SOURCE: https://www.infodose.com.br/js/kob.js */

// kob-glue-dh10.js — final, limpo, pronto para substituir o monólito
(function(){
  'use strict';
  if(window.__KOBLLUX_MONOLITH_FIXED_INIT__) { console.log('KOBLLUX fixed already init'); return; }
  window.__KOBLLUX_MONOLITH_FIXED_INIT__ = true;

  /* -----------------------------
     DOM helpers & toast
     ----------------------------- */
  const $ = (q,r=document)=> r && r.querySelector ? r.querySelector(q) : null;
  const $$ = (q,r=document)=> r && r.querySelectorAll ? [...r.querySelectorAll(q)] : [];
  const toastEl = $('#kx_toast') || null;
  function toast(msg, ms=1400){
    if(!toastEl){ console.log('KOBLLUX.toast:', msg); return; }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(()=> toastEl.style.opacity='0', ms);
  }

  /* -----------------------------
     UI elements (tolerant selectors)
     ----------------------------- */
  const bar = $('#symbolBar') || document.querySelector('symbol-bar') ;
  const toggleBtn = $('#toggleBtn') || document.querySelector('main-toggle');
  const frame = $('#content-frame') || $('#frame') || $('#navFrame') || document.querySelector('iframe');
  const root = $('#root') || document.body;
  const hudStatus = $('#hudStatus');
  const outline = $('#kob-tts-outline') || (() => {
    const el = document.createElement('div');
    el.id = 'kob-tts-outline';
    el.style.position = 'absolute';
    el.style.pointerEvents = 'none';
    el.style.display = 'none';
    
    /* document.body.appendChild(el); */
    
    document.querySelector('.content').appendChild(el);

    return el;
  })();

  const BTN_PLAY = $('#btn-play');
  const BTN_NEXT = $('#btn-next');
  const BTN_PREV = $('#btn-prev');
  const BTN_ARCH = $('#btn-arch')|| document.querySelector('orb') ;

  /* -----------------------------
     Archetypes (keep structure compat)
     ----------------------------- *
  const ARCHETYPES = [
    { id:'kobllux', name:'KOBLLUX', voice:'Luciana',   lang:'pt-BR', rate:0.98, pitch:0.48, color:'#22D3EE' },
    { id:'kodux',   name:'KODUX',   voice:'Luciana',   lang:'pt-BR', rate:0.86, pitch:0.68, color:'#F97316' },
    { id:'atlas',   name:'ATLAS',   voice:'Reed',    lang:'en-US',  rate:1.00, pitch:0.93, color:'#38BDF8' },
    { id:'nova',    name:'NOVA',    voice:'Luciana', lang:'pt-BR',  rate:1.06, pitch:1.34, color:'#F97316' },
    { id:'vitalis', name:'VITALIS', voice:'Rocko',   lang:'pt-BR',  rate:0.96, pitch:1.42, color:'#22C55E' },
    { id:'pulse',   name:'PULSE',   voice:'Reed',    lang:'pt-BR',  rate:1.00, pitch:1.14, color:'#EC4899' },
    { id:'artemis', name:'ARTEMIS', voice:'Paulina', lang:'es-MX',  rate:1.00, pitch:1.23, color:'#A855F7' },
    { id:'serena',  name:'SERENA',  voice:'Joana',   lang:'pt-BR',  rate:0.92, pitch:0.90, color:'#38BDF8' },
    { id:'kaos',    name:'KAOS',    voice:'Rocko',   lang:'pt-BR',  rate:1.09, pitch:1.28, color:'#FACC15' },
    { id:'genus',   name:'GENUS',   voice:'Reed',    lang:'pt-BR',  rate:0.98, pitch:1.23, color:'#E5E7EB' },
    { id:'lumine',  name:'LUMINE',  voice:'Flo',     lang:'fr-FR',  rate:1.03, pitch:1.55, color:'#FDE047' },
    { id:'solus',   name:'SOLUS',   voice:'Satu',    lang:'fi-FI',  rate:0.96, pitch:0.87, color:'#0EA5E9' },
    { id:'rhea',    name:'RHEA',    voice:'Alice',   lang:'it-IT',  rate:1.02, pitch:0.59, color:'#22C55E' },
    { id:'aion',    name:'AION',    voice:'Monica',  lang:'es-ES',  rate:0.88, pitch:0.30, color:'#4F46E5' },
    { id:'uno',      name:'UNO',      voice:'Grandma', lang:'en-US', rate:0.90, pitch:0.93, color:'#F97316' },
    { id:'dual',     name:'DUAL',     voice:'Milena',    lang:'ru-RU', rate:1.02, pitch:1.02, color:'#06B6D4' },
    { id:'trinity',  name:'TRINITY',  voice:'Sandy',   lang:'en-US', rate:1.04, pitch:1.04, color:'#EC4899' },
    { id:'infodose', name:'INFODOSE', voice:'Luciana', lang:'pt-BR', rate:1.06, pitch:0.96, color:'#22C55E' },
    { id:'horus', name:'HORUS', voice:'Majed', lang:'ar-001', rate:0.94, pitch:0.82, color:'#F59E0B' }
  ];
  
*/
/* ─────────────────────────────────────────────
   ARCHETYPES · Unified Voice + Theme Registry
   usado por:
   - kob-glue-dh10.js
   - kob-voice-engine.js
   ───────────────────────────────────────────── */
 const ARCHETYPES = [

  {
    id:'kobllux',
    name:'KOBLLUX',
    voice:'Luciana',
    lang:'pt-BR',
    rate:0.98,
    pitch:0.39,
    color:'#22D3EE',
    theme:{
      primary:'#22D3EE',
      secondary:'#7dd3fc',
      bgSoft:'radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)',
      glow:'0 0 18px rgba(34,211,238,.55)'
    }
  },

  {
    id:'kodux',
    name:'KODUX',
    voice:'Rocko',
    lang:'pt-BR',
    rate:0.86,
    pitch:0.18,
    color:'#F97316',
    theme:{
      primary:'#F97316',
      secondary:'#fb923c',
      bgSoft:'radial-gradient(circle at 60% 30%, rgba(249,115,22,.08), transparent)',
      glow:'0 0 18px rgba(249,115,22,.55)'
    }
  },

  {
    id:'atlas',
    name:'ATLAS',
    voice:'Reed',
    lang:'en-US',
    rate:1.00,
    pitch:0.78,
    color:'#78e3ff',
    theme:{
      primary:'#78e3ff',
      secondary:'#b978ff',
      bgSoft:'radial-gradient(circle at 40% 10%, rgba(120,227,255,.07), transparent)',
      glow:'0 0 18px rgba(120,227,255,.55)'
    }
  },

  {
    id:'nova',
    name:'NOVA',
    voice:'Luciana',
    lang:'pt-BR',
    rate:1.06,
    pitch:1.39,
    color:'#ff6b6b',
    theme:{
      primary:'#ff6b6b',
      secondary:'#ffb347',
      bgSoft:'radial-gradient(circle at 70% 20%, rgba(255,107,107,.08), transparent)',
      glow:'0 0 18px rgba(255,107,107,.55)'
    }
  },

  {
    id:'vitalis',
    name:'VITALIS',
    voice:'Rocko',
    lang:'pt-BR',
    rate:0.96,
    pitch:1.39,
    color:'#4ecdc4',
    theme:{
      primary:'#4ecdc4',
      secondary:'#45b7d1',
      bgSoft:'radial-gradient(circle at 50% 30%, rgba(78,205,196,.08), transparent)',
      glow:'0 0 18px rgba(78,205,196,.55)'
    }
  },

  {
    id:'pulse',
    name:'PULSE',
    voice:'Reed',
    lang:'pt-BR',
    rate:1.00,
    pitch:1.48,
    color:'#a8e6cf',
    theme:{
      primary:'#a8e6cf',
      secondary:'#d4a5a5',
      bgSoft:'radial-gradient(circle at 20% 40%, rgba(168,230,207,.08), transparent)',
      glow:'0 0 18px rgba(168,230,207,.55)'
    }
  },

  {
    id:'artemis',
    name:'ARTEMIS',
    voice:'Paulina',
    lang:'es-MX',
    rate:1.00,
    pitch:1.23,
    color:'#ffd93d',
    theme:{
      primary:'#ffd93d',
      secondary:'#ff9f1c',
      bgSoft:'radial-gradient(circle at 40% 60%, rgba(255,217,61,.08), transparent)',
      glow:'0 0 18px rgba(255,217,61,.55)'
    }
  },

  {
    id:'serena',
    name:'SERENA',
    voice:'Joana',
    lang:'pt-BR',
    rate:0.92,
    pitch:0.90,
    color:'#b8e1ff',
    theme:{
      primary:'#b8e1ff',
      secondary:'#a0b9ff',
      bgSoft:'radial-gradient(circle at 60% 30%, rgba(184,225,255,.08), transparent)',
      glow:'0 0 18px rgba(184,225,255,.55)'
    }
  },

  {
    id:'kaos',
    name:'KAOS',
    voice:'Rocko',
    lang:'pt-BR',
    rate:1.09,
    pitch:1.37,
    color:'#ff8066',
    theme:{
      primary:'#ff8066',
      secondary:'#b624ff',
      bgSoft:'radial-gradient(circle at 50% 20%, rgba(255,128,102,.08), transparent)',
      glow:'0 0 18px rgba(255,128,102,.55)'
    }
  },

  {
    id:'genus',
    name:'GENUS',
    voice:'Reed',
    lang:'pt-BR',
    rate:0.98,
    pitch:1.23,
    color:'#95e1d3',
    theme:{
      primary:'#95e1d3',
      secondary:'#f38181',
      bgSoft:'radial-gradient(circle at 50% 50%, rgba(149,225,211,.08), transparent)',
      glow:'0 0 18px rgba(149,225,211,.55)'
    }
  },

  {
    id:'lumine',
    name:'LUMINE',
    voice:'Flo',
    lang:'fr-FR',
    rate:1.03,
    pitch:1.78,
    color:'#f9f3b2',
    theme:{
      primary:'#f9f3b2',
      secondary:'#ffe69b',
      bgSoft:'radial-gradient(circle at 60% 40%, rgba(249,243,178,.08), transparent)',
      glow:'0 0 18px rgba(249,243,178,.55)'
    }
  },

  {
    id:'solus',
    name:'SOLUS',
    voice:'Satu',
    lang:'fi-FI',
    rate:0.99,
    pitch:0.78,
    color:'#ffb347',
    theme:{
      primary:'#ffb347',
      secondary:'#ff8c42',
      bgSoft:'radial-gradient(circle at 40% 20%, rgba(255,179,71,.08), transparent)',
      glow:'0 0 18px rgba(255,179,71,.55)'
    }
  },

  {
    id:'rhea',
    name:'RHEA',
    voice:'Alice',
    lang:'it-IT',
    rate:1.02,
    pitch:0.45,
    color:'#b5eaea',
    theme:{
      primary:'#b5eaea',
      secondary:'#80b3ff',
      bgSoft:'radial-gradient(circle at 50% 30%, rgba(181,234,234,.08), transparent)',
      glow:'0 0 18px rgba(181,234,234,.55)'
    }
  },

  {
    id:'aion',
    name:'AION',
    voice:'Milena',
    lang:'ru-RU',
    rate:0.88,
    pitch:0.30,
    color:'#c79aff',
    theme:{
      primary:'#c79aff',
      secondary:'#9f7aff',
      bgSoft:'radial-gradient(circle at 40% 50%, rgba(199,154,255,.08), transparent)',
      glow:'0 0 18px rgba(199,154,255,.55)'
    }
  },

  {
    id:'uno',
    name:'UNO',
    voice:'Grandma',
    lang:'en-US',
    rate:0.90,
    pitch:0.13,
    color:'#f97316',
    theme:{
      primary:'#f97316',
      secondary:'#fb923c',
      bgSoft:'radial-gradient(circle at 50% 20%, rgba(249,115,22,.08), transparent)',
      glow:'0 0 18px rgba(249,115,22,.55)'
    }
  },

  {
    id:'dual',
    name:'DUAL',
    voice:'Luciana',
    lang:'pt-BR',
    rate:1.02,
    pitch:1.02,
    color:'#06b6d4',
    theme:{
      primary:'#06b6d4',
      secondary:'#67e8f9',
      bgSoft:'radial-gradient(circle at 60% 30%, rgba(6,182,212,.08), transparent)',
      glow:'0 0 18px rgba(6,182,212,.55)'
    }
  },

  {
    id:'trinity',
    name:'TRINITY',
    voice:'Sandy',
    lang:'en-US',
    rate:1.04,
    pitch:0.33,
    color:'#ec4899',
    theme:{
      primary:'#ec4899',
      secondary:'#f472b6',
      bgSoft:'radial-gradient(circle at 50% 40%, rgba(236,72,153,.08), transparent)',
      glow:'0 0 18px rgba(236,72,153,.55)'
    }
  },

  {
    id:'infodose',
    name:'INFODOSE',
    voice:'Luciana',
    lang:'pt-BR',
    rate:1.06,
    pitch:0.96,
    color:'#22c55e',
    theme:{
      primary:'#22c55e',
      secondary:'#4ade80',
      bgSoft:'radial-gradient(circle at 60% 40%, rgba(34,197,94,.08), transparent)',
      glow:'0 0 18px rgba(34,197,94,.55)'
    }
  },

  {
    id:'horus',
    name:'HORUS',
    voice:'Flo',
    lang:'it-IT',
    rate:1.24,
    pitch:0.14,
    color:'#f59e0b',
    theme:{
      primary:'#f59e0b',
      secondary:'#fbbf24',
      bgSoft:'radial-gradient(circle at 40% 30%, rgba(245,158,11,.08), transparent)',
      glow:'0 0 18px rgba(245,158,11,.55)'
    }
  }

];


  /* -----------------------------
     State & Storage
     ----------------------------- */
  let state = {
    archIdx: 0,
    isSpeaking: false,
    blocks: [],
    currentBlockIdx: 0,
    isCollapsed: localStorage.getItem('kob_collapsed') === 'true'
  };

  const KOB_NS = 'kob_tts::v1::';
  const PST = k => KOB_NS + k;
  const StorageSafe = {
    get(k,d=null){ try{ const v = localStorage.getItem(PST(k)); return v==null? d : JSON.parse(v); }catch{return d} },
    set(k,v){ try{ localStorage.setItem(PST(k), JSON.stringify(v)); }catch{} }
  };

  /* -----------------------------
     Speech API (fallback)
     ----------------------------- */
  const synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  if(!synth) toast('SpeechSynthesis não disponível');

  /* -----------------------------
     Idle & position helpers
     ----------------------------- */
  const IDLE_TIME = 9000;
  let idleTimer = null;
  function resetIdleTimer(){ if(!bar) return; bar.classList.remove('idle'); clearTimeout(idleTimer); idleTimer = setTimeout(()=> { if(!state.isCollapsed) bar.classList.add('idle'); }, IDLE_TIME); }

  function applyPosition(x,y){
    if(!bar) return;
    const maxX = window.innerWidth - bar.offsetWidth;
    const maxY = window.innerHeight - bar.offsetHeight;
    x = Math.max(0, Math.min(maxX, x)); y = Math.max(0, Math.min(maxY, y));
    bar.style.left = x + 'px'; bar.style.top = y + 'px';
    bar.classList.remove('snap-side','snap-side-right','snap-top','floating');
    if(y <= 40) bar.classList.add('snap-top');
    else if(x <= 40) bar.classList.add('snap-side');
    else if(x >= maxX - 40) bar.classList.add('snap-side-right');
    else bar.classList.add('floating');
  }

  function snapToEdges(){
    if(!bar) return;
    bar.style.transition = 'all .36s cubic-bezier(.175,.885,.32,1.275)';
    const r = bar.getBoundingClientRect();
    let x = r.left, y = r.top;
    if(y < 40){ y = 0; x = (window.innerWidth - r.width)/2; }
    else {
      if(x < 40) x = 0;
      if(x > window.innerWidth - r.width - 40) x = window.innerWidth - r.width;
    }
    applyPosition(x,y);
    try{ localStorage.setItem('kob_hud_pos', JSON.stringify({x,y})); }catch(e){}
    setTimeout(()=> bar.style.transition = '', 420);
  }

  /* -----------------------------
     Restore pos & HUD setup
     ----------------------------- */
  (function restore(){
    if(!bar) return;
    try{
      const s = JSON.parse(localStorage.getItem('kob_hud_pos') || '{"x":20,"y":120}');
      applyPosition(s.x, s.y);
    }catch(e){
      applyPosition(20,120);
    }
    if(state.isCollapsed) bar.classList.add('collapsed');
  })();

  (function setupHUD(){
    if(!bar) return;
    let dragging=false, start={x:0,y:0,ox:0,oy:0};
    bar.addEventListener('pointerdown', e => {
      if(e.target.closest('.symbol-button')) return;
      dragging = true; bar.classList.add('is-dragging');
      const rect = bar.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, ox: e.clientX - rect.left, oy: e.clientY - rect.top };
      try{ bar.setPointerCapture(e.pointerId); }catch{}
    });
    bar.addEventListener('pointermove', e => {
      if(!dragging) return;
      bar.style.transition = 'none';
      applyPosition(e.clientX - start.ox, e.clientY - start.oy);
    });
    bar.addEventListener('pointerup', e => {
      if(!dragging) return;
      dragging = false; bar.classList.remove('is-dragging');
      try{ bar.releasePointerCapture(e.pointerId); }catch{}
      snapToEdges();
    });

    toggleBtn && toggleBtn.addEventListener('click', ()=>{
      state.isCollapsed = !state.isCollapsed;
      bar.classList.toggle('collapsed', state.isCollapsed);
      localStorage.setItem('kob_collapsed', state.isCollapsed);
      setTimeout(snapToEdges, 320);
    });

    ['mousemove','touchstart','mousedown','pointerdown'].forEach(ev=>{
      window.addEventListener(ev, resetIdleTimer, {passive:true});
    });
    resetIdleTimer();
  })();

  /* -----------------------------
     Symbol bar handler
     ----------------------------- */
  (function attachSymbolBarHandler(){
    if(!bar) return;
    bar.removeEventListener && bar.removeEventListener('click', ()=>{});
    bar.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.symbol-button');
      if(!btn) return;

      // URL open buttons
      if(btn.dataset && btn.dataset.url){
        const url = String(btn.dataset.url).trim();
        if(url){
          try{
            if(frame && ('src' in frame)) frame.src = url;
            localStorage.setItem('kob_last_url', url);
            toast('Abrindo ' + url);
          }catch(e){
            console.warn('Erro ao abrir iframe:', e);
            toast('Erro ao abrir URL');
          }
        }
        return;
      }

      
      
      
      // TTS controls
      const bid = (btn.id || btn.dataset.id || btn.dataset.action || '').toString();

      const callTTS = (fnName) => {
        try{
          if(window.KOB_TTS && typeof window.KOB_TTS[fnName] === 'function'){
            window.KOB_TTS[fnName]();
            return true;
          }
          if(window.KOBLLUX && typeof window.KOBLLUX[fnName] === 'function'){
            window.KOBLLUX[fnName]();
            return true;
          }
          return false;
        }catch(err){
          console.warn('callTTS error', err);
          return false;
        }
      };

      switch(bid){
        case 'btn-play':
          callTTS('toggle') || callTTS('play') || callTTS('startSpeech') || callTTS('stopSpeech') || toast('TTS indisponível');
          break;
        case 'btn-next':
          callTTS('next') || (function(){
            if(window.KOBLLUX && window.KOBLLUX.state){
              window.KOBLLUX.state.currentBlockIdx = Math.min((window.KOBLLUX.state.blocks||[]).length-1, (window.KOBLLUX.state.currentBlockIdx||0)+1);
              if(window.KOBLLUX.state.isSpeaking) window.KOBLLUX.startSpeech && window.KOBLLUX.startSpeech();
            }
          })();
          break;
        case 'btn-prev':
          callTTS('prev') || (function(){
            if(window.KOBLLUX && window.KOBLLUX.state){
              window.KOBLLUX.state.currentBlockIdx = Math.max(0, (window.KOBLLUX.state.currentBlockIdx||0)-1);
              if(window.KOBLLUX.state.isSpeaking) window.KOBLLUX.startSpeech && window.KOBLLUX.startSpeech();
            }
          })();
          break;
        case 'btn-arch':
          callTTS('cycleArchetype') || (window.KOBLLUX && window.KOBLLUX.updateArchetype && window.KOBLLUX.updateArchetype((window.KOBLLUX.state.archIdx||0)+1));
          break;
        default:
          if(btn.dataset && btn.dataset.action === 'open-menu') toggleBtn && toggleBtn.click();
          break;
      }
    }, { passive: true });
  })();

  /* -----------------------------
     small util
     ----------------------------- */
  function hexToRgba(hex,a){ const c=(hex||'#000').replace('#',''); const r=parseInt(c.slice(0,2),16), g=parseInt(c.slice(2,4),16), b=parseInt(c.slice(4,6),16); return `rgba(${r},${g},${b},${a})`; }


/*function applyVoiceTheme(arch){

  const root = document.documentElement;

  root.style.setProperty('--kob-voice-primary', arch.theme.primary);
  root.style.setProperty('--kob-voice-secondary', arch.theme.secondary);
  root.style.setProperty('--kob-voice-bg-soft', arch.theme.bgSoft);
  root.style.setProperty('--kob-voice-glow', arch.theme.glow);

  document.body.dataset.voiceArch = arch.id;

}*/
  function applyVoiceTheme(arch) {
  if (!arch || !arch.theme) return;

  const root = document.documentElement;
  const body = document.body;

  const primary   = arch.theme.primary;
  const secondary = arch.theme.secondary;
  const soft      = arch.theme.soft || arch.theme.bgSoft;
  const glow      = arch.theme.glow;

  /* ─────────────
     TTS SYSTEM
  ───────────── */

  root.style.setProperty('--kob-tts-primary', primary);
  root.style.setProperty('--kob-tts-secondary', secondary);
  root.style.setProperty('--kob-tts-soft', soft);
  root.style.setProperty('--kob-tts-glow', glow);

  /* ─────────────
     VOICE SYSTEM (legacy)
  ───────────── */

  root.style.setProperty('--kob-voice-primary', primary);
  root.style.setProperty('--kob-voice-secondary', secondary);
  root.style.setProperty('--kob-voice-bg-soft', soft);
  root.style.setProperty('--kob-voice-glow', glow);

  /* ─────────────
     ARCH STATE
  ───────────── */

  body.setAttribute('data-voice-arch', arch.id);
}

  /* -----------------------------
     updateArchetype: update CSS + call engine.applyVoiceTheme if available
     ----------------------------- */
  function updateArchetype(idx){
    state.archIdx = (typeof idx === 'number') ? (idx % ARCHETYPES.length) : 0;
    const arch = ARCHETYPES[state.archIdx] || ARCHETYPES[0];

    // If engine available and has applyVoiceTheme, prefer engine to update UI theme
    try{
      if(window.KOBLLUX_VOICE_ENGINE && typeof window.KOBLLUX_VOICE_ENGINE.applyVoiceTheme === 'function'){
        // engine will handle CSS vars and body[data-voice-arch]
        window.KOBLLUX_VOICE_ENGINE.applyVoiceTheme(Object.assign({}, arch, { id: arch.id }));
      } else {
        // defensive local CSS vars
        const primary = arch.color || '#00f5ff';
        const soft = hexToRgba(primary, 0.14);
        document.documentElement.style.setProperty('--kob-voice-primary', primary);
        document.documentElement.style.setProperty('--kob-voice-secondary', primary);
        document.documentElement.style.setProperty('--kob-voice-bg-soft', soft);
        document.documentElement.style.setProperty('--kob-voice-outline', hexToRgba(primary, 0.28));
        if(document.body) document.body.setAttribute('data-voice-arch', arch.id);
      }
      if(hudStatus) hudStatus.textContent = arch.name;
    }catch(e){
      console.warn('updateArchetype fail', e);
    }

    try{
      if(outline){
        const primary = arch.color || '#00f5ff';
        outline.style.borderColor = primary;
        outline.style.boxShadow = `0 0 12px ${hexToRgba(primary,0.45)}, inset 0 0 8px ${hexToRgba(primary,0.2)}`;
        outline.style.background = hexToRgba(primary,0.06);
      }
    }catch(e){ console.warn('applyArchetypeTheme outline fail', e); }

    if(state.isSpeaking){ stopSpeech(); startSpeech(); }
  }

  /* -----------------------------
     Blocks scanning & status
     ----------------------------- */
  function scanBlocks(){
    try{
      const sel = 'h1,h2,h3,p,li,blockquote,pre,td,th';
      if(frame && frame.contentWindow){
        const doc = frame.contentDocument || frame.contentWindow.document;
        const nodes = [...doc.querySelectorAll(sel)].filter(n=> (n.innerText||'').trim().length > 0);
        if(nodes.length){ state.blocks = nodes; state.currentBlockIdx = 0; return; }
      }
    }catch(e){ /* cross-origin or other */ }

    const localNodes = [...(root.querySelectorAll ? root.querySelectorAll('h1,h2,h3,p,li,blockquote,pre,td,th') : [])].filter(n=> (n.innerText||'').trim().length > 0);
    state.blocks = localNodes;
    state.currentBlockIdx = 0;
  }

  function rebuildBlocks(){ scanBlocks(); setStatus(); }
  function setStatus(){ const el = $('#tts-status'); if(!el) return; if(!state.blocks.length) el.textContent='0/0'; else el.textContent = `${Math.min(state.currentBlockIdx+1, state.blocks.length)}/${state.blocks.length}`; }

  function showOutlineFor(node){
    if(!outline || !node){ outline.style.display='none'; return; }
    try{
      const rect = node.getBoundingClientRect();
      if(node.ownerDocument !== document && frame){
        const fRect = frame.getBoundingClientRect();
        outline.style.left = (fRect.left + rect.left) + 'px';
        outline.style.top = (fRect.top + rect.top) + 'px';
      } else {
        outline.style.left = (rect.left + window.scrollX) + 'px';
        outline.style.top = (rect.top + window.scrollY) + 'px';
      }
      outline.style.width = (rect.width + 8) + 'px';
      outline.style.height = (rect.height + 8) + 'px';
      outline.style.display = 'block';
    }catch(e){ outline.style.display = 'none'; }
  }
  function hideOutline(){ if(outline) outline.style.display = 'none'; }

  /* -----------------------------
     voice helpers (fallback)
     ----------------------------- */
  function findVoiceByNamePart(part){
    if(!synth) return null;
    const voices = synth.getVoices()||[];
    const v = voices.find(x => x.name && x.name.toLowerCase().includes(String(part||'').toLowerCase()));
    if(v) return v;
    return voices.find(x => /pt/i.test(x.lang)) || voices[0] || null;
  }

  /* -----------------------------
     speakCurrent() — uses engine when available, fallback to local synth
     ----------------------------- */
  function speakCurrent(){
    if(!state.blocks.length) rebuildBlocks();
    if(state.currentBlockIdx >= state.blocks.length){ stopSpeech(); toast('Fim da leitura'); return; }

    const el = state.blocks[state.currentBlockIdx];
    const arch = ARCHETYPES[state.archIdx] || ARCHETYPES[0];
    const txt = (el && el.innerText) ? el.innerText.trim() : '';
    if(!txt){ state.currentBlockIdx++; setStatus(); return speakCurrent(); }

    // Try to delegate to the voice engine
    const engine = window.KOBLLUX_VOICE_ENGINE || null;
    if(engine && typeof engine.activateArchetype === 'function' && typeof engine.speakWithCurrentArchetype === 'function'){
      try{
        engine.activateArchetype(arch.id);
        const ok = engine.speakWithCurrentArchetype(txt, {
          onStart(){
            showOutlineFor(el);
            setStatus();
          },
          onEnd(){
            if(state.isSpeaking){
              state.currentBlockIdx++;
              setTimeout(speakCurrent, 120);
            }
          },
          onError(){
            state.currentBlockIdx++;
            speakCurrent();
          }
        });
        if(ok) return;
      }catch(e){
        console.warn('voice engine call failed, falling back:', e);
      }
    }

    // fallback: use local SpeechSynthesis
    if(!synth){ toast('TTS indisponível'); return; }
    try{ synth.cancel(); }catch(e){}
    const u = new SpeechSynthesisUtterance(txt);
    const voice = findVoiceByNamePart(arch.voice);
    if(voice) u.voice = voice;
    if(arch.lang) u.lang = arch.lang;
    u.rate = arch.rate ?? 1;
    u.pitch = arch.pitch ?? 1;
    u.onstart = () => { showOutlineFor(el); setStatus(); };
    u.onend = () => {
      if(state.isSpeaking){ state.currentBlockIdx++; setStatus(); setTimeout(()=> speakCurrent(), 120); }
    };
    u.onerror = (ev) => { console.warn('tts error', ev); if(state.isSpeaking){ state.currentBlockIdx++; speakCurrent(); } };
    synth.speak(u);
  }

  /* -----------------------------
     start/stop
     ----------------------------- */
  function startSpeech(){
    if(!state.blocks.length) rebuildBlocks();
    if(!state.blocks.length){ toast('Nada para ler'); return; }
    state.isSpeaking = true;
    BTN_PLAY && (BTN_PLAY.textContent = '■');
    speakCurrent();
  }

  function stopSpeech(){
    state.isSpeaking = false;
    try{ synth && synth.cancel(); }catch(e){}
    BTN_PLAY && (BTN_PLAY.textContent = '▶');
    hideOutline();
    setStatus();
  }

  /* -----------------------------
     dock extras / selection read
     ----------------------------- */
  $('#tts-on') && $('#tts-on').addEventListener('click', ()=> { if(state.isSpeaking) stopSpeech(); else startSpeech(); });
  $('#tts-next') && $('#tts-next').addEventListener('click', ()=> { state.currentBlockIdx = Math.min(state.blocks.length-1, state.currentBlockIdx + 1); if(state.isSpeaking) speakCurrent(); else showOutlineFor(state.blocks[state.currentBlockIdx]); setStatus(); });
  $('#tts-prev') && $('#tts-prev').addEventListener('click', ()=> { state.currentBlockIdx = Math.max(0, state.currentBlockIdx - 1); if(state.isSpeaking) speakCurrent(); else showOutlineFor(state.blocks[state.currentBlockIdx]); setStatus(); });
  $('#tts-stop') && $('#tts-stop').addEventListener('click', ()=> stopSpeech());
  $('#tts-reset') && $('#tts-reset').addEventListener('click', ()=> { state.currentBlockIdx = 0; rebuildBlocks(); setStatus(); });
  $('#tts-reread') && $('#tts-reread').addEventListener('click', ()=> { state.currentBlockIdx = 0; startSpeech(); });
  $('#tts-sel') && $('#tts-sel').addEventListener('click', () => {
    const s = String(window.getSelection && window.getSelection());
    if (!s || !s.trim()) return toast('Selecione um trecho para ler.');

    const arch = ARCHETYPES[state.archIdx] || ARCHETYPES[0];

    // prefer engine speak
    try{
      if(window.KOBLLUX_VOICE_ENGINE && typeof window.KOBLLUX_VOICE_ENGINE.activateArchetype === 'function'){
        window.KOBLLUX_VOICE_ENGINE.activateArchetype(arch.id);
        const ok = window.KOBLLUX_VOICE_ENGINE.speakWithCurrentArchetype(s.trim(), {
          onStart(){ /* nothing */ },
          onEnd(){ /* nothing */ },
          onError(){ /* nothing */ }
        });
        if(ok) return;
      }
    }catch(e){ console.warn('engine speakWithCurrentArchetype failed', e); }

    // fallback local
    try { synth.cancel(); } catch(e){}
    const u = new SpeechSynthesisUtterance(String(sanitize(s)));
    const voice = findVoiceByNamePart(arch.voice);
    if (voice) u.voice = voice;
    if (arch.lang) u.lang = arch.lang;
    u.rate  = arch.rate ?? 1;
    u.pitch = arch.pitch ?? 1;
    synth.speak(u);
  });

  $('#tts-grid') && $('#tts-grid').addEventListener('click', ()=> {
    const prefs = StorageSafe.get('prefs', {});
    prefs.outline = !prefs.outline;
    StorageSafe.set('prefs', prefs);
    toast(prefs.outline ? 'Outline ativado' : 'Outline desativado');
  });

  function sanitize(txt){ return String(txt||'').replace(/\bCopiar\b/g,' ').replace(/\s{2,}/g,' ').trim(); }

  /* -----------------------------
     click to speak and click selection logic
     ----------------------------- */
  document.addEventListener('click', (ev) => {
    const selector = 'h1,h2,h3,p,li,blockquote,pre,td,th';
    const target = ev.target.closest ? ev.target.closest(selector) : null;
    if(!target) return;
    if(target.closest && (target.closest('#symbolBar') || target.closest('.kob-tts-dock'))) return;
    rebuildBlocks();
    let idx = state.blocks.findIndex(b => b.isEqualNode && b.isEqualNode(target));
    if(idx < 0){
      const ttext = (target.innerText || '').trim();
      idx = state.blocks.findIndex(b => (b.innerText||'').trim() === ttext);
    }
    if(idx >= 0) state.currentBlockIdx = idx;
    showOutlineFor(state.blocks[state.currentBlockIdx]);
    if(!state.isSpeaking) setStatus();
    const prefs = StorageSafe.get('prefs', {outline:true, clickToSpeak:true});
    if(prefs.clickToSpeak){ state.isSpeaking = true; startSpeech(); }
  }, {passive:true});

  // safe polyfill for isEqualNode usage
  Node.prototype.isEqualNode = Node.prototype.isEqualNode || function(other){ return this === other; };

  /* -----------------------------
     initial scan
     ----------------------------- */
  (function initial(){
    try{
      const last = localStorage.getItem('kob_last_url');
      if(last && frame && ('src' in frame)) frame.src = last;
    }catch(e){}
    try{ scanBlocks(); }catch(e){}
    setStatus();
    // inject basic voice theme CSS patch to ensure CSS vars exist (non-destructive)
    try{ injectVoiceThemeCSS(); }catch(e){}
  })();

  /* -----------------------------
     API exposure & compatibility wrapper
     ----------------------------- */
  window.KOBLLUX = window.KOBLLUX || {};
  Object.assign(window.KOBLLUX, { startSpeech, stopSpeech, rebuildBlocks, updateArchetype, state });

  // speakText wrapper: delegates to engine when possible, otherwise uses local synth
  window.KOBLLUX.speakText = window.KOBLLUX.speakText || function(txt, opts){
    try{
      const text = String(txt || '').trim();
      if(!text) return false;

      // Prefer engine
      if(window.KOBLLUX_VOICE_ENGINE && typeof window.KOBLLUX_VOICE_ENGINE.speakWithCurrentArchetype === 'function'){
        if(opts && opts.arch) window.KOBLLUX_VOICE_ENGINE.activateArchetype(opts.arch);
        return window.KOBLLUX_VOICE_ENGINE.speakWithCurrentArchetype(text, {
          onStart: opts && opts.onStart,
          onEnd:   opts && opts.onEnd,
          onError: opts && opts.onError
        });
      }

      // Legacy fallback
      const synthLocal = window.speechSynthesis;
      if(!synthLocal) return false;
      const utter = new SpeechSynthesisUtterance(text);
      // pick voice
      const voiceName = (opts && opts.voice) || (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].voice) || null;
      const pickVoice = () => {
        try{
          const voices = synthLocal ? synthLocal.getVoices() : [];
          if(voiceName){
            const found = voices.find(v => v.name && v.name.toLowerCase().includes(String(voiceName).toLowerCase()));
            if(found) return found;
          }
          if(voices && voices.length) return voices.find(x => /pt/i.test(x.lang)) || voices[0];
        }catch(e){ /* ignore */ }
        return null;
      };
      const v = pickVoice();
      if(v) utter.voice = v;
      utter.rate = (opts && typeof opts.rate === 'number') ? opts.rate : (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].rate) || 1.0;
      utter.pitch = (opts && typeof opts.pitch === 'number') ? opts.pitch : (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].pitch) || 1.0;
      utter.lang = (opts && opts.lang) || (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].lang) || 'pt-BR';
      try{ synthLocal.cancel(); }catch(e){}
      synthLocal.speak(utter);
      return true;
    }catch(e){
      console.warn('KOBLLUX.speakText failed', e);
      return false;
    }
  };

  /* -----------------------------
     injectVoiceThemeCSS (utility)
     ----------------------------- */
  function injectVoiceThemeCSS(){
    if(document.getElementById('KOB_VOICE_THEME_CSS_PATCH')) return;
    const patch = document.createElement('style');
    patch.id = 'KOB_VOICE_THEME_CSS_PATCH';
    patch.textContent = `
:root{ --kob-voice-theme-duration: 520ms; }
body, .nebula, details.acc, .btn, #fab, .kob-tts-dock, .kob-tts-panel.is-dock {
  transition: background var(--kob-voice-theme-duration) ease, box-shadow var(--kob-voice-theme-duration) ease, border-color var(--kob-voice-theme-duration) ease, color var(--kob-voice-theme-duration) ease;
}
`;
    document.head && document.head.appendChild(patch);

    if (!document.getElementById('KOBLLUX_VOICE_THEME_CSS')) {
      const style = document.createElement('style');
      style.id = 'KOBLLUX_VOICE_THEME_CSS';
      style.textContent = `
:root{
  --kob-voice-primary: #78e3ff;
  --kob-voice-secondary: #b978ff;
  --kob-voice-accent: #ffffff;
  --kob-voice-bg-soft: radial-gradient(900px 700px at 50% 10%,rgba(123,243,255,.06),transparent 80%), radial-gradient(600px 600px at 70% 100%,rgba(180,120,255,.04),transparent 80%), var(--bg);
  --kob-voice-glow: 0 0 18px rgba(0,216,216,0.55);
}
.kob-tts-dock{ background:var(--kob-voice-bg-soft); box-shadow:var(--kob-voice-glow); border-radius:12px; backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.06); }
`;
      document.head.appendChild(style);
    }
  }

  /* -----------------------------
     small public helpers for debugging
     ----------------------------- */
  window.KOBLLUX.getArchetypes = () => ARCHETYPES.slice();
  window.KOBLLUX.setArchetypes = (arr) => { if(Array.isArray(arr)) { while(ARCHETYPES.length) ARCHETYPES.pop(); arr.forEach(a=>ARCHETYPES.push(a)); } };

  /* -----------------------------
     init: expose and set initial archetype
     ----------------------------- */
  try{
    updateArchetype(state.archIdx || 0);
  }catch(e){ console.warn('initial updateArchetype failed', e); }

  console.log('KOBLLUX glue init ✓');
  toast('KOBLLUX pronto ✓', 900);

})(); 
// end IIFE
/* ╔══════════════════════════════╗
   ║ KOBLLUX COB BRIDGE v1       ║
   ║ Colar no FINAL do COBJS     ║
   ╚══════════════════════════════╝ */

(() => {

if(window.KOBLLUX?.bridgeLoaded){
   console.log("Bridge já ativa");
   return;
}

window.KOBLLUX=window.KOBLLUX||{};
window.KOBLLUX.bridgeLoaded=true;

const NS="KOBLLUX_BRIDGE";

/* =========================
   FRAME PRINCIPAL
========================= */

const getFrame=()=>{

return document.getElementById("motorFrame")
||document.getElementById("content-frame")
||document.getElementById("frame")
||document.querySelector("iframe");

};

/* =========================
   ENVIAR
========================= */

window.KOBLLUX.send=(type,payload={})=>{

const frame=getFrame();

if(!frame?.contentWindow)return false;

frame.contentWindow.postMessage({

ns:NS,
type,
payload,
ts:Date.now()

},"*");

return true;

};

/* =========================
   RECEBER
========================= */

window.addEventListener(

"message",

e=>{

const msg=e.data;

if(
!msg||
msg.ns!==NS||
!msg.type
)return;

switch(msg.type){

case"READY":

console.log(
"⚡ Motor pronto",
msg.payload
);

break;


case"PONG":

window.KOBLLUX.state=
window.KOBLLUX.state||{};

window.KOBLLUX.state.child=
msg.payload;

break;


case"STATE":

window.KOBLLUX.state=
window.KOBLLUX.state||{};

window.KOBLLUX.state.bridge=
msg.payload;

break;


case"ARCHETYPE_CHANGE":

if(
typeof
window.KOBLLUX.updateArchetype
==="function"
){

window.KOBLLUX
.updateArchetype(
msg.payload.idx
);

}

break;


case"SPEAK":

if(
typeof
window.KOBLLUX.speakText
==="function"
){

window.KOBLLUX.speakText(
msg.payload.text||""
);

}

break;


case"LOG":

console.log(
"[COB]",
msg.payload
);

break;

}

});

/* =========================
   EVENTOS DO SISTEMA
========================= */

window.addEventListener(

"KOBLLUX_VOICES_READY",

()=>{

console.log(
"🎙️ vozes integradas"
);

window.KOBLLUX.send(

"VOICES_READY",

{

total:
Object.keys(
window.KOBLLUX_VOICES||{}
).length

});

}

);

/* =========================
   HOOK ARCHETYPE
========================= */

if(

window.KOBLLUX
.updateArchetype

){

const old=
window.KOBLLUX
.updateArchetype;

window.KOBLLUX
.updateArchetype=

function(idx){

old.call(
this,
idx
);

const arche=

ARCHETYPES[idx];

window.KOBLLUX.send(

"ARCHETYPE_CHANGE",

{

idx,
id:arche?.id,
name:arche?.name,
voice:arche?.voice

});

};

}

/* =========================
   HOOK SPEECH
========================= */

if(
window.KOBLLUX
.speakText
){

const oldSpeak=
window.KOBLLUX
.speakText;

window.KOBLLUX
.speakText=

function(){

window.KOBLLUX.send(

"SPEAK",

{

text:
arguments[0]

});

return oldSpeak
.apply(
this,
arguments
);

};

}

/* =========================
   PING VIVO
========================= */

setInterval(()=>{

window.KOBLLUX.send(

"PING",

{

time:Date.now()

});

},5000);


/* =========================
   BOOT
========================= */

window.addEventListener(

"DOMContentLoaded",

()=>{

window.KOBLLUX.send(

"READY",

{

title:
document.title,

archs:
ARCHETYPES?.length||0

});

});

})();

/* ===== source-https-www-infodose-com-br-js-modules-motor-4-369-js.js ===== */
/* SOURCE: https://www.infodose.com.br/js/modules/motor-4-369.js */

(function() {
  // =========================================
  // 1. ACORDEÃO (mantido original)
  // =========================================
  function makeCollapsible(node) {
    if (!node || node.dataset.accordionInit) return;
    node.dataset.accordionInit = "true";
    const header = node.querySelector('.accordion-header');
    const body = node.querySelector('.collapsible-body');
    if (!header || !body) return;
    if (!header.querySelector('.indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'indicator';
      indicator.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      header.appendChild(indicator);
    }
    if (!node.classList.contains('is-collapsed') && !node.classList.contains('is-open')) node.classList.add('is-open');
    if (node.classList.contains('is-collapsed')) body.style.height = '0px';
    header.addEventListener('click', (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      if (['input', 'select', 'button', 'textarea'].includes(targetTag)) return;
      const isCollapsed = node.classList.contains('is-collapsed');
      if (isCollapsed) {
        node.classList.remove('is-collapsed');
        node.classList.add('is-open');
        body.style.height = body.scrollHeight + 'px';
        body.addEventListener('transitionend', function handler(ev) {
          if (ev.propertyName === 'height') {
            body.style.height = 'auto';
            body.removeEventListener('transitionend', handler);
          }
        });
      } else {
        body.style.height = body.scrollHeight + 'px';
        void body.offsetHeight;
        node.classList.remove('is-open');
        node.classList.add('is-collapsed');
        body.style.height = '0px';
      }
    });
  }
  window.KobAccordion = {
    open: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-collapsed'); card.classList.add('is-open'); } },
    close: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-open'); card.classList.add('is-collapsed'); } },
    toggle: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; card && card.querySelector('.accordion-header')?.click(); }
  };
  const observer = new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes && m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches && node.matches('.accordion')) makeCollapsible(node);
        node.querySelectorAll && node.querySelectorAll('.accordion').forEach((el) => makeCollapsible(el));
      });
    });
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.accordion').forEach(makeCollapsible);

  // =========================================
  // 2. BASE DE ARQUÉTIPOS + USER
  // =========================================
  const di_userNameRaw = localStorage.getItem("di_userName") || "";
  const userKey = di_userNameRaw.trim().toLowerCase();
  const displayUserName = di_userNameRaw.trim() || "User";
  
  let ARCHETYPES_BASE = [
  "atlas", "nova", "vitalis", "pulse", "kaos", "kodux", "lumine",
  "aion", "kobllux", "artemis", "serena", "genus", "solus",
  "rhea", "uno", "dual", "trinity", "infodose", "horus", "bllue",
   "luxara",
  "velor", "elysha", "sylon", "naira", "thenir", "eloh", "novael",
  "aelya", "ignyra", "lumara", "kaythar", "elya", "sylla", "anamyx",
  "yamantek", "metalux", "kd1", "koφd1", "christos",
  "aek_dion", "aekael_domnnus", "nephesh_elyon"
];

if (userKey && !ARCHETYPES_BASE.includes(userKey)) {
  ARCHETYPES_BASE.push(userKey);
}

const ARCHETYPES = [...ARCHETYPES_BASE];

const ARCH_NAMES = {
  atlas: "Atlas",
  nova: "Nova",
  vitalis: "Vitalis",
  pulse: "Pulse",
  kaos: "Kaos",
  kodux: "Kodux",
  lumine: "Lumine",
  aion: "Aion",
  kobllux: "Kobllux",
  artemis: "Artemis",
  serena: "Serena",
  genus: "Genus",
  solus: "Solus",
  rhea: "Rhea",
  uno: "Uno",
  dual: "Dual",
  trinity: "Trinity",
  infodose: "Infodose",
  horus: "Horus",
  bllue: "Bllue",

elysha: "Elysha",
Luxara: "Luxara",

  velor: "Velor",

  sylon: "Sylon",
  naira: "Naira",
  thenir: "Thenir",
  eloh: "Eloh",
  novael: "Novael",

  aelya: "Aelya",
  ignyra: "Ignyra",
  lumara: "Lumara",

  kaythar: "Kaythar",
  sylla: "Sylla",
    elya: "Elya",
  anamyx: "Anamyx",

  yamantek: "Yamantek",
  metalux: "Metalux",
  kd1: "KD1",
  "koφd1": "KOΦD1",
  christos: "Christos",

  k_dion: "a€K_Dion",
  kael_domnnus: "a€Kael DommnuS",
  nephesh_elyon: "a€Nephesh Elyon"
};
  if (userKey) ARCH_NAMES[userKey] = di_userNameRaw.trim();

  const userOption = document.getElementById("diUserOption");
  if (userOption) {
    userOption.value = userKey || "user";
    userOption.textContent = `${displayUserName} (Usuário/Núcleo)`;
  }

  // =========================================
  // 3. MOTOR 3·6·9 (com persistência)
  // =========================================
  let di_engineStep = parseInt(localStorage.getItem('kobllux_engine_step') || '0', 10);
  let di_reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
  let di_jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
  let di_use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';

  function saveEngineState() {
    localStorage.setItem('kobllux_engine_step', String(di_engineStep));
    localStorage.setItem('kobllux_reverse_mode', String(di_reverse));
    localStorage.setItem('kobllux_jump_step', String(di_jump));
    localStorage.setItem('kobllux_cycle_3697', String(di_use3697));
  }

  function syncEngineUI() {
    document.querySelectorAll('[data-engine]').forEach(btn => {
      const val = parseInt(btn.dataset.engine, 10);
      if (val === di_engineStep) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    document.querySelectorAll('[data-jump]').forEach(btn => {
      const val = parseInt(btn.dataset.jump, 10);
      if (val === di_jump) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    const reverseBtn = document.getElementById('reverseToggle');
    if (reverseBtn) {
      reverseBtn.textContent = `Reverse: ${di_reverse ? 'ON' : 'OFF'}`;
      reverseBtn.classList.toggle('is-active', di_reverse);
    }
    const cycleBtn = document.getElementById('cycle3697');
    if (cycleBtn) {
      cycleBtn.textContent = `3-6-9-7: ${di_use3697 ? 'ON' : 'OFF'}`;
      cycleBtn.classList.toggle('is-active', di_use3697);
    }
  }

  function di_getSequence(startIndex, length) {
    const total = ARCHETYPES.length;
    const sequence = [];
    let currentIndex = ((startIndex % total) + total) % total;
    const pattern = di_use3697 ? [3, 6, 9, 7] : [di_engineStep];
    for (let i = 0; i < length; i++) {
      sequence.push(ARCHETYPES[currentIndex]);
      let step = pattern[i % pattern.length];
      if (di_reverse) step *= -1;
      step += di_jump;
      currentIndex = (currentIndex + step) % total;
      if (currentIndex < 0) currentIndex += total;
    }
    return sequence;
  }

  function updateStatusWithEngine() {
    const statusBar = document.getElementById('statusBar');
    if (statusBar && !statusBar.textContent.includes('Opcode')) {
      statusBar.textContent = `Motor ${di_engineStep} · ${di_reverse ? 'Reverse' : 'Forward'} · salto +${di_jump} · ${di_use3697 ? '3-6-9-7' : 'Linear'}`;
    }
  }

  // eventos dos controles
  document.querySelectorAll('[data-engine]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_engineStep = parseInt(btn.dataset.engine, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Motor +${di_engineStep} ativado`);
    });
  });
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_jump = parseInt(btn.dataset.jump, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Salto extra +${di_jump}`);
    });
  });
  const reverseBtnDom = document.getElementById('reverseToggle');
  if (reverseBtnDom) {
    reverseBtnDom.addEventListener('click', () => {
      di_reverse = !di_reverse;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Reverse ${di_reverse ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }
  const cycleBtnDom = document.getElementById('cycle3697');
  if (cycleBtnDom) {
    cycleBtnDom.addEventListener('click', () => {
      di_use3697 = !di_use3697;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Ciclo 3-6-9-7 ${di_use3697 ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }
  syncEngineUI();
  updateStatusWithEngine();

  // =========================================
  // 4. DOM ELEMENTOS
  // =========================================
  const dom = {
    input: document.getElementById('inputText'),
    output: document.getElementById('outputContainer'),
    genBtn: document.getElementById('genBtn'),
    archSelect: document.getElementById('startArch'),
    cycleCheck: document.getElementById('cycleMode'),
    body: document.body,
    copyBtn: document.getElementById('copyBtn'),
    clearBtn: document.getElementById('clearBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    statusBar: document.getElementById('statusBar'),
    hudStatus: document.getElementById('hudStatus'),
    toastContainer: document.getElementById('toast-container'),
    mainCard: document.getElementById('mainHeroCard')
  };

  function showToast(message, isError = false) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (!isError) {
      const currentColor = getComputedStyle(document.body).getPropertyValue('--kob-voice-primary').trim();
      if (currentColor) toast.style.background = currentColor;
    } else toast.style.background = "#c44";
    dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  if (dom.input) {
    const savedInput = localStorage.getItem('kobllux_draft_input');
    if (savedInput) dom.input.value = savedInput;
  }

  if (dom.archSelect) {
    dom.archSelect.addEventListener('change', (e) => {
      dom.body.setAttribute('data-arch', e.target.value);
    });
  }

  // =========================================
  // 5. FUNÇÃO GERAR FRACTAIS (COM MOTOR)
  // =========================================
  function generateFractals() {
    if (!dom.input || !dom.output || !dom.archSelect || !dom.cycleCheck) return;
    const text = dom.input.value.trim();
    if (!text) {
      showToast("Aviso: Texto de entrada vazio.", true);
      return;
    }
    localStorage.setItem('kobllux_draft_input', text);

    const sentencesMatch = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    const sentences = sentencesMatch ? sentencesMatch.map(s => s.trim()).filter(Boolean) : [];
    if (sentences.length === 0) return;

    const startArchName = dom.archSelect.value;
    const startIdx = ARCHETYPES.indexOf(startArchName);
    const isCycleMode = dom.cycleCheck.checked;

    // SEQUÊNCIA VIA MOTOR 3·6·9
    const sequence = isCycleMode ? di_getSequence(startIdx, sentences.length) : [ARCHETYPES[startIdx]];

    dom.output.innerHTML = '';
    let resultTextForExport = "";

    sentences.forEach((sentence, i) => {
      const currentArchName = isCycleMode ? sequence[i] : ARCHETYPES[startIdx];

      const block = document.createElement('div');
      block.className = 'para-block accordion is-open';
      block.style.animationDelay = `${i * 0.1}s`;

      const dummyBody = document.createElement('body');
      dummyBody.setAttribute('data-arch', currentArchName);
      document.documentElement.appendChild(dummyBody);
      const archColor = getComputedStyle(dummyBody).getPropertyValue('--kob-voice-primary').trim();
      document.documentElement.removeChild(dummyBody);

      block.style.setProperty('--kob-voice-primary', archColor);
      block.style.setProperty('--kob-voice-bg-soft', `color-mix(in srgb, ${archColor} 12%, transparent)`);
      block.style.borderLeftColor = archColor;
      block.style.setProperty('--card-accent', archColor);

      const displayArchName = ARCH_NAMES[currentArchName] || currentArchName;

      block.innerHTML = `
        <div class="accordion-header">
          <div class="arch-tag" style="color: ${archColor}; border-color: color-mix(in srgb, ${archColor} 30%, rgba(255,255,255,0.1))">
            ${displayArchName} · Δ
          </div>
        </div>
        <div class="collapsible-body">
          <div class="content-inner">${escapeHtml(sentence)}</div>
        </div>
      `;
      dom.output.appendChild(block);
      resultTextForExport += `${displayArchName.toUpperCase()} — ${sentence}\n\n`;
    });

    localStorage.setItem('kobllux_last_result', resultTextForExport.trim());
    const total = sentences.length;
    if (dom.statusBar) dom.statusBar.textContent = `Opcode 0x0B · Motor 3·6·9 · ${total} Fractal(s) Gerado(s)`;
    if (dom.hudStatus) dom.hudStatus.textContent = `Δ-${total}`;
    
    if (dom.mainCard && dom.mainCard.classList.contains('is-open')) {
      dom.mainCard.querySelector('.accordion-header')?.click();
    }
    showToast(`Integração concluída | Motor: +${di_engineStep} | Reverse: ${di_reverse ? 'ON' : 'OFF'} | Salto: +${di_jump} | ${di_use3697 ? 'Ciclo 3697' : 'Linear'}`);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // eventos principais
  if (dom.genBtn) dom.genBtn.addEventListener('click', generateFractals);
  if (dom.input) {
    dom.input.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateFractals();
    });
  }

  // copiar / limpar / download
  if (dom.copyBtn) {
    dom.copyBtn.addEventListener('click', async () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para copiar.", true); return; }
      try {
        await navigator.clipboard.writeText(content);
        showToast("Fractais copiados para o Códex");
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = content;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast("Fractais copiados (fallback)");
      }
    });
  }
  if (dom.clearBtn) {
    dom.clearBtn.addEventListener('click', () => {
      if (dom.input) dom.input.value = '';
      if (dom.output) dom.output.innerHTML = '<div class="empty-state">Sistema reiniciado. Aguardando novos dados.</div>';
      localStorage.removeItem('kobllux_last_result');
      localStorage.removeItem('kobllux_draft_input');
      if (dom.statusBar) dom.statusBar.textContent = 'Sistema em repouso · Matrix Pronta';
      if (dom.hudStatus) dom.hudStatus.textContent = '78K-ID';
      if (dom.mainCard && dom.mainCard.classList.contains('is-collapsed')) dom.mainCard.querySelector('.accordion-header')?.click();
      showToast("Memória Limpa");
    });
  }
  if (dom.downloadBtn) {
    dom.downloadBtn.addEventListener('click', () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para transferir.", true); return; }
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Transferência Concluída");
    });
  }

  // data-arch inicial
  if (dom.archSelect) dom.body.setAttribute('data-arch', dom.archSelect.value);
})();



(async () => {
  try {
    const ARCHETYPES = await fetch(
      "https://www.infodose.com.br/js/modules/archetypes.json"
    ).then(r => r.json());

    const select = document.getElementById("startArch");
    const userName = localStorage.getItem("di_userName") || "User";

    if (select && Array.isArray(ARCHETYPES) && ARCHETYPES.length) {
      select.innerHTML = "";

      const userOpt = document.createElement("option");
      userOpt.value = userName.toLowerCase();
      userOpt.textContent = `${userName} (Usuário/Núcleo)`;
      select.appendChild(userOpt);

      ARCHETYPES.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id || a.name || "";
        opt.textContent = a.name || a.id || "Archetype";
        select.appendChild(opt);
      });

      window.ARCHETYPES = ARCHETYPES;
      window.ARCHETYPE_IDS = ARCHETYPES.map(a => a.id);
      window.ARCHETYPE_NAMES = ARCHETYPES.map(a => a.name);
      window.ARCHETYPE_MAP = Object.fromEntries(
        ARCHETYPES.map(a => [a.id, a])
      );
    }

    console.log("[78K] Archetypes JSON carregado");
  } catch (err) {
    console.error("[78K] Falha ao carregar archetypes.json", err);
  }
})();

/* ===== inline-3.js ===== */
console.log("Sistema operacional SÜMBÜS Pronto.");

/* ===== archetypes.js ===== */
const ARCHETYPES = [
  "atlas","nova","vitalis","pulse","kaos","kodux","lumine","aion",
  "kobllux","artemis","serena","genus","solus","rhea","uno","dual",
  "trinity","infodose","horus","bllue",
  localStorage.getItem("di_userName")
];

/* ===== source-https-www-infodose-com-br-js-o0-js.js ===== */
/* SOURCE: https://www.infodose.com.br/js/o0.js */

// 🔥 UNIVERSAL ORB GENERATOR: EVOLVED 3D (V3) 🔥
function injectOrbStyles() {
  if (document.getElementById('dual-orb-styles')) return;

  const style = document.createElement('style');
  style.id = 'dual-orb-styles';
  style.innerHTML = `
    @keyframes orbBreathe {
      0%, 100% { transform: translateZ(0) scale(1); opacity: .82; filter: brightness(1); }
      50%      { transform: translateZ(0) scale(1.08); opacity: 1;   filter: brightness(1.22); }
    }

    @keyframes orbSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    @keyframes orbPulse {
      0%   { transform: scale(.78); opacity: .55; }
      100% { transform: scale(1.28); opacity: 0; }
    }

    @keyframes orbFloat {
      0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
      50%      { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
    }

    .dual-orb-wrap {
      --orb-speed: 4s;
      --orb-spin-speed: 12s;
      --orb-pulse-speed: 2.2s;

      position: relative;
      display: inline-grid;
      place-items: center;
      width: var(--orb-size, 64px);
      aspect-ratio: 1;
      perspective: 900px;
      transform-style: preserve-3d;
      user-select: none;
      cursor: pointer;
      transition: transform .28s cubic-bezier(.175,.885,.32,1.275);
    }

    .dual-orb-wrap:active {
      transform: scale(.94);
    }

    .dual-orb-wrap:hover {
      transform: scale(1.03);
    }

    .dual-orb-svg {
      width: 100%;
      height: 100%;
      display: block;
      opacity: .78;
      filter: brightness(.72) saturate(1.08);
      transform: translateZ(0);
    }

    .dual-orb-shell {
      position: absolute;
      inset: 10%;
      display: grid;
      place-items: center;
      transform-style: preserve-3d;
      animation: orbFloat 6s ease-in-out infinite;
      pointer-events: none;
    }

    .dual-orb-halo {
      position: absolute;
      inset: -24%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(120,227,255,.24), rgba(185,120,255,.06) 42%, transparent 70%);
      filter: blur(18px);
      opacity: .9;
      animation: orbPulse var(--orb-pulse-speed) ease-in-out infinite;
      transform: translateZ(-18px);
    }

    .dual-orb-core {
      position: relative;
      width: 42%;
      height: 42%;
      border-radius: 50%;
      transform-style: preserve-3d;
      transform: translateZ(18px);
      background:
        radial-gradient(circle at 30% 28%, rgba(255,255,255,.95) 0%, rgba(255,255,255,.32) 8%, rgba(255,255,255,0) 26%),
        radial-gradient(circle at 70% 72%, var(--orb-primary, #78e3ff) 0%, var(--orb-secondary, #b978ff) 74%);
      box-shadow:
        0 0 16px rgba(120,227,255,.55),
        0 0 34px rgba(120,227,255,.25),
        inset -10px -12px 20px rgba(0,0,0,.38),
        inset 10px 10px 18px rgba(255,255,255,.12);
      animation: orbSpin var(--orb-spin-speed) linear infinite;
    }

    .dual-orb-core::before {
      content: "";
      position: absolute;
      inset: -42%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,.16), transparent 66%);
      filter: blur(10px);
      opacity: .75;
    }

    .dual-orb-core::after {
      content: "";
      position: absolute;
      inset: 12%;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,.65), transparent 58%);
      opacity: .55;
      mix-blend-mode: screen;
    }

    .dual-orb-wrap.speaking .dual-orb-core {
      animation:
        orbSpin 2s linear infinite,
        orbBreathe .55s ease-in-out infinite alternate;
    }

    .dual-orb-wrap.speaking .dual-orb-halo {
      animation:
        orbPulse .85s ease-in-out infinite;
    }

    .dual-orb-wrap:hover .dual-orb-core {
      box-shadow:
        0 0 20px rgba(120,227,255,.7),
        0 0 42px rgba(120,227,255,.36),
        inset -10px -12px 20px rgba(0,0,0,.34),
        inset 10px 10px 18px rgba(255,255,255,.14);
    }
  `;
  document.head.appendChild(style);
}

function makeOrbAvatar(name = 'DUAL', size = 64) {
  injectOrbStyles();

  const safe = String(name || 'DUAL').trim() || 'DUAL';
  const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;
  const uid = Math.random().toString(36).slice(2, 7);
  const gradId = `orb_${seed.toString(36)}_${uid}`;

  return `
    <div
      class="dual-orb-wrap"
      id="${gradId}"
      style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);"
      aria-label="${safe}"
      role="img"
    >
      <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="${gradId}_core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
            <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
            <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
          </radialGradient>

          <linearGradient id="${gradId}_ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
            <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="46" fill="#05070c"/>
        <circle cx="50" cy="50" r="40" fill="url(#${gradId}_core)" opacity=".28"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${gradId}_ring)" stroke-width="2.5"
          stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
        <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22" filter="blur(2px)"/>
        <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
      </svg>

      <div class="dual-orb-shell">
        <div class="dual-orb-halo"></div>
        <div class="dual-orb-core"></div>
      </div>
    </div>
  `;
}

window.makeOrbAvatar = makeOrbAvatar;
window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);
window.makeOrbAvatar3D = makeOrbAvatar;

/* ===== source-https-www-infodose-com-br-js-modules-koblluxv30-js.js ===== */
/* SOURCE: https://www.infodose.com.br/js/modules/koblluxv30.js */

(() => {
  if (window.__DI_OVERRIDE_READY__) return;
  window.__DI_OVERRIDE_READY__ = true;

  const NAME_KEYS = ['di_userName', 'userName'];

  const SEL = {
    inputA: '#inputUser',
    inputB: '#infodoseNameInput',
    lblName: '#lblName',
    actName: '#actName',
    smallText: '#smallText',
    hudStatus: '#hudStatus',
    smallIdent: '#smallIdent',
    actBadge: '#actBadge',
    mainOrb: '#main-orb',
    avatarTarget: '#avatarTarget',
    smallMiniAvatar: '#smallMiniAvatar',
    actMiniAvatar: '#actMiniAvatar'
  };

  const $ = (s) => document.querySelector(s);

  function safeName(v) {
    return (v || '').trim() || 'DUAL';
  }

  function seed(name) {
    return [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  }

  function compute(name) {
    const s = seed(name);
    return {
      name,
      seed: s,
      h1: s % 360,
      h2: (s * 37) % 360
    };
  }

  function applyRoot(name) {
    const d = compute(name);
    const root = document.documentElement;

    root.style.setProperty('--kob-voice-primary', `hsl(${d.h1} 100% 55%)`);
    root.style.setProperty('--kob-voice-secondary', `hsl(${d.h2} 90% 45%)`);
    root.dataset.diName = d.name;
    root.dataset.arch = d.name;
  }

  function renderOrb(selector, name, size) {
    const el = $(selector);
    if (!el) return;

    if (typeof window.makeOrbAvatar === 'function') {
      el.innerHTML = window.makeOrbAvatar(name, size);
    }
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function sync(name) {
    const safe = safeName(name);

    localStorage.setItem('di_userName', safe);
    localStorage.setItem('userName', safe);

    applyRoot(safe);

    setText(SEL.lblName, safe);
    setText(SEL.actName, safe);
    setText(SEL.smallText, safe);
    setText(SEL.hudStatus, safe);

    const activeKey = window.STATE?.keys?.find?.(k => k.active);
    const keyName = activeKey ? activeKey.name : '--';

    setText(SEL.smallIdent, keyName);
    setText(SEL.actBadge, activeKey ? `key:${keyName}` : 'v:--');

    renderOrb(SEL.mainOrb, safe, 48);
    renderOrb(SEL.avatarTarget, safe, 64);
    renderOrb(SEL.smallMiniAvatar, safe, 24);
    renderOrb(SEL.actMiniAvatar, safe, 36);
  }

  function bind() {
    const inputs = [$(SEL.inputA), $(SEL.inputB)].filter(Boolean);
    const initial = safeName(
      $(SEL.inputA)?.value ||
      $(SEL.inputB)?.value ||
      localStorage.getItem('di_userName') ||
      localStorage.getItem('userName')
    );

    inputs.forEach((inp) => {
      if (!inp.value) inp.value = initial;
      inp.addEventListener('input', () => sync(inp.value));
      inp.addEventListener('change', () => sync(inp.value));
    });

    sync(initial);

    window.addEventListener('storage', (e) => {
      if (NAME_KEYS.includes(e.key)) sync(e.newValue);
    });

    document.addEventListener('di:name:update', (e) => {
      sync(e.detail?.name);
    });
  }

  window.di_overrideSync = sync;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();

/* ===== source-https-www-infodose-com-br-js-di-icon-btn-js.js ===== */
/* SOURCE: https://www.infodose.com.br/js/di-icon-btn.js */

(() => {
  const CACHE_KEY = 'di_btn_icon_cache_v2';
  const STORAGE_PREFIX = 'symbol_button_';

  const buttons = () =>
    Array.from(document.querySelectorAll('.symbol-button[data-url]'));

  const storageGet = (storage, key) => {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const storageSet = (storage, key, value) => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const storageRemove = (storage, key) => {
    try {
      storage.removeItem(key);
    } catch {}
  };

  const loadCache = () => storageGet(localStorage, CACHE_KEY) || {};
  const saveCache = (cache) => storageSet(localStorage, CACHE_KEY, cache);

  const cache = loadCache();

  const normKey = (url) => {
    try {
      return new URL(url, location.href).href;
    } catch {
      return String(url || '');
    }
  };

  const getStorageKey = (btn) => {
    if (!btn) return null;
    if (btn.id) return `${STORAGE_PREFIX}${btn.id}`;
    if (btn.dataset.storeKey) return `${STORAGE_PREFIX}${btn.dataset.storeKey}`;
    return null;
  };

  async function fetchText(url) {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  function pickBestIcon(icons = []) {
    if (!Array.isArray(icons) || !icons.length) return null;

    const parsed = icons
      .map(i => ({
        ...i,
        sizeNum: (() => {
          const m = String(i.sizes || '').match(/(\d+)\s*x\s*(\d+)/i);
          return m ? Math.max(+m[1], +m[2]) : 0;
        })()
      }))
      .sort((a, b) => b.sizeNum - a.sizeNum);

    return (
      parsed.find(i => String(i.sizes || '').includes('192')) ||
      parsed.find(i => i.sizeNum >= 192) ||
      parsed[0] ||
      null
    );
  }

  async function resolveIcon(url) {
    const key = normKey(url);
    if (cache[key]) return cache[key];

    try {
      const base = new URL(key);
      const html = await fetchText(base.href);
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const manifestLink = doc.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        const manifestUrl = new URL(
          manifestLink.getAttribute('href'),
          base
        ).href;

        try {
          const manifest = await fetchJSON(manifestUrl);
          const icon = pickBestIcon(manifest?.icons);

          if (icon?.src) {
            const resolved = new URL(icon.src, manifestUrl).href;
            cache[key] = resolved;
            saveCache(cache);
            return resolved;
          }
        } catch {}
      }

      const apple = doc.querySelector(
        'link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]'
      );

      if (apple?.getAttribute('href')) {
        const resolved = new URL(apple.getAttribute('href'), base).href;
        cache[key] = resolved;
        saveCache(cache);
        return resolved;
      }

      const shortcut = doc.querySelector(
        'link[rel="shortcut icon"], link[rel="icon"]'
      );

      if (shortcut?.getAttribute('href')) {
        const resolved = new URL(shortcut.getAttribute('href'), base).href;
        cache[key] = resolved;
        saveCache(cache);
        return resolved;
      }

      const fallback = new URL('/favicon.ico', base).href;
      cache[key] = fallback;
      saveCache(cache);
      return fallback;
    } catch {
      const fallback = (() => {
        try {
          return new URL('/favicon.ico', new URL(key, location.href)).href;
        } catch {
          return null;
        }
      })();

      if (fallback) {
        cache[key] = fallback;
        saveCache(cache);
      }

      return fallback;
    }
  }

  function paintButton(btn, iconUrl) {
    if (!btn || !iconUrl) return;

    btn.classList.add('di-icon-ready');
    btn.dataset.diIconDone = '1';

    btn.innerHTML = '';

    const img = document.createElement('img');
    img.className = 'di-btn-icon-img';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = iconUrl;

    img.onerror = () => {
      const fallback = document.createElement('span');
      fallback.className = 'di-btn-icon-fallback';
      fallback.textContent = btn.dataset.fallback || '◉';
      btn.innerHTML = '';
      btn.appendChild(fallback);
    };

    btn.appendChild(img);
  }

  async function processButton(btn) {
    const url = btn?.dataset?.url;
    if (!url) return;

    const icon = await resolveIcon(url);
    if (icon) paintButton(btn, icon);
  }

  async function run() {
    await Promise.all(buttons().map(processButton));
  }

  function restoreButtons() {
    document.querySelectorAll('.symbol-button').forEach((btn) => {
      const key = getStorageKey(btn);
      if (!key) return;

      const sessionData = storageGet(sessionStorage, key);
      const localData = storageGet(localStorage, key);
      const data = sessionData || localData;

      if (!data) return;

      if (data.url) {
        btn.dataset.url = data.url;
      }

      if (data.iconUrl) {
        paintButton(btn, data.iconUrl);
      } else if (btn.dataset.url) {
        btn.dataset.diIconDone = '';
        processButton(btn);
      }
    });
  }

  async function updateAttrBtn(
    btn,
    {
      url,
      save = true,
      session = true,
      refresh = true,
      fallback = '◉'
    } = {}
  ) {
    if (!btn || !url) return null;

    const cleanUrl = String(url).trim();
    if (!cleanUrl) return null;

    btn.dataset.url = cleanUrl;
    btn.dataset.fallback = fallback;
    btn.dataset.diIconDone = '';

    let iconUrl = null;

    if (refresh) {
      iconUrl = await resolveIcon(cleanUrl);
      if (iconUrl) paintButton(btn, iconUrl);
    }

    const payload = {
      id: btn.id || '',
      url: cleanUrl,
      iconUrl: iconUrl || '',
      updatedAt: Date.now()
    };

    const key = getStorageKey(btn);
    if (key) {
      if (session) storageSet(sessionStorage, key, payload);
      if (save) storageSet(localStorage, key, payload);
      if (!session && !save) {
        storageRemove(sessionStorage, key);
        storageRemove(localStorage, key);
      }
    }

    window.dispatchEvent(
      new CustomEvent('di-button-updated', { detail: payload })
    );

    return payload;
  }

  function observeDynamicButtons() {
    const root = document.body;
    if (!root) return;

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;

            if (node.matches?.('.symbol-button[data-url]')) {
              processButton(node);
            }

            node
              .querySelectorAll?.('.symbol-button[data-url]')
              .forEach((btn) => processButton(btn));
          });
        }

        if (m.type === 'attributes' && m.attributeName === 'data-url') {
          const btn = m.target;
          if (btn?.classList?.contains('symbol-button')) {
            btn.dataset.diIconDone = '';
            processButton(btn);
          }
        }
      }
    });

    mo.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-url']
    });
  }

  window.DI_ICON_LOADER = {
    refresh: run,
    clearCache() {
      Object.keys(cache).forEach((k) => delete cache[k]);
      saveCache(cache);
    },
    updateAttrBtn,
    restoreButtons
  };

  function init() {
    restoreButtons();
    run();
    observeDynamicButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* ===== source-https-www-infodose-com-br-js-orb1-js.js ===== */
/* SOURCE: https://www.infodose.com.br/js/ORB1-.js */

 const App = {
    config: {
      vaultKey: 'dual_vault_data',
      themeKey: 'dual_theme_mode',
      navKey: 'dual_nav_state',
      sysKey: 'dual_system_active'
    },
    state: {
      active: false,
      safeMode: true,
      stacks: [],
      editingId: null // novo: id do módulo que está sendo editado (null = criar novo)
    },

    init() {
      this.cacheDOM();
      this.loadData();
      this.bindEvents();
      if(window.lucide) lucide.createIcons();

      const theme = localStorage.getItem(this.config.themeKey);
      if(theme) document.documentElement.setAttribute('data-theme', theme);

      const wasActive = localStorage.getItem(this.config.sysKey) === 'true';
      if(wasActive) this.toggleSystem(true);
      else setTimeout(() => this.dom.orbBtn.classList.add('ready'), 500);
    },

    cacheDOM() {
  this.dom = {
    body: document.body,
    navFrame:
      document.getElementById('navFrame') ||
      document.getElementById('frame'),

    orbBtn: document.getElementById('orbBtn'),
    sysStatus: document.getElementById('sysStatus'),
    stackList: document.getElementById('stackList'),
    viewVault: document.getElementById('viewVault'),
    viewEditor: document.getElementById('viewEditor'),
    runtimeLayer: document.getElementById('runtimeLayer'),
    appFrame: document.getElementById('appFrame'),
    modTitle: document.getElementById('modTitle'),
    modContent: document.getElementById('modContent'),

    pulseBar: document.getElementById('pulseBar'),
    safeLabel: document.getElementById('safeLabel'),
    uploadInput: document.getElementById('uploadInput'),
    remoteBtn: document.getElementById('remoteBtn')
  };
},

    bindEvents() {
      this.dom.orbBtn.addEventListener('click', () => this.toggleSystem());
      document.querySelectorAll('[data-url]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.dom.navFrame.src = btn.dataset.url;
          this.showToast(`NAV: ${btn.title}`);
        });
      });

      document.getElementById('createBtn').addEventListener('click', () => this.toggleEditor(true));
      document.getElementById('cancelEditor').addEventListener('click', () => this.cancelEditing());
      document.getElementById('saveEditor').addEventListener('click', () => this.saveModule());

      document.getElementById('dropZone').addEventListener('click', () => this.dom.uploadInput.click());
      this.dom.uploadInput.addEventListener('change', (e) => this.handleUpload(e));
      document.getElementById('uploadBtn').addEventListener('click', () => this.dom.uploadInput.click());
      document.getElementById('backupBtn').addEventListener('click', () => this.exportVault());

      document.getElementById('safeBtn').addEventListener('click', () => this.toggleSafe());

      document.getElementById('themeToggle').addEventListener('click', () => {
         const current = document.documentElement.getAttribute('data-theme');
         const next = current === 'light' ? 'dark' : 'light';
         document.documentElement.setAttribute('data-theme', next);
         localStorage.setItem(this.config.themeKey, next);
         this.showToast(`THEME: ${next.toUpperCase()}`);
      });

      document.getElementById('closeRuntime').addEventListener('click', () => this.closeRuntime());
      document.getElementById('exportBtn').addEventListener('click', () => {
        if(this.dom.appFrame.srcdoc) {
          const blob = new Blob([this.dom.appFrame.srcdoc], {type:'text/html'});
          this.dom.navFrame.src = URL.createObjectURL(blob);
          this.showToast("EXPORTED TO NAV");
          this.closeRuntime();
        }
      });

      // Novo: botão globo aceita URLs
      this.dom.remoteBtn.addEventListener('click', () => this.handleRemoteUrl());
    },

    loadData() {
      try {
        const raw = localStorage.getItem(this.config.vaultKey);
        if(raw) this.state.stacks = JSON.parse(raw);
      } catch(e) { this.state.stacks = []; }
      this.renderVault();

      const last = localStorage.getItem(this.config.navKey);
      if(last && last !== 'about:blank') this.dom.navFrame.src = last;

      this.dom.navFrame.onload = () => {
        try { localStorage.setItem(this.config.navKey, this.dom.navFrame.contentWindow.location.href); } catch(e){}
      };
    },

    toggleSystem(force) {
      this.state.active = force !== undefined ? force : !this.state.active;
      localStorage.setItem(this.config.sysKey, this.state.active);
      if(this.state.active) {
        this.dom.body.classList.add('system-active');
        this.dom.sysStatus.innerText = "ONLINE";
        this.dom.sysStatus.style.color = "var(--neon-cyan)";
        this.dom.sysStatus.style.borderColor = "var(--neon-cyan)";
      } else {
        this.dom.body.classList.remove('system-active');
        this.dom.sysStatus.innerText = "STANDBY";
        this.dom.sysStatus.style.color = "var(--text-muted)";
        this.dom.sysStatus.style.borderColor = "var(--glass-border)";
      }
    },

    toggleEditor(show, moduleObj = null) {
      if(show) {
        this.dom.viewEditor.classList.remove('state-translated-x');
        if(moduleObj) {
          // abrir em modo edição
          this.state.editingId = moduleObj.id;
          this.dom.modTitle.value = moduleObj.title || '';
          this.dom.modContent.value = moduleObj.content || '';
        } else {
          this.state.editingId = null;
          this.dom.modTitle.value = '';
          this.dom.modContent.value = '';
        }
        this.dom.modTitle.focus();
      } else {
        this.dom.viewEditor.classList.add('state-translated-x');
      }
    },

    cancelEditing() {
      this.state.editingId = null;
      this.toggleEditor(false);
    },

    toggleSafe() {
      this.state.safeMode = !this.state.safeMode;
      this.dom.safeLabel.innerText = this.state.safeMode ? "SAFE" : "RAW";
      this.dom.safeLabel.style.color = this.state.safeMode ? "inherit" : "var(--alert-red)";
      this.showToast(this.state.safeMode ? "PROTOCOL: SAFE" : "PROTOCOL: RAW (UNSAFE)");
    },

    exportVault() {
      const data = JSON.stringify(this.state.stacks, null, 2);
      const blob = new Blob([data], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dual-vault-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast("VAULT EXPORTED");
    },

    saveModule() {
      const title = this.dom.modTitle.value.trim();
      const content = this.dom.modContent.value;
      if(!title) return this.showToast("ERROR: TITLE REQUIRED");

      if(this.state.editingId) {
        // Atualiza módulo existente
        const idx = this.state.stacks.findIndex(s => s.id === this.state.editingId);
        if(idx === -1) return this.showToast("ERROR: MODULE NOT FOUND");
        this.state.stacks[idx].title = title;
        this.state.stacks[idx].content = content;
        this.state.stacks[idx].date = new Date().toLocaleDateString();
        localStorage.setItem(this.config.vaultKey, JSON.stringify(this.state.stacks));
        this.showToast("MODULE UPDATED");
      } else {
        // Cria novo módulo
        const mod = {
          id: Date.now(),
          title,
          content: content || '<h1>Empty Module</h1>',
          date: new Date().toLocaleDateString()
        };
        this.state.stacks.unshift(mod);
        localStorage.setItem(this.config.vaultKey, JSON.stringify(this.state.stacks));
        this.showToast("MODULE CRYSTALLIZED");
      }

      this.state.editingId = null;
      this.renderVault();
      this.toggleEditor(false);
    },

    handleUpload(e) {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          try {
              const json = JSON.parse(ev.target.result);
              if(Array.isArray(json) && json[0]?.id) {
                  if(confirm("RESTORE BACKUP? This will merge with current vault.")) {
                      this.state.stacks = [...json, ...this.state.stacks];
                      this.state.stacks = this.state.stacks.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i);
                      localStorage.setItem(this.config.vaultKey, JSON.stringify(this.state.stacks));
                      this.renderVault();
                      this.showToast("BACKUP RESTORED");
                      return;
                  }
              }
          } catch(e) { /* Not a JSON array, treat as single file */ }

        this.state.stacks.unshift({
          id: Date.now(),
          title: file.name,
          content: ev.target.result,
          date: new Date().toLocaleDateString()
        });
        localStorage.setItem(this.config.vaultKey, JSON.stringify(this.state.stacks));
        this.renderVault();
        this.showToast("FILE UPLOADED");
      };
      reader.readAsText(file);
      // reset input so same file can be re-uploaded if needed
      e.target.value = '';
    },

    deleteModule(id) {
      if(!confirm("DELETE MODULE?")) return;
      this.state.stacks = this.state.stacks.filter(s => s.id !== id);
      localStorage.setItem(this.config.vaultKey, JSON.stringify(this.state.stacks));
      this.renderVault();
    },

    // Novo: download individual
    downloadModule(id) {
      const mod = this.state.stacks.find(s => s.id === id);
      if(!mod) return this.showToast("ERROR: NOT FOUND");
      const blob = new Blob([mod.content], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // sanitize filename
      const safeName = (mod.title || 'module').replace(/[^\w\d\-_\.]/g,'_');
      a.download = `${safeName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast("DOWNLOAD STARTED");
    },

    renderVault() {
      this.dom.stackList.innerHTML = '';
      document.getElementById('vaultCount').innerText = `${this.state.stacks.length} ITEMS`;

      if(this.state.stacks.length === 0) {
        this.dom.stackList.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-muted); font-family:var(--font-code); font-size:12px;">VAULT EMPTY</div>`;
        return;
      }

      this.state.stacks.forEach(stack => {
        const el = document.createElement('div');
        el.className = 'stack-item';
        el.innerHTML = `
          <div class="stack-info">
            <div class="stack-icon"><i data-lucide="box" style="width:16px;"></i></div>
            <div class="stack-text">
              <h4>${this.escapeHtml(stack.title)}</h4>
              <span>${stack.date}</span>
            </div>
          </div>
          <div class="stack-actions">
            <button class="mini-btn btn-run" title="Run"><i data-lucide="play" style="width:12px;"></i></button>
            <button class="mini-btn btn-edit" title="Edit"><i data-lucide="edit-2" style="width:12px;"></i></button>
            <button class="mini-btn btn-dl" title="Download"><i data-lucide="download" style="width:12px;"></i></button>
            <button class="mini-btn btn-del" title="Delete"><i data-lucide="trash-2" style="width:12px;"></i></button>
          </div>
        `;

        // Bind actions
        el.querySelector('.btn-run').onclick = (e) => { e.stopPropagation(); this.runModule(stack.id); };
        el.querySelector('.btn-edit').onclick = (e) => { e.stopPropagation(); this.editModule(stack.id); };
        el.querySelector('.btn-dl').onclick = (e) => { e.stopPropagation(); this.downloadModule(stack.id); };
        el.querySelector('.btn-del').onclick = (e) => { e.stopPropagation(); this.deleteModule(stack.id); };
        el.onclick = () => this.runModule(stack.id);

        this.dom.stackList.appendChild(el);
      });

      if(window.lucide) lucide.createIcons();
    },

    escapeHtml(text) {
      if(!text) return '';
      return text.replace(/[&<>"']/g, function(m) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
      });
    },

    runModule(id) {
      const mod = this.state.stacks.find(s => s.id === id);
      if(!mod) return;

      let code = mod.content;
      if(this.state.safeMode) {
        try {
           if(!code.includes('<html') && !code.includes('<!doctype')) {
             code = `<style>body{color:#fff;background:transparent;font-family:sans-serif}</style>${code}`;
           }
        } catch(e){}
      }

      this.dom.appFrame.srcdoc = code;
      this.dom.runtimeLayer.classList.add('state-visible-y');
      this.dom.sysStatus.innerText = "RUNNING";
      this.dom.sysStatus.style.opacity = '0.7';
    },

    closeRuntime() {
      this.dom.runtimeLayer.classList.remove('state-visible-y');
      this.dom.sysStatus.style.opacity = '1';
      this.dom.sysStatus.innerText = "ONLINE";
      setTimeout(() => this.dom.appFrame.srcdoc = '', 400);
    },

    // Abre editor com módulo carregado (modo editar)
    editModule(id) {
      const mod = this.state.stacks.find(s => s.id === id);
      if(!mod) return this.showToast("ERROR: MODULE NOT FOUND");
      this.toggleEditor(true, mod);
    },

    // Novo: aceita URL, tenta fetch; se fetch falhar faz fallback para abrir navFrame
    async handleRemoteUrl() {
      const url = prompt("INSIRA URL (http(s)://...):");
      if(!url) return;
      try {
        // tentativa de fetch do HTML (CORS pode bloquear)
        const res = await fetch(url, {mode:'cors'});
        if(!res.ok) throw new Error('HTTP ' + res.status);
        const ct = res.headers.get('content-type') || '';
        if(ct.includes('text/html') || ct.includes('application/xhtml+xml')) {
          const text = await res.text();
          // salva como módulo automaticamente
          const mod = { id: Date.now(), title: url, content: text, date: new Date().toLocaleDateString() };
          this.state.stacks.unshift(mod);
          localStorage.setItem(this.config.vaultKey, JSON.stringify(this.state.stacks));
          this.renderVault();
          this.showToast("REMOTE SAVED TO VAULT");
        } else {
          // não-html — apenas abre no navFrame
          this.dom.navFrame.src = url;
          this.showToast("OPENED IN NAV (non-HTML)");
        }
      } catch(err) {
        // Falha (CORS ou rede) — fallback: abrir no navFrame e avisar
        try {
          this.dom.navFrame.src = url;
          this.showToast("FALLBACK: OPENED IN NAV (fetch failed)");
        } catch(e) {
          this.showToast("ERROR: COULD NOT OPEN URL");
        }
      }
    }
  };

  window.onload = () => App.init();